<template>
  <!-- Button trigger modal -->
  <button
    type="button"
    class="btn btn-outline-primary"
    data-toggle="modal"
    data-target="#addFriendsToGroup"
    @click="getUserFriendlist"
  >
    <i class="far fa-address-book"></i>
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="addFriendsToGroup"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">
            Add Friend To Group
          </h5>
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

  <button
    type="button"
    class="btn btn-outline-primary"
    data-toggle="modal"
    data-target="#removeMembersFromGroup"
    @click="getUserFriendlist"
    v-if="groupAdmin && currentUsername === groupAdmin.username"
  >
    <i class="fa fa-meteor"></i>
  </button>

  <!-- Modal -->
  <div
    class="modal fade"
    id="removeMembersFromGroup"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Remove Members</h5>
        </div>

        <div class="modal-body">
          <ul v-if="groupMembers">
            <li v-for="(member, index) in groupMembers" :key="index">
              <input
                class="form-check-input"
                type="checkbox"
                :value="member.username"
                :id="`members-${member.username}`"
                v-model="membersToRemove"
              />
              <label
                class="form-check-label"
                :for="`members-${member.username}`"
              >
                {{ member.name }}
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
            @click="removeMembersFromGroup"
          >
            Remove Members
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
    groupAdmin: {
      type: Object,
    },
    groupMembers: {
      type: Array,
    },
  },
  data: {
    friendsToAdd: [],
    membersToRemove: [],
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
    removeMembersFromGroup() {
      if (this.membersToRemove.length > 0) {
        this.membersToRemove.forEach((member) => {
          this.$apollo.mutate({
            mutation: gql`
              mutation RemoveUserFromGroup(
                $groupId: String!
                $username: String!
              ) {
                removeUserFromGroup(groupId: $groupId, username: $username) {
                  groupName
                  members {
                    username
                  }
                }
              }
            `,
            variables: {
              groupId: this.activeGroupId,
              username: member,
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
