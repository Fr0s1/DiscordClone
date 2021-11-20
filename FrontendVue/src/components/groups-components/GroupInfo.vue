<template>
  <div class="group-info">
    <div class="online-members" v-if="onlineMembers.length > 0">
      <ul class="list-unstyled chat-list mt-2 mb-0">
        <h1>Online - {{ onlineMembers.length }}</h1>
        <li
          class="clearfix"
          v-for="(member, index) in onlineMembers"
          :key="index"
        >
          <img :src="member.avatar" alt="avatar" />
          <p>{{ member.username }}</p>
        </li>
      </ul>
    </div>
    <div class="offline-members" v-if="offlineMembers.length > 0">
      <ul class="list-unstyled chat-list mt-2 mb-0">
        <h1>Offline - {{ offlineMembers.length }}</h1>
        <li
          class="clearfix"
          v-for="(member, index) in offlineMembers"
          :key="index"
        >
          <img :src="member.avatar" alt="avatar" />
          <p>{{ member.username }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    groupMembers: {
      type: Array,
    },
    activeGroupAvatar: {
      type: String,
    },
  },
  data() {
    return {};
  },
  computed: {
    onlineMembers() {
      let members = [];
      this.groupMembers.forEach((member) => {
        if (member.accountStatus == "Online") {
          members.push(member);
        }
      });

      return members;
    },
    offlineMembers() {
      let members = [];
      this.groupMembers.forEach((member) => {
        if (member.accountStatus == "Offline") {
          members.push(member);
        }
      });

      return members;
    },
  }
};
</script>

<style scoped>
.online-members ul h1,
.offline-members ul h1 {
  font-size: 18px;
}

.group-info {
  width: 160px;
}

.group-info img {
  padding-left: 0px;
  width: 100px;
  height: 100px;
}

.group-info {
  position: absolute;
  right: 15px;
  top: 20px;
  margin: auto;
}

.chat-list li {
  padding: 10px 15px;
  list-style: none;
  border-radius: 3px;
}
.chat-list li:hover {
  background: #efefef;
  cursor: pointer;
}
.chat-list li.active {
  background: #efefef;
}
.chat-list li .name {
  font-size: 15px;
}
.chat-list img {
  margin-right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
img {
  float: left;
  border-radius: 50%;
}
.about {
  float: left;
  padding-left: 8px;
}
.status {
  color: #999;
  font-size: 13px;
}
.online,
.offline,
.me {
  margin-right: 2px;
  font-size: 8px;
  vertical-align: middle;
}
.online {
  color: #86c541;
}
.offline {
  color: #e47297;
}
.me {
  color: #1d8ecd;
}
.float-right {
  float: right;
}
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
</style>
