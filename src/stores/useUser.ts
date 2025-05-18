import { create } from "zustand";

type User = {
  uid?: string;
  name: string;
  username: string;
  cover: string;
  avatar: string;
  bio: {
    location?: string;
    occupation?: string;
    introduction?: string;
    contact?: string;
  };
  joined_at: string;
};

type UserState = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));
