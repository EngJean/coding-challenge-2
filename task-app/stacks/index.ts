import { ApiStack } from "./ApiStack";
import { TaskStack } from "./TaskStack";
import { AuthStack } from "./AuthStack";
import { App } from "@serverless-stack/resources";

export default function(app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  });
  app.stack(TaskStack).stack(ApiStack).stack(AuthStack);
}
