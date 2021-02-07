import create from "zustand";

export const authStore = create((set) => ({
  authenticated: false,
  roles: [],
  userDetails: null,
  loading: false,
  setLoading: (loading) => set(() => ({ loading })),
  setUserDetails: (details) =>
    set(() => ({ userDetails: details, authenticated: details != null })),
  authenticate: () => set((state) => ({ authenticated: true })),
  updateRoles: (roles) => set((state) => ({ roles: roles })),
  logout: () => {
    set((state) => ({
      authenticated: false,
      userDetails: null,
      rules: [],
      loading: false,
    }));
  },
}));

export const ordersStore = create((set) => ({
  orders: null,
  setOrdersInformation: (data) => set((state) => ({ orders: data })),
}));
