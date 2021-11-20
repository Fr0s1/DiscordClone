<template>
  <!-- Button trigger modal -->
  <button
    type="button"
    class="btn btn-outline-primary"
    data-toggle="modal"
    data-target="#exampleModalCenter"
    @click="getUserFriendlist"
  >
    <i class="far fa-address-book"></i>
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModalCenter"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Add Friend To Group</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <ul v-if="friendlist">
            <li v-for="(friend, index) in friendlist" :key="index">
              <input
                class="form-check-input"
                type="checkbox"
                :value="friend.username"
                :id="friend.username"
                v-model="friendsToAdd"
              />
              <label class="form-check-label" :for="friend.username">
                {{ friend.name }}
              </label>
            </li>
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-dismiss="modal"
            @click="addUserToGroup"
          >
            Add user
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  inject: ["currentUsername"],
  props: {
    friendlist: {
      type: Array,
    },
    activeGroupId: {
      type: String,
    },
  },
  data: {
    friendsToAdd: [],
  },
  methods: {
    addUserToGroup() {
      if (this.friendsToAdd.length > 0) {
        this.friendsToAdd.forEach((friend) => {
          this.$apollo.mutate({
            mutation: gql`
              mutation Mutation($groupId: String!, $username: String!) {
                addUserToGroup(groupId: $groupId, username: $username) {
                  members {
                    username
                  }
                }
              }
            `,
            variables: {
              groupId: this.activeGroupId,
              username: friend,
            },
          });
        });
      }
    },
  },
};
</script>

<style scoped>
.btn.btn-outline-primary {
  text-align: center;
  margin-right: 5px;
  width: 40px;
  height: 40px;
}
.fade:not(.show) {
  opacity: 1;
}

.modal-body {
  text-align: left;
}
</style>
