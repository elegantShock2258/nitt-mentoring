import { defineStore } from "pinia";
import { User } from "types/types";

export const useUserStore = defineStore("userInfo", {
  state: () => {
    return {
      username: "",
      loggedIn: false,
      department: "NONE",
      id: 0,
      level: -1,
      faculty: false,
      student: false,
    } as User & { loggedIn: boolean, department: string };
  },
  actions: {
    signOut() {
      this.loggedIn = false;
    },
  },
});
