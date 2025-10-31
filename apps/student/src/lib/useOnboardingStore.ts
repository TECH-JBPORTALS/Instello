import { RouterOutputs } from "@instello/api";
import { create } from "zustand";

export type Course = Omit<
  RouterOutputs["lms"]["courseOrBranch"]["list"][number],
  "courseId"
>;

export type Branch = RouterOutputs["lms"]["courseOrBranch"]["list"][number];

type OnboardingState = {
  firstName: string;
  lastName: string;
  dob: Date;
  course?: Course;
  branch?: Branch;
  isCoursesLoading: boolean;
  isBranchesLoading: boolean;
  setField: <K extends keyof OnboardingState>(
    key: K,
    value: OnboardingState[K],
  ) => void;
  reset: () => void;
};

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
      course: undefined,
      branch: undefined,
      isBranchesLoading: false,
      isCoursesLoading: false,
    }),
}));
