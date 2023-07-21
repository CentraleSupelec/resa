const config = {
  cas: {
    loginUrl: process.env.REACT_APP_CAS_LOGIN_URL,
    logoutUrl: process.env.REACT_APP_CAS_LOGOUT_URL,
    loginService: process.env.REACT_APP_CAS_LOGIN_SERVICE,
    logoutService: process.env.REACT_APP_CAS_LOGOUT_SERVICE,
  },
  altCas: {
    loginUrl: process.env.REACT_APP_ALT_CAS_LOGIN_URL,
    logoutUrl: process.env.REACT_APP_ALT_CAS_LOGOUT_URL,
    loginService: process.env.REACT_APP_ALT_CAS_LOGIN_SERVICE,
    logoutService: process.env.REACT_APP_ALT_CAS_LOGOUT_SERVICE,
  },
  back: {
    url: process.env.REACT_APP_BACK_URL,
  },
  altBack: {
    url: process.env.REACT_APP_ALT_BACK_URL,
  },
  imagesBaseURL: process.env.REACT_APP_IMAGES_BASE_URL,
};

export default config;
