<template>
  <ul class="list-unstyled chat-list mt-2 mb-0">
    <li
      class="clearfix"
      v-for="(contact, index) in contactlist"
      :class="!contactIsGroup && activeContactIndex === index ? 'active' : ''"
      @click="setActiveContact(index)"
      :key="index"
    >
      <img :src="contact.avatar" alt="avatar" />
      <div class="about">
        <div class="name">{{ contact.name }}</div>
        <div class="status"><i class="fa fa-circle online"></i> Online</div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    contactlist: {
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
      activeContactIndex: 0,
      nextCursor: new Date().toISOString(),
      limit: 10,
    };
  },
  methods: {
    setActiveContact(index) {
      console.log("Clicked");
      this.activeContactIndex = index;
      console.log(this.activeContactUsername);
    },
  },
  computed: {
    activeContactUsername() {
      if (this.contactlist.length > 0) {
        let newActiveUsername =
          this.contactlist[this.activeContactIndex].username;

        return newActiveUsername;
      }
    },
  },
  watch: {
    activeContactUsername(newVal, oldVal) {
      this.$emit("fetch-messages", {
        limit: this.limit,
        nextCursor: this.nextCursor,
        username: newVal,
        firstFetch: true,
        activeContactIndex: this.activeContactIndex,
        contactIsGroup: false,
        scrollHeight: 0,
        shouldScroll: true,
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
  height: 45px;
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
