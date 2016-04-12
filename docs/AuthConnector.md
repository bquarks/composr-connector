# Authentication

First, we need to create an instance of AuthConnector:

```javascript
const authConnector = new composrCR.AuthConnector({
  authConfig: myComposrConfig,
  options: myInstanceOptions
});
```

## Configuration

You need to specify your server details:

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

In options you can set:
* headersExtension: This will add the headers you specify in every auth request you make.
* authDataExtension: This will add claims you specify in every auth request you make.

```javascript
const myInstanceOptions = {
  headersExtension: {
    NewHeader: 'my-new-header-info'
  },
  authDataExtension: {
    NewClaim: 'my-new-claims-info'
  }
}}
```

### Injecting AuthRequest & AuthPersist instances

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

## Initialization

Once AuthConnector instance is created you can use ```init()``` to initiate your authentication process.

```javascript
authConnector.init()
```

This will load tokens from previous sessions (stored in local or session Storage) or fetch from the server, and set your current user authentication status in ```userAuthenticated``` property.

## API

**AuthConnector**
* Methods
  - **loginClient()**
    ```javascript
    authConnector.loginClient()
    .then((clientToken) => console.log('My new client token:', clientToken))
    .catch((err) => console.log('Something went wrong trying to obtain the client token:', err));
    ```
    Application login with client scopes.

    Returns a *promise* with the authentication result.

  - **loginUser({email, password, remember})**
    ```javascript
    authConnector.loginUser({
      email: 'myemail@myemailservice.com',
      password: 'mypass',
      remember: true
      })
      .then((userToken) => console.log('My new user token:', userToken))
      .catch((err) => console.log('Something went wrong trying to obtain the user token:', err));
    ```
    Application login with user scopes.

    If *remember* is true, authentication tokens will persist in localStorage for further sessions.

    Returns a *promise* with the authentication result.

  - **refreshUserToken()**
    ```javascript
    authConnector.refreshUserToken()
    .then((accessToken) => console.log('My new user token:', userToken))
    .catch((err) => console.log('Something went wrong trying to refresh user token:', err));
    ```
    Uses refreshToken stored in browser to fetch a new accessToken.

    Returns a *promise* with the refresh token result.

  - **logoutUser()**
    ```javascript
    authConnector.logoutUser()
    .then(() => console.log('Logged out'))
    .catch((err) => console.log('Something went wrong trying to log out with server:', err));
    ```
    User logout with server.
    It also removes all user auth data stored in browser.

    Returns a *promise* with the request logout result.
    If request fails, all data in browser will be removed anyway.

  - **authValidation()**
    ```javascript
    authConnector.authValidation()
    .then((userToken) => console.log('Your user token:', userToken))
    .catch(() => console.log('It was not posible to login with user scopes.'));
    ```
    Checks if exists a valid user session stored in browser.

    Returns a *promise* that will success if there is a valid session, returning an user token.

  - **getCurrentToken()**
    ```javascript
    authConnector.getCurrentToken()
    .then((currentToken) => console.log('This is your current token:', currentToken))
    .catch((err) => console.log('Something failed trying to obtain the token:', err));
    ```
    Checks the current token available.

    Returns a *promise* that will success returning the user token if it's available, if not, returns client token.

* Properties
  - **userAuthenticated**

    Returns a boolean with the user session status.
