import * as composrCR from '../../src/composr-connector';

describe('composr-connector', () => {
  describe('exposes', () => {
    beforeEach(() => {

    });

    it('AuthRequest class', () => {
      expect(composrCR.AuthRequest).to.not.be.undefined;
    });

    it('AuthPersist class', () => {
      expect(composrCR.AuthPersist).to.not.be.undefined;
    });

    it('AuthConnector class', () => {
      expect(composrCR.AuthConnector).to.not.be.undefined;
    });

  });
});
