import { createApp, h } from "vue";
import App from "./App.vue";
import router from "./router";
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';

import {
    applyPolyfills,
    defineCustomElements,
} from '@aws-amplify/ui-components/loader';


import VueSocketIO from 'vue-3-socket.io';

import { ApolloClient, InMemoryCache } from '@apollo/client/core'

import { createApolloProvider } from '@vue/apollo-option'

Amplify.configure(aws_exports);
applyPolyfills().then(() => {
    defineCustomElements(window);
});

(async () => {
    const app = createApp({
        render: () => h(App),
    })

    app.use(router)

    app.use(new VueSocketIO({
        debug: true,
        connection: 'ws://localhost:3000/chat',
        options: {
            withCredentials: false
        }
    }))

    const cache = new InMemoryCache()

    const getHeaders = async () => {

        let res = await Auth.currentSession()
        let accessToken = res.getAccessToken()
        let jwt = accessToken.getJwtToken()
        //You can print them to see the full objects
        console.log(`myAccessToken: ${JSON.stringify(accessToken)}`)
        console.log(`myJwt: ${jwt}`)

        return {
            authorization: `Bearer ${jwt}`
        }

    };

    const apolloClient = new ApolloClient({
        uri: 'http://localhost:4000/graphql',
        cache,
        headers: await getHeaders()
    })

    const apolloProvider = createApolloProvider({
        defaultClient: apolloClient,
    })

    app.use(apolloProvider)

    app.mount("#app");
})()

