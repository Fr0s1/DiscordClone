<template>
  <div class="bgimg">
    <amplify-authenticator>
      <amplify-sign-in
        header-text="Welcome to Discord Clone App"
        slot="sign-in"
        :formFields="formFields1"
      ></amplify-sign-in>
      <amplify-sign-up slot="sign-up" :formFields="formFields2">
        <div slot="federated-buttons"></div
      ></amplify-sign-up>

      <div v-if="authState === 'signedin' && user">
        <router-view />
      </div>
    </amplify-authenticator>
  </div>
</template>

<script>
import { onAuthUIStateChange } from "@aws-amplify/ui-components";
export default {
  name: "AuthWithSlots",
  created() {
    this.unsubscribeAuth = onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData;
    });
  },
  beforeUnmount() {
    this.unsubscribeAuth();
  },
  data() {
    return {
      user: undefined,
      authState: undefined,
      unsubscribeAuth: undefined,
      formFields1: [
        {
          type: "username",
          label: "Username",
          placeholder: "Your Username",
          inputProps: { required: true, autocomplete: "username" },
        },
        {
          type: "password",
          label: "Password",
          placeholder: "Input Password",
          inputProps: { required: true, autocomplete: "new-password" },
        },
      ],
      formFields2: [
        {
          type: "name",
          label: "Your Name",
          placeholder: "Your Name",
          inputProps: { required: true, autocomplete: "name" },
        },
        {
          type: "birthdate",
          label: "Birthday",
          placeholder: "Your Birthday",
          inputProps: { required: true, autocomplete: "birthdate" },
        },
        {
          type: "email",
          label: "Email",
          placeholder: "Your Email",
          inputProps: { required: true, autocomplete: "email" },
        },
        {
          type: "username",
          label: "Username",
          placeholder: "Your Username",
          inputProps: { required: true, autocomplete: "username" },
        },
        {
          type: "password",
          label: "Password",
          placeholder: "Input Password",
          inputProps: { required: true, autocomplete: "new-password" },
        },
        {
          type: "phone_number",
          label: "Phone Number",
          placeholder: "Input your Phone Number",
          inputProps: { required: true, autocomplete: "phone_number" },
        },
      ],
    };
  },
};
</script>

<style>
:root {
  --amplify-primary-color: #7289da;
  --amplify-primary-tint: #99aab5;
  --amplify-primary-shade: #007bff;
  --amplify-text-sm: 1rem;
  --amplify-background-color: #2c2f33;
  --amplify-secondary-color: #7289da;
}
.bgimg {
  background-image: url("./assets/LoginBackground.png");
  background-color: #007bff;
  background-size: 100% auto;
}
</style>
