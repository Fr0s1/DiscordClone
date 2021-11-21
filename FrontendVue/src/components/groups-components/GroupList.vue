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
      <div
        class="badge bg-success float-right"
        v-if="
          group.groupName !== activeGroupName &&
          realtimeGroupMessages[group._id] &&
          realtimeGroupMessages[group._id].length > 0
        "
      ></div>
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
    realtimeGroupMessages: {
      type: Object,
    },
  },
  data() {
    return {
      activeGroupIndex: null,
      limit: 10,
    };
  },
  methods: {
    setActiveGroup(index) {
      if (!this.contactIsGroup) {
        this.$emit("change-contact-type");
      }

      this.activeGroupIndex = index;

      this.$emit("empty-realtime-group-messages", this.activeGroupId);

      this.$emit("fetch-group-messages", {
        limit: this.limit,
        nextCursor: new Date().toISOString(),
        groupId: this.groups[this.activeGroupIndex]._id,
        firstFetch: true,
        contactIsGroup: true,
        shouldScroll: true,
        activeGroupIndex: this.activeGroupIndex,
      });
    },
  },
  computed: {
    activeGroupName() {
      if (this.groups.length > 0 && this.activeGroupIndex) {
        return this.groups[this.activeGroupIndex].groupName;
      }
    },
    activeGroupId() {
      if (this.groups.length > 0) {
        return this.groups[this.activeGroupIndex]._id;
      }
    },
  },
  watch: {
    groups(newGroupList, oldGroupList) {
      if (newGroupList && newGroupList.length > 0) {
        this.groups.forEach((group) => {
          this.$emit("joinSocketIORoom", {
            roomId: group._id,
          });
        });
      }
    },
  },
};
</script>

<style scoped>
.badge {
  height: 15px;
  width: 15px;
  border-radius: 50%;
}

.badge:empty {
  display: block;

  color: #86c541;
}

.btn {
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
