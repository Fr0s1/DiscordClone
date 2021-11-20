<template>
  <div class="bgimg">
    <amplify-authenticator>
      <!-- The rest of your app code -->

      <router-view />
    </amplify-authenticator>
  </div>
</template>

<script>
export default {};
</script>
<style>
:root {
  --amplify-primary-color: #007bff;
  --amplify-primary-tint: #2600ff;
  --amplify-primary-shade: #1100ff;
  --amplify-text-sm: 1rem;
}
.bgimg {
  background-image: url("./assets/LoginBackground.png");
  background-color: #007bff;
  background-size: 100% auto;
}
</style>
