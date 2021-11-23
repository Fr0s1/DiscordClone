const { GraphQLScalarType, Kind } = require('graphql');
const moment = require('moment')

const { isValidDate } = require('../utils')

const birthDateScalar = new GraphQLScalarType({
    name: 'BirthDate',
    description: 'Birth Date custom scalar type',
    serialize(value) {
        return value; // Convert outgoing Date to integer for JSON
    },
    parseValue(value) {
        if (isValidDate(value)) { // Check for date has format DD/MM/YYYY
            return moment(value, "DD/MM/YYYY").format("DD/MM/YYYY")
        }
        return null
    },
    parseLiteral(ast) {
        if (isValidDate(ast)) { // Check for date has format DD/MM/YYYY
            return moment(ast, "DD/MM/YYYY").format("DD/MM/YYYY")
        }
        return null
    },
});

module.exports = birthDateScalar