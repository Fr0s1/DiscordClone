<template>
  <div class="message-control-sender">
    <b-dropdown
      id="dropdown-1"
      class="m-md-2"
      toggle-class="text-decoration-none"
      no-caret
    >
      <template class="btn btn-outline-primary" #button-content>
        <i class="fas fa-ellipsis-h"></i>
      </template>
      <b-dropdown-item @click="deleteMessage(message._id, 'socketio')">
        Delete message
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
    },
  },
  methods: {
    deleteMessage(messageId, type) {
      if (type === "graphql") {
        // Delete message from messages list pre-fetched from GraphQL
        this.graphql_messages = this.graphql_messages.filter(
          (message) => message._id !== messageId
        );
      } else if (type === "socketio") {
        // Delete message from realtime messages array
        this.all_socketio_messages = this.all_socketio_messages.filter(
          (message) => message._id !== messageId
        );
      }

      // Delete message saved in database
      this.$apollo.mutate({
        mutation: gql`
          mutation DeleteMessage($messageId: String!) {
            deleteMessage(messageId: $messageId) {
              _id
            }
          }
        `,
        variables: {
          messageId,
        },
      });
    },
  },
};
</script>
