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
const INCREASE_COUNT = 2; // TEST를 쉽게 하기 위해 1 -> 2로 수정
interface Info {
  actCount: number;
  actTotalCount: number;
  makeAvailableSeconds: number;
  makerAka: string;
  fullCount: number;
  timer: NodeJS.Timeout | null;

  incrementActCount: () => void;
  setCompleteAct: () => void;
  setMakerAka: (makerAka: string) => void;
  setTimer: () => void;
}
export const useInfoStore = create<Info>()(
  persist(
    (set) => ({
      fullCount: FULL_COUNT,
      actCount: 0,
      actTotalCount: 0,
      makeAvailableSeconds: 0,
      makerAka: "",
      timer: null,

      incrementActCount: () =>
        set((state) => ({
          actCount: state.actCount + INCREASE_COUNT,
          actTotalCount: state.actTotalCount + INCREASE_COUNT,
          makeAvailableSeconds: 5,
        })),

      setCompleteAct: () =>
        set((state) => ({
          actCount: state.actTotalCount % state.fullCount,
        })),

      setMakerAka: (makerAka) => set({ makerAka }),

      setTimer: () =>
        set((state) => {
          if (state.timer) {
            clearInterval(state.timer);
          }
          const timer = setInterval(() => {
            set((prevState) => {
              if (prevState.makeAvailableSeconds > 0) {
                return {
                  makeAvailableSeconds: prevState.makeAvailableSeconds - 1,
                };
              } else {
                clearInterval(timer);
                return { timer: null };
              }
            });
          }, 1000);

          return { timer };
        }),
    }),
    {
      name: "info-storage",
    },
  ),
);
