import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { loadAppData, saveAppData } from "../storage/appData";
import type { AppData, Pet } from "../types";

type AppDataContextValue = {
  appData: AppData;
  username: string | null;
  pets: Pet[];
  isLoading: boolean;
  setUsername: (username: string) => Promise<void>;
  addPet: (pet: Pet) => Promise<void>;
  updatePet: (pet: Pet) => Promise<void>;
  removePet: (petId: string) => Promise<void>;
};

const defaultAppData: AppData = {
  username: null,
  pets: [],
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

type AppDataProviderProps = {
  children: ReactNode;
};

export const AppDataProvider = ({ children }: AppDataProviderProps) => {
  const [appData, setAppData] = useState<AppData>(defaultAppData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialAppData = async () => {
      try {
        const storedAppData = await loadAppData();
        setAppData(storedAppData);
      } catch (error) {
        console.error("Failed to load app data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialAppData();
  }, []);

  const updateAppData = async (
    updater: (prev: AppData) => AppData,
  ): Promise<void> => {
    let nextAppData: AppData | null = null;

    setAppData((prev) => {
      nextAppData = updater(prev);
      return nextAppData;
    });

    if (nextAppData) {
      await saveAppData(nextAppData);
    }
  };

  const setUsername = async (username: string) => {
    await updateAppData((prev) => ({
      ...prev,
      username,
    }));
  };

  const addPet = async (pet: Pet) => {
    await updateAppData((prev) => ({
      ...prev,
      pets: [...prev.pets, pet],
    }));
  };

  const updatePet = async (pet: Pet) => {
    await updateAppData((prev) => ({
      ...prev,
      pets: prev.pets.map((existingPet) =>
        existingPet.id === pet.id ? pet : existingPet,
      ),
    }));
  };

  const removePet = async (petId: string) => {
    await updateAppData((prev) => ({
      ...prev,
      pets: prev.pets.filter((pet) => pet.id !== petId),
    }));
  };

  return (
    <AppDataContext.Provider
      value={{
        appData,
        username: appData.username,
        pets: appData.pets,
        isLoading,
        setUsername,
        addPet,
        updatePet,
        removePet,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }

  return context;
};
