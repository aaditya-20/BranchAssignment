# Branch International

## Additional Feature Implemented

- Scheme to Divide Work : Added a get slot feature where agent can directly get there query slot to resolve, no need of agent to surf over queries and no chance of duplicacy.
- Implemented Search : Search functionality is implemented using Regex so as to have pattern matching
- Integrated Websocket : Socket.io is use to realtime ask query and resolve query on real time

## How to setup project

- Clone the project and then change your directory
  ```
  git clone https://github.com/Brax-1/BranchInternational.git
  cd BranchInternational
  ```
- Make sure you have node lts version(18.10.0) installed

### SetUp Server
- Install node modules
  ```
  cd server
  npm i
  npm start : To start backend
  ```
### SetUp Web
- Install node modules
  ```
  cd web
  npm i
  npm start : To start front end
  ```
- install dependencies & Start project both frontend and backend
  ```
### Start just Backend api
  ```
  cd server
  npm start
  ```
### Start just frontend
  ```
  cd web
  npm start
  open link in url after successfull project running : http://localhost:3000/
  ```
- Suggestion to use postman to test api routes

