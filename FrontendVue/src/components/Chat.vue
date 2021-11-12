<template>
  <div class="container">
    <div class="row clearfix">
      <div class="col-lg-12">
        <div class="card chat-app">
          <div id="plist" class="people-list">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"
<<<<<<< HEAD
                  ><i class="fas fa-search" style="color:#007bff"></i
=======
                  ><i class="fas fa-search" style="color: #007bff"></i
>>>>>>> dfcef8fe98256cdfe4a276e4007ebe23aa703a84
                ></span>
              </div>
              <input type="text" class="form-control" placeholder="Search..." />
            </div>
            <contact-list
              :contactlist="user.contactlist"
              :contactIsGroup="contactIsGroup"
              @fetch-messages="fetchMessages"
            ></contact-list>

            <group-list
              :groups="user.groups"
              :contactIsGroup="contactIsGroup"
              @fetch-group-messages="fetchGroupMessages"
              @joinSocketIORoom="joinSocketIORoom"
            ></group-list>
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
                      :src="user.contactlist[activeContactIndex]?.avatar"
                      alt="avatar"
                    />
                  </a>
                  <div class="chat-about">
                    <h6 class="m-b-0">{{ activeContactUsername }}</h6>
                    <small>Last seen: 2 hours ago</small>
                  </div>
                </div>
                <div class="col-lg-6 hidden-sm text-right">
<<<<<<< HEAD
<<<<<<< HEAD
                  <button
                    class="btn btn-outline-primary"
                    @click="videoChat()"
                  >
                    <i class="fa fa-phone" data-toggle="tooltip" data-placement="auto" title="Call"></i>
=======
                  <button
                    class="btn btn-outline-primary"
                    @click="
                      contactIsGroup ? startGroupVideoCall() : startVideoCall()
                    "
                  >
                    <i
                      class="fa fa-phone"
                      data-toggle="tooltip"
                      data-placement="auto"
                      title="Call"
                    ></i>
>>>>>>> 5c59c6dcf62731b4e826e160e75ad1fe076d3277
                  </button>
                  <button class="btn btn-outline-primary">
                    <i class="fas fa-camera" data-toggle="tooltip" data-placement="auto" title="Video call"></i>
                  </button>
                  <button class="btn btn-outline-primary">
                    <i class="fas fa-image" data-toggle="tooltip" data-placement="auto" title="Ảnh"></i>
                  </button>
                  <button class="btn btn-outline-primary">
                    <i class="fas fa-cogs" data-toggle="tooltip" data-placement="auto" title="Cài đặt"></i>
                  </button>
                  <button class="btn btn-outline-primary">
                    <i class="fas fa-question" data-toggle="tooltip" data-placement="auto" title="Trợ giúp"></i>
                  </button>
                  <button class="btn btn-outline-primary">
                    <i class="fas fa-camera" data-toggle="tooltip" data-placement="auto" title="Đăng xuất"></i>
=======
                  <button class="btn btn-outline-primary" data-toggle="tooltip" data-placement="auto" title="Call">
                    <i
                      class="fa fa-phone"
                    ></i>
                  </button>
                  <button class="btn btn-outline-primary" data-toggle="tooltip" data-placement="auto" title="Video call" @click="videoChat()">
                    <i
                      class="fas fa-camera"
                    ></i>
                  </button>
                  <button class="btn btn-outline-primary" data-toggle="tooltip" data-placement="auto" title="Profile" @click="info()">
                    <i
                      class="fas fa-user-alt"
                    ></i>
                  </button>
                  <button class="btn btn-outline-primary" data-toggle="tooltip" data-placement="auto" title="About Us" @click="about()">
                    <i
                      class="fas fa-info"
                    ></i>
>>>>>>> dfcef8fe98256cdfe4a276e4007ebe23aa703a84
                  </button>
                </div>
              </div>
            </div>
