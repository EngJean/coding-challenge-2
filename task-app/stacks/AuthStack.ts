import * as iam from "aws-cdk-lib/aws-iam";
import { Auth, use, StackContext } from "@serverless-stack/resources";
import { ApiStack } from "./ApiStack";
import { TaskStack } from "./TaskStack";

export function AuthStack({ stack }: StackContext) {
  const { api } = use(ApiStack);
  const { table } = use(TaskStack);

  // Create a Cognito User Pool and Identity Pool
  const auth = new Auth(stack, "Auth", {
    login: ["email", "phone", "username", "preferredUsername"],
  });

  auth.attachPermissionsForAuthUsers(stack, [
    // Allow access to the API
    api,
    // Policy granting access to the tasks table
    new iam.PolicyStatement({
      actions: ["dynamodb:*"],
      effect: iam.Effect.ALLOW,
      resources: [
        table.tableArn,
      ],
    }),
  ]);

  // Show the auth resources in the output
  stack.addOutputs({
    Region: stack.region,
    UserPoolId: auth.userPoolId,
    IdentityPoolId: auth.cognitoIdentityPoolId!,
    UserPoolClientId: auth.userPoolClientId,
  });

  // Return the auth resource
  return {
    auth,
  };
}