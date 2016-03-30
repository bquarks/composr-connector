import AuthRequest from './AuthRequest';
import AuthPersist from './AuthPersist';
import * as utils from '../utils/utils';

class AuthConnector {
  constructor(authConfig, options = {}) {
    this.authPersist = new AuthPersist();
    this.authRequest = new AuthRequest(authConfig);
    this.options = options;
    this.userAuthenticated = false;
  }

  /**
   * Validates if clientAccessToken exists in sessionStorage and is not expired
   *
   * @return {String} clientAccessToken
   */
  _validateClientAccessToken(clientToken) {

    if (clientToken &&
      clientToken.accessToken &&
      clientToken.expiresAt &&
      Date.now() < parseInt(clientToken.expiresAt)) {
      // Accesstoken exists and is not expired
      return clientToken.accessToken;
    }

    return;
  }

  ////////////////
  // Public API //
  ////////////////

  /**
   * Authenticates with client scope
   *
   * @return {Object} Promise
   */
  loginClient() {
    this.authPersist.getTokensFromStorage();
    const storedClientToken = this.authPersist.tokens.client;
    const currentClientAccessToken = this._validateClientAccessToken(storedClientToken);

    const clientAccessTokenPromise = new Promise((resolve, reject) => {
      // Resolve current clientToken if exists
      if (currentClientAccessToken) {
        resolve(currentClientAccessToken);
        return;
      }

      // Ask for a new clientToken
      this.authRequest.authenticateClient()
        .then(res => {
          this.authPersist.persistClientToken(res);
          resolve(res);
        })
        .catch(err => reject(err));

    });

    this.clientAccessTokenPromise = clientAccessTokenPromise;

    return clientAccessTokenPromise;
  }

  /**
   * Sign in method
   *
   * @return {Object} A result promise
   */
  loginUser({email, password, remember}) {
    const deviceId = 'Web-' + utils.generateUUID();
    const request = this.authRequest.authenticateUser({email, password, remember, deviceId});

    request.then(res => {
      let tokenObject = res.tokenObject;
      tokenObject.deviceId = deviceId;
      this.authPersist.remember = remember ? remember : false;
      this.authPersist.persistAuthData(tokenObject);
      this.userAuthenticated = true;
    });

    this.loginUserPromise = request;

    return request;
  }

  refreshUserToken(refreshPage) {
    this.authPersist.getTokensFromStorage();
    this.authPersist.getRememberFromStorage();

    const authData = {
      refreshToken: this.authPersist.tokens.user.refreshToken,
      deviceId: this.authPersist.tokens.deviceId
    };

    const request = this.authRequest.refreshUserToken(authData);

    request.then(res => {
      this.authPersist.persistAuthData(res.data);
      this.userAuthenticated = true;
    });

    this.refreshUserTokenPromise = request;

    return request;
  }

  /**
   * Logs out method
   * Calls _authenticate() method with our stored credentials
   */
  logoutUser() {
    this.authPersist.getTokensFromStorage();

    const authData = {
      accessToken: this.authPersist.tokens.user.accessToken,
      deviceId: this.authPersist.tokens.deviceId
    };

    const request = this.authRequest.logoutUser(authData);

    this.userAuthenticated = false;

    this.authPersist.removeAllUserData();

    return request;
  }
}

export default AuthConnector;