<<<<<<< HEAD
            <div class="chat-history">
              <ul class="m-b-0" ref="chatHistory" @scroll="fetchedMessage">
                <!-- <div class="loader"></div> -->

                <!-- This section is to display messages fetch from graphql or websocket -->
                <li
                  class="clearfix"
                  v-for="(message, index) in messages"
                  :key="index"
                >
                  <div v-if="currentUsername === message.sender.username">
                    <div class="message-data text-right">
                      <span class="message-data-time">{{
                        formatTime(message.sentTime)
                      }}</span>
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
                          <img
                            class="modal-content"
                            id="img01"
                            ref="zoomImage"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="message-data">
                      <span class="message-data-time">{{
                        formatTime(message.sentTime)
                      }}</span>
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
                          <img
                            class="modal-content"
                            id="img01"
                            ref="zoomImage"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <!-- This section is to display realtime sent message -->
                <!-- The reason this v-for li element is duplicated because then userMessages fetched from graphql can't be dynamically changed -->
                <li
                  class="clearfix"
                  v-for="(message, index) in realtimeFetchedMessages[
                    activeContactUsername
                  ]"
                  :key="index"
                >
                  <div v-if="currentUsername === message.sender.username">
                    <div class="message-data text-right">
                      <span class="message-data-time">{{
                        formatTime(message.sentTime)
                      }}</span>
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
                          <img
                            class="modal-content"
                            id="img01"
                            ref="zoomImage"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="message-data">
                      <span class="message-data-time">{{
                        formatTime(message.sentTime)
                      }}</span>
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
                          <img
                            class="modal-content"
                            id="img01"
                            ref="zoomImage"
                          />
                        </div>
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
<<<<<<< HEAD
                      <button
                        class="btn-outline-primary btn"
                      >
                        <i class="fas fa-paper-plane" data-toggle="tooltip" data-placement="auto" title="Gửi" style="color:#oo7bff"></i>
=======
                      <button class="btn-outline-primary btn">
                        <i
                          class="fas fa-paper-plane"
                          data-toggle="tooltip"
                          data-placement="auto"
                          title="Gửi"
                          style="color: #oo7bff"
                        ></i>
>>>>>>> dfcef8fe98256cdfe4a276e4007ebe23aa703a84
                      </button>
                      <input
                        type="text"
                        class="form-control"
<<<<<<< HEAD
                        style="border-color:#007bff"
=======
                        style="border-color: #007bff"
>>>>>>> dfcef8fe98256cdfe4a276e4007ebe23aa703a84
                        placeholder="Enter text here..."
                        name="content"
                        id="content"
                        v-model="messageContent"
                      />
                    </div>
                    <input
                      type="file"
                      class="form-control-file"
<<<<<<< HEAD
                      style="margin-top:5px"
=======
                      style="margin-top: 5px"
>>>>>>> dfcef8fe98256cdfe4a276e4007ebe23aa703a84
                      id="files"
                      name="files"
                      multiple
                      @change="filesChange($event.target.files)"
                      ref="messageFiles"
                    />
                  </form>
                </div>
=======
>>>>>>> 5c59c6dcf62731b4e826e160e75ad1fe076d3277

            <chat-history
              :userMessages="userMessages"
              :activeContactUsername="activeContactUsername"
              :currentUsername="currentUsername"
              :userAvatarUrl="user.avatar"
              :hasFinishedLoadingMessages="hasFinishedLoadingMessages"
              :realtimeFetchedMessages="realtimeFetchedMessages"
              :scrollHeight="scrollHeight"
              :shouldScroll="shouldScroll"
              @fetch-messages="fetchMessages"
              v-if="!contactIsGroup"
            ></chat-history>
            <group-chat-history
              v-else
              :groupMessages="groupMessages"
              :activeGroupId="activeGroupId"
              :realtimeGroupMessages="realtimeGroupMessages"
              :scrollHeight="scrollHeight"
              :shouldScroll="shouldScroll"
              :hasFinishedLoadingGroupMessages="hasFinishedLoadingGroupMessages"
              @fetch-group-messages="fetchGroupMessages"
            ></group-chat-history>

            <send-message
              :activeContactUsername="activeContactUsername"
              :contactIsGroup="contactIsGroup"
              :activeGroupId="activeGroupId"
              :currentUserAvatarUrl="user.avatar"
              @chatMessage="sendMessage"
              @realtime-message="addToRealtimeMessagesList"
              @groupChatMessage="sendGroupMessage"
            ></send-message>
          </div>

