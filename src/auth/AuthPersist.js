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
    const evaluateEnvironment = new Function('try {return window;}catch(e){ return false;}');

    if (evaluateEnvironment()) {
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
    this.localStorage.scopes = data.scopes;
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
    this.sessionStorage.scopes = data.scopes;
    this.sessionStorage.refreshToken = data.refreshToken;
    this.sessionStorage.accessToken = data.accessToken;
    this.sessionStorage.expiresAt = data.expiresAt;

  }

  /**
   * Removes auth data from localStorage
   */
  _removeLocalStorage() {
    var items = ['refreshToken', 'accessToken', 'expiresAt', 'scopes', 'remember', 'authOptions'];

    for (let i in items) {
      this.localStorage.removeItem(items[i]);
    }
  }

  /**
   * Removes auth data from sessionStorage
   */
  _removeSessionStorage() {
    var items = ['refreshToken', 'accessToken', 'expiresAt', 'scopes', 'remember', 'authOptions'];

    for (let i in items) {
      this.sessionStorage.removeItem(items[i]);
    }
  }

  _removeUserCookie(cookieName) {
    document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  _removeUserCookies() {
    // TODO: Due to an issue with ios 8 or lower versions
    //  it's better to use for..in loops instead for..of
    //
    // Replace following lines in projects without support for this browsers:
    //
    // for (const cookie of this.cookies) {
    //   this._removeUserCookie(cookie);
    // }
    for (let i in this.cookies) {
      const cookie = this.cookies[i];
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
    const scopes = this.sessionStorage.scopes ||
      this.localStorage.scopes;
    const {
      accessToken,
      expiresAt
    } = this._getUserAccessToken();
    const userTokens = {
      refreshToken,
      accessToken,
      expiresAt,
      scopes
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
  persistClientToken({
    accessToken,
    expiresAt
  }) {

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
   * @param  {Object} tokenObject [accessToken, refreshToken, expiresAt, authOptions]
   */
  persistAuthData(tokenObject) {
    const {
      accessToken,
      refreshToken,
      expiresAt,
      scopes,
      authOptions
    } = tokenObject;

    if (this.remember) {
      this._addLocalStorage(tokenObject);
      this._addSessionStorage(tokenObject);

    } else {
      // Not saving in localstorage if user doesnt check remember option
      // When browser is closed, user is logged out
      this._addSessionStorage(tokenObject);
    }

    this.tokens.user = {
      accessToken,
      refreshToken,
      expiresAt,
      scopes
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
