import { Scenario } from "@/interfaces/coonyang";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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

const FULL_COUNT = 4;
interface Info {
  actCount: number;
  actTotalCount: number;
  makeAvailableSeconds: number;
  makerAka: string;
  fullCount: number;

  incrementActCount: () => void;
  setCompleteAct: (actTotalCount: number, fullCount: number) => void;
  setMakerAka: (makerAka: string) => void;
}
export const useInfoStore = create<Info>()(
  persist(
    (set) => ({
      fullCount: FULL_COUNT,
      actCount: 0,
      actTotalCount: 0,
      makeAvailableSeconds: 0,
      makerAka: "",

      incrementActCount: () =>
        set((state) => ({
          actCount: state.actTotalCount + 1,
          actTotalCount: state.actTotalCount + 1,
        })),

      setCompleteAct: (actTotalCount, fullCount) =>
        set({ actTotalCount: actTotalCount % fullCount }),

      setMakerAka: (makerAka) => set({ makerAka }),
    }),
    {
      name: "info-storage",
    },
  ),
);