<<<<<<< HEAD
<<<<<<< HEAD
      <div class="control-buttons" style="margin-bottom:20px">
        <button
          type="button"
          class="btn btn-outline-primary"
          @click="endVideoCall"
        >
          <i class="fas fa-phone-slash" style="color:red"></i>
=======
      <div class="control-buttons" style="margin-bottom: 20px">
        <button
          type="button"
          class="btn btn-outline-primary"
          data-toggle="tooltip"
          data-placement="auto"
          title="End Call"
          @click="endVideoCall"
        >
          <i class="fas fa-phone-slash" style="color:red; margin-left: -2.5px"></i>
>>>>>>> dfcef8fe98256cdfe4a276e4007ebe23aa703a84
        </button>

        <button
          type="button"
          class="btn btn-outline-primary"
<<<<<<< HEAD
          @click="
            hasMuted ? startAudioOnly(srcStream) : stopAudioOnly(srcStream)
          "
        >
          <i v-if="hasMuted" class="fas fa-microphone-slash" style="color:red"></i> 
          <i v-else class="fas fa-microphone"></i> 
=======
          data-toggle="tooltip"
          data-placement="auto"
          @click="changeMicrophoneStatus(srcStream)"
        >
          <i
            v-if="hasTurnedOffMicrophone"
            class="fas fa-microphone-slash"
            style="color:red; margin-left: -2.5px"
            title="Mute"
          ></i>
          <i v-else title="Unmute" class="fas fa-microphone"></i>
>>>>>>> dfcef8fe98256cdfe4a276e4007ebe23aa703a84
        </button>
        <button
          type="button"
          class="btn btn-outline-primary"
<<<<<<< HEAD
          @click="stopVideoOnly(srcStream)"
        >
          <i class="fas fa-video" style="color:red"></i>
=======
          @click="changeWebcamStatus(srcStream)"
        >
          <i
            v-if="hasTurnedOffWebcam"
            class="fas fa-video-slash"
            style="color: red"
          ></i>
          <i v-else class="fas fa-video"></i>
>>>>>>> dfcef8fe98256cdfe4a276e4007ebe23aa703a84
        </button>
=======
          <private-video-chat
            v-if="hasVideoCallStarted && !contactIsGroup"
            :activeContactPeerId="activeContactPeerId"
            :peer="peer"
            :isCaller="isCaller"
            :answeringCall="answeringCall"
            @stop-video-chat="hasVideoCallStarted = false"
          ></private-video-chat>
          <group-video-chat
            v-else-if="hasVideoCallStarted && contactIsGroup && activeGroupId"
            :groupMembersPeerIds="groupMembersPeerIds"
            :peer="peer"
            :isCaller="isCaller"
            :answeringCall="answeringCall"
            :groupMembers="group.members"
            @stop-video-chat="hasVideoCallStarted = false"
          ></group-video-chat>
        </div>
