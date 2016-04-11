class AuthPersist {
  constructor(cookies = []) {
    this._isNode();
    this.getRememberFromStorage();
    this.getTokensFromStorage();
    this.cookies = cookies;
  }

  /////////////////
  // Private API //
  /////////////////

  _isNode() {
    if (window) {
      this.sessionStorage = window.sessionStorage;
      this.localStorage = window.localStorage;

      return false;
    }

    this.sessionStorage = {
      removeItem(item) {
        this[item] = void 0;
      }
    };

    this.localStorage = {
      removeItem(item) {
        this[item] = void 0;
      }
    };

    return true;
  }

  /**
   * Adds data to localStorage
   *
   * @param {Object} data
   */
  _addLocalStorage(data) {
    if (this.remember) {
      this.localStorage.remember = true;
      this.localStorage.refreshToken = data.refreshToken;
    }
    if (data.authOptions) {
      this.localStorage.authOptions = JSON.stringify(data.authOptions);
    }
    this.localStorage.accessToken = data.accessToken;
    this.localStorage.expiresAt = data.expiresAt;

  }

  /**
   * Adds data to sessionStorage
   *
   * @param {Object} data
   */
  _addSessionStorage(data) {

    if (this.remember) {
      this.sessionStorage.remember = true;
    }
    if (data.authOptions) {
      this.sessionStorage.authOptions = JSON.stringify(data.authOptions);
    }
    this.sessionStorage.refreshToken = data.refreshToken;
    this.sessionStorage.accessToken = data.accessToken;
    this.sessionStorage.expiresAt = data.expiresAt;

  }

  /**
   * Removes auth data from localStorage
   */
  _removeLocalStorage() {
    this.localStorage.removeItem('refreshToken');
    this.localStorage.removeItem('accessToken');
    this.localStorage.removeItem('expiresAt');
    this.localStorage.removeItem('remember');
    this.localStorage.removeItem('authOptions');
  }

  /**
   * Removes auth data from sessionStorage
   */
  _removeSessionStorage() {
    this.sessionStorage.removeItem('refreshToken');
    this.sessionStorage.removeItem('accessToken');
    this.sessionStorage.removeItem('expiresAt');
    this.sessionStorage.removeItem('remember');
    this.sessionStorage.removeItem('authOptions');
  }

  _removeUserCookie(cookieName) {
    document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  _removeUserCookies() {
    for (const cookie of this.cookies) {
      this._removeUserCookie(cookie);
    }
  }

  _getAuthOptionsFromStorage() {
    let authOptions = this.sessionStorage.authOptions ||
      this.localStorage.authOptions;
    try {
      authOptions = JSON.parse(authOptions);
    } catch (err) {
      authOptions = {};
    }
    return authOptions;
  }

  _getUserAccessToken() {
    const sessionStorageToken = {
      accessToken: this.sessionStorage.accessToken,
      expiresAt: parseInt(this.sessionStorage.expiresAt)
    };

    const localStorageToken = {
      accessToken: this.localStorage.accessToken,
      expiresAt: parseInt(this.localStorage.expiresAt)
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
    const refreshToken = this.sessionStorage.refreshToken ||
      this.localStorage.refreshToken;
    const {
      accessToken,
      expiresAt
    } = this._getUserAccessToken();
    const userTokens = {
      refreshToken,
      accessToken,
      expiresAt
    };

    return userTokens;
  }

  _getClientAccessToken() {
    let accessToken = this.sessionStorage.clientAccessToken;;
    let expiresAt = this.sessionStorage.clientExpiresAt;

    return {
      accessToken,
      expiresAt
    };
  }

  ////////////////
  // Public API //
  ////////////////

  /**
   * Persist client accessToken
   */
  persistClientToken(data) {
    let {
      accessToken,
      expiresAt
    } = data;

    this.sessionStorage.clientAccessToken = accessToken;
    this.sessionStorage.clientExpiresAt = expiresAt;

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
    const {
      accessToken,
      refreshToken,
      expiresAt,
      authOptions
    } = data;

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

    this.tokens.authOptions = authOptions;

    return true;
  }

  removeAllUserData() {
    this._removeLocalStorage();
    this._removeSessionStorage();
    this._removeUserCookies();
  }

  getRememberFromStorage() {
    const remember = this.sessionStorage.remember ||
      this.localStorage.remember;

    this.remember = (remember === 'true');

    return this.remember;
  }

  getTokensFromStorage() {
    let tokens = {
      client: this._getClientAccessToken(),
      user: this._getUserTokens(),
      authOptions: this._getAuthOptionsFromStorage()
    };
    this.tokens = tokens;

    return tokens;
  }
}

export default AuthPersist;
