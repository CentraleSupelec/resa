const config = {
  cas: {
    loginUrl: process.env.REACT_APP_CAS_LOGIN_URL,
    logoutUrl: process.env.REACT_APP_CAS_LOGOUT_URL,
    loginService:
      window.location.protocol +
      '//' +
      window.location.hostname +
      process.env.REACT_APP_CAS_LOGIN_SERVICE,
    logoutService:
      window.location.protocol +
      '//' +
      window.location.hostname +
      process.env.REACT_APP_CAS_LOGOUT_SERVICE,
  },
  altCas: {
    loginUrl: process.env.REACT_APP_ALT_CAS_LOGIN_URL,
    logoutUrl: process.env.REACT_APP_ALT_CAS_LOGOUT_URL,
    loginService:
      window.location.protocol +
      '//' +
      window.location.hostname +
      process.env.REACT_APP_ALT_CAS_LOGIN_SERVICE,
    logoutService:
      window.location.protocol +
      '//' +
      window.location.hostname +
      process.env.REACT_APP_ALT_CAS_LOGOUT_SERVICE,
  },
  back: {
    url:
      window.location.protocol +
      '//' +
      window.location.hostname +
      process.env.REACT_APP_BACK_URL,
  },
  altBack: {
    url:
      window.location.protocol +
      '//' +
      window.location.hostname +
      process.env.REACT_APP_ALT_BACK_URL,
  },
  imagesBaseURL:
    window.location.protocol + '//' + window.location.hostname + '/roomImages/',
};

export default config;
