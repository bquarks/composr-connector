import * as utils from '../utils/utils';

class AuthRequest {
  constructor(authConfig, endpoints) {
    // Init auth variables
    this.authConfig = authConfig;
    this.endpoints = endpoints || authConfig.endpoints;

    // auth init methods
    this.authenticateClient();
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
   * @param  {Object}           storedClientToken Token stored in browser
   * @return {Object} Promise
   */
  authenticateClient(storedClientToken) {
    const clientAccessTokenPromise = new Promise((resolve, reject) => {
      const currentClientAccessToken = this._validateClientAccessToken(storedClientToken);
      const claims = this._createClaims({}, 'client');

      // Resolve current clientToken if exists
      if (currentClientAccessToken) {
        resolve(currentClientAccessToken);
        return;
      }

      // Ask for a new clientToken
      this._authenticate('loginClient', claims)
        .then(res => resolve(res))
        .catch(err => reject(err));

    });

    this.clientAccessTokenPromise = clientAccessTokenPromise;

    return clientAccessTokenPromise;
  }
}

export default AuthRequest;
