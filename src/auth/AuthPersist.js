class AuthPersist {
  constructor() {

  }

  /**
   * Stores result auth data in local & session storage
   *
   * @param  {Object} data [accessTocken, refreshToken, remember]
   */
  _persistAuthData(data) {

    if (this.remember) {
      this._addLocalStorage(data);
      this._addSessionStorage(data);

    } else {
      // Not saving in localstorage if user doesnt check remember option
      // When browser is closed, user is logged out
      // To save accesstoken in localstorage, uncomment this line
      // this._addLocalStorage(data);
      this._addSessionStorage(data);
    }
    this.fire('auth:userLogged');
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

  _removeUserCookie(cookieName) {
    document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  _getMostRecentToken() {
    var mostRecentToken = {};

    var sessionStorageToken = {
      accessToken: window.sessionStorage.getItem('accessToken'),
      expiresAt: parseInt(window.sessionStorage.getItem('expiresAt'))
    };

    var localStorageToken = {
      accessToken: window.localStorage.getItem('accessToken'),
      expiresAt: parseInt(window.localStorage.getItem('expiresAt'))
    };

    if (!isNaN(sessionStorageToken.expiresAt) && !isNaN(localStorageToken.expiresAt)) {
      mostRecentToken = sessionStorageToken.expiresAt > localStorageToken.expiresAt ? sessionStorageToken : localStorageToken;
      return mostRecentToken;
    }

    mostRecentToken = isNaN(sessionStorageToken.expiresAt) ? localStorageToken : sessionStorageToken;

    return mostRecentToken;
  }

  /**
   * Validates accesstoken and refresh it if necessary
   */
  _validateAccessToken() {
    var that = this;

    var mostRecentAccessToken = this._getMostRecentToken();

    var accessToken = mostRecentAccessToken.accessToken;

    var expiresAt = mostRecentAccessToken.expiresAt;

    var refreshToken = window.sessionStorage.getItem('refreshToken') || window.localStorage.getItem('refreshToken');

    var accessTokenPromise = new Promise(function(resolve, reject) {
      if (accessToken &&
        expiresAt &&
        Date.now() < expiresAt) {
        // Accesstoken exists and is not expired
        resolve({
          accessToken: accessToken
        });
      } else if (refreshToken) {
        // AccessToken expired or missed: refresh token if exists
        that.refreshToken(page.current).then(function(data) {
          resolve(data);
        }).catch(function(err) {
          reject(err);
        });
      } else {
        reject({
          err: 'No accessToken or refreshToken'
        });
      }

    });

    return accessTokenPromise;
  }

  /**
   * Checks if remember is in localStorage
   */
  _validateRemember() {
    var that = this;
    var remember = window.sessionStorage.getItem('remember') ||
      window.localStorage.getItem('remember');

    var rememberPromise = new Promise(function(resolve, reject) {
      if (remember === 'true') {
        that.remember = true;
        that.refreshToken().then(function(data) {
          resolve(data);
        }).catch(function(err) {
          reject(err);
        });
      } else {
        reject('No Remember setted');
      }

    });

    return rememberPromise;
  }

  /**
   * Persist client accessToken
   */
  _persistClientToken(data) {

    window.sessionStorage.setItem('clientAccessToken', data.accessToken);
    window.sessionStorage.setItem('clientExpiresAt', data.expiresAt);
  }

  getClientAccessToken() {

  }
}

export default AuthPersist;
