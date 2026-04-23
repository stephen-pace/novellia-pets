import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppData } from "../types";

export const STORAGE_KEY = "novelliaPetsData";

const defaultAppData: AppData = {
  username: null,
  pets: [],
};

export async function loadAppData(): Promise<AppData> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return defaultAppData;
  }

  return JSON.parse(raw) as AppData;
}

export async function saveAppData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function clearAppData(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
