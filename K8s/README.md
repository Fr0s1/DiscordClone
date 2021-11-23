These are all K8s manifest files to create GraphQL, SocketIO and Express File server along with Services, Ingress, ...

For Pod to run correctly, create ConfigMap resource and set appropiate env variables in deployment YML files

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: discord-backend-configmap
  namespace: discord-backend
data:
  BUCKET_NAME: 
  FILE_SERVER_ENDPOINT: 
  region: 
  cognitoUserPoolId: 
  tokenUse: access
  tokenExpiration: 
  mongodb_database: 
  mongodb_host: 
  mongodb_port: 
  redisHost: 
  redisPort: 
  redisKeyExpireTime: 
  ENV: AWS
  AWS_SecretName: 
  SECRETS_STORE_PATH: 
  frontend_endpoint: 
```
