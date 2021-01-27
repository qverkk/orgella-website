import create from "zustand";

export const authStore = create((set) => ({
  authenticated: false,
  roles: [],
  authenticate: () => set((state) => ({ authenticated: true })),
  updateRoles: (roles) => set((state) => ({ roles: roles })),
}));

export const cartStore = create((set, get) => ({
  items: [],
  addItem: (item) => {
    var found = false;
    for (const i in get().items) {
      if (get().items[i].product.auctionPath == item.product.auctionPath) {
        const calculatedAmount = get().items[i].amount + item.amount;
        const maxQuantity = get().items[i].product.quantity;
        if (maxQuantity <= calculatedAmount) {
          get().items[i].amount = maxQuantity;
        } else {
          get().items[i].amount = calculatedAmount;
        }
        found = true;
        break;
      }
    }
    if (!found) {
      set((state) => ({ items: [...state.items, item] }));
    }
  },
  removeProductByAuctionPath: (auctionPath) => {
    let filteredArray = get().items.filter(
      (item) => item.product.auctionPath !== auctionPath
    );
    set({ items: filteredArray });
  },
}));
