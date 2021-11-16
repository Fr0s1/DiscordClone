export default {
    socketIO_Endpoint: 'ws://localhost:3000/chat',
    graphQL_Endpoint: 'http://localhost:4000/graphql',
    socketIO_HTTP: "http://localhost:3000/chat",
    graphql_subscription_endpoint: "ws://localhost:4000/graphql"
}

// http://localhost:3000/chat
// http://localhost:4000/grapql
// ws://localhost:3000/chat

/* For AWS deployment */
// socketIO_Endpoint: 'wss://api.frostdevops.com/chat',
// graphQL_Endpoint: 'https://api.frostdevops.com/graphql',
// socketIO_HTTP: "https://api.frostdevops.com/chat",
// graphql_subscription_endpoint: "wss://api.frostdevops.com/graphql"

/* For local development */
// socketIO_Endpoint: 'ws://localhost:3000/chat',
// graphQL_Endpoint: 'http://localhost:4000/graphql',
// socketIO_HTTP: "http://localhost:3000/chat",
// graphql_subscription_endpoint: "ws://localhost:4000/graphql"
