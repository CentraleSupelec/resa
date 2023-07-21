# Resa back-end

## Environments

For resa to work you need:

- a CAS server
- an OpenPortal database
- a mail (SMTP) server

## Setup

### Prerequesites

You will need git and yarn (or npm, but yarn is used during deployment).

### Cloning project

Clone (with master branch)

```console
git clone 
cd back
```

### Mongo

With a global installation:

- [Install mongo globally](https://docs.mongodb.com/manual/installation/)
- Start mongo service: run `mongod`
- Connect to mongo service: run `mongo`

Alternatively, using docker:

- Install docker and run it (for instance through the Docker Desktop app, or through the `dockerd` command)
- Start mongo service: `docker run --rm -p 27017:27017 -d -v ~/data:/data/db --name mongodb mongo`
- Connect to mongo service: `docker run -it --link mongodb:mongo --rm mongo mongo --host mongo`

Alternatively, using docker-compose:

- Start docker containers `docker-compose up -d`
- Connect to mongo service with mongosh `docker exec -it resa-mongo mongosh`

Then create the user `resa` on the database, this is the express application user:

```mongodb
use resa;
db.createUser({ user: <mongo username>, roles: ["readWrite"], pwd: <mongo password> });
```

To add yourself as an admin for resa, and after connecting to mongo:

```mongo
use resa;
db.admins.insert({
  id: "<your openportal id>",
  firstName: "<your openportal first name>",
  lastName: "<your openportal last name>",
  email: "<your openportal email>",
  permissions: ["SUPER_ADMIN"]
})
```

You may now close the connection to the mongo shell.

### Configuring

Create `src/config/config-<env>.js` (env should be one of: prod, pre-prod, dev and must be set in the .env file):

```js
// eslint-disable-next-line
const secrets = require("./secrets");

module.exports = {
  defaultOwnUrl: "<resa-base-url>",
  defaultCas: {
    rscUrl: "https://<your-cas-url>/cas/p3/serviceValidate",
    service: "https://<resa-base-url>/loginAccept/",
  },
  webservice: { // All of these settings should end in .asmx?wsdl
    sessionurl: 
      "<openportal-session-url>",
    agendaurl:
      "<openportal-agenda-url>",
    annuaireurl:
      "<openportal-annuaire-url>",
    user: "u.webservices",
    password: secrets.prod.webservicePassword,
  },
  geodeDSClient: secrets.prod.geodeDSClient,
  geodeDSRoot: "https://geode-ds.centralesupelec.fr",
  jwt: {
    secret: secrets.prod.jwtSecret,
  },
  cypher: {
    salt: secrets.prod.cypherSalt,
    tokenSecret: secrets.prod.tokenSalt,
  },
  smtp: { // SMTP server used for sending confirmation email after a reservation
    host: "",
    port: "",
  },
  sender_email: '"<Email name>" <email@email.com>',
  adminEmail: "",
  ccEmail: "",
  server: {},
  public: {},
  db: secrets.prod.db,
};

```

Create `src/config/secrets.json`:

```json
{
  "dev": {
    "geodeDSClient": {
      "id": "<id geodeDSClient (in gitlab's CI/CD secret tokens)>",
      "secret": "<secret geodeDSClient (in gitlab's CI/CD secret tokens)>"
    },
    "db": {
      "host": "localhost",
      "name": "resa",
      "username": "<mongo username>",
      "password": "<mongo password>"
    },
    "geodeUser": {
      "id": "<your openportal id>",
      "firstName": "<your openportal first name>",
      "lastName": "<your openportal last name>",
      "email": "<your openportal email>"
    },
    "webservicePassword": "<password for openportal (in gitlab's CI/CD secret tokens)>",
    "jwtSecret": "<random string to hash jwts>",
    "cypherSalt": "<random string to cypher token for room reservation for delegates>",
    "tokenSalt": "<random string to generate random strings for token>"
  }
}
```

### Node dependencies

Install yarn and the install Node.js dependencies in the repository local directory:

```console
$ yarn
```

### DNS Redirection

Depending of the settings of your CAS server, you may have to add a DNS redirection of your `localhost` to allow the server to connect to the CAS when in local developpement. And so you should add in `/etc/hosts`:

`127.0.0.1 localhost.<domain-your-cas-accept>`

## Launch

Ensure the mongo service is running:

- if installed globally:

```console
$ mongod
```

- if using docker:

```console
$ yarn mongo-docker-start
```

Launch the app (see port default setting in `bin/www` file):

```console
$ yarn dev
```
## Other scripts

Connect to the mongo shell:

```console
$ yarn mongo-docker-shell
```

## Docker setup

Two dockerfiles are available for both backend and frontend.

### Backend setup

Create the secrets.json file in the folder config and fill it to match the config.js file (this app was designed to mount this file as a kubernetes secret, but you can keep the syntax anyway).
In the folder back run : ``` docker build -t backend .``` puis ``` docker run -p 3001:3001 backend```

## A note on GEODE translation

The files under `back/webservice/translatorConfig` tell resa back-end how to translate the data received from the OpenPortal's SOAP API. One can inspect openportal's "Ressources > Communautés" web page to find the data structure and ids describing the rooms.

Ids will depend on the OpenPortal configuration, and thus vary between bacasable and gestion OpenPortal servers.

## Managed rooms

Groups that manage/authorize certain room bookings have to be declared in `webservice/translatorConfig-prod.json` (see following example) with their corresponding Geode numeric value.

```json
"belongsTo": {
      "CodPro": "<belongsTo-code>",
      "ValPro": {
        "<group-id>": {
          "groupId": <group-id>,
          "label": "<group-name>"
        },
      }
}
```

## Videoconferencing

Here is the actual behavior:

- some rooms have a videoConference boolean, indicating if they provide a videoconference service at all
- another property, called videoProviders, specifies a list of enabled providers (WebEx, Teams...)
- when a booking is created with a videoconference resource, the selected videoProvider is sent from the front to the back
- then the back calls GeodeDS to create a videoconference with this provier, returning the accessDetails text that will be sent by email (sometimes the booking needs to be validated by the room manager, so the call to GeodeDS and the email are not sent straight away)

## MongoDB collections

### meetings

The meetings collection is used to maintain a mapping between Geode eventId and the videoconferencing meetingId (allocated through Geode DS).

If the event is deleted on Geode, the corresponding meetingId has to be deallocated on Geode DS.
