```
.
├── BackendNodejs
│   ├── Dockerfile
│   ├── README.md
│   ├── env
│   ├── package-lock.json
│   ├── package.json
│   └── src
│       ├── aws
│       │   └── index.js
│       ├── graphql
│       │   ├── directives
│       │   │   └── deprecatedDirective.js
│       │   ├── resolvers
│       │   │   ├── GroupChat.js
│       │   │   ├── GroupMessage.js
│       │   │   ├── Message.js
│       │   │   ├── Mutation.js
│       │   │   ├── Query.js
│       │   │   ├── Subscription.js
│       │   │   └── User.js
│       │   ├── scalars
│       │   │   └── Date.js
│       │   └── schema.graphql
│       ├── mongodb
│       │   └── schemas
│       │       ├── FriendRequest.js
│       │       ├── Group.js
│       │       ├── GroupMessage.js
│       │       ├── Message.js
│       │       ├── User.js
│       │       └── index.js
│       └── server.js
├── ChatServer
│   ├── Dockerfile
│   ├── README.md
│   ├── env
│   ├── package-lock.json
│   ├── package.json
│   └── src
│       ├── aws
│       │   └── s3.js
│       ├── controllers
│       │   ├── groupmessage.controller.js
│       │   ├── message.controller.js
│       │   └── user-session.controller.js
│       ├── models
│       │   ├── Group.js
│       │   ├── GroupMessage.js
│       │   ├── Message.js
│       │   ├── User.js
│       │   └── index.js
│       ├── redis
│       │   └── redisClient.js
│       ├── routes
│       │   ├── groupmessage.route.js
│       │   ├── message.route.js
│       │   └── user-session.route.js
│       └── server.js
├── FilesServer
│   ├── Dockerfile
│   ├── README.md
│   ├── env
│   ├── package-lock.json
│   ├── package.json
│   └── src
│       ├── aws
│       │   └── s3.js
│       ├── controllers
│       │   ├── group.controller.js
│       │   ├── groupmessage.controller.js
│       │   ├── message.controller.js
│       │   └── user.controller.js
│       ├── models
│       │   ├── User.js
│       │   └── index.js
│       ├── redis
│       │   └── redisClient.js
│       ├── routes
│       │   ├── group.route.js
│       │   ├── groupmessage.route.js
│       │   ├── message.route.js
│       │   └── user.route.js
│       └── server.js
├── FrontendVue
│   ├── README.md
│   ├── amplify
│   │   ├── #current-cloud-backend
│   │   │   ├── amplify-meta.json
│   │   │   ├── api
│   │   │   ├── auth
│   │   │   │   └── realworldvuee96d13e1
│   │   │   │       └── parameters.json
│   │   │   ├── backend-config.json
│   │   │   ├── hosting
│   │   │   │   └── amplifyhosting
│   │   │   │       └── amplifyhosting-template.json
│   │   │   └── tags.json
│   │   ├── README.md
│   │   ├── backend
│   │   │   ├── amplify-meta.json
│   │   │   ├── api
│   │   │   ├── auth
│   │   │   │   └── realworldvuee96d13e1
│   │   │   │       └── parameters.json
│   │   │   ├── awscloudformation
│   │   │   │   ├── build
│   │   │   │   │   ├── awscloudformation
│   │   │   │   │   │   └── nested-cloudformation-stack.yml
│   │   │   │   │   └── hosting
│   │   │   │   │       └── amplifyhosting
│   │   │   │   │           └── amplifyhosting-template.json
│   │   │   │   └── nested-cloudformation-stack.yml
│   │   │   ├── backend-config.json
│   │   │   ├── hosting
│   │   │   │   └── amplifyhosting
│   │   │   │       └── amplifyhosting-template.json
│   │   │   └── tags.json
│   │   ├── cli.json
│   │   └── team-provider-info.json
│   ├── babel.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── index.html
│   │   └── logo.ico
│   └── src
│       ├── App.vue
│       ├── assets
│       │   ├── LoginBackground.png
│       │   ├── images
│       │   │   └── discord-logo.svg
│       │   ├── logo.png
│       │   └── styles
│       │       └── global.scss
│       ├── aws-exports.js
│       ├── components
│       │   ├── Chat.vue
│       │   ├── EditProfile.vue
│       │   ├── HelloWorld.vue
│       │   ├── SendMessage.vue
│       │   ├── UserProfile.vue
│       │   ├── groups-components
│       │   │   ├── GroupChatHistory.vue
│       │   │   ├── GroupList.vue
│       │   │   ├── GroupMembers.vue
│       │   │   └── GroupVideoChat.vue
│       │   ├── private-chat-components
│       │   │   ├── ChatHistory.vue
│       │   │   ├── ContactList.vue
│       │   │   └── PrivateVideoChat.vue
│       │   └── user
│       │       └── _id.vue
│       ├── config
│       │   └── index.js
│       ├── main.js
│       ├── router
│       │   └── index.js
│       └── views
│           ├── About.vue
│           └── Home.vue
├── K8s
│   ├── DiscordClone
│   │   ├── discord-clone-configmap.yaml
│   │   ├── discord-clone-ingress.yaml
│   │   ├── discord-clone-secret-provider-class.yml
│   │   ├── files-server-deployment.yaml
│   │   ├── files-server-service.yaml
│   │   ├── graphql-deployment.yaml
│   │   ├── graphql-services.yaml
│   │   ├── socket-io-deployment.yaml
│   │   ├── socket-io-service.yaml
│   │   └── socketio-stateful-set.yml
│   ├── LetsEncrypt
│   │   ├── letsencrypt-issuer-prod.yml
│   │   └── letsencrypt-issuer.yml
│   ├── Nginx
│   │   ├── nginx-ingress-controller.yml
│   │   └── nginx-tls-lb-termination.yml
│   ├── README.md
│   └── command.txt
├── README.md
├── amazon-eks-vpc-discord-clone.yaml
├── docker-compose-eks.yml
├── docker-compose-github.yml
├── docker-compose.yml
├── package-lock.json
└── package.json

61 directories, 126 files
```
