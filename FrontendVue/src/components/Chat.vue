<template>
  <div class="container">
    <p v-for="(message, index) in array" :key="index" v-show="false">{{message.content}}</p>
    <div class="row clearfix">
      <div class="col-lg-12">
        <div class="card chat-app">
          <div id="plist" class="people-list">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i class="fa fa-search"></i
                ></span>
              </div>
              <input type="text" class="form-control" placeholder="Search..." />
            </div>
            <ul class="list-unstyled chat-list mt-2 mb-0">
              <li
                class="clearfix"
                v-for="(contact, index) in user.contactlist"
                :class="activeContactIndex === index ? 'active' : ''"
                @click="setActiveContact(index)"
                :key="index"
              >
                <img :src="contact.avatar" alt="avatar" />
                <div class="about">
                  <div class="name">{{ contact.name }}</div>
                  <div class="status">
                    <i class="fa fa-circle offline"></i> left 7 mins ago
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="chat">
            <div class="chat-header clearfix">
              <div class="row">
                <div class="col-lg-6">
                  <a
                    href="javascript:void(0);"
                    data-toggle="modal"
                    data-target="#view_info"
                  >
                    <img
                      :src="activeContactAvatar"
                      alt="avatar"
                    />
                  </a>
                  <div class="chat-about">
                    <h6 class="m-b-0">{{activeContactUsername}}</h6>
                    <small>Last seen: 2 hours ago</small>
                  </div>
                </div>
                <div class="col-lg-6 hidden-sm text-right">
                  <a
                    href="javascript:void(0);"
                    class="btn btn-outline-secondary"
                    ><i class="fa fa-camera"></i
                  ></a>
                  <a href="javascript:void(0);" class="btn btn-outline-primary"
                    ><i class="fa fa-image"></i
                  ></a>
                  <a href="javascript:void(0);" class="btn btn-outline-info"
                    ><i class="fa fa-cogs"></i
                  ></a>
                  <a href="javascript:void(0);" class="btn btn-outline-warning"
                    ><i class="fa fa-question"></i
                  ></a>
                </div>
              </div>
            </div>
            <div class="chat-history">
              <ul class="m-b-0">
                <li
                  class="clearfix"
                  v-for="(message, index) in conversationMessages"
                  :key="index"
                >
                  <div v-if="currentUsername === message.sender.username">
                    <div class="message-data text-right">
                      <span class="message-data-time">10:10 AM, Today</span>
                      <img :src="user.avatar" alt="avatar" />
                    </div>
                    <div class="message other-message float-right">
                      {{ message.content }}
                      <div
                        class="message-files"
                        v-if="message.files && message.files.length > 0"
                      >
                        <img
                          v-for="(file, index) in message.files"
                          :key="index"
                          :src="file.fileUrl"
                          width="100"
                          style="display: inline-block, marginRight: 5px"
                        />
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="message-data">
                      <span class="message-data-time">10:12 AM, Today</span>
                    </div>
                    <div class="message my-message">
                      {{ message.content }}
                      <div
                        class="message-files"
                        v-if="message.files && message.files.length > 0"
                      >
                        <img
                          v-for="(file, index) in message.files"
                          :key="index"
                          :src="file.fileUrl"
                          width="100"
                          style="display: inline-block, marginRight: 5px"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="chat-message clearfix">
              <div class="input-group mb-0">
                <div class="message-input">
                  <form
                    enctype="multipart/form-data"
                    @submit.prevent="sendMessage()"
                  >
                    <div class="input-group-prepend">
                      <button class="input-group-text btn">
                        <i class="fa fa-send"></i>
                      </button>
                    </div>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Enter text here..."
                      name="content"
                      id="content"
                      v-model="messageContent"
                    />
                    <input
                      type="file"
                      class="form-control-file"
                      id="files"
                      name="files"
                      multiple
                      @change="filesChange($event.target.files)"
                    />
                  </form>
                </div>

                <div class="message-files-preview">
                  <img
                    v-for="(src, index) in messagesFilePreviewUrls"
                    :key="index"
                    :src="src"
                    style="width: 200px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  inject: ["currentUsername", "config"],
  data() {
    return {
      user: {}, // User information fetched from GraphQL Server
      activeContactIndex: 0, // Default index of current contact in contactlist
      userMessages: {
        messages: [],
      },
      messageContent: "", // Message input field
      messagesFilePreviewUrls: [], // An array contain img's src when user upload image for previewing
      messageFiles: [], // // An array contain user uploaded message to send in form
      array: [],
    };
  },
  sockets: {
    connect: function () {
      console.log("socket to notification channel connected");
    },
  },
  apollo: {
    user() {
      return {
        query: gql`
          query Query($username: String) {
            user(username: $username) {
              avatar
              contactlist {
                username
                name
                avatar
              }
            }
          }
        `,
        variables: {
          username: this.currentUsername,
        },
      };
    },
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
              }
              count
              nextCursor
            }
          }
        `,
        variables() {
          return {
            firstUser: this.currentUsername,
            secondUser: this.activeContactUsername,
            limit: 3,
            nextCursor: new Date().toISOString(),
          };
        },
        skip() {
          return !this.user.contactlist;
        },
      };
    },
  },
  methods: {
    setActiveContact(index) {
      this.activeContactIndex = index;
      console.log(this.activeContactUsername);
      console.log(this.userMessages.messages);
    },
    sendMessage() {
      let message = {
        sender: {
          username: this.currentUsername,
        },
        receiver: {
          username: this.activeContactUsername,
        },
        content: this.messageContent,
        files: [],
      };

      if (this.messagesFilePreviewUrls.length > 0) {
        this.messagesFilePreviewUrls.forEach((fileUrl) => {
          message.files.push({
            fileUrl,
          });
        });
      }

      this.conversationMessages.push(message);

      let sentMessage = new FormData();

      sentMessage.append("sender", this.currentUsername);
      sentMessage.append("receiver", this.activeContactUsername);
      sentMessage.append("content", this.messageContent);

      if (this.messageFiles.length > 0) {
        for (let fileIndex in this.messageFiles) {
          sentMessage.append(`f${fileIndex}`, this.messageFiles[fileIndex]);
        }

        this.axios
          .post(`${this.config.socketIO_HTTP}/message`, sentMessage)
          .then((res) => {
            this.$socket.emit("chatMessage", res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        this.axios
          .post(`${this.config.socketIO_HTTP}/message`, sentMessage)
          .then((res) => {
            console.log(res);
          });

        this.$socket.emit("chatMessage", message);
      }
      this.messageContent = "";

      this.messageFiles = [];
      this.messagesFilePreviewUrls = [];
    },
    filesChange(files) {
      this.messageFiles = files;
      this.messagesFilePreviewUrls = [];
      for (let fileIndex in files) {
        let file = files[fileIndex];

        this.messagesFilePreviewUrls.push(URL.createObjectURL(file));
      }
    },
  },
  computed: {
    activeContactUsername() {
      return this.user.contactlist[this.activeContactIndex].username;
    },
    activeContactAvatar() {
      return this.user.contactlist[this.activeContactIndex].avatar;
    },
    conversationMessages() {
      return this.userMessages.messages.slice().reverse();
    },
  },
  created() {
    this.$socket.emit("currentUser", {
      user: this.currentUsername,
      id: this.$socket.id,
    });

    this.sockets.subscribe("chatMessage", function (data) {
      console.log(data);
      this.array.push(data)
      this.conversationMessages.push(data);
    });
  },
};
</script>
<style scoped>
body {
  background-color: #f4f7f6;
  margin-top: 20px;
}
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

.chat .chat-header {
  padding: 15px 20px;
  border-bottom: 2px solid #f4f7f6;
}

.chat .chat-header img {
  float: left;
  border-radius: 40px;
  width: 40px;
}

.chat .chat-header .chat-about {
  float: left;
  padding-left: 10px;
}

.chat .chat-history {
  padding: 20px;
  border-bottom: 2px solid #fff;
}

.chat .chat-history ul {
  padding: 0;
}

.chat .chat-history ul li {
  list-style: none;
  margin-bottom: 30px;
}

.chat .chat-history ul li:last-child {
  margin-bottom: 0px;
}

.chat .chat-history .message-data {
  margin-bottom: 15px;
}

.chat .chat-history .message-data img {
  border-radius: 40px;
  width: 40px;
}

.chat .chat-history .message-data-time {
  color: #434651;
  padding-left: 6px;
}

.chat .chat-history .message {
  color: #444;
  padding: 18px 20px;
  line-height: 26px;
  font-size: 16px;
  border-radius: 7px;
  display: inline-block;
  position: relative;
}

.chat .chat-history .message:after {
  bottom: 100%;
  left: 7%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-bottom-color: #fff;
  border-width: 10px;
  margin-left: -10px;
}

.chat .chat-history .my-message {
  background: #efefef;
}

.chat .chat-history .my-message:after {
  bottom: 100%;
  left: 30px;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-bottom-color: #efefef;
  border-width: 10px;
  margin-left: -10px;
}

.chat .chat-history .other-message {
  background: #e8f1f3;
  text-align: right;
}

.chat .chat-history .other-message:after {
  border-bottom-color: #e8f1f3;
  left: 93%;
}

.chat .chat-message {
  padding: 20px;
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
