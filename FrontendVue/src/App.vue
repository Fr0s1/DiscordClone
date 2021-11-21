<template>
  <amplify-authenticator>
    <!-- The rest of your app code -->

    <router-view />
    <!-- <amplify-sign-in
    header-text="My Custom Sign In Text"
    slot="sign-in"
    :handleSubmit="handleSubmit"
  ></amplify-sign-in> -->
    <amplify-sign-up
      slot="sign-up"
      :formFields="formFields"
    ></amplify-sign-up>

  </amplify-authenticator>
</template>

<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Auth } from 'aws-amplify';
export async function register(email, password, username, phone_number) {

  return Auth
    .signUp({ username, password }, email, phone_number)
    .then(data => console.log())
    .catch(error => {
      notification.warning({
        message: error.code,
        description: error.message,
      })
    })
}
export default {
  name: 'AuthWithSlots',
  // created() {
  //   this.unsubscribeAuth = onAuthUIStateChange((authState, authData) => {
  //     this.authState = authState;
  //     this.user = authData;
  //   })
  // },
  data() {
    return {
      // user: {},
      // authState: {},
      // unsubscribeAuth: {},
      formFields: [
        {
          type: 'email',
          label: 'Email',
          placeholder: 'Custom email placeholder',
          inputProps: { required: true, autocomplete: 'email' },
        },
        {
          type: 'username',
          label: 'Username',
          placeholder: 'Custom email placeholder',
          inputProps: { required: true, autocomplete: 'username' },
        },
        {
          type: 'password',
          label: 'Password',
          placeholder: 'Custom password placeholder',
          inputProps: { required: true, autocomplete: 'new-password' },
        },
        {
          type: 'phone_number',
          label: 'PhoneNumber',
          placeholder: 'PhoneNumber',
          inputProps: { required: true, autocomplete: 'phone_number' },
        },
        {
          type: 'name',
          label: 'Name',
          placeholder: 'Custom name placeholder',
          inputProps: { required: true, autocomplete: 'name' },
        },
        {
          type: 'birthdate',
          label: 'Birthdate',
          placeholder: 'Custom birthdate placeholder',
          inputProps: { required: true, autocomplete: 'birthdate' },
        },
      ]
    }
  },

  // beforeUnmount() {
  //   this.unsubscribeAuth();
  // }
  methods: {
    // handleSubmit(e) {

    // }
  }
  
}
</script>
<style>
  :root{
    --amplify-primary-color: #007bff;
    --amplify-primary-tint: #2600ff;
    --amplify-primary-shade: #1100ff;
    --amplify-text-sm: 1rem;
  }
 
</style>