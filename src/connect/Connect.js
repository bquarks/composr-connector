import AuthConnector from '../auth/AuthConnector';
import * as utils from '../utils/utils';

if (this && this.Meteor) {
  // NOTE: this only work if it is used with the meteor package version of this library.

  this.Headers = fetch.Headers;
  this.Request = fetch.Request;

  fetch.Promise = Promise;
}

class Connect {
  constructor({config, options = {}, authConnector = new AuthConnector({
        authConfig: config
      })}) {
    this.authConnector = authConnector;
    this.endpoints = config.endpoints;
    this.urlBase = config.urlBase;
    this.options = options;

    this._requestDataQueue = [];

    this.authConnector.init();
  }

  /////////////////
  // Private API //
  /////////////////

  _buildHeaders({token, headersExtension}) {
    const defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    };

    let headers = Object.assign(defaultHeaders, this.options.headersExtension, headersExtension);

    return new Headers(headers);
  }

  _buildRequestParams({body, queryParams}) {
    const queryPath = this._buildQueryPath(queryParams);

    if (body) {
      body = JSON.stringify(body);
    }

    return {
      body,
      queryPath
    };
  }

  _buildQueryPath(dict) {
    var query = '';
    if (dict) {
      var queries = [];
      Object.keys(dict).forEach(function(key) {
        queries.push(key + '=' + dict[key]);
      });
      if (queries.length > 0) {
        query = '?' + queries.join('&');
      }
    }
    return query;
  }

  _buildUrl({endpoint, queryPath}) {
    let requestEndpoint = this.endpoints[endpoint];

    if (endpoint.key) {
      requestEndpoint = this.endpoints[endpoint.key] + endpoint.id;
    }

    const url = utils.buildURI(this.urlBase) + requestEndpoint + queryPath;

    return url;
  }

  _buildRequest({endpoint, method, params, data, headersExtension} , token) {
    const {body, queryPath} = this._buildRequestParams({
      queryParams: params,
      body: data
    });
    const url = this._buildUrl({
      endpoint,
      queryPath
    });
    const headers = this._buildHeaders({
      token,
      headersExtension
    });

    const request = new Request(url, {
      credentials: 'include',
      mode: 'cors',
      cache: 'no-store',
      method,
      headers,
      body
    });

    return fetch(request)
      .then(utils.checkStatus);
  }

  _createRetryRequests(tokenObject) {
    const { accessToken } = tokenObject;
    let requestDataQueue;
    let requestsCallback;
    let retryRequests = [];

    if (this.options.retryRequestProxy) {
      const retryRequestProxyResponse = this.options.retryRequestProxy(tokenObject, this._requestDataQueue);
      requestDataQueue = retryRequestProxyResponse.requestDataQueue;
      requestsCallback = retryRequestProxyResponse.requestsCallback;
    } else {
      requestDataQueue = this._requestDataQueue;
      requestsCallback = (data) => data;
    }

    // TODO: Due to an issue with ios 8 or lower versions
    //  it's better to use for..in loops instead for..of
    //
    // Replace following lines in projects without support for this browsers:
    //
    // for (const data of requestDataQueue) {
    //   const request = this._buildRequest(data, accessToken);
    //
    //   retryRequests.push(request);
    // }
    for (let i in requestDataQueue) {
      const data = requestDataQueue[i];
      const request = this._buildRequest(data, accessToken);

      retryRequests.push(request);
    }

    this._requestDataQueue = [];

    return Promise.all(retryRequests)
      .then(requestsCallback);
  }

  _retry(requestData) {
    this._requestDataQueue.push(requestData);

    if (this._retryStatus === 'Pending') {
      return this._retryRequest;
    }

    const refreshTokenPromise = this.authConnector.refreshUserToken();
    this._retryRequest = refreshTokenPromise
      .then((tokenObject) => this._createRetryRequests(tokenObject));

    refreshTokenPromise
      .then(() => this._retryStatus = 'Resolved')
      .catch(() => this._retryStatus = 'Resolved');

    return this._retryRequest;
  }

  /**
   * Send request
   *
   * @param  {Object} requestData
   * @return {Object} Promise
   */
  _request(requestData, retry = true) {
    const fetchRequest = this.authConnector.getCurrentToken()
      .then((token) => {
        const request = this._buildRequest(requestData, token);

        return request;
      })
      .catch((err) => {
        if (retry && err.status === 401 && this.authConnector.userAuthenticated) {
          return this._retry(requestData);
        }

        throw err;
      });

    return fetchRequest;
  }

  ////////////////
  // Public API //
  ////////////////

  /**
   * Send request through proxy
   *
   * @param  {Object} requestData
   * @return {Object} Promise
   */
  request(requestData, retry = true) {

    if (this.options.requestProxy) {
      const requestProxy = this.options.requestProxy;
      return requestProxy(this._request, requestData, retry);
    }

    return this._request(requestData, retry);
  }

  /**
   * GET request
   *
   * @param  {String} endpoint
   * @param  {Object} params
   * @return {Object}  Request promise
   */
  get(endpoint, params) {
    const requestData = {
      method: 'get',
      endpoint,
      params
    };

    return this.request(requestData);
  }

  /**
   * DELETE request
   *
   * @param  {String} endpoint
   * @param  {Object} params
   * @return {Object}  Request promise
   */
  delete(endpoint, params) {
    const requestData = {
      method: 'delete',
      endpoint,
      params
    };

    return this.request(requestData);
  }

  /**
   * POST request
   *
   * @param  {String} endpoint
   * @param  {Object} data
   * @return {Object}  Request promise
   */
  post(endpoint, data) {
    const requestData = {
      method: 'post',
      endpoint,
      data
    };

    return this.request(requestData);
  }

  /**
   * PUT request
   *
   * @param  {String} endpoint
   * @param  {Object} data
   * @return {Object}  Request promise
   */
  put(endpoint, data) {
    const requestData = {
      method: 'put',
      endpoint,
      data
    };

    return this.request(requestData);
  }

}

export default Connect;
