// Google Authentication Service
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

class GoogleService {
  constructor() {
    this.initialized = false;
    this.googleAuth = null;
  }

  async init() {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      if (document.getElementById('google-identity-script')) {
        this.initialized = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-identity-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.initialized = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services'));
      };
      document.head.appendChild(script);
    });
  }

  async signIn() {
    await this.init();

    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google Identity Services not loaded'));
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (response.credential) {
            resolve({
              idToken: response.credential,
              provider: 'google'
            });
          } else {
            reject(new Error('Google sign-in failed'));
          }
        },
      });

      // Prompt the user to sign in
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          // Fallback to popup if One Tap is not displayed
          this.signInWithPopup().then(resolve).catch(reject);
        } else if (notification.isSkippedMoment()) {
          reject(new Error('Google sign-in was skipped'));
        } else if (notification.isDismissedMoment()) {
          reject(new Error('Google sign-in was dismissed'));
        }
      });
    });
  }

  async signInWithPopup() {
    await this.init();

    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google Identity Services not loaded'));
        return;
      }

      // Create a temporary button for OAuth popup
      const buttonDiv = document.createElement('div');
      buttonDiv.style.display = 'none';
      document.body.appendChild(buttonDiv);

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => {
          document.body.removeChild(buttonDiv);
          if (response.credential) {
            resolve({
              idToken: response.credential,
              provider: 'google'
            });
          } else {
            reject(new Error('Google sign-in failed'));
          }
        },
      });

      window.google.accounts.id.renderButton(buttonDiv, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
      });

      // Click the rendered button to trigger OAuth
      const googleButton = buttonDiv.querySelector('div[role="button"]');
      if (googleButton) {
        googleButton.click();
      } else {
        // Fallback: use OAuth 2.0 popup
        this.oauthPopup().then(resolve).catch(reject);
      }
    });
  }

  async oauthPopup() {
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = 'openid email profile';
    
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'token id_token');
    authUrl.searchParams.set('scope', scope);
    authUrl.searchParams.set('nonce', this.generateNonce());

    return new Promise((resolve, reject) => {
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl.toString(),
        'Google Sign In',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        reject(new Error('Failed to open Google sign-in popup'));
        return;
      }

      const checkPopup = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(checkPopup);
            reject(new Error('Google sign-in popup was closed'));
            return;
          }

          if (popup.location.href.includes(redirectUri)) {
            clearInterval(checkPopup);
            const hash = popup.location.hash.substring(1);
            const params = new URLSearchParams(hash);
            const idToken = params.get('id_token');
            popup.close();

            if (idToken) {
              resolve({ idToken, provider: 'google' });
            } else {
              reject(new Error('No ID token received from Google'));
            }
          }
        } catch (e) {
          // Cross-origin error, popup still on Google's domain
        }
      }, 500);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkPopup);
        if (!popup.closed) {
          popup.close();
        }
        reject(new Error('Google sign-in timed out'));
      }, 300000);
    });
  }

  generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async getProfile(idToken) {
    // Decode the JWT token to get user info
    try {
      const base64Url = idToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        emailVerified: payload.email_verified,
      };
    } catch (error) {
      console.error('Failed to decode Google ID token:', error);
      return null;
    }
  }

  signOut() {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }
}

export const googleService = new GoogleService();
export default googleService;
