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
        ref="contactVideo"
      >
        <video autoplay="true" :id="member.username" @click="setMainUserVideo">
          <p>{{ member.name }}</p>
        </video>
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
          style="color: red"
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
          style="color: red"
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
    isCaller: {
      type: Boolean,
    },
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
  },

  data() {
    return {
      hasTurnedOffMicrophone: false,
      hasTurnedOffWebcam: false,
      srcStream: null,
      call: null,
      groupMembersStream: [],
      groupMembersPeerCurrentCall: {},
    };
  },
  methods: {
    startVideoChat() {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          let userWebcam = this.$refs.srcVideo;
          let peer = this.peer;
          let membersWebcam = this.$refs.contactVideo;
          this.srcStream = stream;
          userWebcam.srcObject = stream;
          userWebcam.play();
          if (this.isCaller) {
            this.groupMembersPeerIds.forEach((member) => {
              console.log(member.peerId);
              this.groupMembersPeerCurrentCall[member.username] = peer.call(
                member.peerId,
                stream
              );
              this.groupMembersPeerCurrentCall[member.username].on(
                "stream",
                function (remoteStream) {
                  // Show stream in some video/canvas element.
                  console.log("Received stream");
                  console.log(membersWebcam.childNodes[0]);
                  membersWebcam.childNodes[0].srcObject = remoteStream;
                  console.log(remoteStream);
                }
              );
            });
          } else {
            this.call = this.answeringCall;
            this.call.answer(stream); // Answer the call with an A/V stream.
          }
        })
        .catch(function (err) {
          console.log("An error occurred: " + err);
        });
    },
    endVideoCall() {
      this.$emit("stop-video-chat");
      this.stopWebcamAndMicrophone(this.srcStream);
      this.stopWebcamAndMicrophone(this.contactStream);
      this.currentCall.close();
    },
    // stop only mic
    changeWebcamStatus(stream) {
      this.hasTurnedOffWebcam = !this.hasTurnedOffWebcam;
      stream.getVideoTracks()[0].enabled = !this.hasTurnedOffWebcam;
    },
    changeMicrophoneStatus(stream) {
      this.hasTurnedOffMicrophone = !this.hasTurnedOffMicrophone;
      stream.getAudioTracks()[0].enabled = !this.hasTurnedOffMicrophone;
    },
    stopWebcamAndMicrophone(stream) {
      stream.getTracks().forEach(function (track) {
        track.stop();
      });
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
