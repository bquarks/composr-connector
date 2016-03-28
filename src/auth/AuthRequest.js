import * as utils from '../utils/utils';

class AuthRequest {
  constructor(authConfig, endpoints) {
    // Init auth variables
    this.authConfig = authConfig;
    this.endpoints = endpoints || authConfig.endpoints;
  }

  /////////////////
  // Private API //
  /////////////////

  /**
   * Creates a credentials object with data stored in this.authconfig
   * and extends it with more authData (if provided)
   *
   * @param  {Object} authData Extended auth data (i.e. user & pass)
   * @param  {String} scope
   * @return {Object}
   */
  _createClaims(authData, scope) {
    let {
      clientId, iamAUD, scopes
    } = this.authConfig;
    let claims = {
      iss: clientId,
      aud: iamAUD,
      scope: scopes[scope]
    };

    if (authData) {
      Object.assign(claims, authData);
    }

    return claims;
  }

  /**
   * Generates jwt
   *
   * @param  {Object} claims
   * @param  {String} clientSecret
   * @return {String}
   */
  _generateAssertion(claims, clientSecret) {
    return utils.jwt.generate(claims, clientSecret);
  }

  /**
   * Authenticates with composr
   * Uses fetch (or fetch polyfill: https://github.com/github/fetch)
   *
   * @param  {String} endpoint     Endpoint to comunicate with
   * @param  {Object} claims  Credentials data created with _createClaims
   * @param  {Object} headers
   * @return {Object} A result promise
   */
  _authenticate(endpoint, claims, headers = {}) {
    const url = utils.buildURI(this.authConfig.urlBase) + this.endpoints[endpoint];
    const clientSecret = this.authConfig.clientSecret;
    const jwt = this._generateAssertion(claims, clientSecret);
    const body = {
      jwt
    };
    let defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    };

    Object.assign(defaultHeaders, headers);

    let headersInstance = new Headers(defaultHeaders);

    const request = new Request(url, {
      credentials: 'same-origin',
      mode: 'cors',
      cache: 'no-store',
      method: 'POST',
      headers: headersInstance,
      body: JSON.stringify(body)
    });

    return fetch(request).then(utils.checkStatus);
  }

  ////////////////
  // Public API //
  ////////////////

  /**
   * Authenticates with client scope
   *
   * @param  {Object}           storedClientToken Token stored in browser
   * @return {Object} Promise
   */
  authenticateClient(storedClientToken) {
    const claims = this._createClaims({}, 'client');

    this.clientAccessTokenPromise = this._authenticate('loginClient', claims);

    return this.clientAccessTokenPromise;
  }

  /**
 * Sign in method
 * Calls _authenticate() method with the inserted credentials
 * @return {Object} A result promise
 */
  authenticateUser({email, password, remember, deviceId}) {
      const authData = {
        'basic_auth.username': email,
        'basic_auth.password': password
      };

      const headers = {
        Deviceid: deviceId
      };

      const claims = this._createClaims(authData, 'user');

      this.userAccessTokenPromise = this._authenticate('login', claims, headers);

      return this.userAccessTokenPromise;
    }
}

export default AuthRequest;
