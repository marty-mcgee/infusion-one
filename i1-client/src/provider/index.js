import { API, graphqlOperation } from "aws-amplify";

export const connectToGraphqlAPI = ({endpoingName = 'dev', graphqlQuery, variables}) => {
    if(API && API._graphqlApi && API._graphqlApi._options && API._graphqlApi._options.endpoints && API._graphqlApi._options.endpoints.length) {
        const matchedEndPoint = API._graphqlApi._options.endpoints.find(endpoint => endpoint.name === endpoingName);
        if(endpoingName && matchedEndPoint) {
            API._graphqlApi._options.aws_appsync_graphqlEndpoint = matchedEndPoint.endpoint;
            API._graphqlApi._options.aws_appsync_apiKey = matchedEndPoint.aws_appsync_apiKey;
            return variables ? API.graphql(graphqlOperation(graphqlQuery, variables)) : API.graphql(graphqlOperation(graphqlQuery));
        }
    }
   return undefined;  
}


