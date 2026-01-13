/**
 * LINE Service
 * Handles LINE OAuth and LIFF integration
 */

const LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID || '';
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || '';

const lineService = {
  /**
   * Verify LINE access token and get user profile
   */
  async verifyAccessToken(accessToken) {
    try {
      // Verify token
      const verifyResponse = await fetch(
        `https://api.line.me/oauth2/v2.1/verify?access_token=${accessToken}`
      );
      
      if (!verifyResponse.ok) {
        throw new Error('Invalid LINE access token');
      }

      // Get user profile
      const profileResponse = await fetch('https://api.line.me/v2/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to get LINE profile');
      }

      const profile = await profileResponse.json();
      
      return {
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl || null,
        statusMessage: profile.statusMessage || null
      };
    } catch (error) {
      console.error('LINE verification error:', error);
      throw new Error('LINE authentication failed');
    }
  },

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code) {
    try {
      const redirectUri = process.env.LINE_REDIRECT_URI || 'http://localhost:5173/auth/line/callback';
      
      const response = await fetch('https://api.line.me/oauth2/v2.1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: LINE_CHANNEL_ID,
          client_secret: LINE_CHANNEL_SECRET
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || 'Failed to exchange code');
      }

      const tokens = await response.json();
      
      return {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresIn: tokens.expires_in,
        idToken: tokens.id_token
      };
    } catch (error) {
      console.error('LINE token exchange error:', error);
      throw new Error('Failed to exchange LINE authorization code');
    }
  },

  /**
   * Verify LIFF ID token
   */
  async verifyIdToken(idToken) {
    try {
      const response = await fetch('https://api.line.me/oauth2/v2.1/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          id_token: idToken,
          client_id: LINE_CHANNEL_ID
        })
      });

      if (!response.ok) {
        throw new Error('Invalid ID token');
      }

      return await response.json();
    } catch (error) {
      console.error('LINE ID token verification error:', error);
      throw new Error('Failed to verify LINE ID token');
    }
  }
};

module.exports = lineService;
