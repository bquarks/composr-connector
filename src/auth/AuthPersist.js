class AuthPersist {
  constructor() {
    this.getRememberFromStorage();
    this.getTokensFromStorage();
  }

  /////////////////
  // Private API //
  /////////////////

  /**
   * Adds data to localStorage
   *
   * @param {Object} data
   */
  _addLocalStorage(data) {
    if (this.remember) {
      window.localStorage.remember = true;
      window.localStorage.refreshToken = data.refreshToken;
    }
    if (data.deviceId) {
      window.localStorage.deviceId = data.deviceId;
    }
    window.localStorage.accessToken = data.accessToken;
    window.localStorage.expiresAt = data.expiresAt;

  }

  /**
   * Adds data to sessionStorage
   *
   * @param {Object} data
   */
  _addSessionStorage(data) {

    if (this.remember) {
      window.sessionStorage.remember = true;
    }
    if (data.deviceId) {
      window.sessionStorage.deviceId = data.deviceId;
    }
    window.sessionStorage.refreshToken = data.refreshToken;
    window.sessionStorage.accessToken = data.accessToken;
    window.sessionStorage.expiresAt = data.expiresAt;

  }

  /**
   * Removes auth data from localStorage
   */
  _removeLocalStorage() {
    window.localStorage.removeItem('refreshToken');
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('expiresAt');
    window.localStorage.removeItem('remember');
    window.localStorage.removeItem('deviceId');
  }

  /**
   * Removes auth data from sessionStorage
   */
  _removeSessionStorage() {
    window.sessionStorage.removeItem('refreshToken');
    window.sessionStorage.removeItem('accessToken');
    window.sessionStorage.removeItem('expiresAt');
    window.sessionStorage.removeItem('remember');
    window.sessionStorage.removeItem('deviceId');
  }

  _removeUserCookie(cookieName) {
    document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  _getDeviceIdFromStorage() {
    const deviceId = window.sessionStorage.deviceId ||
      window.localStorage.deviceId;
    return deviceId;
  }

  _getUserAccessToken() {
    const sessionStorageToken = {
      accessToken: window.sessionStorage.accessToken,
      expiresAt: parseInt(window.sessionStorage.expiresAt)
    };

    const localStorageToken = {
      accessToken: window.localStorage.accessToken,
      expiresAt: parseInt(window.localStorage.expiresAt)
    };

    let mostRecentToken = {};

    if (!isNaN(sessionStorageToken.expiresAt) && !isNaN(localStorageToken.expiresAt)) {
      mostRecentToken = sessionStorageToken.expiresAt > localStorageToken.expiresAt ? sessionStorageToken : localStorageToken;
      return mostRecentToken;
    }

    mostRecentToken = isNaN(sessionStorageToken.expiresAt) ? localStorageToken : sessionStorageToken;

    return mostRecentToken;
  }

  _getUserTokens() {
    const refreshToken =  window.sessionStorage.refreshToken ||
      window.localStorage.refreshToken;
    const { accessToken, expiresAt } = this._getUserAccessToken();
    const userTokens = {
      refreshToken,
      accessToken,
      expiresAt
    };

    return userTokens;
  }

  _getClientAccessToken() {
    let accessToken = window.sessionStorage.clientAccessToken;;
    let expiresAt = window.sessionStorage.clientExpiresAt;

    return { accessToken, expiresAt };
  }

  ////////////////
  // Public API //
  ////////////////

  /**
   * Persist client accessToken
   */
  persistClientToken(data) {
    let { accessToken, expiresAt } = data;

    window.sessionStorage.setItem('clientAccessToken', accessToken);
    window.sessionStorage.setItem('clientExpiresAt', expiresAt);

    this.tokens.client = {
      accessToken,
      expiresAt
    };
  }

  /**
   * Stores result auth data in local & session storage
   *
   * @param  {Object} data [accessToken, refreshToken, remember]
   */
  persistAuthData(data) {
    const { accessToken, refreshToken, expiresAt, deviceId } = data;

    if (this.remember) {
      this._addLocalStorage(data);
      this._addSessionStorage(data);

    } else {
      // Not saving in localstorage if user doesnt check remember option
      // When browser is closed, user is logged out
      this._addSessionStorage(data);
    }

    this.tokens.user = {
      accessToken,
      refreshToken,
      expiresAt
    };

    this.tokens.deviceId = deviceId;

    return true;
  }

  getRememberFromStorage() {
    const remember = window.sessionStorage.getItem('remember') ||
      window.localStorage.getItem('remember');
    this.remember === 'true';
  }

  getTokensFromStorage() {
    let tokens = {
      client: this._getClientAccessToken(),
      user: this._getUserTokens(),
      deviceId: this._getDeviceIdFromStorage()
    };
    this.tokens = tokens;

    return tokens;
  }
}

export default AuthPersist;
