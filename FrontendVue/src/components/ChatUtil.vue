<template>
  <div class="input-group" style="width: 260px; margin: auto; border-bottom: 1px solid #eaeaea;">
    <b-button-group>
      <b-input-group class="mb-2">
        <b-input-group-prepend is-text>
          <b-icon icon="search"></b-icon>
        </b-input-group-prepend>
        <b-form-input type="search" placeholder="Search contact"></b-form-input>
      </b-input-group>
      <b-icon
        v-b-tooltip.hover
        title="create new group"
        id="create-group"
        style="width: 40px; height: 40px; margin-left: 5%"
        variant="primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        icon="people-fill"
      ></b-icon>
    </b-button-group>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Create New Group Contact
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label"
                  >Group Name</label
                >
                <input
                  type="text"
                  class="form-control"
                  :id="`group-${groupName}`"
                  v-model="groupName"
                />
                {{ groupName }}
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label"
                  >Member</label
                >
                <ul
                  class="list-group"
                  v-for="friend in user.friendlist"
                  :key="friend.username"
                >
                  <li class="list-group-item">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :value="friend.username"
                        :id="friend.username"
                        v-model="friendToAddToGroups"
                      />
                      <label class="form-check-label" :for="friend.username">{{
                        friend.name
                      }}</label>
                      <b-avatar
                        variant="info"
                        :src="friend.avatar"
                        class="mr-3"
                      ></b-avatar>
                    </div>
                  </li>
                </ul>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              style="width: 30%"
              type="button"
              class="btn btn-primary"
              @click="groupName.length > 0 ? createGroup() : null"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  props: {
    user: {
      type: Object,
    },
  },
  data() {
    return {
      groupName: "",
      friendToAddToGroups: [],
    };
  },
  methods: {
    addMembersToGroup(groupId) {
      if (this.friendToAddToGroups.length > 0) {
        this.friendToAddToGroups.forEach((friend) => {
          this.$apollo.mutate({
            mutation: gql`
              mutation AddUserToGroup($groupId: String!, $username: String!) {
                addUserToGroup(groupId: $groupId, username: $username) {
                  groupName
                  members {
                    username
                  }
                }
              }
            `,
            variables: {
              groupId,
              username: friend,
            },
          });
        });
      }
    },
    createGroup() {
      this.$apollo.mutate({
        mutation: gql`
          mutation CreateGroup($groupName: String!) {
            createGroup(groupName: $groupName) {
              _id
              groupName
              members {
                username
              }
            }
          }
        `,
        variables: {
          groupName: this.groupName,
        },
        update: (store, { data: { createGroup } }) => {
          this.addMembersToGroup(createGroup._id);
        },
      });
    },
  },
};
</script>

<style scoped></style>
