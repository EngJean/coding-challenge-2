import {
  Api,
  ReactStaticSite,
  StackContext,
  Table,
} from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  // Create the table
  const table = new Table(stack, "Users", {
    fields: {
      userId: "string",
    },
    primaryIndex: { partitionKey: "userId" },
    stream: true,
  });
  table.attachPermissions(["s3"]);

  // Create the HTTP API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        // Allow the API to access the table
        permissions: [table],
        // Pass in the table name to our API
        environment: {
          tableName: table.tableName,
        },
      },
    },
    routes: {
      "POST /": "functions/lambda.handler",
    },
  });

  // Deploy our React app
  const site = new ReactStaticSite(stack, "ReactSite", {
    path: "frontend",
    environment: {
      REACT_APP_API_URL: api.url,
    },
    // No custom domain just yet.
    // customDomain: "www.tasks.com",
  });

  // Show the URLs in the output
  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
  });
}