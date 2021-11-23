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
      <div
        class="badge bg-success float-right"
        v-if="
          contact.username !== currentUsername &&
          realtimeFetchedMessages[contact.username] &&
          realtimeFetchedMessages[contact.username].length > 0
        "
      ></div>
      <div class="about">
        <div class="name">{{ contact.name }}</div>
        <div class="status">
          <i
            :class="`fa fa-circle ${
              contact.accountStatus === 'Online' ? 'online' : 'offline'
            }`"
          ></i>
          {{ contact.accountStatus }}
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import gql from "graphql-tag";

export default {
  inject: ["currentUsername"],
  props: {
    contactlist: {
      type: Array,
      required: true,
      default: [],
    },
    contactIsGroup: {
      type: Boolean,
    },
    realtimeFetchedMessages: {
      type: Object,
    },
  },
  data() {
    return {
      activeContactIndex: 0,
      limit: 10,
      userMessages: {
        messages: [],
      },
      contactlistMessages: {},
    };
  },
  apollo: {
    userMessages() {
      return {
        query: gql`
          query Query(
            $firstUser: String!
            $secondUser: String!
            $nextCursor: Date
            $limit: Int
          ) {
            userMessages(
              firstUser: $firstUser
              secondUser: $secondUser
              nextCursor: $nextCursor
              limit: $limit
            ) {
              messages {
                _id
                sender {
                  username
                }
                receiver {
                  username
                }
                sentTime
                content
                files {
                  fileName
                  fileType
                  fileUrl
                }
                seenStatus
              }
              count
              nextCursor
            }
          }
        `,
        variables: {
          firstUser: this.currentUsername,
          secondUser: null,
          limit: null,
          nextCursor: null,
        },
        skip: true,
      };
    },
  },
  methods: {
    setActiveContact(index) {
      this.$emit("empty-current-realtime-messages");

      if (this.contactIsGroup) {
        this.$emit("change-contact-type");
      }

      this.activeContactIndex = index;
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
        nextCursor: new Date().toISOString(),
        username: newVal,
        firstFetch: true,
        activeContactIndex: this.activeContactIndex,
        contactIsGroup: false,
        scrollHeight: 0,
        shouldScroll: true,
      });
    },
    contactlist(newVal, oldVal) {
      if (newVal && newVal.length > 0) {
        newVal.forEach((contact) => {
          if (contact.username != this.currentUsername) {
            this.$apollo.queries.userMessages.skip = true;
            this.$apollo.queries.userMessages.setVariables({
              firstUser: this.currentUsername,
              secondUser: contact.username,
              limit: 1,
              nextCursor: new Date().toISOString(),
            });
            this.$apollo.queries.userMessages.skip = false;

            this.$apollo.queries.userMessages.fetchMore({
              variables: {
                firstUser: this.currentUsername,
                secondUser: contact.username,
                limit: 1,
                nextCursor: new Date().toISOString(),
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                this.contactlistMessages[contact.username] =
                  fetchMoreResult.userMessages.messages;
              },
            });
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.badge:empty {
  display: inline-block;
  height: 10px;
  color: #86c541;
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
