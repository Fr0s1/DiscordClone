<template>
  <div class="home" style="text-align:center">
    <img style="width:14%" alt="Vue logo" src="../assets/logo.png"/>
    <HelloWorld msg="Welcome to Discord Clone App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
};
</script>
