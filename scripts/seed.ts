import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const flags = [
    { key: "studio_text", enabled: true, description: "Enable text generation modality (Groq)" },
    { key: "studio_image", enabled: true, description: "Enable image generation modality (Pixio/HF)" },
    { key: "studio_audio", enabled: true, description: "Enable audio generation modality (Hugging Face)" },
    { key: "studio_video", enabled: true, description: "Enable video generation modality (Pixio/HF)" },
    { key: "admin_panel", enabled: true, description: "Platform admin console" },
    { key: "stripe_billing", enabled: true, description: "Stripe checkout and subscriptions" },
  ];

  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      create: flag,
      update: { description: flag.description, enabled: flag.enabled },
    });
  }

  console.log(`Seeded ${flags.length} feature flags for Epic Agent Studio`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });