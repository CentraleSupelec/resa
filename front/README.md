# Resa front-end

## Setup

### Prerequisites

Check first resa back-end repository README for the software dependencies and accounts creation needed.

Launching and testing the front-end locally requires running the resa back-end, and a correct configuration to other services (CAS, geode, mail server).

### Configuring

You can make three different configuration files for dev, pre-prod and prod environments. See `config-env.js.example` to make your configuration file, rename it in `config-prod.js`, `config-preprod.js` or `config-dev.js` and move it in the folder `src/config`. You can have these three config files in the same time in `src/config`. The file `src/config/index.js` choose the right one according to `REACT_APP_ENV` environment variable.

- by default, authentication uses Central Authentication Service (CAS). You may need to authorize Resa's URLs on your CAS server for authentication to work
- a static asset server can be used to serve images of rooms. The image for room with id `resourceId` will be fetched from `${config.imagesBaseURL}${resourceId}` ; if a 404 is received, there will be a silent error and no image nor any error will be displayed. Leave `config.imagesBaseURL` blank is you do not want to use this feature
- LocalStorage is used to store the user's full name and the JWT token that authenticates his back-end requests

### Node dependencies

Install yarn and the install Node.js dependencies in the repository local directory:

```console
$ yarn
```

## Generate local certificates

Check the mkcert utility (or prefer using openssl directly): See also:
https://github.com/FiloSottile/mkcert

On Mac OS:

```
$ mkcert -key-file ./certs/server.pem -cert-file ./certs/server.pem "resa-dev.hostname.fr"
$ cp certs/server.pem node_modules/webpack-dev-server/ssl/
```

Then restart the dev server. If node_modules is erased, redo the last command above.

If additional granting is needed, check in the browser: Developer tools -> security -> import certificate -> double click -> enable/trust. Or prefer using the certificates OS granting tool (System keychain in Mac OS) directly and double click the certificates to grant permissions.

It may be necessary to manually goes to http://resa-dev.hostname.fr:3001/api and accept the certificate, so that the front-end can communicate with the back-end.

## Launch

By default, the front-end listens on port 80 so you will need `sudo` to assign that port:

```
sudo yarn dev
```

### Debug

One may install redux-devtools-extension to the browser in use (check `configureStore.js` file).