<template>
  <div class="chat-history">
    <ul class="m-b-0" ref="chatHistory" @scroll="fetchMessages">
      <!-- This section is to display messages fetch from graphql -->
      <li class="clearfix" v-for="(message, index) in messages" :key="index">
        <div
          v-if="currentUsername === message.sender.username"
          class="graphql-messages"
        >
          <div class="message-data text-right">
            <div class="message-control-sender">
              <b-dropdown
                id="dropdown-1"
                class="m-md-2"
                toggle-class="text-decoration-none"
                no-caret
              >
                <template class="btn btn-outline-primary" #button-content>
                  <i class="fas fa-ellipsis-h"></i>
                </template>
                <b-dropdown-item @click="deleteMessage(message._id, 'graphql')">
                  Delete message
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <span class="message-data-time">{{
              formatTime(message.sentTime)
            }}</span>
            <img :src="userAvatarUrl" alt="avatar" />
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
                style="display: inline-block"
                @click="zoomImage($event.target)"
              />
              <div id="myModal" class="modal" ref="modal">
                <!-- The Close Button -->
                <span
                  class="close"
                  ref="closeImageButton"
                  @click="closeZoomImage"
                  >&times;</span
                >

                <!-- Modal Content (The Image) -->
                <img class="modal-content" id="img01" ref="zoomImage" />
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="message-data">
            <span class="message-data-time">{{
              formatTime(message.sentTime)
            }}</span>
            <div class="message-control-sender">
              <b-dropdown
                id="dropdown-1"
                class="m-md-2"
                toggle-class="text-decoration-none"
                no-caret
              >
                <template class="btn btn-outline-primary" #button-content>
                  <i class="fas fa-ellipsis-h"></i>
                </template>
                <b-dropdown-item @click="deleteMessage(message._id, 'graphql')">
                  Delete message
                </b-dropdown-item>
              </b-dropdown>
            </div>
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
                style="display: inline-block"
                @click="zoomImage($event.target)"
              />
              <div id="myModal" class="modal" ref="modal">
                <!-- The Close Button -->
                <span
                  class="close"
                  ref="closeImageButton"
                  @click="closeZoomImage"
                  >&times;</span
                >

                <!-- Modal Content (The Image) -->
                <img class="modal-content" id="img01" ref="zoomImage" />
              </div>
            </div>
          </div>
        </div>
      </li>

      <!-- This section is to display messages fetch from socketio -->
      <li
        class="clearfix"
        v-for="(message, index) in all_socketio_messages"
        :key="index"
      >
        <div v-if="currentUsername === message.sender.username">
          <div class="message-data text-right">
            <div class="message-control-sender">
              <b-dropdown
                id="dropdown-1"
                class="m-md-2"
                toggle-class="text-decoration-none"
                no-caret
              >
                <template class="btn btn-outline-primary" #button-content>
                  <i class="fas fa-ellipsis-h"></i>
                </template>
                <b-dropdown-item
                  @click="deleteMessage(message._id, 'socketio')"
                >
                  Delete message
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <span class="message-data-time">{{
              formatTime(message.sentTime)
            }}</span>

            <img :src="userAvatarUrl" alt="avatar" />
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
                style="display: inline-block"
                @click="zoomImage($event.target)"
              />
              <div id="myModal" class="modal" ref="modal">
                <!-- The Close Button -->
                <span
                  class="close"
                  ref="closeImageButton"
                  @click="closeZoomImage"
                  >&times;</span
                >

                <!-- Modal Content (The Image) -->
                <img class="modal-content" id="img01" ref="zoomImage" />
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="message-data">
            <span class="message-data-time">{{
              formatTime(message.sentTime)
            }}</span>
            <div class="message-control-sender">
              <b-dropdown
                id="dropdown-1"
                class="m-md-2"
                toggle-class="text-decoration-none"
                no-caret
              >
                <template class="btn btn-outline-primary" #button-content>
                  <i class="fas fa-ellipsis-h"></i>
                </template>
                <b-dropdown-item
                  @click="deleteMessage(message._id, 'socketio')"
                >
                  Delete message
                </b-dropdown-item>
              </b-dropdown>
            </div>
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
                style="display: inline-block"
                @click="zoomImage($event.target)"
              />
              <div id="myModal" class="modal" ref="modal">
                <!-- The Close Button -->
                <span
                  class="close"
                  ref="closeImageButton"
                  @click="closeZoomImage"
                  >&times;</span
                >

                <!-- Modal Content (The Image) -->
                <img class="modal-content" id="img01" ref="zoomImage" />
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import moment from "moment";
import gql from "graphql-tag";

