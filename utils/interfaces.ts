import {
  College,
  Criteria,
  Scholarship,
  StudentBackground,
  StudentCriteria,
  User,
} from "@prisma/client";

export type FullCollegeAndScholarshipType = College & {
  scholarships: Scholarship[];
};
export type FullScholarshipType = Scholarship & {
  college: College;
  criteria: Criteria;
};
export type ScholarFilterType = {
  name: string | undefined | null;
  coverage: string | undefined | null;
  category: string | undefined | null;
  from: string | undefined | null;
  to: string | undefined | null;
};
export type FullStudentType = User & {
  studentCriteria: StudentCriteria;
  studentBackground: StudentBackground;
  role: "STUDENT";
};
