# Node: Admin-Panel BigDeal Backend

## Folder Structure (src/)

| Directory      | Description                                                                         |
| -------------- | ----------------------------------------------------------------------------------- |
| `/common`      | cosntants and utilities (e.g. Routing Paths, commonResponses, sendEmail)            |
| `/config`      | Database Setup, environment variables, logger (e.g. connectDB, logger)              |
| `/helpers`     | Different HTTP Ports adn messages (e.g. StatuCodes, StatusMessage)                  |
| `/middlewares` | JWTToken setup (e.g. Authentication, )                                              |
| `/user`        | User Module (e.g. handlers, routing, queries, dbschema,validationschema, services ) |

### Requirements

- Node.js 12+ & NPM 6
- MongoDB
- MongoDB Compass

### Environment Variables

There are some environment variables that you need to define inside `.env` file in the project.

```
PORT=PORT
LOG_ENV=LOG_ENV
DATABASE_URL=DATABASE_URL
ACCESS_TOKEN_EXPIRES_IN=ACCESS_TOKEN_EXPIRES_IN
ALGORITHM=ALGORITHM
FROM_EMAI=FROM_EMAIL
EMAIL_USERNAME=EMAIL_USERNAME
EMAIL_PASSWORD=EMAIL_PASSWORD
EMAIL_PORT=EMAIL_PORT
EMAIL_HOST=EMAIL_HOST
```

### Commands

```terminal
# install dependencies for backend
$ npm install

# run backend- for run in production
$ npm run dev

# run backend - for run in development
$ npm run start

# run test
$ npm run test
```
