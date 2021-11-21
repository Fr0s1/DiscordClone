import { createApp, h } from "vue";
import App from "./App.vue";
import router from "./router";
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
import config from './config'
import BootstrapVue3 from 'bootstrap-vue-3';
import { BootstrapIconsPlugin } from 'bootstrap-icons-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import {
    applyPolyfills,
    defineCustomElements,
} from '@aws-amplify/ui-components/loader';

import VueSocketIO from 'vue-3-socket.io';

import { ApolloClient, InMemoryCache } from '@apollo/client/core'

import { createApolloProvider } from '@vue/apollo-option'

import axios from 'axios'
import VueAxios from 'vue-axios'
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
    app.use(BootstrapVue3)
    app.use(BootstrapIconsPlugin);
    app.use(VueAxios, axios)
    app.use(router)
    app.provide('config', config)

    app.use(new VueSocketIO({
        debug: true,
        connection: config.socketIO_Endpoint,
        options: {
            withCredentials: false
        },
        transports: ["websocket"]
    }))

    const cache = new InMemoryCache()

    const getHeaders = async () => {

        try {
            let res = await Auth.currentSession()

            // console.log(res);
            let accessToken = res.getAccessToken()
            let jwt = accessToken.getJwtToken()

            let user = await Auth.currentUserInfo();
            // console.log(user);
            // console.log(user.username)
            //You can print them to see the full objects
            // console.log(`myAccessToken: ${JSON.stringify(accessToken)}`)
            // console.log(`myJwt: ${jwt}`)
            app.provide('currentUsername', user.username)
            return {
                authorization: `Bearer ${jwt}`
            }
        } catch (e) {
            console.log(e)
        }
    };

    const apolloClient = new ApolloClient({
        uri: config.graphQL_Endpoint,
        cache,
        headers: await getHeaders()
    })

    const apolloProvider = createApolloProvider({
        defaultClient: apolloClient,
    })

    app.use(apolloProvider)

    app.mount("#app");
})()

