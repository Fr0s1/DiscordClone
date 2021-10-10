API List:

Base URL: http://localhost:8000/file/...

Group:

1. POST /groups/avatar: upload group avatar
   Use "enctype='multipart/form-data'"

   Example:
   <form enctype="multipart/form-data" method="post">
       <input type="file" name="groupAvatar" id="groupAvatar">
       <input type="text" name="groupId" id="groupId">
       <button type="submit">Send</button>
   </form>

    Value of "name" and "id" attribute in input tag must be the same as Example

2. GET /groups/{groupId}/avatar: get group avatar url

   groupId: id of group

User:

1. POST /users/avatar: upload user avatar

    <form enctype="multipart/form-data" method="post">
       <input type="file" name="avatar" id="avatar">
       <input type="text" name="username" id="username">
       <button type="submit">Send</button>
   </form>
