<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p> <font size="20px">
      Đây là sản phẩm môn Dự Án INT 3509-1</font>
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener"
        ></a
      >.
    </p>
    <h3>Nhóm thực hiện</h3>
    <ul>
      <li>
        <a>Đinh Trọng Hiếu<br>18020xxx</a>
      </li>
      <li>
        <a>Phạm Văn Hoàng<br>18020564</a>
      </li>
      <li>
        <a>Nguyễn Chương Đức<br>18020353</a>
      </li>
    </ul>
    <h3>Mã nguồn</h3>
    <ul>
      <li>
        <a href="https://github.com/Fr0s1/DiscordClone" target="_blank" rel="noopener">GitHub</a>
      </li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li>
        <a href="https://router.vuejs.org" target="_blank" rel="noopener"
          >vue-router</a
        >
      </li>
      <li>
        <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-devtools#vue-devtools"
          target="_blank"
          rel="noopener"
          >vue-devtools</a
        >
      </li>
      <li>
        <a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener"
          >vue-loader</a
        >
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
          rel="noopener"
          >awesome-vue</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Discord Clone",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 60px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 20px;
}
a {
  color: #42b983;
}
</style>
