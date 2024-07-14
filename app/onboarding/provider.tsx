"use client";
import {
  CollegeCourseType,
  EducationalLevelType,
  FinancialStatusType,
  UniversityPreferenceType,
} from "@/utils/types";
import { SchoolType } from "@prisma/client";
import * as React from "react";

export type STUDENT_BG = {
  isPWD: boolean;
  isVarsityScholarship: boolean;
  isArtistScholarship: boolean;
  isExtracurricular: boolean;
  isLeader: boolean;
  isMinority: boolean;
  isStudentWorker: boolean;
  isInnnovative: boolean;
};

type ContextType = {
  page: number;
  setPage: (temp: number) => void;

  // PREV SCH INFO
  educationalLevel: EducationalLevelType | undefined;
  setEducationalLevel: (temp: EducationalLevelType | undefined) => void;
  percentageGrade: number | undefined;
  setPercentageGrade: (temp: number | undefined) => void;
  nameOfPrevSchool: string;
  setNameOfPrevSchool: (temp: string) => void;
  typeOfPrevSchool: SchoolType | undefined;
  setTypeOfPrevSchool: (temp: SchoolType | undefined) => void;
  financialStatus: FinancialStatusType | undefined;
  setFinancialStatus: (temp: FinancialStatusType) => void;

  // STUDENT BACKGROUND
  studentBG: STUDENT_BG;
  setStudentBG: (temp: STUDENT_BG) => void;

  // PREFERRENCES
  universityPreferences: UniversityPreferenceType[];
  setUniversityPreferences: (temp: UniversityPreferenceType[]) => void;
  coursePreferences: CollegeCourseType[];
  setCoursePreferences: (temp: CollegeCourseType[]) => void;

  // NOTIFICATIONS
  isNewScholarship: boolean;
  setIsNewScholarship: (temp: boolean) => void;
  isScholarshipDeadline: boolean;
  setIsScholarshipDeadline: (temp: boolean) => void;

  fetchAll: () => any;
};

const Context = React.createContext<ContextType>({
  page: 1,
  setPage: (temp: number) => {},

  // PREV SCH INFO
  educationalLevel: undefined,
  setEducationalLevel: (temp: EducationalLevelType | undefined) => {},
  percentageGrade: undefined,
  setPercentageGrade: (temp: number | undefined) => {},
  nameOfPrevSchool: "",
  setNameOfPrevSchool: (temp: string) => {},
  typeOfPrevSchool: undefined,
  setTypeOfPrevSchool: (temp: SchoolType | undefined) => {},
  financialStatus: undefined,
  setFinancialStatus: (temp: FinancialStatusType) => {},

  studentBG: {
    isPWD: false,
    isArtistScholarship: false,
    isExtracurricular: false,
    isInnnovative: false,
    isLeader: false,
    isMinority: false,
    isStudentWorker: false,
    isVarsityScholarship: false,
  },
  setStudentBG: (temp: STUDENT_BG) => {},

  // PREFERRENCES
  universityPreferences: [],
  setUniversityPreferences: (temp: UniversityPreferenceType[]) => {},
  coursePreferences: [],
  setCoursePreferences: (temp: CollegeCourseType[]) => {},

  // NOTIFICATIONS
  isNewScholarship: false,
  setIsNewScholarship: (temp: boolean) => {},
  isScholarshipDeadline: false,
  setIsScholarshipDeadline: (temp: boolean) => {},

  fetchAll: () => {},
});

export const useOnboardingContext = () => React.useContext(Context);

const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const [page, setPage] = React.useState<number>(1);

  // PREV SCH INFO
  const [educationalLevel, setEducationalLevel] =
    React.useState<EducationalLevelType>();
  const [percentageGrade, setPercentageGrade] = React.useState<number>();
  const [nameOfPrevSchool, setNameOfPrevSchool] = React.useState<string>("");
  const [typeOfPrevSchool, setTypeOfPrevSchool] = React.useState<SchoolType>();
  const [financialStatus, setFinancialStatus] =
    React.useState<FinancialStatusType>();

  const [studentBG, setStudentBG] = React.useState<STUDENT_BG>({
    isPWD: false,
    isVarsityScholarship: false,
    isArtistScholarship: false,
    isExtracurricular: false,
    isLeader: false,
    isMinority: false,
    isStudentWorker: false,
    isInnnovative: false,
  });

  const [universityPreferences, setUniversityPreferences] = React.useState<
    UniversityPreferenceType[]
  >([]);
  const [coursePreferences, setCoursePreferences] = React.useState<
    CollegeCourseType[]
  >([]);

  const [isNewScholarship, setIsNewScholarship] =
    React.useState<boolean>(false);
  const [isScholarshipDeadline, setIsScholarshipDeadline] =
    React.useState<boolean>(false);

  function fetchAll() {
    return {
      educationalLevel,
      percentageGrade,
      nameOfPrevSchool,
      typeOfPrevSchool,
      financialStatus,
      studentBG,
      universityPreferences,
      coursePreferences,
      isNewScholarship,
      isScholarshipDeadline,
    };
  }

  return (
    <Context.Provider
      value={{
        page,
        setPage,

        // PREV SCH INFO
        educationalLevel,
        setEducationalLevel,
        percentageGrade,
        setPercentageGrade,
        nameOfPrevSchool,
        setNameOfPrevSchool,
        typeOfPrevSchool,
        setTypeOfPrevSchool,
        financialStatus,
        setFinancialStatus,

        studentBG,
        setStudentBG,

        // PREFERRENCES
        universityPreferences,
        setUniversityPreferences,
        coursePreferences,
        setCoursePreferences,

        // NOTIFICATIONS
        isNewScholarship,
        setIsNewScholarship,
        isScholarshipDeadline,
        setIsScholarshipDeadline,

        fetchAll,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default OnboardingProvider;
