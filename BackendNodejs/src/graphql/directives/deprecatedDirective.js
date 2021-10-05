const { mapSchema, getDirective, MapperKind } = require('@graphql-tools/utils')
const { GraphQLSchema } = require('graphql')

function deprecatedDirective(directiveName) {
    return {
        deprecatedDirectiveTypeDefs: `directive @${directiveName}(reason: String) on FIELD_DEFINITION | ENUM_VALUE`,
        deprecatedDirectiveTransformer: (schema) => mapSchema(schema, {
            [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
                const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
                if (deprecatedDirective) {
                    fieldConfig.deprecationReason = deprecatedDirective['reason'];
                    return fieldConfig;
                }
            },
            [MapperKind.ENUM_VALUE]: (enumValueConfig) => {
                const deprecatedDirective = getDirective(schema, enumValueConfig, directiveName)?.[0];
                if (deprecatedDirective) {
                    enumValueConfig.deprecationReason = deprecatedDirective['reason'];
                    return enumValueConfig;
                }
            }
        }),
    };
}

module.exports = {
    deprecatedDirective
}