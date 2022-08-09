import {
  Api,
  ReactStaticSite,
  StackContext,
  use,
} from "@serverless-stack/resources";
import { TaskStack } from "./TaskStack";

export function ApiStack( {stack}: StackContext ) {
  const { table } = use(TaskStack);
  
  // Create the API to handle app functions
  const api = new Api(stack, "Api", {
    defaults: {
      authorizer: "iam",
      function: {
        permissions: [table],
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
    },
    routes: {
      "POST /signup" : "/functions/handler.signUp",
      "POST /auth" : "/functions/handler.authenticateUser",
      "POST /confirm" : "/functions/handler.confirmUser",
      "GET /user/{user_name}" : "/functions/handler.getUser",
      "POST /createTask/{user_name}": "/functions/handler.createTask",
      "GET /tasks/{user_name}": "/functions/handler.getTasks",
    },
  });

  // Deploy React app
  const site = new ReactStaticSite(stack, "ReactSite", {
    path: "frontend",
    environment: {
      REACT_APP_API_URL: api.url,
    },
    // No custom domain just yet. Example below.
    // customDomain: "www.tasks.com",
  });

  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
  });

  return { 
    api, 
  };
}