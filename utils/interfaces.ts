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
  name: string | undefined;
  coverage: string | undefined;
  category: string | undefined;
  from: string | undefined;
  to: string | undefined;
};
export type FullStudentType = User & {
  studentCriteria: StudentCriteria;
  studentBackground: StudentBackground;
  role: "STUDENT";
};