export default {
  props: {
    userMessages: {
      type: Object,
      default: {
        messages: [],
      },
    },
    currentUsername: {
      type: String,
    },
    activeContactUsername: {
      type: String,
    },
    userAvatarUrl: {
      type: String,
    },
    hasFinishedLoadingMessages: {
      type: Boolean,
    },
    allRealtimeMessages: {
      type: Array,
    },
    scrollHeight: {
      type: Number,
    },
    shouldScroll: {
      type: Boolean,
    },
  },
  data() {
    return {
      nextCursor: new Date().toISOString(),
      limit: 10,
      graphql_messages: [],
      all_socketio_messages: [],
    };
  },
  methods: {
    scrollDown(scrollHeight) {
      let chatHistory = this.$refs.chatHistory;
      chatHistory.scrollTop = scrollHeight;
    },
    fetchMessages() {
      let chatHistory = this.$refs.chatHistory;
      if (chatHistory.scrollTop == 0 && this.userMessages.nextCursor !== "") {
        this.$emit("fetch-messages", {
          limit: this.limit,
          nextCursor: this.userMessages.nextCursor,
          username: this.activeContactUsername,
          firstFetch: false,
          scrollHeight: chatHistory.scrollHeight,
          shouldScroll: true,
        });
      }
    },
    formatTime(value) {
      return moment(String(value)).format("DD/MM/YYYY HH:mm");
    },
    zoomImage(img) {
      let modal = this.$refs.modal;
      modal.style.display = "block";
      let zoomImg = this.$refs.zoomImage;
      zoomImg.src = img.src;
    },
    closeZoomImage() {
      let modal = this.$refs.modal;
      modal.style.display = "none";
    },

    deleteMessage(messageId, type) {
      if (type === "graphql") {
        // Delete message from messages list pre-fetched from GraphQL
        this.graphql_messages = this.graphql_messages.map((message) =>
          message._id !== messageId
            ? message
            : { ...message, content: "Message deleted", files: [] }
        );
      } else if (type === "socketio") {
        // Delete message from realtime messages array
        this.all_socketio_messages = this.all_socketio_messages.map((message) =>
          message._id !== messageId
            ? message
            : { ...message, content: "Message deleted", files: [] }
        );
      }

      // Delete message saved in database
      this.$apollo.mutate({
        mutation: gql`
          mutation DeleteMessage($messageId: String!) {
            deleteMessage(messageId: $messageId) {
              _id
            }
          }
        `,
        variables: {
          messageId,
        },
      });
    },
  },
  computed: {
    messages() {
      return this.graphql_messages.slice().reverse();
    },
  },
  updated() {
    if (this.hasFinishedLoadingMessages) {
      let chatHistory = this.$refs.chatHistory;

      if (this.shouldScroll) {
        this.scrollDown(chatHistory.scrollHeight - this.scrollHeight);
      }
    }
  },
  watch: {
    userMessages(newList, oldList) {
      this.graphql_messages = newList.messages;
    },
    allRealtimeMessages(newList, oldList) {
      this.all_socketio_messages = newList;
    },
  },
};
</script>
<style scoped>
.message-control-sender {
  display: inline-block;
}

.graphql-messages {
  position: relative;
}

.chat-history ul li {
  margin-bottom: 0px;
}

.btn {
  width: 40px;
}

.chat-history {
  padding: 20px;
  border-bottom: 2px solid #fff;
  height: 73.4vh;
}

.chat-history ul::-webkit-scrollbar {
  width: 10px;
}

.chat-history ul::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  --webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #007bff;
}

.chat-history ul::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
  --webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

.chat-history ul {
  width: auto;
  height: 70vh;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
}

.chat-history ul li.clearfix {
  list-style: none;
  margin-bottom: 30px;
}

.chat-history ul li:last-child {
  margin-bottom: 0px;
}

.chat-history .message-data {
  margin-bottom: 15px;
}

.chat-history .message-data img {
  margin-left: 5px;
  border-radius: 40px;
  width: 40px;
  height: 40px;
}

.chat-history .message-data-time {
  color: #434651;
  padding-left: 6px;
}

.chat-history .message {
  color: #212529;
  padding: 18px 20px;
  line-height: 26px;
  font-size: 16px;
  border-radius: 7px;
  display: inline-block;
  position: relative;
}

.chat-history .message:after {
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

.chat-history .my-message {
  background: #f8f9fa;
}

.chat-history .my-message:after {
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

.chat-history .other-message {
  background: #f8f9fa;
  text-align: right;
}

.chat-history .other-message:after {
  border-bottom-color: #e8f1f3;
  left: 93%;
}

.chat-message {
  padding: 20px;
}
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
  .chat-history {
    height: 300px;
    overflow-x: auto;
  }
}

@media only screen and (min-width: 768px) and (max-width: 992px) {
  .chat-history {
    height: 600px;
    overflow-x: auto;
  }
}

@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
  .chat-history {
    height: calc(100vh - 350px);
    overflow-x: auto;
  }
}

#myImg {
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

#myImg:hover {
  opacity: 0.7;
}

/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.9); /* Black w/ opacity */
}

/* Modal Content (Image) */
.modal-content {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
}

/* Caption of Modal Image (Image Text) - Same Width as the Image */
#caption {
  margin: auto;
  display: block;
  width: 80%;
  max-width: 700px;
  text-align: center;
  color: #ccc;
  padding: 10px 0;
  height: 150px;
}

/* Add Animation - Zoom in the Modal */
.modal-content,
#caption {
  animation-name: zoom;
  animation-duration: 0.6s;
}

.btn {
  padding: 10px;
  border: 0;
  margin: 2px;
  width: 40px;
}

@keyframes zoom {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

/* The Close Button */
.close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  transition: 0.3s;
}

.close:hover,
.close:focus {
  color: #bbb;
  text-decoration: none;
  cursor: pointer;
}

/* 100% Image Width on Smaller Screens */
@media only screen and (max-width: 700px) {
  .modal-content {
    width: 100%;
  }
}
</style>
