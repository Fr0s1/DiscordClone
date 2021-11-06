<template>
  <div class="chat-message clearfix">
    <div class="input-group mb-0">
      <div class="message-input">
        <form enctype="multipart/form-data" @submit.prevent="sendMessage()">
          <div class="input-group-prepend">
            <button class="btn-outline-primary btn">
              <i
                class="fas fa-paper-plane"
                data-toggle="tooltip"
                data-placement="auto"
                title="Gửi"
                style="color: #oo7bff"
              ></i>
            </button>
            <input
              type="text"
              class="form-control"
              style="border-color: #007bff"
              placeholder="Enter text here..."
              name="content"
              id="content"
              v-model="messageContent"
            />
          </div>
          <input
            type="file"
            class="form-control-file"
            style="margin-top: 5px"
            id="files"
            name="files"
            multiple
            @change="filesChange($event.target.files)"
            ref="messageFiles"
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
</template>

<script>
export default {
  inject: ["currentUsername", "config"],
  props: {
    activeContactUsername: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      messageContent: "", // Message input field

      messagesFilePreviewUrls: [], // An array contain img's src when user upload image for previewing

      messageFiles: [], // // An array contain user uploaded message to send in form
    };
  },
  methods: {
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
        sentTime: new Date().toISOString(),
      };

      if (this.messagesFilePreviewUrls.length > 0) {
        this.messagesFilePreviewUrls.forEach((fileUrl) => {
          message.files.push({
            fileUrl,
          });
        });
      }

      this.$emit("realtime-message", message);

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
            this.$emit("chatMessage", res.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        this.axios
          .post(`${this.config.socketIO_HTTP}/message`, sentMessage)
          .then((res) => {
            console.log(res);
          })
          .catch((e) => {
            console.log(e);
          });

        this.$emit("chatMessage", message);
      }
      this.messageContent = "";

      this.messageFiles = [];
      this.messagesFilePreviewUrls = [];
      this.$refs.messageFiles.value = null;
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
};
</script>
<style scoped>
.message-input {
  width: 100%;
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
