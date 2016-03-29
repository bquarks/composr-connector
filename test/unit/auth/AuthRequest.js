import {
  default as AuthRequest
} from '../../../src/auth/AuthRequest';

describe('AuthRequest', () => {
  const window = {};
  const authConfig = {
    'clientId': 'ZZZZZZZ',
    'clientSecret': 'XXXXXXXXXXXXXXXXYYYYYYYYYYY',
    'scopes': {
      'user': 'user:scope',
      'client': 'client:scope'
    },
    'urlBase': 'https://my-url.io/{{module}}/',
    'version': 'v0',
    'domain': 'mydomain',
    'endpoints': {
      'loginClient': 'mydomain/v0/loginclient/',
      'login': 'mydomain/v0/loginuser/',
      'logout': 'mydomain/v0/logoutuser/',
      'refreshToken': 'mydomain/v0/refreshtoken/',
    },
    'iamAUD': 'http://iam.io'
  };

  it('should be defined', () => {
    expect(AuthRequest).to.not.be.undefined;
  });

  describe('generates an instance', () => {
    const authRequest = new AuthRequest(authConfig);

    it('has all properties', () => {
      expect(authRequest).to.include.keys(
        'authConfig',
        'endpoints'
      );
    });
  });

});
