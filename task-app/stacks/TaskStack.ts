import { Table, StackContext } from "@serverless-stack/resources";

export function TaskStack({ stack }: StackContext) {
  // Create the DynamoDB table
  const table = new Table(stack, "go-getter-tasks-dynamodb", {
    fields: {
      id: "string",
      Username:"string",
      task_name: "string",
      task_due_date: "string",
      amount_components: "string", 
    },
    primaryIndex: { partitionKey: "id" },
    globalIndexes: { "User Index": { partitionKey: "Username" }, },
    stream: true,
  });

  return {
    table,
  };
}