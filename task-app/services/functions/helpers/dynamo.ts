import { APIGatewayProxyCallback } from 'aws-lambda'
import { DynamoDB as myDynamo} from 'aws-sdk'
export default class DynamoDB {

    private client : AWS.DynamoDB.DocumentClient
    private userTable : string
    private taskTable : string

    constructor() {
        this.client = new myDynamo.DocumentClient()
        this.userTable = 'go-getter-users-dynamodb'
        this.taskTable = 'go-getter-tasks-dynamodb'
    }

    public createUser = (userName : string, UserSub: string, callback: APIGatewayProxyCallback) => {

        const params = {
            TableName: this.userTable,
            Item: {
                "user_name": userName,
                "user_id": UserSub
            },
            ConditionExpression: 'attribute_not_exists(user_name)'
        }
    
        this.client.put(params, (err, data) => {
            if (err) {
                return callback(null, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    statusCode: 500,
                    body: JSON.stringify({
                        message: err
                    })
                })
            }
            else {
                return callback(null, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    statusCode: 200,
                    body: JSON.stringify({
                        message: "User has been created"
                    })
                })
            }
        })
    }

    public getUser = (userName : string, callback: APIGatewayProxyCallback) => {

        const params = {
            TableName: this.userTable,
            Key: {
                'user_name': userName
            },
            ConditionExpression: 'attribute_exists(user_name)'
        }

        this.client.get(params, (err, data) => {
            if (err) {
                return callback(null, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    statusCode: 500,
                    body: JSON.stringify({
                        message: err
                    })
                })
            }
            else {
                if (data.Item) {
                    return callback(null, {
                        headers: {
                            "Access-Control-Allow-Origin": "*"
                        },
                        statusCode: 200,
                        body: JSON.stringify({
                            message: data.Item
                        })
                    })
                }
                else {
                    return callback(null, {
                        headers: {
                            "Access-Control-Allow-Origin": "*"
                        },
                        statusCode: 500,
                        body: JSON.stringify({
                            message: "No user information found"
                        })
                    })
                }
            }
        })

    }

    public createTask = (result : any, taskId: string, callback: APIGatewayProxyCallback) => {

        console.log(`Creating Task...`)

        const params = {
            TableName: this.taskTable,
            Item: {
                "id": taskId,
                "user_name": result.user_name,
                "task_name": result.task_name,
                "task_due_date": result.task_due_date,
                "amount_components": result.amount_components,
            },
            ConditionExpression: 'attribute_not_exists(user_name)'
        }
    
        this.client.put(params, (err, data) => {
            if (err) {
                return callback(null, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    statusCode: 500,
                    body: JSON.stringify({
                        message: err
                    })
                })
            }
            else {
                return callback(null, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    statusCode: 200,
                    body: JSON.stringify({
                        message: "Task has been created"
                    })
                })
            }
        })
    }

    public getTasks = (userName : string, callback: APIGatewayProxyCallback) => {

        console.log(`Trying to retrieve tasks of user : ${userName} ...`)

        const params = {
            TableName: this.taskTable,
            ConditionExpression: 'attribute_exists(user_name)',
            FilterExpression: 'user_name = :user_name',
            ExpressionAttributeValues: {
                ':user_name': userName
            }
        }
        
        //TODO, change to a query with a secondary index of user_name
        this.client.scan(params, (err, data) => {
            if (err) {
                return callback(null, {
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    statusCode: 500,
                    body: JSON.stringify({
                        message: err
                    })
                })
            }
            else {
                if (data.Items) {
                    return callback(null, {
                        headers: {
                            "Access-Control-Allow-Origin": "*"
                        },
                        statusCode: 200,
                        body: JSON.stringify({
                            message: data.Items
                        })
                    })
                }
                else {
                    return callback(null, {
                        headers: {
                            "Access-Control-Allow-Origin": "*"
                        },
                        statusCode: 500,
                        body: JSON.stringify({
                            message: "No information found about user."
                        })
                    })
                }
            }
        })
    }
}