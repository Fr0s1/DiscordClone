<template>
  <div class="home" style="text-align: center">
    <img style="width: 14%" alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Discord Clone App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { Auth } from "aws-amplify";
import gql from "graphql-tag";
export const ADD_USER = gql`
  mutation (
    $email: String!
    $name: String!
    $phone_number: String!
    $username: String!
    $birthdate: BirthDate!
  ) {
    addUser(
      email: $email
      name: $name
      phone_number: $phone_number
      username: $username
      birthdate: $birthdate
    ) {
      email
      name
      phone_number
      username
      birthdate
    }
  }
`;

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  data() {
    return {
      userInfo: null,
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
  async created() {
    try {
      var userInfo = await Auth.currentUserInfo();

      this.$apollo.mutate({
        mutation: ADD_USER,
        variables: {
          name: userInfo.attributes.name,
          email: userInfo.attributes.email,
          phone_number: userInfo.attributes.phone_number,
          username: userInfo.username,
          birthdate: userInfo.attributes.birthdate,
        },
      });
    } catch (e) {
      console.log(e);
    }
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
  },
};
</script>
<style>
.home {
  background: white;
}
</style>
