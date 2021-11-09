<template>
  <amplify-authenticator>
    <!-- The rest of your app code -->
    
    <router-view />
   
  </amplify-authenticator>
</template>

<script>
export default {
  
};
</script>
<style>
  :root{
    --amplify-primary-color: #007bff;
    --amplify-primary-tint: #2600ff;
    --amplify-primary-shade: #1100ff;
    --amplify-text-sm: 1rem;
  }
  :root.amplify-button{
    --text-transform: auto;
    
  }
  
</style>
