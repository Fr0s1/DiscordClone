let config = process.env.NODE_ENV === "development" ? {
    socketIO_Endpoint: 'ws://localhost:3000/chat',
    graphQL_Endpoint: 'http://localhost:4000/graphql',
    socketIO_HTTP: "http://localhost:3000/chat",
    graphql_subscription_endpoint: "ws://localhost:4000/graphql",
    file_server_endpoint: "http://localhost:8000/file"

} : {
    socketIO_Endpoint: 'wss://api.frostdevops.com/chat',
    graphQL_Endpoint: 'https://api.frostdevops.com/graphql',
    socketIO_HTTP: "https://api.frostdevops.com/chat",
    graphql_subscription_endpoint: "wss://api.frostdevops.com/graphql",
    file_server_endpoint: "https://api.frostdevops.com/file"
}

export default config

/* For AWS deployment */
// socketIO_Endpoint: 'wss://api.frostdevops.com/chat',
// graphQL_Endpoint: 'https://api.frostdevops.com/graphql',
// socketIO_HTTP: "https://api.frostdevops.com/chat",
// graphql_subscription_endpoint: "wss://api.frostdevops.com/graphql",
// file_server_enpoint: "https://api.frostdevops.com/file"

/* For local development */
// socketIO_Endpoint: 'ws://localhost:3000/chat',
// graphQL_Endpoint: 'http://localhost:4000/graphql',
// socketIO_HTTP: "http://localhost:3000/chat",
// graphql_subscription_endpoint: "ws://localhost:4000/graphql",
// file_server_enpoint: "http://localhost:8000/file"
