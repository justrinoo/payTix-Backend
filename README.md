## payTix

### Documentation

See the application endpoint documentation on postman [View Documentation](https://documenter.getpostman.com/view/10726334/UUxzA7Hc)

#### Note : Select Environment Postman, choose <b>Ticketing</b>

## Installation

<b>payTix</b> requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd payTix-Backend
npm i
npm run dev
```

### Set Up Configuration

Set up configuration for the .env Environment

Create a .env file in the root directory of your project, For Example:

```sh
DB_HOST=yourhost
DB_USER=youruser
DB_PASS=yourpassword
DB_NAME=yourDatabaseName

JWT_SECRET=yourSecretJWT
JWT_EXPIRED=24h

HOST_SMTP=smtp.gmail.com
PORT_SMTP=465
EMAIL_AUTH=yourEmailActiveInGmail
PASS_AUTH=yourPasswordEmail
EMAIL_FROM=fromEm
```
