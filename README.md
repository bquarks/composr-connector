[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![BOWER version][bower-version-image]][bower-url]
[![GITHUB downloads][github-downloads]][bower-url]
[![APACHE License][license-image]][license-url]

# composr-connector
A connector for [Composr middleware](https://github.com/corbel-platform/corbel-composr).

## Installation

With [npm](https://npmjs.org) do:

```
$ npm install --save composr-connector
```

With [bower](https://http://bower.io/) do:

```bash
bower install composr-connector --save
```

Import the dist file in your project:

```html
<script src="../bower_components/composr-connector/dist/composr-connector.js"></script>
```
or
```html
<script src="../bower_components/composr-connector/dist/composr-connector.min.js"></script>
```

### Dependencies

This library uses some new javascript features like es6-promises, fetch API,... so you may need to use some polyfills in your project:

* [ES6 Object.assign()](https://github.com/rubennorte/es6-object-assign)
* [ES6 Promises](https://github.com/stefanpenner/es6-promise)
* [Fetch API](https://github.com/github/fetch)

All of them are included in bower dependencies. To use them in your app, just make sure to add them before the library file:
```html
<script src="../bower_components/es6-object-assign/dist/object-assign.js"></script>
<script src="../bower_components/es6-promise/promise.js"></script>
<script src="../bower_components/fetch/fetch.js"></script>
```
 You can also consider to use [CDN Polyfill Service]( https://cdn.polyfill.io/v2/docs/).

## Usage

### Load

Using ES6/Babel:

```javascript
import * as composrCR from 'composr-connector';
```

Using Node.js / Browserify / RequireJS:

```javascript
var composrCR = require('composr-connector');
```

If you don't use the previous options, a global variable will expose named ```composrCR```.

### Authentication

First, we need to create an instance of AuthConnector:

```javascript
const authConnector = new composrCR.AuthConnector({
  authConfig: myComposrConfig,
  options: myInstanceOptions
});
```

#### Configuration


```javascript
const myComposrConfig = {
  "clientId": "XXXXXX",
  "clientSecret": "YYYYYYYYYYYYYYYYYYYYY",
  "scopes": {
    "user": "scopes:user",
    "client": "scopes:web"
  },
  "urlBase": "https://my-composr-url.io/{{module}}/",
  "endpoints": {
    "loginClient": "my:domain/myPhrasesVersion/loginclient/",
    "login": "my:domain/myPhrasesVersion/loginuser/",
    "logout": "my:domain/myPhrasesVersion/logoutuser/",
    "refreshToken": "my:domain/myPhrasesVersion/refreshtoken/"
  },
  "iamAUD": "http://my-iam-ul.io"
}}
```

##### Injecting AuthRequest & AuthPersist instances

In some cases (such as Meteor packages), you need to instanciate AuthRequest & AuthPersist separate from AuthConnector:

```javascript
const myAuthRequestInstance = new composrCR.AuthRequest(myComposrConfig);

const myAuthPersistInstance = new composrCR.AuthPersist();
```

Now, you can inject during AuthConnector instance creation:

```javascript
const authConnector = new composrCR.AuthConnector({
  authRequest: myAuthRequestInstance,
  authPersist: myAuthPersistInstance,
  options: myInstanceOptions
});
```

Note that you load the auth config in AuthRequest instance.

#### Initialization

Once AuthConnector instance is created you can use ```init()``` to initiate your authentication process.

```javascript
authConnector.init()
```

This will load tokens from previous sessions (stored in local or session Storage) or fetch from the server, and set your current user authentication status in ```userAuthenticated``` property.
#### API

*AuthConnector*
* Methods
  - loginClient()
  - loginUser()
  - refreshUserToken()
  - logoutUser()

  - init()
  - authValidation()
  - getCurrentToken()


* Properties
  - userAuthenticated

## Testing & Developing

Clone the project:

```git clone https://github.com/bquarks/composr-connector.git```

Install dependencies:

```npm install```

Run tests:

```npm run tests```

Build the project (transpiling to ES5):

```npm run build```

Build & launch in browser (http://localhost:3000/):

```npm run serve```

[license-image]: http://img.shields.io/:license-apache-blue.svg?style=flat-square
[license-url]: LICENSE

[npm-url]: https://npmjs.org/package/composr-connector
[npm-version-image]: http://img.shields.io/npm/v/composr-connector.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/composr-connector.svg?style=flat

[github-downloads]: https://img.shields.io/github/downloads/bquarks/composr-connector/total.svg

[bower-url]: https://bower.io/package/composr-connector
[bower-version-image]: http://img.shields.io/bower/v/composr-connector.svg?style=flat
[bower-downloads-image]: http://img.shields.io/bower/dm/composr-connector.svg?style=flat
