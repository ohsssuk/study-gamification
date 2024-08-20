import { Scenario } from "@/interfaces/coonyang";
import { create } from "zustand";

interface Dialog {
  scenario: Scenario[];
  finishCallback: () => void;
  createDialog: (scenario: Scenario[], finishCallback?: () => void) => void;
  destoryDialog: () => void;
}
export const useDialogStore = create<Dialog>((set) => ({
  scenario: [],
  finishCallback: () => {},
  createDialog: (scenario, finishCallback = () => {}) =>
    set({
      scenario,
      finishCallback,
    }),
  destoryDialog: () => set({ scenario: [], finishCallback: () => {} }),
}));
