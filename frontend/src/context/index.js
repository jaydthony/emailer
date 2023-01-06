import create from "zustand";
import { persist } from "zustand/middleware";

const siteInfo = create((set) => ({
  info: {},
  setInfo: (info) =>
    set((state) => ({
      info,
    })),
}));
const authToken = create(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    {
      name: "auth", // unique name
    }
  )
);
const profileData = create(
  persist(
    (set) => ({
      data: {},
      setData: (data) =>
        set((state) => ({
          data,
        })),
    }),
    {
      name: "profileData", // unique name
    }
  )
);
const settingsData = create(
  persist(
    (set) => ({
      data: {},
      setData: (data) =>
        set((state) => ({
          data,
        })),
    }),
    {
      name: "profileData", // unique name
    }
  )
);
export { profileData, authToken, siteInfo ,settingsData};
