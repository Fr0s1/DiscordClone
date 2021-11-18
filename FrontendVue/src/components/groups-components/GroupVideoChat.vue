<template>
  <div class="video-chat">
    <div class="user-video">
      <video ref="srcVideo" autoplay="true" muted id="userWebcam"></video>
    </div>

    <div class="members-video">
      <div
        class="member-video"
        v-for="(member, index) in members"
        :key="index"
        :id="member.username"
        :ref="`contactVideo-${member.username}`"
      >
        <video
          autoplay="true"
          :id="member.username"
          @click="setMainUserVideo"
        ></video>
        <p>{{ member.name }}</p>
      </div>
    </div>
    <div class="control-buttons" style="margin-bottom: 20px">
      <button
        type="button"
        class="btn btn-outline-primary"
        @click="endVideoCall"
      >
        <i class="fas fa-phone-slash" style="color: red"></i>
      </button>

      <button
        type="button"
        class="btn btn-outline-primary"
        @click="changeMicrophoneStatus(srcStream)"
      >
        <i
          v-if="hasTurnedOffMicrophone"
          class="fas fa-microphone-slash"
          style="color: red; margin-left: -3px"
        ></i>
        <i v-else class="fas fa-microphone"></i>
      </button>
      <button
        type="button"
        class="btn btn-outline-primary"
        @click="changeWebcamStatus(srcStream)"
      >
        <i
          v-if="hasTurnedOffWebcam"
          class="fas fa-video-slash"
          style="color: red; margin-left: -1px"
        ></i>
        <i v-else class="fas fa-video"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["currentUsername", "config"],
  props: {
    peer: {
      default: null,
    },
    groupMembersPeerIds: {
      type: Array,
      default: [],
    },
    groupMembers: {
      type: Array,
    },
    answeringCall: {
      default: null,
    },
    srcStream: {
      default: null,
    },
  },

  data() {
    return {
      hasTurnedOffMicrophone: false,
      hasTurnedOffWebcam: false,
      call: null,
      groupMembersStream: [],
      groupMembersPeerCurrentCall: {},
      groupMembersStream: {},
    };
  },
  methods: {
    startVideoChat() {
      let userWebcam = this.$refs.srcVideo;
      let peer = this.peer;
      userWebcam.srcObject = this.srcStream;
      userWebcam.play();
      this.groupMembersPeerIds.forEach((member) => {
        console.log(member.peerId);
        this.groupMembersPeerCurrentCall[member.username] = peer.call(
          member.peerId,
          this.srcStream
        );
        this.groupMembersPeerCurrentCall[member.username].on(
          "stream",
          (remoteStream) => {
            // Show stream in some video/canvas element.
            console.log("Received stream");
            this.groupMembersStream[member.username] = remoteStream;
            let membersWebcam = this.$refs[`contactVideo-${member.username}`];

            membersWebcam.childNodes[0].srcObject = remoteStream;
            console.log(remoteStream);
          }
        );
      });
    },
    endVideoCall() {
      for (const [groupMembers, peerCall] of Object.entries(
        this.groupMembersPeerCurrentCall
      )) {
        peerCall.close();
      }
      for (const [groupMembers, stream] of Object.entries(
        this.groupMembersStream
      )) {
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
      }
      this.$emit("stop-video-chat");
    },
    // Turn on/off webcam
    changeWebcamStatus() {
      this.hasTurnedOffWebcam = !this.hasTurnedOffWebcam;
      this.$emit("change-webcam-status");
    },
    // Turn on/off mic
    changeMicrophoneStatus() {
      this.hasTurnedOffMicrophone = !this.hasTurnedOffMicrophone;
      this.$emit("change-microphone-status");
    },
  },
  computed: {
    members() {
      return this.groupMembers.filter(
        (member) => member.username != this.currentUsername
      );
    },
  },
  mounted() {
    this.startVideoChat();
  },
};
</script>

<style scoped>
.member-video {
  display: inline-block;
}

.member-video video {
  height: 200px;
}
.btn {
  width: 40px;
  margin-right: 5px;
}
</style>
