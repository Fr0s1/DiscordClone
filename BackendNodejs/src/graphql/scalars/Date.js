const { GraphQLScalarType } = require('graphql')
const { Kind } = require('graphql/language')
const { Schema } = require('mongoose')

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
        return Schema.Types.Date(value); // value from the client
    },
    serialize(value) {
        return Schema.Types.Date(value); // value sent to the client
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return Schema.Types.Date(ast.value); // ast value is always in string format
        }
        return null;
    },
})

module.exports = dateScalar