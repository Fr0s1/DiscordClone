import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';

import {
    applyPolyfills,
    defineCustomElements,
} from '@aws-amplify/ui-components/loader';

Amplify.configure(aws_exports);
applyPolyfills().then(() => {
    defineCustomElements(window);
});

import VueSocketIO from 'vue-3-socket.io';

createApp(App).use(router).use(new VueSocketIO({
    debug: true,
    connection: 'ws://localhost:3000/chat',
    options: {
        withCredentials: false
    }
})).mount("#app");
