import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  GROUPS: '@groups',
};

export const saveGroups = async (groups) => {
  try {
    await AsyncStorage.setItem(KEYS.GROUPS, JSON.stringify(groups));
  } catch (e) {
    console.error('Error saving groups:', e);
  }
};

export const loadGroups = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.GROUPS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading groups:', e);
    return [];
  }
};