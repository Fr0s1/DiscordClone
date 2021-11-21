<template>
 <div class="container">
    <h1>Edit Profile</h1>
  	<hr>
	<div class="row">
      <div class="col-md-3">
        <div class="text-center">
          <img v-bind:src="g_user.avatar" class=" img-circle" alt="avatar">
          <input type="file"  @change="processFile($event)" class="form-control">
        </div>
      </div>
      
      <div class="col-md-9 personal-info">
        <h3>Personal info</h3>
        
        <form class="form-horizontal" role="form">
          <div class="form-group">
            <label class="col-lg-3 control-label">Name:</label>
            <div class="col-lg-8">
              <input  class="form-control" type="text" v-model="g_user.name">
            </div>
          </div>
          <div class="form-group">
            <label class="col-lg-3 control-label">Email:</label>
            <div class="col-lg-8">
              <input class="form-control" type="text" v-model="g_user.email">
            </div>
          </div>
          <div class="form-group">
            <label class="col-lg-3 control-label">PhoneNumber:</label>
            <div class="col-lg-8">
              <input class="form-control" type="text" v-model="g_user.phone_number">
            </div>
          </div>
          <div class="form-group">
            <label class="col-md-3 control-label">Username:</label>
            <div class="col-md-8">
              <input class="form-control" type="text" v-model="g_user.username">
            </div>
          </div>
          
          <div class="form-group">
            <label class="col-md-3 control-label"></label>
            <div class="col-md-8">
              <input @click="updateUserInfo" type="button" class="btn btn-primary" value="Save Changes">
              <span></span>
            </div>
          </div>
        </form>
      </div>
  </div>
</div>
</template>

<script>
import gql from "graphql-tag";
export const UPDATE_USER_INFO = gql`mutation ($email: String!, $name: String!, $phone_number: String!, $avatar: String!) {
  updateUserInfo(email: $email, name: $name, phone_number: $phone_number, avatar: $avatar) {
    email,
    name,
    phone_number,
    avatar
  }
}`;
export default {
    
  inject: ["currentUsername"],
  data() {
    return {
      // Initialize your apollo data
      g_user: {
          name: '',
          username: '',
          phone_number: '',
          emai: '',
          avatar: ''
      },
      friendlist: [],
      someData: ''
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
    this.someData = event.target.files[0]
    console.log(this.someData.name)
    },

    updateUserInfo() {
      console.log(this.g_user.name);
      this.$apollo.mutate({
        mutation: UPDATE_USER_INFO,
        variables: {
          name: this.g_user.name,
          email: this.g_user.email,
          phone_number: this.g_user.phone_number,
          avatar: this.someData.name
        }
      });
      
      // this.$router.push('/user/'+this.currentUsername);
    }

  },
  
  mounted() {
    console.log(this.currentUsername);
    console.log(this.user);
    
  },

}
</script>

<style>

</style>