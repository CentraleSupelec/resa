# Resa front-end

## Setup

### Prerequisites

Check first resa back-end repository README for the software dependencies and accounts creation needed.

Launching and testing the front-end locally requires running the resa back-end, and a correct configuration to other services (CAS, geode, mail server).

### Configuring

On a local environment, you must overwrite the configuration by creating a local config file in `front/src/config/config-local.js`, as the default configuration is expected in Docker provided environment, witch is not supported with yarn for development :

```js
const config = {
  cas: {
    loginUrl: 'https://cas.example.com/cas/login',
    logoutUrl: 'https://cas.example.com/cas/logout',
    loginService:
      window.location.protocol +
      '//' +
      window.location.hostname +
      '/loginAccept/',
    logoutService:
      window.location.protocol + '//' + window.location.hostname + '/',
  },
  altCas: {
    loginUrl: 'https://altcas.example.com/cas/login',
    logoutUrl: 'https://altcas.example.com/cas/logout',
    loginService:
      window.location.protocol +
      '//' +
      window.location.hostname +
      '/loginAccept/',
    logoutService:
      window.location.protocol + '//' + window.location.hostname + '/',
  },
  back: {
    url:
      window.location.protocol + '//' + window.location.hostname + ':3001/api',
  },
  altBack: {
    url:
      window.location.protocol + '//' + window.location.hostname + ':3001/api',
  },
  imagesBaseURL:
    window.location.protocol + '//' + window.location.hostname + '/roomImages/',
};

export default config;
```

### Node dependencies

Install yarn and the install Node.js dependencies in the repository local directory:

```console
$ yarn
```

## Launch

By default, the front-end listens on port 80 so you will need `sudo` to assign that port:

```
sudo yarn dev
```

### Debug

One may install redux-devtools-extension to the browser in use (check `configureStore.js` file).
