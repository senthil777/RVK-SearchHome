import * as Keychain from 'react-native-keychain';

const SERVICE_NAME = 'com.rvk.homesearch.auth';

export const TokenStorage = {

  // ✅ Save access token securely
  saveToken: async (token: string): Promise<void> => {
    try {
      await Keychain.setGenericPassword('accessToken', token, {
        service: SERVICE_NAME,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });
    } catch (error) {
      console.error('TokenStorage.saveToken error:', error);
      throw new Error('Failed to save token.');
    }
  },

  // ✅ Get access token
  getToken: async (): Promise<string | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: SERVICE_NAME,
      });
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('TokenStorage.getToken error:', error);
      return null;
    }
  },

  // ✅ Delete token on logout
  clearToken: async (): Promise<void> => {
    try {
      await Keychain.resetGenericPassword({ service: SERVICE_NAME });
    } catch (error) {
      console.error('TokenStorage.clearToken error:', error);
    }
  },
};