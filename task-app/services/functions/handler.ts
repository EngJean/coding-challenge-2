import { APIGatewayProxyEvent, APIGatewayProxyCallback} from 'aws-lambda';
import { CognitoIdentityServiceProvider } from "aws-sdk";
import DynamoDB from './helpers/dynamo';
import { parse } from "aws-multipart-parser";
import { MultipartFormData } from 'aws-multipart-parser/dist/models';
import { v4 as uuidv4 } from "uuid";

const cognito = new CognitoIdentityServiceProvider()
const dynamoClient = new DynamoDB()

export const signUp = (event: APIGatewayProxyEvent, context: any, callback: APIGatewayProxyCallback) => {

  if (!event.body) {
      return callback(null, {
          statusCode: 500,
          body: JSON.stringify({message: "Please use a proper body"})
      })
  }
  else {

      const body = JSON.parse(event.body)
  
      const params = {
          "ClientId": process.env.GO_GETTER_USERS_CLIENT_ID ? process.env.GO_GETTER_USERS_CLIENT_ID : '',
          "Username": body.userName,
          "Password": body.password,
          "UserAttributes": [
              {
                  "Name": "phone_number",
                  "Value": body.phoneNumber
              },
              {
                  "Name": "email",
                  "Value": body.email
              },
              {
                  "Name": "given_name",
                  "Value": body.firstName
              },
              {
                  "Name": "family_name",
                  "Value": body.lastName
              },
              {
                  "Name": "birthdate",
                  "Value": body.birthDate
              }
          ]
      }
      cognito.signUp(params, (err, data) => {
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
              return dynamoClient.createUser(body.userName, data.UserSub, callback)
          }
      })
  }
}

export const confirmUser = (event: APIGatewayProxyEvent, context: any, callback: APIGatewayProxyCallback) => { 

  if (!event.body) {
      return callback(null, {
          headers: {
              "Access-Control-Allow-Origin": "*"
          },
          statusCode: 500,
          body: JSON.stringify({message: "Please use a proper body"})
      })
  }
  else { 

      const body = JSON.parse(event.body)

      const params = {
          "ClientId": process.env.GO_GETTER_USERS_CLIENT_ID ? process.env.GO_GETTER_USERS_CLIENT_ID : '',
          "ConfirmationCode": body.code,
          "Username": body.userName
      }

      cognito.confirmSignUp(params, (err, data) => {
          if (err) {
              return callback(null, {
                  headers: {
                      "Access-Control-Allow-Origin": "*"
                  },
                  statusCode: 500,
                  body: JSON.stringify({message: err})
              })
          }
          else {
              return callback(null, {
                  headers: {
                      "Access-Control-Allow-Origin": "*"
                  },
                  statusCode: 200,
                  body: JSON.stringify({message: "User has been confirmed"})
              })
          }
      })
  }
}

export const authenticateUser = (event: APIGatewayProxyEvent, context: any, callback: APIGatewayProxyCallback) => { 

  if (!event.body) {
      return callback(null, {
          headers: {
              "Access-Control-Allow-Origin": "*"
          },
          statusCode: 500,
          body: JSON.stringify({message: "Please use a proper body"})
      })
  }
  else { 

      const body = JSON.parse(event.body)

      const params = {
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: process.env.GO_GETTER_USERS_CLIENT_ID ? process.env.GO_GETTER_USERS_CLIENT_ID : '',
          AuthParameters: {
              USERNAME: body.userName,
              PASSWORD: body.password
          }
      }

      cognito.initiateAuth(params, (err, data) => {
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
                      message: {
                          IdToken: data.AuthenticationResult?.IdToken,
                          ExpiresIn: data.AuthenticationResult?.ExpiresIn,
                      }
                  })
              })
          }
      })

  }
} 

export const getUser = (event: APIGatewayProxyEvent, context: any, callback: APIGatewayProxyCallback) => {

  const userName = event.pathParameters ? event.pathParameters.user_name : undefined

  if (userName) {
      return dynamoClient.getUser(userName, callback)
  }
  else {
      return callback(null, {
          headers: {
              "Access-Control-Allow-Origin": "*"
          },
          statusCode: 500,
          body: JSON.stringify({
              message: "Please include a user in the request"
          })
      })
  }
}

export const createTask = (event: APIGatewayProxyEvent, context: any, callback: APIGatewayProxyCallback) => {
  
  const userName = event.pathParameters ? event.pathParameters.user_name : undefined
  const uuid = uuidv4();

  if (userName) {
    if (!event.body) {
        return callback(null, {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            statusCode: 500,
            body: JSON.stringify({message: "Please use a proper body"})
        })
    }
    else {
        const data : MultipartFormData = parse(event, true)
        
        const result = {
          task_name: data.task_name,
        //   task_due_date: data.task_due_date,
          user_name: userName,
        }
        return dynamoClient.createTask(result, uuid, callback)
      }
    }
  else {
    return callback(null, {
      headers: {
          "Access-Control-Allow-Origin": "*"
      },
      statusCode: 500,
      body: JSON.stringify({message: "Please include a user name"})
    })
  }
}
  
export const getTasks = (event: APIGatewayProxyEvent, context: any, callback: APIGatewayProxyCallback) => {

  const userName = event.pathParameters ? event.pathParameters.user_name : undefined

  if (userName) {
      return dynamoClient.getTasks(userName, callback)
  }
  else {
      return callback(null, {
          headers: {
              "Access-Control-Allow-Origin": "*"
          },
          statusCode: 500,
          body: JSON.stringify({message: "Please include a user name"})
      })
  }
}