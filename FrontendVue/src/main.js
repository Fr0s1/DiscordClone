import { createApp, h } from "vue";
import App from "./App.vue";
import router from "./router";
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
import config from './config'
import Toaster from '@meforma/vue-toaster';

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

// Import Bootstrap Vue
import BootstrapVue3 from 'bootstrap-vue-3';
import { BootstrapIconsPlugin } from 'bootstrap-icons-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

Amplify.configure(aws_exports);
applyPolyfills().then(() => {
    defineCustomElements(window);
});

async function getAuthData() {
    try {
        let res = await Auth.currentSession()
        let accessToken = res.getAccessToken()
        let jwt = accessToken.getJwtToken()

        let user = await Auth.currentUserInfo();

        return {
            token: jwt,
            user
        }
    } catch (e) {
        console.log(e)
    }
}

(async () => {
    const app = createApp({
        render: () => h(App),
    })

    app.use(BootstrapVue3)
    app.use(BootstrapIconsPlugin);
    app.use(Toaster)
    app.use(VueAxios, axios)
    app.use(router)
    app.provide('config', config)

    try {
        app.use(new VueSocketIO({
            debug: true,
            connection: config.socketIO_Endpoint,
            options: {
                withCredentials: process.env.NODE_ENV !== "development",
            },
        }))

        const cache = new InMemoryCache()

        let authData = await getAuthData()

        app.provide('currentUsername', authData.user.username)

        const httpLink = new HttpLink({
            // You should use an absolute URL here
            uri: config.graphQL_Endpoint,
            headers: {
                authorization: `Bearer ${authData.token}`
            }
        })

        const wsLink = new WebSocketLink({
            uri: config.graphql_subscription_endpoint,
            options: {
                reconnect: true,
                connectionParams: {
                    authToken: authData.token
                }
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

    } catch (e) {
        console.log(e)
    }

    app.mount("#app");

})()

