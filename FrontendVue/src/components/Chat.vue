<template>
  <div class="container">
    <div class="row clearfix">
      <div class="col-lg-12">
        <div class="card chat-app">
          <div id="plist" class="people-list">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><i class="fas fa-search" style="color: #007bff"></i
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
                  </button>
                  <button
                    class="btn btn-outline-primary"
                    data-toggle="tooltip"
                    data-placement="auto"
                    title="Video call"
                    @click="
                      contactIsGroup ? startGroupVideoCall() : startVideoCall()
                    "
                  >
                    <i
                      class="fas fa-camera"
                      data-toggle="tooltip"
                      data-placement="auto"
                      title="Video call"
                    ></i>
                  </button>
                  <button class="btn btn-outline-primary">
                    <i
                      class="fas fa-image"
                      data-toggle="tooltip"
                      data-placement="auto"
                      title="Ảnh"
                    ></i>
                  </button>
                  <button class="btn btn-outline-primary">
                    <i
                      class="fas fa-cogs"
                      data-toggle="tooltip"
                      data-placement="auto"
                      title="Cài đặt"
                    ></i>
                  </button>
                  <button class="btn btn-outline-primary">
                    <i
                      class="fas fa-question"
                      data-toggle="tooltip"
                      data-placement="auto"
                      title="Trợ giúp"
                    ></i>
                  </button>
                  <button class="btn btn-outline-primary">
                    <i
                      class="fas fa-camera"
                      data-toggle="tooltip"
                      data-placement="auto"
                      title="Đăng xuất"
                    ></i>
                  </button>
                </div>
              </div>
            </div>

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

          <private-video-chat
            v-if="hasVideoCallStarted && !contactIsGroup"
            :activeContactPeerId="activeContactPeerId"
            :peer="peer"
            :isCaller="isCaller"
            :answeringCall="answeringCall"
            @stop-video-chat="hasVideoCallStarted = false"
          ></private-video-chat>
          <group-video-chat
            v-else-if="
              hasGroupVideoCallStarted && contactIsGroup && activeGroupId
            "
            :groupMembersPeerIds="groupMembersPeerIds"
            :peer="peer"
            :answeringCall="answeringCall"
            :groupMembers="group.members"
            @stop-video-chat="hasVideoCallStarted = false"
          ></group-video-chat>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Peer from "peerjs";
import moment from "moment";

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
  },
  data() {
    return {
      user: {
        // User information fetched from GraphQL Server
        contactlist: [],
        groups: [],
      },

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

      peer: null, // PeerJS object for current logged in user

      contactListPeerIds: [], // List of user contact list peerId

      hasVideoCallStarted: false, //Check if current user has started a 1 to 1 call

      hasGroupVideoCallStarted: false, // Check if current user has started a group video call

      activeContactPeerId: null,

      isCaller: null,

      answeringCall: null,

      contactIsGroup: null, // Boolean to decide if message is sent to 1 user or multicast to group member

      scrollHeight: 0,

      shouldScroll: null,

      dataConnections: {}, // Object to store data connection object to each group members when start group video call
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
                accountStatus
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
        subscribeToMore: {
          document: gql`
            subscription Subscription($username: String!) {
              accountStatusInfo(username: $username) {
                username
                accountStatus
              }
            }
          `,
          variables: {
            // This works just like regular queries
            // and will re-subscribe with the right variables
            // each time the values change
            username: "hieudt223",
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            // Here, return the new result from the previous with the new data
            let accountStatusInfo = subscriptionData.data.accountStatusInfo;
            let oldContactList = previousResult.user.contactlist;
            let contactlist = oldContactList.map((contact) =>
              contact.username === accountStatusInfo.username
                ? {
                    ...contact,
                    accountStatus: accountStatusInfo.accountStatus,
                  }
                : contact
            );
            return {
              user: {
                ...previousResult.user,
                contactlist,
              },
            };
          },
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
      this.isCaller = true;

      if (!this.contactListPeerIds[this.activeContactUsername]) {
        let peerId = await this.getActiveContactPeerId();
        this.activeContactPeerId = peerId;
        this.contactListPeerIds.push({
          username: this.activeContactUsername,
          peerId,
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

          // Save data connection object to each group member
          let conn = (this.dataConnections[member.username] = this.peer.connect(
            result.data
          ));

          conn.on("open", function () {
            conn.send("Group video call");
          });
        }
      }

      this.hasGroupVideoCallStarted = true;
      this.isCaller = true;
    },
    async getActiveContactPeerId() {
      let res = await this.axios.get(
        `${this.config.socketIO_HTTP}/session/${this.activeContactUsername}/peerId`
      );

      return res.data;
    },

    formatTime(value) {
      return moment(String(value)).format("MM/DD/YYYY hh:mm");
    },

    // Change acccount status on "Online" or "Offline",...
    changeAccountStatus(accountStatus) {
      this.$apollo.mutate({
        mutation: gql`
          mutation Mutation($accountStatus: AccountStatus) {
            updateUserInfo(accountStatus: $accountStatus) {
              username
              accountStatus
            }
          }
        `,
        variables: {
          accountStatus,
        },
      });
    },

    tabOrWindowsClosedHandler() {
      this.changeAccountStatus("Offline");
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

    // Changed account to offline if user close windows or tab
    window.addEventListener("beforeunload", this.tabOrWindowsClosedHandler);
  },

  mounted() {
    let peer = this.peer;

    peer.on("call", (answeringCall) => {
      console.log("Called");
      this.answeringCall = answeringCall;

      if (this.contactIsGroup) {
        this.startGroupVideoCall();

        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            this.answeringCall.answer(stream);
            this.hasVideoCallStarted = true;
          });
      } else {
        this.isCaller = false;
        this.hasVideoCallStarted = true;
      }
    });

    peer.on("connection", (dataConnection) => {
      console.log("Connected");

      dataConnection.on("data", function (data) {
        console.log("Received data ", data);

        if (data === "Group video call") {
          this.hasGroupVideoCallStarted = true;
        } else if (data === "Private video call") {
        }
      });
    });

    this.sockets.subscribe("chatMessage", function (data) {
      this.addToRealtimeMessagesList(data);
    });

    this.sockets.subscribe("groupMessage", function (data) {
      this.addToRealtimeMessagesList(data);
    });

    this.changeAccountStatus("Online");
  },
};
</script>

<style scoped>
.btn {
  text-align: center;
  margin-right: 5px;
  width: 40px;
  height: 40px;
}
.container {
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

.chat .chat-header {
  padding: 15px 20px;
  border-bottom: 2px solid #f4f7f6;
}

.chat .chat-header img {
  float: left;
  border-radius: 40px;
  width: 40px;
  height: 40px;
}

.chat .chat-header .chat-about {
  float: left;
  padding-left: 10px;
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
