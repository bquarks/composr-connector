import AuthConnector from '../auth/AuthConnector';
import * as utils from '../utils/utils';

class Connect {
  constructor({config, authConnector = new AuthConnector({authConfig: config})}) {
    this.authConnector = authConnector;
    this.endpoints = config.endpoints;
    this.urlBase = config.urlBase;
  }

  _buildHeaders({token, headersExtension}) {
    const defaultHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + token
    };

    let headers = Object.assign(defaultHeaders, headersExtension);

    return new Headers(headers);
  }

  _buildRequestParams({body, queryParams}) {
    const queryPath = this._buildQueryPath(queryParams);

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
        query = queries.join('&');
      }
    }
    return query;
  }

  _buildUrl({endpoint, queryPath}) {
    const url = utils.buildURI(this.urlBase) + this.endpoints[endpoint] + queryPath;

    return url;
  }

  _buildRequest({endpoint, method, params = {}, headersExtension}, token) {
    const {body, queryPath} = this._buildRequestParams(params);
    const url = this._buildUrl({
      endpoint,
      queryPath
    });
    const headers = this._buildHeaders({token, headersExtension});

    const request = new Request(url, {
      credentials: 'same-origin',
      mode: 'cors',
      cache: 'no-store',
      method,
      headers,
      body
    });

    return request;
  }

  /**
   * Send request
   *
   * @param  {Object} requestData
   * @return {Object} Promise
   */
  request(requestData, retry = true) {
    const fetchRequest = this.authConnector.getCurrentToken()
      .then((token) => {
        const request = this._buildRequest(requestData, token);

        return request;
      })
      .then(fetch)
      .then(utils.checkStatus)
      .catch((err) => {
        if (retry && err.status === 401 && this.authConnector.userAuthenticated) {
          return this.authConnector.refreshUserToken()
          .then(({accessToken}) => {
            const request = this._buildRequest(requestData, accessToken);

            return fetch(request);
          });
        }

        return err;
      });

    return fetchRequest;
  }
}

export default Connect;
