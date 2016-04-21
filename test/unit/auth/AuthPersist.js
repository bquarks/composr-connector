import { default as AuthPersist } from '../../../src/auth/AuthPersist';

describe('AuthPersist', () => {
  it('should be defined', () => {
    expect(AuthPersist).to.not.be.undefined;
  });

  describe('generates an instance', () => {
    const authPersist = new AuthPersist();

    expect(authPersist).to.not.be.undefined;

    it('should ', () => {
    });
  });
});
