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
                  <button class="btn btn-outline-primary" data-toggle="tooltip" data-placement="auto" title="Call">
                    <i
                      class="fa fa-phone"
                    ></i>
                  </button>
                  <button class="btn btn-outline-primary" data-toggle="tooltip" data-placement="auto" title="Video call" @click="contactIsGroup ? startGroupVideoCall() : startVideoCall()">
                    <i
                      class="fas fa-camera"
                    ></i>
                  </button>
                  <button class="btn btn-outline-primary" data-toggle="tooltip" data-placement="auto" title="Profile" @click="info()">
                    <i
                      class="fas fa-user-alt"
                    ></i>
                  </button>
                  <button class="btn btn-outline-primary" data-toggle="tooltip" data-placement="auto" title="Sign Out" @click="signOut()">
                    <i
                      class="fas fa-sign-out-alt"
                    ></i>
                  </button>
                  <button class="btn btn-outline-primary" data-toggle="tooltip" data-placement="auto" title="About Us" @click="about()">
                    <i
                      class="fas fa-info"
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
            v-else-if="hasVideoCallStarted && contactIsGroup && activeGroupId"
            :groupMembersPeerIds="groupMembersPeerIds"
            :peer="peer"
            :isCaller="isCaller"
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
import { Auth } from 'aws-amplify';
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
      hasVideoCallStarted: false,
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
    about(){
      this.$router.push('/');
    },
    info(){
      this.$router.push('/user/'+this.currentUsername);
    },
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
    async signOut() {
    try {
        await Auth.signOut();
    } catch (error) {
        console.log('error signing out: ', error);
    }
    this.$router.push('/');
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
      return moment(String(value)).format("MM/DD/YYYY hh:mm");
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
  },

  mounted() {
    let peer = this.peer;

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
    });
  },
};
</script>

<style scoped>
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