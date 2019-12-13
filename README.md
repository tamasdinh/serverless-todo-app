# Serverless TODO app

## Table of Contents

* [Project Goals](#Project-goals)
* [How to run the application](#How-to-run-the-application)
* [Built with](#Built-with)
* [Author](#Author)

## Project goals

The goal of the project was to build a fully functional serverless backend to a todo management frontend. The serverless backend is implemented via the ```serverless``` framework on the ```AWS``` platform.

The frontend was provided in the course and is built using ```React```.

### Functionality of the application

This application allows creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.


## How to run the application

### Backend

To deploy an application you can run the following commands if you have serverless installed and configured to your AWS account. However, the client app is configured to use my own backend so you can try out the app by following the Frontend instructions below.

```
cd backend
npm install
sls deploy -v
```

## Frontend
Clone the repo, then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

__```ENJOY!```__

## Built With

* ```Javascript``` - :)
* [Node.js and Node Package Manager](https://nodejs.org/en/) - for handling dependencies and project configuration
* [Serverless](https://serverless.com) - Configuration and deployment framework that makes serverless app development much easier than using e.g. AWS CloudFormation. Works with multiple cloud service providers.
* [Auth0](https://auth0.com) - external authentication service used.


## Author

* **Tamas Dinh** - [LinkedIn profile](https://www.linkedin.com/in/tamasdinh/)
