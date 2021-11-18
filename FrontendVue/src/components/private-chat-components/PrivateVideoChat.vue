<template>
  <div class="video-chat">
    <div class="video">
      <video ref="srcVideo" autoplay="true" muted id="userWebcam"></video>
      <video ref="contactVideo" autoplay="true" id="contactWebcam"></video>
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
          style="color: red; margin-left: -3px;"
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
          style="color: red; margin-left: -1px;"
        ></i>
        <i v-else class="fas fa-video"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeContactPeerId: {
      type: String,
    },
    isCaller: {
      type: Boolean,
    },
    peer: {
      default: null,
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
      contactStream: null,
      call: null,
    };
  },
  methods: {
    async startVideoChat() {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          let userWebcam = this.$refs.srcVideo;
          let peer = this.peer;
          let contactWebcam = this.$refs.contactVideo;
          this.srcStream = stream;
          userWebcam.srcObject = stream;
          userWebcam.play();

          if (this.isCaller) {
            this.call = peer.call(this.activeContactPeerId, stream);
          } else {
            this.call = this.answeringCall;
            this.call.answer(stream); // Answer the call with an A/V stream.
          }

          this.call.on("stream", function (remoteStream) {
            // Show stream in some video/canvas element.
            contactWebcam.srcObject = remoteStream;
            contactWebcam.play();
          });
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
  mounted() {
    this.startVideoChat();
  },
};
</script>
<style scoped>
.btn{
  width: 40px;
  margin-right: 5px;
}
</style>