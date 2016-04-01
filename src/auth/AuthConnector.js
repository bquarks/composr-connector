import AuthRequest from './AuthRequest';
import AuthPersist from './AuthPersist';
import * as utils from '../utils/utils';

class AuthConnector {
  constructor({options = {}, authConfig, authPersist = new AuthPersist(), authRequest = new AuthRequest(authConfig)}) {
    this.authPersist = authPersist;
    this.authRequest = authRequest;
    this.options = options;
    this.userAuthenticated = false;
  }

  /**
   * Validates if clientAccessToken exists in sessionStorage and is not expired
   *
   * @return {String} clientAccessToken
   */
  _validateClientAccessToken(clientToken) {

    const isValid = (clientToken &&
      clientToken.accessToken &&
      clientToken.expiresAt &&
      Date.now() < parseInt(clientToken.expiresAt));

    return isValid ? clientToken.accessToken : false;

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

  _addExtension() {

  }

  /**
   * Sign in method
   *
   * @return {Object} A result promise
   */
  loginUser({email, password, remember, options}) {
    const deviceId = 'Web-' + utils.generateUUID();
    const headersExtension = {
      Deviceid: deviceId
    };
    const authDataExtension = {
      'device_id': deviceId
    };
    const request = this.authRequest.authenticateUser({email, password, remember, headersExtension, authDataExtension});

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

  /**
   * Refresh token method
   *
   * @return {Object}  A result promise
   */
  refreshUserToken() {
    this.authPersist.getTokensFromStorage();
    this.authPersist.getRememberFromStorage();

    const refreshToken = this.authPersist.tokens.user.refreshToken;
    const headersExtension = {
      Deviceid: this.authPersist.tokens.deviceId
    };
    const authDataExtension = {
      'device_id': this.authPersist.tokens.deviceId
    };

    const request = this.authRequest.refreshUserToken({refreshToken, headersExtension, authDataExtension});

    request.then(res => {
      this.authPersist.persistAuthData(res);
      this.userAuthenticated = true;
    });

    this.refreshUserTokenPromise = request;

    return request;
  }

  /**
   * Logout method
   * Calls _authenticate() method
   */
  logoutUser() {
    this.authPersist.getTokensFromStorage();

    const accessToken = this.authPersist.tokens.user.accessToken;
    const headersExtension = {
      Deviceid: this.authPersist.tokens.deviceId
    };
    const authDataExtension = {
      'device_id': this.authPersist.tokens.deviceId
    };

    const request = this.authRequest.logoutUser({accessToken, headersExtension, authDataExtension});

    this.userAuthenticated = false;

    this.authPersist.removeAllUserData();

    return request;
  }
}

export default AuthConnector;
