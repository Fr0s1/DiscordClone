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
        // this.$emit("fetch-messages", {
        //   limit: this.limit,
        //   nextCursor: this.nextCursor,
        //   username: newActiveUsername,
        //   firstFetch: true,
        //   activeContactIndex: this.activeContactIndex,
        //   contactIsGroup: false,
        //   scrollHeight: 0,
        //   shouldScroll: true,
        // });
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