>>>>>>> 5c59c6dcf62731b4e826e160e75ad1fe076d3277
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Peer from "peerjs";
import moment from "moment";
<<<<<<< HEAD
export default {
  inject: ["currentUsername", "config"],
  filters: {
    formatTime: function (value) {
      if (value) {
        return moment(value).format("DD/MM/YYYY HH:mm");
      }
    },
=======

import ContactList from "./private-chat-components/ContactList.vue";
import ChatHistory from "./private-chat-components/ChatHistory.vue";
import PrivateVideoChat from "./private-chat-components/PrivateVideoChat.vue";

import GroupList from "./groups-components/GroupList.vue";
import GroupChatHistory from "./groups-components/GroupChatHistory.vue";
import GroupVideoChat from "./groups-components/GroupVideoChat.vue";

import SendMessage from "./SendMessage.vue";

export default {
  inject: ["currentUsername", "config"],
  components: {
    GroupList,
    ContactList,
    ChatHistory,
    SendMessage,
    PrivateVideoChat,
    GroupChatHistory,
    GroupVideoChat,
>>>>>>> 5c59c6dcf62731b4e826e160e75ad1fe076d3277
  },
  data() {
    return {
      user: {
        // User information fetched from GraphQL Server
        contactlist: [],
        groups: [],
      },
<<<<<<< HEAD
      activeContactIndex: 0, // Default index of current contact in contactlist
      userMessages: {
        messages: [],
      }, // Messages fetch from GraphQL
      messageContent: "", // Message input field
      messagesFilePreviewUrls: [], // An array contain img's src when user upload image for previewing
      messageFiles: [], // // An array contain user uploaded message to send in form
      realtimeFetchedMessages: {}, // Messages received by socket.io events
=======

      activeContactUsername: null,
      activeGroupGroupname: null,
      activeGroupId: null,

      userMessages: {
        messages: [],
      }, // Messages fetch from GraphQL

      group: {
        members: [],
      },

      realtimeFetchedMessages: {},
      realtimeGroupMessages: {},

      groupMembersPeerIds: [],

>>>>>>> 5c59c6dcf62731b4e826e160e75ad1fe076d3277
      peer: null, // PeerJS object for current logged in user
      contactListPeerIds: [], // List of user contact list peerId
<<<<<<< HEAD
      currentCall: null, // Current video call PeerJS MediaConnection Object
=======

      hasVideoCallStarted: false,
>>>>>>> 5c59c6dcf62731b4e826e160e75ad1fe076d3277

      activeContactPeerId: null,

      isCaller: null,

      answeringCall: null,

      contactIsGroup: null,

      scrollHeight: 0,

      shouldScroll: null,
    };
  },
  sockets: {
    connect: function () {
      this.$socket.emit("currentUser", {
        user: this.currentUsername,
        id: this.$socket.id,
      });

      if (this.contactIsGroup) {
        console.log(this.activeGroupId);
        this.$socket.emit("joinSocketIORoom", {
          roomId: this.activeGroupId,
        });
      }
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
              groups {
                _id
                groupName
                groupAvatar
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
        variables: {
          firstUser: this.currentUsername,
          secondUser: null,
          limit: null,
          nextCursor: null,
        },
        skip: true,
      };
    },
    groupMessages() {
      return {
        query: gql`
          query Query($groupId: String!, $nextCursor: Date, $limit: Int) {
            groupMessages(
              groupId: $groupId
              nextCursor: $nextCursor
              limit: $limit
            ) {
              messages {
                sender {
                  username
                  avatar
                }
                content
                files {
                  fileUrl
                  fileType
                  fileName
                }
                sentTime
              }
              count
              nextCursor
            }
          }
        `,
        variables: {
          limit: null,
          nextCursor: null,
          groupId: null,
        },
        skip: true,
      };
    },
    group() {
      return {
        query: gql`
          query Query($groupId: String!) {
            group(groupId: $groupId) {
              members {
                username
                name
              }
            }
          }
        `,
        variables() {
          return {
            groupId: this.activeGroupId,
          };
        },
        skip() {
          return !this.activeGroupId;
        },
      };
    },
  },
  methods: {
<<<<<<< HEAD
    scrollDown(scrollHeight) {
      let chatHistory = this.$refs.chatHistory;
      chatHistory.scrollTop = scrollHeight;
    },
    about(){
      this.$router.push('/');
    },
    info(){
      this.$router.push('/user/'+this.currentUsername);
    },
    fetchedMessage() {
      // Because graphql query is reactive, query will be automatically run again when
      // query variable change, in this case is fetching message before a specific time
      let chatHistory = this.$refs.chatHistory;
=======
    addToRealtimeMessagesList(message) {
      if (this.contactIsGroup) {
        if (!this.realtimeGroupMessages[this.activeGroupId]) {
          this.realtimeGroupMessages[this.activeGroupId] = [];
        }
        this.realtimeGroupMessages[this.activeGroupId].push(message);
      } else {
        if (!this.realtimeFetchedMessages[this.activeContactUsername]) {
          this.realtimeFetchedMessages[this.activeContactUsername] = [];
        }
        this.realtimeFetchedMessages[this.activeContactUsername].push(message);
      }
>>>>>>> 5c59c6dcf62731b4e826e160e75ad1fe076d3277

      if (message.sender.username === this.currentUsername) {
        this.shouldScroll = true;

        this.scrollHeight = 0;
      } else {
        this.shouldScroll = false;
      }
    },
    fetchMessages(data) {
      this.contactIsGroup = false;
      this.shouldScroll = data.shouldScroll;

      if (data.firstFetch) {
        this.scrollHeight = data.scrollHeight;
        this.activeContactUsername = data.username;
        this.$apollo.queries.userMessages.skip = false;
        this.$apollo.queries.userMessages.setVariables({
          firstUser: this.currentUsername,
          secondUser: data.username,
          limit: data.limit,
          nextCursor: data.nextCursor,
        });
        this.$apollo.queries.userMessages.refetch();
      } else {
        this.scrollHeight = data.scrollHeight;
        this.$apollo.queries.userMessages.skip = false;
        this.$apollo.queries.userMessages.fetchMore({
          variables: {
            firstUser: this.currentUsername,
            secondUser: data.username,
            limit: data.limit,
            nextCursor: data.nextCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newMessages = fetchMoreResult.userMessages.messages;
            return {
              userMessages: {
                __typename: previousResult.userMessages.__typename,
                // Merging the tag list
                messages: [
                  ...previousResult.userMessages.messages,
                  ...newMessages,
                ],
                count:
                  previousResult.userMessages.count +
                  fetchMoreResult.userMessages.count,
                nextCursor: fetchMoreResult.userMessages.nextCursor,
              },
            };
          },
        });
      }
    },
<<<<<<< HEAD
    setActiveContact(index) {
      // Set realtime message array of current contact to empty to prevent duplicate because when switching back to this current contact
      // graphql will make a new query to get latest 3 messages
      this.activeContactIndex = index;
      this.realtimeFetchedMessages[this.activeContactUsername] = [];
      this.scrollHeight = 0;
      this.shouldScroll = true;
      this.$apollo.queries.userMessages.skip = false;
      this.$apollo.queries.userMessages.setVariables({
        firstUser: this.currentUsername,
        secondUser: this.activeContactUsername,
        limit: this.messagesToFetch,
        nextCursor: new Date().toISOString(),
      });
      this.$apollo.queries.userMessages.refetch();
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
        sentTime: new Date().toISOString(),
      };
      if (this.messagesFilePreviewUrls.length > 0) {
        this.messagesFilePreviewUrls.forEach((fileUrl) => {
          message.files.push({
            fileUrl,
          });
        });
      }
      if (!this.realtimeFetchedMessages[this.activeContactUsername]) {
        this.realtimeFetchedMessages[this.activeContactUsername] = [];
      }

      this.realtimeFetchedMessages[this.activeContactUsername].push(message);
      this.scrollHeight = 0;
      this.shouldScroll = true;

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
          })
          .catch((e) => {
            console.log(e);
          });
        this.$socket.emit("chatMessage", message);
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
=======
    fetchGroupMessages(data) {
      this.contactIsGroup = true;
      this.shouldScroll = data.shouldScroll;
      if (data.firstFetch) {
        this.activeGroupId = data.groupId;
        this.$apollo.queries.group.refetch({
          groupId: data.groupId,
        });

        this.$apollo.queries.groupMessages.skip = false;
        this.$apollo.queries.groupMessages.setVariables({
          groupId: data.groupId,
          limit: data.limit,
          nextCursor: data.nextCursor,
        });
        this.$apollo.queries.groupMessages.refetch();
      } else {
        this.scrollHeight = data.scrollHeight;
        this.$apollo.queries.groupMessages.skip = false;
        this.$apollo.queries.groupMessages.fetchMore({
          variables: {
            groupId: data.groupId,
            limit: data.limit,
            nextCursor: data.nextCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newGroupMessages = fetchMoreResult.groupMessages.messages;
            return {
              groupMessages: {
                __typename: previousResult.groupMessages.__typename,
                // Merging the tag list
                messages: [
                  ...previousResult.groupMessages.messages,
                  ...newGroupMessages,
                ],
                count:
                  previousResult.groupMessages.count +
                  fetchMoreResult.groupMessages.count,
                nextCursor: fetchMoreResult.groupMessages.nextCursor,
              },
            };
          },
        });
      }
    },
    sendMessage(data) {
      this.$socket.emit("chatMessage", data);
>>>>>>> 5c59c6dcf62731b4e826e160e75ad1fe076d3277
    },
    sendGroupMessage(data) {
      this.$socket.emit("groupMessage", data);
    },
    joinSocketIORoom(data) {
      console.log("Emitted");
      this.$socket.emit("joinSocketIORoom", data);
    },
    async startVideoCall() {
      this.hasVideoCallStarted = true;
<<<<<<< HEAD
      let peerId = await this.getActiveContactPeerId();
      this.contactListPeerIds.push({
        username: this.activeContactUsername,
        peerId,
      });
      let activeContactPeerId = this.contactListPeerIds.find(
        (contact) => contact.username === this.activeContactUsername
      ).peerId;
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          let userWebcam = this.$refs.srcVideo;
          let peer = this.peer;
          let contactWebcam = this.$refs.contactVideo;
          this.srcStream = stream;
          userWebcam.srcObject = stream;
          userWebcam.play();
          this.currentCall = peer.call(activeContactPeerId, stream);
          this.currentCall.on("stream", function (remoteStream) {
            // Show stream in some video/canvas element.
            contactWebcam.srcObject = remoteStream;
            contactWebcam.play();
          });
        })
        .catch(function (err) {
          console.log("An error occurred: " + err);
=======
      this.isCaller = true;

      if (!this.contactListPeerIds[this.activeContactUsername]) {
        let peerId = await this.getActiveContactPeerId();
        this.activeContactPeerId = peerId;
        this.contactListPeerIds.push({
          username: this.activeContactUsername,
          peerId,
>>>>>>> 5c59c6dcf62731b4e826e160e75ad1fe076d3277
        });
      } else {
        this.activeContactPeerId =
          this.contactListPeerIds[this.activeContactUsername];
      }
    },
    async startGroupVideoCall() {
      let groupMembers = this.group.members;
      for (let i = 0; i < groupMembers.length; i++) {
        let member = groupMembers[i];
        if (member.username != this.currentUsername) {
          let result = await this.axios.get(
            `${this.config.socketIO_HTTP}/session/${member.username}/peerId`
          );

          if (
            this.groupMembersPeerIds.findIndex(
              (element) => element.username == member.username
            ) == -1
          ) {
            this.groupMembersPeerIds.push({
              ...member,
              peerId: result.data,
            });
          }
        }
      }

      this.hasVideoCallStarted = true;
      this.isCaller = true;
    },
    async getActiveContactPeerId() {
      let res = await this.axios.get(
        `${this.config.socketIO_HTTP}/session/${this.activeContactUsername}/peerId`
      );
      return res.data;
    },

    formatTime(value) {
      return moment(String(value)).format("MM/DD/YYYY HH:mm");
    },
  },
  computed: {
    activeContactIndex() {
      return this.user.contactlist.findIndex(
        (contact) => contact.username == this.activeContactUsername
      );
    },
    hasFinishedLoadingMessages() {
      return !this.$apollo.queries.userMessages.loading;
    },
    hasFinishedLoadingGroupMessages() {
      return !this.$apollo.queries.groupMessages.loading;
    },
  },
  created() {
    this.$socket.emit("currentUser", {
      user: this.currentUsername,
      id: this.$socket.id,
    });
<<<<<<< HEAD
    this.sockets.subscribe("chatMessage", function (data) {
      let sender = data.sender.username;
      if (!this.realtimeFetchedMessages[sender]) {
        this.realtimeFetchedMessages[sender] = [];
      }
      this.realtimeFetchedMessages[sender].push(data);
      this.shouldScroll = false;
    });
=======

>>>>>>> 5c59c6dcf62731b4e826e160e75ad1fe076d3277
    this.peer = new Peer();
    this.peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      // Save user peerId to backend
      this.axios.post(
        `${this.config.socketIO_HTTP}/session/${this.currentUsername}/peerId`,
        {
          peerId: id,
        }
      );
    });
  },

  mounted() {
    let peer = this.peer;
<<<<<<< HEAD
    peer.on("call", (call) => {
      console.log("Call received");

      this.hasVideoCallStarted = true;
      let currentCall = this.currentCall;

      currentCall = call;

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          let contactWebcam = this.$refs.contactVideo;
          let userWebcam = this.$refs.srcVideo;
          this.srcStream = stream;
          userWebcam.srcObject = stream;
          userWebcam.play();
          currentCall.answer(stream); // Answer the call with an A/V stream.
          currentCall.on("stream", function (remoteStream) {
            // Show stream in some video/canvas element.
            contactWebcam.srcObject = remoteStream;
            contactWebcam.play();
          });
          currentCall.on("close", () => {
            console.log("Call ended");
          });
        });
=======

    peer.on("call", (answeringCall) => {
      this.isCaller = false;
      console.log("Called");
      this.hasVideoCallStarted = true;

      this.answeringCall = answeringCall;
    });

    this.sockets.subscribe("chatMessage", function (data) {
      this.addToRealtimeMessagesList(data);
    });

    this.sockets.subscribe("groupMessage", function (data) {
      this.addToRealtimeMessagesList(data);
>>>>>>> 5c59c6dcf62731b4e826e160e75ad1fe076d3277
    });
  },
};
</script>

