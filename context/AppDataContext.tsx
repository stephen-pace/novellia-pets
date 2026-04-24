import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { clearAppData, loadAppData, saveAppData } from "../Storage/appData";
import type { AppData, Pet } from "../types";

type AppDataContextValue = {
  appData: AppData;
  username: string | null;
  pets: Pet[];
  selectedPetId: string | null;
  currentPet: Pet | null;
  isLoading: boolean;
  setSelectedPetId: (petId: string) => void;
  setUsername: (username: string) => Promise<void>;
  addPet: (pet: Pet) => Promise<void>;
  updatePet: (pet: Pet) => Promise<void>;
  removePet: (petId: string) => Promise<void>;
  resetAppData: () => Promise<void>;
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
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentPet =
    appData.pets.find((pet) => pet.id === selectedPetId) ??
    appData.pets[0] ??
    null;

  useEffect(() => {
    const loadInitialAppData = async () => {
      try {
        // Load persisted data from local storage
        const storedAppData = await loadAppData();
        setAppData(storedAppData);
        setSelectedPetId(storedAppData.pets[0]?.id ?? null);
      } catch (error) {
        console.error("Failed to load app data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialAppData();
  }, []);

  useEffect(() => {
    setSelectedPetId((currentSelectedPetId) => {
      if (appData.pets.length === 0) {
        return null;
      }

      if (
        currentSelectedPetId &&
        appData.pets.some((pet) => pet.id === currentSelectedPetId)
      ) {
        return currentSelectedPetId;
      }

      return appData.pets[0].id;
    });
  }, [appData.pets]);

  const updateAppData = async (
    updater: (prev: AppData) => AppData,
  ): Promise<void> => {
    let nextAppData: AppData | null = null;

    setAppData((prev) => {
      nextAppData = updater(prev);
      return nextAppData;
    });

    if (nextAppData) {
      // Saves to local storage
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
    setSelectedPetId(pet.id);
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

  const resetAppData = async () => {
    // Clears local storage to return app to onboarding state
    await clearAppData();
    setAppData(defaultAppData);
    setSelectedPetId(null);
  };

  return (
    <AppDataContext.Provider
      value={{
        appData,
        username: appData.username,
        pets: appData.pets,
        selectedPetId: currentPet?.id ?? null,
        currentPet,
        isLoading,
        setSelectedPetId,
        setUsername,
        addPet,
        updatePet,
        removePet,
        resetAppData,
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
