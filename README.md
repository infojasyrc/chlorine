Event Manager Backend
===

This project will handle a REST API to handle events: Create, update, remove and list.

From Firebase, we will use:

* Authentication
* Firestore
* Storage

Dependencies
===

For this application, we are using Nodejs v10. (You will check .nvmrc file)

For MacOS:

```
- brew install nvm
- nvm install v10
```

Local Development with reload
===

```
- npm run dev
```

Local Development
===

```
- npm run start
```

Available endpoints for local development
===

```
- get http://localhost:5001/api/healthcheck/
- get http://localhost:5001/api/users
- get http://localhost:5001/api/users/:id
- post http://localhost:5001/api/users/
- put http://localhost:5001/api/users/:id
- delete http://localhost:5001/api/users/:id
```

Folder structure
===

services: This folder will group all services
models: This folder will group all models
api: This folder will group all functions to handle the enpoints.

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
