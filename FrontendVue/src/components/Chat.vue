<template>
  <div class="container">
    <div class="row clearfix">
      <div class="col-lg-12">
        <div class="card chat-app">
          <div id="plist" class="people-list">
            <div style="height:10vh;margin-bottom:5%; margin-top:0%">
              <b-dropdown offset="25" variant="light" right>
                  <template #button-content>
                    <b-avatar variant="info" :src="user.avatar" class="mr-4"></b-avatar>
                    <span style="margin-left:5px">{{user.name}}</span>
                  </template>

                  <b-dropdown-item @click="about()"><b-icon icon="house-door"></b-icon><span style="margin-left:10px">Home</span></b-dropdown-item>
                  <b-dropdown-item @click="info()"><b-icon icon="person"></b-icon><span style="margin-left:10px">Profile</span></b-dropdown-item>
                  <b-dropdown-item @click="signOut()"><b-icon icon="power"></b-icon><span style="margin-left:10px">Logout</span></b-dropdown-item>
              </b-dropdown>
            </div>
            <div class="input-group">
              <chat-util :user="user"/>
            </div>
            
            <div id="people-list-content" style="height:75vh; overflow-y: scroll;">
              <contact-list
              :contactlist="user.contactlist"
              :contactIsGroup="contactIsGroup"
              @fetch-messages="fetchMessages"
              @change-contact-type="contactIsGroup = !contactIsGroup"
              @empty-current-realtime-messages="emptyRealtimeChatMessages"
              :realtimeFetchedMessages="realtimeFetchedMessages"
            ></contact-list>

            <group-list
              :groups="user.groups"
              :contactIsGroup="contactIsGroup"
              :realtimeGroupMessages="realtimeGroupMessages"
              @fetch-group-messages="fetchGroupMessages"
              @change-contact-type="contactIsGroup = !contactIsGroup"
              @joinSocketIORoom="joinSocketIORoom"
              @empty-realtime-group-messages="emptyRealtimeGroupsMessages"
            ></group-list>
            </div>
          </div>
          <div
            class="chat"
            :style="[contactIsGroup ? { 'margin-right': '200px' } : {}]"
          >
            <div class="chat-header clearfix">
              <div class="row">
                <div class="col-lg-6">
                  <router-link
                    :to="`/profile/${user.contactlist[activeContactIndex]?.username}`"
                    target="_blank"
                  >
                    <img
                      :src="
                        contactIsGroup
                          ? activeGroupAvatar
                          : user.contactlist[activeContactIndex]?.avatar
                      "
                      alt="avatar"
                    />
                  </router-link>
                  <div class="chat-about">
                    <a style="text-decoration:none" target="_blank" :href="'/profile/'+ activeContactUsername" class="m-b-0">{{ activeContactUsername }}</a>
                    <small style="display:block">Last seen: 2 hours ago</small>
                  </div>
                </div>
                <div class="col-lg-6 hidden-sm text-right">
                  <group-members-control
                    v-if="contactIsGroup"
                    :friendlist="user.friendlist"
                    :activeGroupId="activeGroupId"
                    :groupAdmin="group.admin"
                    :groupMembers="group.members"
                  ></group-members-control>

                  <button
                    class="btn btn-outline-primary"
                    data-toggle="tooltip"
                    data-placement="auto"
                    title="Call"
                    @click="
                      contactIsGroup ? startGroupVideoCall() : startVideoCall()
                    "
                  >
                    <i class="fa fa-phone"></i>
                  </button>
                  <!-- <button class="btn btn-outline-primary" data-toggle="tooltip" data-placement="auto" title="Profile" @click="info()">
                    <i
                      class="fas fa-user-alt"
                    ></i>
                  </button>
                  <button
                    class="btn btn-outline-primary"
                    data-toggle="tooltip"
                    data-placement="auto"
                    title="Sign Out"
                    @click="signOut"
                  >
                    <i class="fas fa-sign-out-alt"></i>
                  </button>
                  <button class="btn btn-outline-primary" data-toggle="tooltip" data-placement="auto" title="About Us" @click="about()">
                    <i
                      class="fas fa-info"
                    ></i>
                  </button> -->
                  
                </div>
              </div>
            </div>

            <chat-history
              :userMessages="userMessages"
              :activeContactUsername="activeContactUsername"
              :currentUsername="currentUsername"
              :userAvatarUrl="user.avatar"
              :hasFinishedLoadingMessages="hasFinishedLoadingMessages"
              :allRealtimeMessages="allRealtimeMessages"
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
              @realtime-group-message="addToRealTimeGroupMessages"
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
            :srcStream="srcStream"
            @stop-video-chat="stopGroupVideoCall"
            @change-webcam-status="
              srcStream.getVideoTracks()[0].enabled =
                !srcStream.getVideoTracks()[0].enabled
            "
            @change-microphone-status="
              srcStream.getAudioTracks()[0].enabled =
                !srcStream.getAudioTracks()[0].enabled
            "
          ></group-video-chat>

          <group-info
            :groupMembers="group.members"
            v-if="contactIsGroup"
            :activeGroupAvatar="activeGroupAvatar"
            :activeGroupId="activeGroupId"
          ></group-info>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Peer from "peerjs";
