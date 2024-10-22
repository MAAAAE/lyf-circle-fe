import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUseUserIdStore {
  user_id: string;
  setUser_id: (userId: string) => void;
}

const useUserIdStore = create(
  persist<IUseUserIdStore>(
    (set) => ({
      user_id: "",
      setUser_id: (userId: string) => set(() => ({ user_id: userId })),
    }),

    {
      name: "userIdStorage",
    }
  )
);

export default useUserIdStore;