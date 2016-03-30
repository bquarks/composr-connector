# composr-connector
A connector for [Composr middleware](https://github.com/corbel-platform/corbel-composr).

## Installation

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
