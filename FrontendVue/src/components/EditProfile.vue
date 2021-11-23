<template>
<body>
 <div class="container">
    <h1>Edit Profile</h1>
  	<hr>
	<div class="row">
      <div class="col-md-3">
      </div>
      <div class="col-md-10 personal-info" style="border:1px soild black">
        <h3>Personal info</h3>
      <b-card >
        <b-card-header header-tag="header" role="tab" class="d-flex p-1">
          <b-button :href='"/user/"+g_user.username' variant="primary" class="mb-2">
            <b-icon icon="chevron-compact-left" aria-hidden="true"></b-icon> Back
          </b-button>
          <p class="text-center">Form Edir User Info</p>
        </b-card-header>
      <b-form>
        <b-form-group
        id="input-group-1"
        label="Avatar:"
        label-for="input-1"
      >
        <b-avatar size="150px" square v-bind:src="g_user.avatar"></b-avatar>
        <br>
        <input style="margin-top:20px" @change="processFile($event)" type="file" name="avatar" id="avatar">
        </b-form-group>
        <b-form-group
        id="input-group-1"
        label="Name :"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="g_user.name"
          type="text"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-1"
        label="Email Address :"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="g_user.email"
          type="email"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-1"
        label="PhoneNumber :"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="g_user.phone_number"
          type="text"
        ></b-form-input>
      </b-form-group>
      <b-button @click="updateUserInfo" variant="primary">Save Changes</b-button>
      </b-form>
    </b-card>
      </div>
  </div>
</div>
</body>
</template>

<script>
const axios = require("axios")
import gql from "graphql-tag";
export const UPDATE_USER_INFO = gql`mutation ($email: String!, $name: String!, $phone_number: String!) {
  updateUserInfo(email: $email, name: $name, phone_number: $phone_number) {
    email,
    name,
    phone_number,
  }
}`;
export default {
    
  inject: ["currentUsername"],
  data() {
    return {
      // avatar: {
      //   username: '',
      //   avatar: ''
      // },
      avatar: '',
      // Initialize your apollo data
      g_user: {
          name: '',
          username: '',
          phone_number: '',
          email: '',
      },
      friendlist: [],
      originalname: ''
    };
  },
  apollo: {
    user() {
      return {
        query: gql`
          query Query($username: String) {
            user(username: $username) {
              username
              email
              name
              phone_number
              avatar
            }
          }
        `,
        variables: {
          username: this.currentUsername,
        },
        result (r) {
          this.g_user.name = r.data.user.name
          this.g_user.email = r.data.user.email
          this.g_user.username = r.data.user.username
          this.g_user.phone_number = r.data.user.phone_number,
          this.g_user.avatar = r.data.user.avatar
        }
      };
    },
  },
  methods: {

    processFile(event) {
    this.avatar = event.target.files[0]
    console.log(this.avatar)
    },

    updateUserInfo() {
      let formData = new FormData();
      formData.append("username", this.g_user.username);
      formData.append('avatar', this.avatar);
      console.log(this.g_user.name);
      this.$apollo.mutate({
        mutation: UPDATE_USER_INFO,
        variables: {
          name: this.g_user.name,
          email: this.g_user.email,
          phone_number: this.g_user.phone_number,
        }
      });

      axios.post("http://localhost:8000/file/users/avatar",formData)
            .then((res) => {
              console.log(res);
            })
            .catch((e) => {
              console.log(e);
            });
      
      this.$toast.success(`Successfully edited profile`);
      setTimeout(this.$toast.clear, 3000)
      // location.reload();
      this.$router.go();
    }

  },
  
  mounted() {
    console.log(this.currentUsername);
    console.log(this.g_user);
    
  },

}
</script>

<style>
  .body{
    background: white;
  }
</style>