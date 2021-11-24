<template>
  <div class="input-group" style="margin-bottom: 20px">
    <b-button-group>
      <b-input-group class="mb-2">
        <b-input-group-prepend is-text>
          <b-icon icon="search"></b-icon>
        </b-input-group-prepend>
        <b-form-input type="search" placeholder="Search contact"></b-form-input>
      </b-input-group>
      <b-icon v-b-tooltip.hover title="create new group" id="create-group" style="width: 40px; height: 40px; margin-left:5%" variant="primary" data-bs-toggle="modal" data-bs-target="#exampleModal" icon="people-fill"></b-icon> 
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
                  id="exampleFormControlInput1"
                />
              </div>
              <div class="mb-3" style="height: 155px; overflow-y: auto">
                <label for="exampleFormControlInput1" class="form-label"
                  >Member</label
                >
                <ul
                  class="list-group"
                  v-for="list in user.friendlist"
                  :key="list.username"
                >
                  <li class="list-group-item">
                    <div class="form-check">
                      <input
                        style="line-height: 75px"
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                      />
                      <b-avatar
                        variant="info"
                        :src="list.avatar"
                        class="mr-3"
                      ></b-avatar>
                      <span class="form-check-label" for="flexCheckDefault">{{
                        list.name
                      }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button style="width: 30%" type="button" class="btn btn-primary">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
props: {
    user: {
      friendlist: Array
    },
    
  },
}
</script>

<style scoped>
#create-group {
  cursor: pointer;
}

#people-list-content::-webkit-scrollbar {
  width: 1px;
  background-color: #f5f5f5;
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
</style>
