Event Manager Backend
===

This project will handle a REST API to handle events: Create, update, remove and list.

From Firebase, we will use:

* Authentication
* Firestore
* Storage

Dependencies
===

For this application, we are using Nodejs v18. (You will check .nvmrc file)

For MacOS:

```bash
brew install nvm
nvm install v18
```

Local Development
===

For local develpment, you should copy .env.example and use environment variables according to the env.

| Key                   | Description                                                                     |
|:----------------------|:--------------------------------------------------------------------------------|
| **PRIVATE_KEY_ID:**     | Project Id according Firebase (**mandatory**). |
| **PRIVATE_KEY:** | Unique identifer for Project in Firebase |
| **CLIENT_EMAIL:**     | Email created by Firebase for GService account |
| **CLIENT_ID:**          | Identifier for client connection |
| **CLIENT_CERT_URL:**          | Cert URL for Google identification |

Finally, use the following command to run the application

```bash
yarn start
```

If you need to reload the application on each change, use the following command

```bash
yarn dev
```

Folder structure
===

services: This folder will group all services
models: This folder will group all models
controllers: This folder will group all endpoints available for the application
providers: this folder group all data providers for the application. In this case: firebase
services-config: this folder have the api keys for firebase
tests: this folder group all unit tests

Examples of  available endpoints
===

```
- get http://localhost:5001/api/healthcheck/
- get http://localhost:5001/api/users
- get http://localhost:5001/api/users/:id
- post http://localhost:5001/api/users/
- put http://localhost:5001/api/users/:id
- delete http://localhost:5001/api/users/:id
```

For Debugging
===

On MacOS, if you use nvm within a specific version, please add the following:

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/index.js",
      "runtimeExecutable": "${env:HOME}/.nvm/versions/node/{Specific version}/bin/node"
    }
  ]
}
```

Note: After using login endpoint, add Authorization key for each request with login token's content.
