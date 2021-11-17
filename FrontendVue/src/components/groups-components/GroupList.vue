<template>
  <ul class="list-unstyled chat-list mt-2 mb-0">
    <li
      class="clearfix"
      v-for="(group, index) in groups"
      :class="contactIsGroup && activeGroupIndex === index ? 'active' : ''"
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
    contactIsGroup: {
      type: Boolean,
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
      this.$emit("fetch-group-messages", {
        limit: this.limit,
        nextCursor: this.nextCursor,
        groupId: this.groups[this.activeGroupIndex]._id,
        firstFetch: true,
        contactIsGroup: true,
        shouldScroll: true,
      });

      this.$emit("joinSocketIORoom", {
        roomId: this.groups[this.activeGroupIndex]._id,
      });
    },
  },
  computed: {
    activeGroupName() {
      if (this.groups.length > 0 && this.activeGroupIndex) {
        return this.groups[this.activeGroupIndex].groupName;
      }
    },
  },
};
</script>

<style scoped>
.btn{
  width: 40px;
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
  width: 45px;
  height: 45px;
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

@media only screen and (min-width: 768px) and (max-width: 992px) {
  .chat-list {
    height: 650px;
    overflow-x: auto;
  }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
  .chat-list {
    height: 480px;
    overflow-x: auto;
  }
}
</style>
