const fs = require('fs')
const path = require('path');
const axios = require('axios')

const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const express = require('express')
const http = require('http')

const cors = require('cors')

require('dotenv').config({path: path.join(process.cwd(), 'env/.env')})
const aws = require('./aws')

const mongo = require('./mongodb/schemas')

const Query = require('./graphql/resolvers/Query.js')
const Mutation = require('./graphql/resolvers/Mutation')
const User = require('./graphql/resolvers/User')
const Message = require('./graphql/resolvers/Message')
const GroupChat = require('./graphql/resolvers/GroupChat')
const GroupMessage = require('./graphql/resolvers/GroupMessage')

const dateScalar = require('./graphql/scalars/Date')

const resolvers = {
    Date: dateScalar,
    Query,
    Mutation,
    User,
    Message,
    GroupChat,
    GroupMessage
}

const CognitoExpress = require("cognito-express")

const typeDefs = fs.readFileSync(
    path.join(__dirname, 'graphql', 'schema.graphql'),
    'utf8'
)

async function startApolloServer(typeDefs, resolvers) {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            const cognitoExpress = new CognitoExpress({
                region: process.env.region,
                cognitoUserPoolId: process.env.cognitoUserPoolId,
                tokenUse: process.env.tokenUse, //Possible Values: access | id
                tokenExpiration: process.env.tokenExpiration //Up to default expiration of 1 hour (3600000 ms)
            });

            if (req.headers.authorization) {
                const authorizationHeader = req.headers.authorization || '';

                const token = authorizationHeader.replace("Bearer ", "")

                try {
                    let tokenPayload = await cognitoExpress.validate(token)
                    return {
                        mongo,
                        aws,
                        axios,
                        tokenPayload
                    }
                } catch (err) {
                    throw new Error(err);
                }
            } else {
                throw new Error('Not authenticated')
            }
        },
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();

    let corsOptions = {
        origin: '*'
    };

    app.use(cors(corsOptions));
    app.use(express.json())

    server.applyMiddleware({ app });
    await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
    const os = require("os");
    const hostname = os.hostname();
    console.log(`🚀 Server ready at ${hostname}${server.graphqlPath}`);
}

startApolloServer(typeDefs, resolvers)