<template>
  <div class="position-relative">
    <div
      class="chat-messages p-4"
      @scroll="fetchGroupMessages"
      ref="groupChatHistory"
    >
      <div
        :class="
          message.sender.username == currentUsername
            ? 'chat-message-right pb-4'
            : 'chat-message-left pb-4'
        "
        v-for="(message, index) in messages"
        :key="index"
      >
        <div>
          <img
            :src="message.sender.avatar"
            class="rounded-circle mr-1"
            :alt="message.sender.username"
            width="40"
            height="40"
          />
        </div>
        <div
          class="message-control-sender"
          v-if="currentUsername === message.sender.username"
        >
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
              @click="deleteGroupMessage(message._id, 'graphql')"
            >
              Delete message
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
          <div class="font-weight-bold mb-1">
            {{
              message.sender.username == currentUsername
                ? "You"
                : message.sender.username
            }}
            <div
              class="text-muted small text-nowrap mt-2"
              style="display: inline"
            >
              {{ formatTime(message.sentTime) }}
            </div>
          </div>

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
              <span class="close" ref="closeImageButton" @click="closeZoomImage"
                >&times;</span
              >

              <!-- Modal Content (The Image) -->
              <img class="modal-content" id="img01" ref="zoomImage" />
            </div>
          </div>
        </div>
      </div>

      <div
        :class="
          message.sender.username == currentUsername
            ? 'chat-message-right pb-4'
            : 'chat-message-left pb-4'
        "
        v-for="(message, index) in realtimeGroupMessages[activeGroupId]"
        :key="index"
      >
        <div>
          <img
            :src="message.sender.avatar"
            class="rounded-circle mr-1"
            :alt="message.sender.username"
            width="40"
            height="40"
          />
        </div>

        <div
          class="message-control-sender"
          v-if="currentUsername === message.sender.username"
        >
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
              @click="deleteGroupMessage(message._id, 'socketio')"
            >
              Delete message
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
          <div class="font-weight-bold mb-1">
            {{
              message.sender.username == currentUsername
                ? "You"
                : message.sender.username
            }}
            <div
              class="text-muted small text-nowrap mt-2"
              style="display: inline"
            >
              {{ formatTime(message.sentTime) }}
            </div>
          </div>

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
              <span class="close" ref="closeImageButton" @click="closeZoomImage"
                >&times;</span
              >

              <!-- Modal Content (The Image) -->
              <img class="modal-content" id="img01" ref="zoomImage" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

import gql from "graphql-tag";

import DeleteMessage from "../message-components/DeleteMessage.vue";

export default {
  inject: ["currentUsername"],
  components: {
    DeleteMessage,
  },
  props: {
    groupMessages: {
      type: Object,
      default: {
        messages: [],
      },
    },
    hasFinishedLoadingGroupMessages: {
      type: Boolean,
    },
    activeGroupId: {
      type: String,
    },
    realtimeGroupMessages: {
      type: Object,
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
      graphql_group_messages: [],
    };
  },
  methods: {
    scrollDown(scrollHeight) {
      let groupChatHistory = this.$refs.groupChatHistory;
      groupChatHistory.scrollTop = scrollHeight;
    },
    fetchGroupMessages() {
      let groupChatHistory = this.$refs.groupChatHistory;
      if (
        groupChatHistory.scrollTop == 0 &&
        this.groupMessages.nextCursor !== ""
      ) {
        this.$emit("fetch-group-messages", {
          limit: this.limit,
          nextCursor: this.groupMessages.nextCursor,
          groupId: this.activeGroupId,
          firstFetch: false,
          scrollHeight: groupChatHistory.scrollHeight,
          shouldScroll: true,
        });
      }
    },
    deleteGroupMessage(messageId, messageType) {
      if (messageType === "graphql") {
        // Delete message from messages list pre-fetched from GraphQL
        this.graphql_group_messages = this.graphql_group_messages.filter(
          (message) => message._id !== messageId
        );
      } else if (messageType === "socketio") {
        // Delete message from realtime messages array
        this.$emit("delete-realtime-group-messages", messageId);
      }

      // Delete message saved in database
      this.$apollo.mutate({
        mutation: gql`
          mutation Mutation($messageId: String!) {
            deleteGroupMessage(messageId: $messageId) {
              _id
            }
          }
        `,
        variables: {
          messageId,
        },
      });
    },
    formatTime(timeString) {
      return moment(String(timeString)).format("DD/MM/YYYY HH:mm");
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
  },
  computed: {
    messages() {
      return this.graphql_group_messages.slice().reverse();
    },
  },
  updated() {
    if (this.hasFinishedLoadingGroupMessages) {
      if (this.shouldScroll) {
        let groupChatHistory = this.$refs.groupChatHistory;
        this.scrollDown(groupChatHistory.scrollHeight - this.scrollHeight);
      }
    }
  },
  watch: {
    groupMessages(newGroupMessagesList, oldGroupMessagesList) {
      this.graphql_group_messages = newGroupMessagesList.messages;
    },
  },
};
</script>
<style scoped>
body {
  margin-top: 20px;
}

.chat-online {
  color: #34ce57;
}

.chat-offline {
  color: #e4606d;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  height: 71vh;
  overflow-y: scroll;
  margin-bottom: 1rem;
}
.chat-messages::-webkit-scrollbar {
  width: 10px;
}
.chat-messages::-webkit-scrollbar-thumb {
  --webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #007bff;
}
.chat-messages::-webkit-scrollbar-track {
  --webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

.chat-message-left,
.chat-message-right {
  display: flex;
  flex-shrink: 0;
}

.chat-message-left {
  margin-right: auto;
}

.chat-message-right {
  flex-direction: row-reverse;
  margin-left: auto;
}
.py-3 {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}
.px-4 {
  padding-right: 1.5rem !important;
  padding-left: 1.5rem !important;
}
.flex-grow-0 {
  flex-grow: 0 !important;
}
.border-top {
  border-top: 1px solid #dee2e6 !important;
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
