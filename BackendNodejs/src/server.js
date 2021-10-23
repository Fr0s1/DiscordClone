const fs = require('fs')
const path = require('path')
const axios = require('axios')

const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const express = require('express')
const http = require('http')

const cors = require('cors')

require('dotenv').config({ path: path.join(process.cwd(), 'env/.env') })

const aws = require('./aws')

const mongo = require('./mongodb/schemas')

const Query = require('./graphql/resolvers/Query.js')
const Mutation = require('./graphql/resolvers/Mutation')
const User = require('./graphql/resolvers/User')
const Message = require('./graphql/resolvers/Message')
const GroupChat = require('./graphql/resolvers/GroupChat')
const GroupMessage = require('./graphql/resolvers/GroupMessage')

const dateScalar = require('./graphql/scalars/Date')

const { deprecatedDirective } = require('./graphql/directives/deprecatedDirective')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const { deprecatedDirectiveTypeDefs, deprecatedDirectiveTransformer } = deprecatedDirective('deprecated')

const CognitoExpress = require("cognito-express")

const { loadSchema } = require('@graphql-tools/load')
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader')

async function startApolloServer() {
    const resolvers = {
        Date: dateScalar,
        Query,
        Mutation,
        User,
        Message,
        GroupChat,
        GroupMessage
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
        introspection: true,
        context: async ({ req }) => {
            const cognitoExpress = new CognitoExpress({
                region: process.env.region,
                cognitoUserPoolId: process.env.cognitoUserPoolId,
                tokenUse: process.env.tokenUse, //Possible Values: access | id
                tokenExpiration: process.env.tokenExpiration //Up to default expiration of 1 hour (3600000 ms)
            })

            if (req.headers.authorization) {
                const authorizationHeader = req.headers.authorization || ''

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
                    throw new Error(err)
                }
            } else {
                throw new Error('Not authenticated')
            }
        },
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    })
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
    await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve))
    const os = require("os")
    const hostname = os.hostname()

    
    console.log(`🚀 Server ready at ${hostname}${server.graphqlPath}`)
}

startApolloServer()