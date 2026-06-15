import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserModel } from '../models/AuthModel';

const USER_KEY = '@homesearch:user';

export const UserStorage = {

  // ✅ Save user object
  saveUser: async (user: UserModel): Promise<void> => {
    try {
      const json = JSON.stringify(user);
      await AsyncStorage.setItem(USER_KEY, json);
    } catch (error) {
      console.error('UserStorage.saveUser error:', error);
      throw new Error('Failed to save user data.');
    }
  },

  // ✅ Get user object
  getUser: async (): Promise<UserModel | null> => {
    try {
      const json = await AsyncStorage.getItem(USER_KEY);
      return json ? (JSON.parse(json) as UserModel) : null;
    } catch (error) {
      console.error('UserStorage.getUser error:', error);
      return null;
    }
  },

  // ✅ Delete user data on logout
  clearUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('UserStorage.clearUser error:', error);
    }
  },
};