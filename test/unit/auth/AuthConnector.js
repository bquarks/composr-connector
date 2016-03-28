import { default as AuthConnector } from '../../../src/auth/AuthConnector';

describe('AuthConnector', () => {
  const window = {};

  it('should be defined', () => {
    expect(AuthConnector).to.not.be.undefined;
  });

});
