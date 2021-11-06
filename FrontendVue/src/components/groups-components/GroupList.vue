<template>
  <ul class="list-unstyled chat-list mt-2 mb-0">
    <li
      class="clearfix"
      v-for="(group, index) in groups"
      :class="activeGroupIndex === index ? 'active' : ''"
      @click="setActiveGroup(index)"
      :key="index"
    >
      <img :src="group.groupAvatar" alt="avatar" />
      <div class="about">
        <div class="name">{{ group.groupName }}</div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    groups: {
      type: Array,
      required: true,
      default: [],
    },
  },
  data() {
    return {
      activeGroupIndex: null,
      nextCursor: new Date().toISOString(),
      limit: 10,
    };
  },
  methods: {
    setActiveGroup(index) {
      this.activeGroupIndex = index;
    },
  },
  computed: {
    activeGroupName() {
      if (this.groups.length > 0 && this.activeGroupIndex) {
        return this.groups[this.activeGroupIndex].groupName;
      }
    },
    activeGroupId() {
      if (this.groups.length > 0 && this.activeGroupIndex) {
        return this.groups[this.activeGroupIndex]._id;
      }
    },
  },
  watch: {
    activeGroupId(newGroupId, oldGroupName) {
      this.$emit("fetch-group-messages", {
        limit: this.limit,
        nextCursor: this.nextCursor,
        groupId: newGroupId,
        firstFetch: true,
        activeContactIndex: this.activeContactIndex,
      });
    },
  },
};
</script>
<style scoped>
.card {
  background: #fff;
  transition: 0.5s;
  border: 0;
  margin-bottom: 30px;
  border-radius: 0.55rem;
  position: relative;
  width: 100%;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 10%);
}
.chat-app .people-list {
  width: 280px;
  position: absolute;
  left: 0;
  top: 0;
  padding: 20px;
  z-index: 7;
}

.chat-app .chat {
  margin-left: 280px;
  border-left: 1px solid #eaeaea;
}

.people-list {
  -moz-transition: 0.5s;
  -o-transition: 0.5s;
  -webkit-transition: 0.5s;
  transition: 0.5s;
}

.people-list .chat-list li {
  padding: 10px 15px;
  list-style: none;
  border-radius: 3px;
}

.people-list .chat-list li:hover {
  background: #efefef;
  cursor: pointer;
}

.people-list .chat-list li.active {
  background: #efefef;
}

.people-list .chat-list li .name {
  font-size: 15px;
}

.people-list .chat-list img {
  width: 45px;
  border-radius: 50%;
}

.people-list img {
  float: left;
  border-radius: 50%;
}

.people-list .about {
  float: left;
  padding-left: 8px;
}

.people-list .status {
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

@media only screen and (max-width: 767px) {
  .chat-app .people-list {
    height: 465px;
    width: 100%;
    overflow-x: auto;
    background: #fff;
    left: -400px;
    display: none;
  }
  .chat-app .people-list.open {
    left: 0;
  }
  .chat-app .chat {
    margin: 0;
  }
  .chat-app .chat .chat-header {
    border-radius: 0.55rem 0.55rem 0 0;
  }
  .chat-app .chat-history {
    height: 300px;
    overflow-x: auto;
  }
}

@media only screen and (min-width: 768px) and (max-width: 992px) {
  .chat-app .chat-list {
    height: 650px;
    overflow-x: auto;
  }
  .chat-app .chat-history {
    height: 600px;
    overflow-x: auto;
  }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
  .chat-app .chat-list {
    height: 480px;
    overflow-x: auto;
  }
  .chat-app .chat-history {
    height: calc(100vh - 350px);
    overflow-x: auto;
  }
}
</style>
