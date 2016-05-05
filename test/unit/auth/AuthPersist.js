import {
  default as AuthPersist
} from '../../../src/auth/AuthPersist';

describe('AuthPersist', () => {
  it('should be defined', () => {
    expect(AuthPersist).to.not.be.undefined;
  });

  describe('generates an instance', () => {
    const authPersist = new AuthPersist();

    const clientTokenObject = {
      accessToken: 'myToken',
      expiresAt: 9999999
    };

    const userTokenObject = {
      accessToken: 'myUserToken',
      refreshToken: 'myRefreshToken',
      expiresAt: 8888,
      authOptions: {
        'myOption': 'myOption'
      }
    };

    it('should be defined', () => {
      expect(authPersist).to.not.be.undefined;
    });

    it('should have a token object', () => {
      expect(authPersist.tokens).to.not.be.undefined;
      expect(authPersist.tokens).to.be.an('object');
    });

    it('should have a remember property', () => {
      expect(authPersist.remember).to.not.be.undefined;
      expect(authPersist.remember).to.be.a('boolean');
    });

    it('should have a persistClientToken method to persist client token data', () => {

      expect(authPersist.persistClientToken).to.not.be.undefined;

      authPersist.persistClientToken(clientTokenObject);
      expect(authPersist.tokens.client).to.deep.include(clientTokenObject);

      expect(authPersist.sessionStorage.clientAccessToken).to.equal(clientTokenObject.accessToken);
      expect(authPersist.sessionStorage.clientExpiresAt).to.equal(clientTokenObject.expiresAt);
    });

    it('should have a persistAuthData method to save user token data', () => {
      expect(authPersist.persistAuthData).to.not.be.undefined;

      authPersist.persistAuthData(userTokenObject);
      expect(authPersist.tokens.user.expiresAt).to.equal(userTokenObject.expiresAt);
      expect(authPersist.tokens.user.accessToken).to.equal(userTokenObject.accessToken);
      expect(authPersist.tokens.user.refreshToken).to.equal(userTokenObject.refreshToken);
      expect(authPersist.tokens.authOptions).to.equal(userTokenObject.authOptions);

      expect(authPersist.sessionStorage).to.include.keys(userTokenObject);
      expect(authPersist.localStorage).to.not.include.keys(userTokenObject);

      // Use remember property to save in localStorage
      authPersist.remember = true;
      authPersist.persistAuthData(userTokenObject);
      expect(authPersist.localStorage).to.include.keys(userTokenObject);
    });

    it('should have a getTokensFromStorage method to retrieve token data', () => {
      expect(authPersist.getTokensFromStorage).to.not.be.undefined;

      const storageTokens = authPersist.getTokensFromStorage();

      expect(authPersist.tokens).to.deep.include(storageTokens);
    });

    it('should have a removeAllUserData method to remove user token data', () => {
      expect(authPersist.removeAllUserData).to.not.be.undefined;

      authPersist.removeAllUserData();

      expect(authPersist.sessionStorage.accessToken).to.be.undefined;
      expect(authPersist.sessionStorage.expiresAt).to.be.undefined;
      expect(authPersist.sessionStorage.refreshToken).to.be.undefined;
      expect(authPersist.sessionStorage.authOptions).to.be.undefined;

      expect(authPersist.localStorage.accessToken).to.be.undefined;
      expect(authPersist.localStorage.expiresAt).to.be.undefined;
      expect(authPersist.localStorage.refreshToken).to.be.undefined;
      expect(authPersist.localStorage.authOptions).to.be.undefined;
    });
  });
});