<style scoped>
<<<<<<< HEAD
.btn{
  text-align: center;
=======
#menu .ul {
  padding: 0;
  list-style: none;
  background: #f01f1f;
}
#menu.ul li {
  display: inline-block;
  position: relative;
  line-height: 21px;
  text-align: left;
  list-style: none;
}
#menu ul li a {
        display: block;
        padding: 8px 25px;
        color: rgb(0, 0, 0);
        text-decoration: none;
        list-style: none;
}
#menu ul li a:hover {
        color: #fff;
        background: #fcf700;
}
#menu ul.dropdown {
        min-width: 100%; /* Set width of the dropdown */
        background: #f2f2f2;
        display: none;
        position: absolute;
        z-index: 999;
        left: 0;
        list-style: none;
    }
#menu ul:hover .ul.dropdown {
        display: block; /* Display the dropdown */
    }
#menu ul.dropdown li {
        display: block;
    }
.btn{
>>>>>>> dfcef8fe98256cdfe4a276e4007ebe23aa703a84
  margin-right: 5px;
  width: 40px;
  height: 40px;
}
.container {
  max-width: 100vw;
}

.control-buttons,
.video {
  display: flex;
  justify-content: center;
  align-items: center;
}

.video {
  margin-bottom: 10px;
}

.video .container {
  max-width: 100vw;
}

.message-input {
  width: 100%;
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
  width: auto;
  height: 60vh;
  padding: 20px;
  overflow: auto;
}
.chat-history ul::-webkit-scrollbar {
	width: 10px;
  }
.chat-history ul::-webkit-scrollbar-thumb {
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  border-radius: 10px;
  background-color: #007bff;
}
.chat-history ul::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 10px;
	background-color: #F5F5F5;
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
  height: 40px;
  margin-left: 10px;
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

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
