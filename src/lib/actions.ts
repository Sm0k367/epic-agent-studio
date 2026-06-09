export type AppRuntime = "CLOUD_URL" | "CLOUD_ACTION" | "DESKTOP_ONLY" | "USER_CUSTOM";

export type RunResult = {
  ok: boolean;
  message: string;
  openUrl?: string;
  runtime?: AppRuntime;
};

export function executeCloudApp(app: {
  id: string;
  name: string;
  runtime: AppRuntime;
  target: string;
}): RunResult {
  if (app.runtime === "CLOUD_URL" || app.runtime === "CLOUD_ACTION") {
    return {
      ok: true,
      message: `Opening ${app.name}`,
      openUrl: app.target,
      runtime: app.runtime,
    };
  }

  if (app.runtime === "USER_CUSTOM") {
    return {
      ok: true,
      message: `Opening ${app.name}`,
      openUrl: app.target,
      runtime: app.runtime,
    };
  }

  return {
    ok: false,
    message: `${app.name} runs on your Epic OS Desktop. Install the desktop agent to use local tools, folders, and media pipelines.`,
    runtime: "DESKTOP_ONLY",
  };
}