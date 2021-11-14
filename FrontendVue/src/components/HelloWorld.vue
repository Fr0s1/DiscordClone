<template>
  <div class="hello">
    <h1 style="color:#007bff">{{ msg }}</h1>
    <p> <font size="20px" style="color:#007bff">
      <b>Đây là sản phẩm môn Dự Án INT 3509-1</b></font>
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener"
        ></a
      >
    </p>
    <h3 style="color:#007bff">Nhóm thực hiện</h3>
    <ul style="color:#007bff">
      <li>
        <a>Đinh Trọng Hiếu<br>18020486</a>
      </li>
      <li>
        <a>Phạm Văn Hoàng<br>18020564</a>
      </li>
      <li>
        <a>Nguyễn Chương Đức<br>18020353</a>
      </li>
    </ul>
    <h3 style="color:#007bff">Mã nguồn</h3>
    <ul>
      <li>
        <a href="https://github.com/Fr0s1/DiscordClone" style="cursor:pointer" class="btn btn-outline-primary">GitHub</a>
      </li>
    </ul>
    <h3 style="color:#007bff">Liên kết ứng dụng</h3>
    <ul>
      <li>
        <a v-bind:href="'/chat'" style="cursor:pointer" class="btn btn-outline-primary">Chat</a>
      </li>
      <li>
        <a v-bind:href="'/user/'+this.currentUsername" style="cursor:pointer" class="btn btn-outline-primary">Profile</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Discord Clone",
  inject: ["currentUsername"],
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h3 {
  margin: 20 0 20 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 20px;
}

</style>
