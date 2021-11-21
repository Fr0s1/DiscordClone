<template>
  <div class="home" style="text-align:center">
    <img style="width:14%" alt="Vue logo" src="../assets/logo.png"/>
    <HelloWorld msg="Welcome to Discord Clone App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { Auth } from 'aws-amplify';
import gql from "graphql-tag";
export const ADD_USER = gql`mutation ($email: String!, $name: String!, $phone_number: String!, $username: String!) {
  addUser(email: $email, name: $name, phone_number: $phone_number, username: $username) {
    email,
    name,
    phone_number,
    username
  }
}`;

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  inject: ["currentUsername"],

  data() {
    return {
      
    };
  },
  mounted() {
    // this.$router.go()
    // this.loadUser()
    // console.log(this.$router)
  },

  beforeMounted() {
    // location.reload()
  },
  created() {
    var name = Auth.currentUserInfo()
        console.log(name)
        name.then(result => {
          console.log(result)
          this.$apollo.mutate({
              mutation: ADD_USER,
              variables: {
                name: result.attributes.name,
                email: result.attributes.email,
                phone_number: result.attributes.phone_number,
                username: result.username
              }
            });
        })
  },
  methods: {
    //  loadUser() {
    //    console.log("abc")
    //     var name = Auth.currentUserInfo()
    //     console.log(name)
    //     name.then(result => {
    //       console.log(result)
    //       this.$apollo.mutate({
    //           mutation: ADD_USER,
    //           variables: {
    //             name: result.attributes.name,
    //             email: result.attributes.email,
    //             phone_number: result.attributes.phone_number,
    //             username: result.username
    //           }
    //         });
    //     })
    //  } 

  }
};
</script>
