import { Table, StackContext } from "@serverless-stack/resources";

export function UserStack({ stack }: StackContext) {
    // Create the users table: 'go-getter-users-dynamodb'
    const table = new Table(stack, "go-getter-users-dynamodb", {
      fields: {
        Username: "string",
        Password: "string",
        phone_number: "string",
        email: "string",
        given_name: "string",
        family_name: "string",   
        birthdate: "string",
      },
      primaryIndex: { partitionKey: "UserName" },
      stream: true,
    });

    return {
        table,
    };
}

// TO BE IGNORED FOR NOW, SEEMS NOT NEEDED.