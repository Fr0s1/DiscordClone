const { ApolloServer } = require('apollo-server')
const fs = require('fs')
const path = require('path');
const axios = require('axios')

const Query = require('./graphql/resolvers/Query.js')
const Mutation = require('./graphql/resolvers/Mutation')
const User = require('./graphql/resolvers/User')
const Message = require('./graphql/resolvers/Message')
const GroupChat = require('./graphql/resolvers/GroupChat')

require('dotenv').config()
const dateScalar = require('./graphql/scalars/Date')
const aws = require('./aws')

const mongo = require('./mongodb/schemas')

const resolvers = {
    Date: dateScalar,
    Query,
    Mutation,
    User,
    Message,
    GroupChat
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'graphql', 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: {
        mongo,
        aws,
        axios
    }
})

server.listen().then(({ url }) => {
    console.log(process.env.BUCKET_NAME)
    console.log(`Server is running on ${url}`)
})

