Event Manager Backend
===

This project will handle a REST API to handle events: Create, update, remove and list.

From Firebase, we will use:

* Authentication
* Cloud Firestore database
* Storage
* Functions

Dependencies
===

For this application, we are using Nodejs v8.15.0. (You will check .nvmrc file)

For MacOS:

```
- brew install nvm
- nvm install v8.15.0
```

For Windows:

```
- choco install nvm
- nvm install v8.15.0
```

Local Development
===

```
- node index.js
```

Available endpoints for local development
===

using ```node index.js```
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

database: This folder will group all database functions
api: This folder will group all functions to handle the enpoints.

For Debugging
===

Add the following information for launch.json in .vscode folder

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/index.js"
    }
  ]
}
```

However, on MacOS, if you use nvm within a specific version, please add the following:

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/index.js",
      "runtimeExecutable": "${env:HOME}/.nvm/versions/node/v8.15.0/bin/node"
    }
  ]
}
```

Note: After using login endpoint, add Authorization key for each request with login token's content.
