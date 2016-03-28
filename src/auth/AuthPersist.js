class AuthPersist {
  constructor() {
    this.getRememberFromStorage();
    this.getTokensFromStorage();
  }

  /**
   * Stores result auth data in local & session storage
   *
   * @param  {Object} data [accessToken, refreshToken, remember]
   */
  _persistAuthData(data) {
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

  /**
   * Adds data to localStorage
   *
   * @param {Object} data
   */
  _addLocalStorage(data) {
    if (this.remember) {
      window.localStorage.setItem('remember', true);
      window.localStorage.setItem('refreshToken', data.refreshToken);
    }
    if (data.deviceId) {
      window.localStorage.setItem('deviceId', data.deviceId);
    }
    window.localStorage.setItem('accessToken', data.accessToken);
    window.localStorage.setItem('expiresAt', data.expiresAt);

  }

  /**
   * Adds data to sessionStorage
   *
   * @param {Object} data
   */
  _addSessionStorage(data) {

    if (this.remember) {
      window.sessionStorage.setItem('remember', true);
    }
    if (data.deviceId) {
      window.sessionStorage.setItem('deviceId', data.deviceId);
    }
    window.sessionStorage.setItem('refreshToken', data.refreshToken);
    window.sessionStorage.setItem('accessToken', data.accessToken);
    window.sessionStorage.setItem('expiresAt', data.expiresAt);

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

  removeUserCookie(cookieName) {
    document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

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

  getRememberFromStorage() {
    const remember = window.sessionStorage.getItem('remember') ||
      window.localStorage.getItem('remember');
    this.remember === 'true';
  }

  _getDeviceIdFromStorage() {
    const deviceId = window.sessionStorage.getItem('deviceId') ||
      window.localStorage.getItem('deviceId');
    this.deviceId === 'true';
  }

  _getUserAccessToken() {
    const sessionStorageToken = {
      accessToken: window.sessionStorage.getItem('accessToken'),
      expiresAt: parseInt(window.sessionStorage.getItem('expiresAt'))
    };

    const localStorageToken = {
      accessToken: window.localStorage.getItem('accessToken'),
      expiresAt: parseInt(window.localStorage.getItem('expiresAt'))
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
    const refreshToken =  window.sessionStorage.getItem('refreshToken') ||
      window.localStorage.getItem('refreshToken');
    const { accessToken, expiresAt } = this._getUserAccessToken();
    const userTokens = {
      refreshToken,
      accessToken,
      expiresAt
    };

    return userTokens;
  }

  _getClientAccessToken() {
    let accessToken = window.sessionStorage.getItem('clientAccessToken', accessToken);;
    let expiresAt = window.sessionStorage.getItem('clientExpiresAt', expiresAt);;

    return { accessToken, expiresAt };
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
