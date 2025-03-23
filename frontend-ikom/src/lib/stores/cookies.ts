// @/store/adminStore.ts
import { create } from "zustand";
import { getDecryptedCookie } from "@/lib/aes/get-cookie";
import { AuthAdmin } from "../api";

type AdminStore = {
  admin: AuthAdmin | null;
  loadAdmin: () => void;
};

export const useAdminStore = create<AdminStore>((set) => ({
  admin: null,
  loadAdmin: () => {
    if (typeof window === "undefined") return;

    const adminData = getDecryptedCookie<AuthAdmin>("formateur");
    if (adminData) {
      set({ admin: adminData });
    } else {
      console.error("Aucune donnée valide trouvée dans le cookie 'admin'");
      set({ admin: null });
    }
  },
}));