import moment from "moment";
import { Auth } from "aws-amplify";

import ContactList from "./private-chat-components/ContactList.vue";
import ChatHistory from "./private-chat-components/ChatHistory.vue";
import PrivateVideoChat from "./private-chat-components/PrivateVideoChat.vue";

import GroupList from "./groups-components/GroupList.vue";
import GroupChatHistory from "./groups-components/GroupChatHistory.vue";
import GroupVideoChat from "./groups-components/GroupVideoChat.vue";
import GroupInfo from "./groups-components/GroupInfo.vue";
import GroupMembersControl from "./groups-components/GroupMembersControl.vue";
import ChatUtil from "./ChatUtil.vue";
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
    GroupInfo,
    GroupMembersControl,
    ChatUtil
  },
  data() {
    return {
      user: {
        // User information fetched from GraphQL Server
        contactlist: [],
        groups: [],
      },

      activeContactUsername: null,

      activeGroupIndex: null,

      activeGroupId: "",

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
      /*
      The 2 above variables is set in followings case:
      + First fetch: true and scroll all the way to bottom of chat box
      + Fetch older messages when user scroll up
      */

      dataConnections: {}, // Object to store data connection object to each group members when start group video call

      srcStream: null, // Media stream (webcam, microphone) to pass to video call components

      incomingCallType: "", // Whether if incoming call is from user or from group chat
    };
  },
  sockets: {
    connect: function () {
      this.$socket.emit("currentUser", {
        user: this.currentUsername,
        id: this.$socket.id,
      });

      if (this.contactIsGroup) {
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
              name
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
              friendlist {
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
        subscribeToMore: {
          document: gql`
            subscription Subscription($loggedInUsername: String!) {
              accountStatusInfo(loggedInUsername: $loggedInUsername) {
                username
                accountStatus
              }
            }
          `,
          variables: {
            // This works just like regular queries
            // and will re-subscribe with the right variables
            // each time the values change
            loggedInUsername: this.currentUsername,
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            // Append next messages to current array messages fetched from GraphQL
            let accountStatusInfo = subscriptionData.data.accountStatusInfo;

            if (accountStatusInfo) {
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
            }
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
                accountStatus
                avatar
              }

              admin {
                username
              }
            }
          }
        `,
        variables: {
          groupId: this.activeGroupId,
        },
        subscribeToMore: {
          document: gql`
            subscription Subscription($groupId: String!) {
              groupMembersAccountStatus(groupId: $groupId) {
                username
                accountStatus
              }
            }
          `,
          variables() {
            // This works just like regular queries
            // and will re-subscribe with the right variables
            // each time the values change
            return {
              groupId: this.activeGroupId,
            };
          },
          skip() {
            return this.activeGroupId === "";
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            // Append next messages to current array messages fetched from GraphQL
            let groupMembersAccountStatusInfo =
              subscriptionData.data.groupMembersAccountStatus;

            if (groupMembersAccountStatusInfo) {
              let oldListOfMembers = previousResult.group.members;
              let newListsOfMembers = oldListOfMembers.map((contact) =>
                contact.username === groupMembersAccountStatusInfo.username
                  ? {
                      ...contact,
                      accountStatus:
                        groupMembersAccountStatusInfo.accountStatus,
                    }
                  : contact
              );

              return {
                group: {
                  ...previousResult.group,
                  members: newListsOfMembers,
                },
              };
            }
          },
        },
      };
    },
  },
  methods: {
    addToRealTimeGroupMessages(message) {
      // Get group ID of incoming message from SocketIO server
      let groupId = message.group;
      if (!this.realtimeGroupMessages[groupId]) {
        this.realtimeGroupMessages[groupId] = [];
      }
      this.realtimeGroupMessages[groupId].push(message);

      if (this.contactIsGroup && groupId === this.activeGroupId) {
        this.shouldScroll = true;

        this.scrollHeight = 0;
      }
    },
    addToRealtimeMessagesList(message) {
      let sender = message.sender.username;

      if (!this.realtimeFetchedMessages[sender]) {
        this.realtimeFetchedMessages[sender] = [];
      }
      this.realtimeFetchedMessages[sender].push(message);

      if (sender === this.activeContactUsername) {
        this.shouldScroll = true;

        this.scrollHeight = 0;
      }
    },
    fetchMessages(data) {
      this.contactIsGroup = false;
      this.shouldScroll = data.shouldScroll;
      if (data.firstFetch) {
        // Empty realtime messages received from this new user when this username is not focused
        this.realtimeFetchedMessages[this.currentUsername] = [];
        this.realtimeFetchedMessages[data.username] = [];

        this.scrollHeight = data.scrollHeight;
        this.activeContactUsername = data.username;
        this.$apollo.queries.userMessages.setVariables({
          firstUser: this.currentUsername,
          secondUser: data.username,
          limit: data.limit,
          nextCursor: data.nextCursor,
        });
        this.$apollo.queries.userMessages.skip = false;
        this.$apollo.queries.userMessages.refetch();
      } else {
        this.scrollHeight = data.scrollHeight;
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

        this.activeGroupIndex = data.activeGroupIndex;

        // Empty realtime messages received from this group when this group is not focused
        this.realtimeGroupMessages[this.activeGroupId] = [];

        this.$apollo.queries.group.refetch({
          groupId: data.groupId,
        });

        this.$apollo.queries.groupMessages.setVariables({
          groupId: data.groupId,
          limit: data.limit,
          nextCursor: data.nextCursor,
        });
        this.$apollo.queries.groupMessages.skip = false;
      } else {
        this.scrollHeight = data.scrollHeight;
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
      this.$socket.emit("joinSocketIORoom", data);
    },
    async startVideoCall() {
      if (!this.contactListPeerIds[this.activeContactUsername]) {
        let peerId = await this.getActiveContactPeerId(
          this.activeContactUsername
        );
        this.activeContactPeerId = peerId;
        this.contactListPeerIds.push({
          username: this.activeContactUsername,
          peerId,
        });
      } else {
        this.activeContactPeerId =
          this.contactListPeerIds[this.activeContactUsername];
      }

      this.hasVideoCallStarted = true;
      this.isCaller = true;
    },
    async startGroupVideoCall() {
      let groupMembers = this.group.members;
      for (let i = 0; i < groupMembers.length; i++) {
        let member = groupMembers[i];
        if (
          member.username != this.currentUsername &&
          member.accountStatus === "Online"
        ) {
          // Get all online members peer id in group chat
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

      this.srcStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      this.hasGroupVideoCallStarted = true;
    },

    async getActiveContactPeerId(username) {
      let res = await this.axios.get(
        `${this.config.socketIO_HTTP}/session/${username}/peerId`
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

    // When user close the tab, change status to offline and delete socket id and peerid
    tabOrWindowsClosedHandler() {
      this.changeAccountStatus("Offline");
      this.$socket.emit("delete-user-session", {
        username: this.currentUsername,
      });
    },

    compareMessageSentTime(firstMessage, secondMessage) {
      if (firstMessage.sentTime < secondMessage.sentTime) {
        return -1;
      }
      if (firstMessage.sentTime > secondMessage.sentTime) {
        return 1;
      }
      return 0;
    },

    stopGroupVideoCall() {
      this.srcStream.getTracks()[0].stop();

      this.hasGroupVideoCallStarted = false;
    },

    // When user changes contact list, empty realtime message so that no notification is shown
    emptyRealtimeChatMessages() {
      this.realtimeFetchedMessages[this.activeContactUsername] = [];
    },

    /*
    The below function is trigged when user selects between group chat or from contact to group
    Empty real time messages so that the messages are not duplicated in chat conversation and disable notification of new messages
    */
    emptyRealtimeGroupsMessages(groupId) {
      this.realtimeGroupMessages[groupId] = [];
    },
  },
  computed: {
    activeContactIndex() {
      return this.user.contactlist.findIndex(
        (contact) => contact.username == this.activeContactUsername
      );
    },
    activeGroupGroupName() {
      return this.user.groups[this.activeGroupIndex]?.groupName;
    },
    activeGroupAvatar() {
      return this.user.groups[this.activeGroupIndex]?.groupAvatar;
    },
    hasFinishedLoadingMessages() {
      return !this.$apollo.queries.userMessages.loading;
    },
    hasFinishedLoadingGroupMessages() {
      return !this.$apollo.queries.groupMessages.loading;
    },

    /*
    The array containing realtime messages from SocketIO server include messages sent by current logged in user
    and messages sent by current contact
    */
    allRealtimeMessages() {
      let messagesSentByUser = this.realtimeFetchedMessages[
        this.currentUsername
      ]
        ? this.realtimeFetchedMessages[this.currentUsername]
        : [];
      let messagesSentByActiveContact = this.realtimeFetchedMessages[
        this.activeContactUsername
      ]
        ? this.realtimeFetchedMessages[this.activeContactUsername]
        : [];

      let allMessages = messagesSentByUser.concat(messagesSentByActiveContact);
      return allMessages.sort(this.compareMessageSentTime);
    },

    about() {
      this.$router.push("/");
    },
    info() {
      this.$router.push("/user/" + this.currentUsername);
    },
    async signOut() {
      try {
        await Auth.signOut();
      } catch (error) {
        console.log("error signing out: ", error);
      }
      this.$router.push("/");
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

    // Listen for video call
    peer.on("call", async (answeringCall) => {
      console.log("Called");
      this.answeringCall = answeringCall;

      if (this.contactIsGroup) {
        await this.startGroupVideoCall();
        this.answeringCall.answer(this.srcStream);
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
          this.incomingCallType = "group";
          this.hasGroupVideoCallStarted = true;
        }
      });
    });

    // Get 1-1 real time message from SocketIO Server
    this.sockets.subscribe("chatMessage", function (data) {
      this.addToRealtimeMessagesList(data);
    });

    // Get group messages from SocketIO Server
    this.sockets.subscribe("groupMessage", function (data) {
      this.addToRealTimeGroupMessages(data);
    });

    // Send new account status to GraphQL Server
    this.changeAccountStatus("Online");
  },
};
</script>

<style scoped>
#people-list-content::-webkit-scrollbar {
    width: 1px;
    background-color: #F5F5F5;
} 
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
  background: white;
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
}
@media only screen and (min-width: 768px) and (max-width: 992px) {
  .chat-app .chat-list {
    height: 650px;
    overflow-x: auto;
  }
}
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 1) {
  .chat-app .chat-list {
    height: 480px;
    overflow-x: auto;
  }
}
</style>
