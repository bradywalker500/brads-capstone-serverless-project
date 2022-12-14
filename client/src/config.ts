// BOOK: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '5z4ua1scrc'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // BOOK: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-etfd3hhv.us.auth0.com',            // Auth0 domain
  clientId: 'JLL0LYJZ2KxzHFlFdx3sAGJXzk5gVgRE',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
