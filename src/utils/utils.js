import * as jwt from './jwt';

export function buildURI(urlBase) {
  return urlBase.replace('{{module}}', 'composr');
}

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    var error = new Error(response.statusText);
    error.response = response.json();
    throw error;
  }
}

export { jwt };
