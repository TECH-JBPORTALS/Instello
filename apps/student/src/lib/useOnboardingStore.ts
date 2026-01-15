import type { RouterOutputs } from "@instello/api";
import { create } from "zustand";

export type College = Omit<
  RouterOutputs["lms"]["collegeOrBranch"]["list"]["items"][number],
  "collegeId"
>;

export type Branch =
  RouterOutputs["lms"]["collegeOrBranch"]["list"]["items"][number];

interface OnboardingState {
  firstName: string;
  lastName: string;
  dob: Date;
  college?: College;
  branch?: Branch;
  isCoursesLoading: boolean;
  isBranchesLoading: boolean;
  setField: <K extends keyof OnboardingState>(
    key: K,
    value: OnboardingState[K],
  ) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  firstName: "",
  lastName: "",
  dob: new Date(),
  isCoursesLoading: false,
  isBranchesLoading: false,
  setField: (key, value) => set({ [key]: value }),
  reset: () =>
    set({
      firstName: "",
      lastName: "",
      dob: new Date(),
      college: undefined,
      branch: undefined,
      isBranchesLoading: false,
      isCoursesLoading: false,
    }),
}));
