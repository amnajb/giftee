const LIFF_ID = import.meta.env.VITE_LINE_LIFF_ID;

let liff = null;

export const lineService = {
  async init() {
    if (typeof window === 'undefined') return false;
    
    try {
      // Dynamically import LIFF SDK
      const liffModule = await import('@line/liff');
      liff = liffModule.default;
      
      await liff.init({ liffId: LIFF_ID });
      return liff.isLoggedIn();
    } catch (error) {
      console.error('LIFF initialization failed:', error);
      return false;
    }
  },

  isInLINE() {
    return liff?.isInClient() ?? false;
  },

  isLoggedIn() {
    return liff?.isLoggedIn() ?? false;
  },

  async login() {
    if (!liff) await this.init();
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  },

  logout() {
    if (liff?.isLoggedIn()) {
      liff.logout();
    }
  },

  async getProfile() {
    if (!liff?.isLoggedIn()) return null;
    try {
      return await liff.getProfile();
    } catch (error) {
      console.error('Failed to get LINE profile:', error);
      return null;
    }
  },

  async getAccessToken() {
    if (!liff?.isLoggedIn()) return null;
    return liff.getAccessToken();
  },

  // Scan QR code using LINE's scanner (only works in LINE app)
  async scanQR() {
    if (!this.isInLINE()) {
      throw new Error('QR scanning via LINE is only available in LINE app');
    }
    
    try {
      const result = await liff.scanCodeV2();
      return result?.value || null;
    } catch (error) {
      console.error('LINE QR scan failed:', error);
      throw error;
    }
  },

  // Check if LINE QR scanner is available
  canUseLINEScanner() {
    return this.isInLINE() && liff?.scanCodeV2;
  },

  // Close LIFF window
  closeWindow() {
    if (this.isInLINE()) {
      liff.closeWindow();
    }
  },

  // Share message via LINE
  async shareMessage(messages) {
    if (!this.isInLINE()) return false;
    try {
      await liff.shareTargetPicker(messages);
      return true;
    } catch (error) {
      console.error('Share failed:', error);
      return false;
    }
  },
};

export default lineService;
