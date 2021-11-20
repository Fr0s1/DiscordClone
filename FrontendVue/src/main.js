import { createApp, h } from "vue";
import App from "./App.vue";
import router from "./router";
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
import config from './config'

import {
    applyPolyfills,
    defineCustomElements,
} from '@aws-amplify/ui-components/loader';

import VueSocketIO from 'vue-3-socket.io';

import { ApolloClient, InMemoryCache } from '@apollo/client/core'

import { createApolloProvider } from '@vue/apollo-option'

import axios from 'axios'
import VueAxios from 'vue-axios'

// Import for GraphQL Subscription
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { HttpLink } from 'apollo-link-http'

Amplify.configure(aws_exports);
applyPolyfills().then(() => {
    defineCustomElements(window);
});

import { createStore } from 'vuex'

(async () => {
    const app = createApp({
        render: () => h(App),
    })

    const store = createStore({
        state() {
            return {

            }
        }
    })

    app.use(store)

    app.use(VueAxios, axios)
    app.use(router)
    app.provide('config', config)

    app.use(new VueSocketIO({
        debug: true,
        connection: config.socketIO_Endpoint,
        options: {
            withCredentials: false,
        },
    }))

    const cache = new InMemoryCache()

    const getHeaders = async () => {

        try {
            let res = await Auth.currentSession()
            let accessToken = res.getAccessToken()
            let jwt = accessToken.getJwtToken()

            let user = await Auth.currentUserInfo();
            app.provide('currentUsername', user.username)
            return {
                authorization: `Bearer ${jwt}`
            }
        } catch (e) {
            console.log(e)
        }
    };

    const httpLink = new HttpLink({
        // You should use an absolute URL here
        uri: config.graphQL_Endpoint,
        headers: await getHeaders()
    })

    const wsLink = new WebSocketLink({
        uri: config.graphql_subscription_endpoint,
        options: {
            reconnect: true,
        },
    })

    const link = split(
        // split based on operation type
        ({ query }) => {
            const definition = getMainDefinition(query)
            return definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
        },
        wsLink,
        httpLink
    )

    const apolloClient = new ApolloClient({
        link,
        cache,
    })

    const apolloProvider = createApolloProvider({
        defaultClient: apolloClient,
    })

    app.use(apolloProvider)

    app.mount("#app");
})()

