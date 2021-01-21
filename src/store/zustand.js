import create from "zustand";

export const authStore = create((set) => ({
  authenticated: false,
  roles: [],
  authenticate: () => set((state) => ({ authenticated: true })),
  updateRoles: (roles) => set((state) => ({ roles: roles })),
}));
