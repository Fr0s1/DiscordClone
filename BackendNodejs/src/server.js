const path = require('path')
const axios = require('axios')

const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const express = require('express')
const http = require('http')

const cors = require('cors')

let ENV = process.env.ENV

if (ENV !== "AWS") {
    require('dotenv').config({ path: path.join(process.cwd(), 'env/.env') })
}

const aws = require('./aws')

const mongo = require('./mongodb/schemas')

const Query = require('./graphql/resolvers/Query.js')
const Mutation = require('./graphql/resolvers/Mutation')
const User = require('./graphql/resolvers/User')
const Message = require('./graphql/resolvers/Message')
const GroupChat = require('./graphql/resolvers/GroupChat')
const GroupMessage = require('./graphql/resolvers/GroupMessage')
const Subscription = require('./graphql/resolvers/Subscription')

const dateScalar = require('./graphql/scalars/Date')
const birthDateScalar = require('./graphql/scalars/BirthDate')

const { deprecatedDirective } = require('./graphql/directives/deprecatedDirective')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const { deprecatedDirectiveTypeDefs, deprecatedDirectiveTransformer } = deprecatedDirective('deprecated')

const CognitoExpress = require("cognito-express")

const { loadSchema } = require('@graphql-tools/load')
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader')

const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')

const { validateToken } = require('./graphql/utils')

async function startApolloServer() {
    const resolvers = {
        Date: dateScalar,
        BirthDate: birthDateScalar,
        Query,
        Mutation,
        User,
        Message,
        GroupChat,
        GroupMessage,
        Subscription
    }

    const graphqlSchema = await loadSchema(path.join(__dirname, "graphql/schema.graphql"), {
        loaders: [
            new GraphQLFileLoader()
        ]
    })

    let schema = makeExecutableSchema({
        typeDefs: [
            deprecatedDirectiveTypeDefs,
            graphqlSchema
        ],
        resolvers
    })

    schema = deprecatedDirectiveTransformer(schema)

    const app = express()
    const httpServer = http.createServer(app)

    const server = new ApolloServer({
        schema,
        context: async ({ req }) => {
            if (req.headers.authorization) {
                const authorizationHeader = req.headers.authorization || ''

                const token = authorizationHeader.replace("Bearer ", "")

                try {
                    let tokenPayload = await validateToken(token)

                    return {
                        mongo,
                        aws,
                        axios,
                        tokenPayload
                    }
                } catch (err) {
                    throw new Error(err)
                }
            } else {
                throw new Error('Not authenticated')
            }
        },
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), {
            async serverWillStart() {
                return {
                    async drainServer() {
                        subscriptionServer.close();
                    }
                };
            }
        }],
    })

    const subscriptionServer = SubscriptionServer.create({
        // This is the `schema` we just created.
        schema,
        // These are imported from `graphql`.
        execute,
        subscribe,
        async onConnect(connectionParams, webSocket) {
            if (connectionParams.authToken) {
                const tokenPayload = await validateToken(connectionParams.authToken)
                return { tokenPayload };
            }
            throw new Error('Missing auth token!');
        }
    }, {
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // This `server` is the instance returned from `new ApolloServer`.
        path: server.graphqlPath,
    });

    await server.start()

    let corsOptions = {
        origin: '*'
    }

    app.use(cors(corsOptions))
    app.use(express.json())

    app.get('/graphql/healthz', (req, res) => {
        res.send(`🚀 Server ready at ${hostname}${server.graphqlPath}`)
    })

    server.applyMiddleware({ app })
    const PORT = process.env.PORT || 4000
    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve))
    const os = require("os")
    const hostname = os.hostname()

    console.log(`🚀 Server ready at ${hostname}:${PORT}${server.graphqlPath}`)
}

startApolloServer()