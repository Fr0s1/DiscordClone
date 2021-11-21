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
      try {
        this.srcStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        let userWebcam = this.$refs.srcVideo;
        let peer = this.peer;
        let contactWebcam = this.$refs.contactVideo;
        userWebcam.srcObject = this.srcStream;
        userWebcam.play();

        if (this.isCaller) {
          this.call = peer.call(this.activeContactPeerId, this.srcStream);
        } else {
          this.call = this.answeringCall;
          this.call.answer(this.srcStream); // Answer the call with an A/V stream.
        }

        this.call.on("stream", function (remoteStream) {
          // Show stream in some video/canvas element.
          this.contactStream = remoteStream;
          contactWebcam.srcObject = remoteStream;
          contactWebcam.play();
        });
      } catch (e) {
        console.log(e);
      }
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
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !this.hasTurnedOffWebcam;
      });
    },
    changeMicrophoneStatus(stream) {
      this.hasTurnedOffMicrophone = !this.hasTurnedOffMicrophone;
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !this.hasTurnedOffMicrophone;
      });
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
.btn {
  width: 40px;
}

.video {
  display: flex;
  margin: auto;
  justify-content: center;
}

.control-buttons {
  display: flex;
  margin: auto;
  align-items: flex-end;
  justify-content: center;
}
</style>
