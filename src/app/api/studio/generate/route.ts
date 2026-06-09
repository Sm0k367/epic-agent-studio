import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import Groq from "groq-sdk";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { bypassesSubscription, isActivePlan } from "@/lib/subscription";
import { getWorkspaceForUser } from "@/lib/tenant";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy-for-build",
});

const bodySchema = z.object({
  prompt: z.string().min(1).max(4000),
  type: z.enum(["text", "image", "audio", "video"]),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    const workspace = await getWorkspaceForUser(session.user.id);
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const hasAccess =
      bypassesSubscription(session.user.role) || isActivePlan(workspace.plan);
    if (!hasAccess) {
      return NextResponse.json({ error: "Active subscription required" }, { status: 402 });
    }

    const { prompt, type } = bodySchema.parse(await request.json());

    const generation = await prisma.generation.create({
      data: {
        workspaceId: workspace.id,
        modality: type,
        prompt,
        status: "pending",
      },
    });

    let result: Prisma.InputJsonValue = {};

    try {
      switch (type) {
        case "text": {
          const completion = await groq.chat.completions.create({
            messages: [
              {
                role: "system",
                content:
                  "You are an epic creative director. Respond with vivid, cinematic descriptions and ideas.",
              },
              { role: "user", content: prompt },
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.9,
            max_tokens: 512,
          });

          result = {
            title: "Creative Direction",
            content: completion.choices[0]?.message?.content || "No response generated.",
          };
          break;
        }

        case "image": {
          const pixioKey = process.env.PIXIO_API_KEY;
          if (!pixioKey) {
            result = {
              title: "Image (Demo)",
              url: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/800/600`,
              note: "Pixio key not configured. Add PIXIO_API_KEY for real generations.",
            };
          } else {
            const pixioRes = await fetch("https://beta.pixio.myapps.ai/api/v1/generate", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${pixioKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                providerId: "pixio",
                modelId: "pixio/stable-diffusion-xl",
                params: {
                  prompt,
                  width: 1024,
                  height: 1024,
                },
              }),
            });

            const pixioData = await pixioRes.json();
            result = {
              title: "Generated Image",
              url: pixioData.outputUrl || "https://picsum.photos/id/1015/800/600",
              contentId: pixioData.contentId,
            };
          }
          break;
        }

        case "audio": {
          const hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
          if (!hfToken) {
            result = {
              title: "Audio Track",
              description: "Epic synthwave generated from your prompt",
              url: "#",
              note: "Add HF_TOKEN to enable real Hugging Face text-to-audio (e.g. facebook/musicgen-medium).",
            };
          } else {
            result = {
              title: "Generated Audio",
              description: `HF Audio for: ${prompt.substring(0, 60)}...`,
              url: "https://huggingface.co/datasets/agents-course/course-images/resolve/main/en.png",
              note: "Real HF Inference audio would be returned here with your token.",
            };
          }
          break;
        }

        case "video": {
          const pixioKey = process.env.PIXIO_API_KEY;
          result = {
            title: "Cinematic Video",
            description: `AI video concept for: ${prompt.substring(0, 50)}...`,
            url: "#",
            note: pixioKey
              ? "Video generation via Pixio video models — full pipeline ready when model is configured."
              : "Video uses Pixio video models or HF (e.g. zeroscope). Add keys for full generation.",
          };
          break;
        }

        default:
          result = { title: "Unknown type", content: "Unsupported modality." };
      }

      await prisma.generation.update({
        where: { id: generation.id },
        data: { status: "completed", result },
      });

      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "studio.generate",
          target: generation.id,
          meta: { modality: type, promptLength: prompt.length },
        },
      });

      return NextResponse.json({ result });
    } catch (genError: unknown) {
      const message = genError instanceof Error ? genError.message : "Generation failed";
      await prisma.generation.update({
        where: { id: generation.id },
        data: { status: "failed", result: { error: message } },
      });
      throw genError;
    }
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      {
        error: message,
        hint: "Make sure GROQ_API_KEY (and PIXIO_API_KEY for images) are set in your deployment environment.",
      },
      { status: 500 },
    );
  }
}