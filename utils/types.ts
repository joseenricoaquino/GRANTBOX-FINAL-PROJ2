export type EducationalLevelType =
  | "Incoming College Student"
  | "Current College Student";
export const EducationalLevelEnum: EducationalLevelType[] = [
  "Current College Student",
  "Incoming College Student",
];

export const ScholarshipMapping = {
  isVarsityScholarship: "Academic Scholarship",
  isArtistScholarship: "Creative Scholarship",
  isInnnovative: "International Scholarship",
  isMinority: "Minority Scholarship",
  isPWD: "PWD Scholarship",
  isExtracurricular: "Merit Scholarship",
  isLeader: "Merit Scholarship",
  isStudentWorker: "Student Worker Scholarship",
};

export type ScholarshipType =
  | "N/A"
  | "Athletic Scholarship"
  | "Academic Scholarship"
  | "Need-Based Scholarship"
  | "Merit Scholarship"
  | "Minority Scholarship"
  | "International Scholarship"
  | "Creative Scholarship"
  | "PWD Scholarship"
  | "Leadership Scholarship"
  | "Student Worker Scholarship";
export const ScholarshipTypeEnum: ScholarshipType[] = [
  "Athletic Scholarship",
  "Academic Scholarship",
  "Need-Based Scholarship",
  "Merit Scholarship",
  "Minority Scholarship",
  "International Scholarship",
  "Creative Scholarship",
  "PWD Scholarship", // New category for isPWD
  "Student Worker Scholarship", // New category for isStudentWorker
];
export const Half1ScholarshipTypeEnum: ScholarshipType[] = [
  "Athletic Scholarship",
  "Academic Scholarship",
];
export const Half2ScholarshipTypeEnum: ScholarshipType[] = [
  "Need-Based Scholarship",
  "Merit Scholarship",
  "Minority Scholarship",
  "International Scholarship",
  "Creative Scholarship",
  "PWD Scholarship",
  "Student Worker Scholarship",
];

export type CoverageType =
  | "Full Tuition"
  | "Partial Tuition"
  | "Full Ride"
  | "Room and Board"
  | "Books and Supplies"
  | "Travel Expenses"
  | "Miscellaneous Expenses";
export const CoverageTypeEnum: CoverageType[] = [
  "Full Tuition",
  "Partial Tuition",
  "Full Ride",
  "Room and Board",
  "Books and Supplies",
  "Travel Expenses",
  "Miscellaneous Expenses",
];
export const Half1CoverageTypeEnum: CoverageType[] = [
  "Full Tuition",
  "Partial Tuition",
];
export const Half2CoverageTypeEnum: CoverageType[] = [
  "Full Ride",
  "Room and Board",
  "Books and Supplies",
  "Travel Expenses",
  "Miscellaneous Expenses",
];

export type FinancialStatusType =
  | "Not Specified"
  | "Below PHP 100,000"
  | "PHP 100,001 - PHP 200,000"
  | "PHP 200,001 - PHP 300,000"
  | "PHP 300,001 - PHP 500,000"
  | "PHP 500,001 - PHP 1,000,000"
  | "Above PHP 1,000,000";
export const FinancialStatusEnum: FinancialStatusType[] = [
  "Not Specified",
  "Below PHP 100,000",
  "PHP 100,001 - PHP 200,000",
  "PHP 200,001 - PHP 300,000",
  "PHP 300,001 - PHP 500,000",
  "PHP 500,001 - PHP 1,000,000",
  "Above PHP 1,000,000",
];

export type UniversityPreferenceType =
  | "Adamson University"
  | "Air Link International Aviation College"
  | "AMA Computer University"
  | "Arellano University"
  | "Asia Pacific College"
  | "Asia School of Arts and Sciences"
  | "Asian College Quezon City"
  | "De La Salle Manila"
  | "De La Salle Benilde"
  | "Ateneo de Manila University"
  | "University of the Philippines Diliman"
  | "University of Santo Tomas"
  | "Far Eastern University"
  | "Mapúa University"
  | "Polytechnic University of the Philippines"
  | "San Beda University"
  | "Lyceum of the Philippines University"
  | "Centro Escolar University"
  | "Pamantasan ng Lungsod ng Maynila"
  | "University of the East"
  | "Technological Institute of the Philippines"
  | "National University"
  | "Philippine Normal University"
  | "Silliman University"
  | "Saint Louis University"
  | "University of San Carlos"
  | "Cebu Technological University"
  | "Mindanao State University"
  | "University of Southern Mindanao"
  | "Colegio de San Juan de Letran";
export const UniversityPreferenceEnum: UniversityPreferenceType[] = [
  "Adamson University",
  "Air Link International Aviation College",
  "AMA Computer University",
  "Arellano University",
  "Asia Pacific College",
  "Asia School of Arts and Sciences",
  "Asian College Quezon City",
  "De La Salle Manila",
  "De La Salle Benilde",
  "Ateneo de Manila University",
  "University of the Philippines Diliman",
  "University of Santo Tomas",
  "Far Eastern University",
  "Mapúa University",
  "Polytechnic University of the Philippines",
  "San Beda University",
  "Lyceum of the Philippines University",
  "Centro Escolar University",
  "Pamantasan ng Lungsod ng Maynila",
  "University of the East",
  "Technological Institute of the Philippines",
  "National University",
  "Philippine Normal University",
  "Silliman University",
  "Saint Louis University",
  "University of San Carlos",
  "Cebu Technological University",
  "Mindanao State University",
  "University of Southern Mindanao",
  "Colegio de San Juan de Letran",
];

export type CollegeCourseType =
  | "Bachelor of Science Major in Software Technology"
  | "Bachelor of Science in Computer Science"
  | "Bachelor of Science in Information Technology"
  | "Bachelor of Science in Information Systems"
  | "Bachelor of Science in Computer Engineering"
  | "Bachelor of Science in Electronics and Communications Engineering"
  | "Bachelor of Science in Electrical Engineering"
  | "Bachelor of Science in Mechanical Engineering"
  | "Bachelor of Science in Civil Engineering"
  | "Bachelor of Science in Chemical Engineering"
  | "Bachelor of Science in Industrial Engineering"
  | "Bachelor of Science in Architecture"
  | "Bachelor of Science in Accountancy"
  | "Bachelor of Science in Business Administration"
  | "Bachelor of Science in Entrepreneurship"
  | "Bachelor of Science in Marketing Management"
  | "Bachelor of Science in Financial Management"
  | "Bachelor of Science in Hospitality Management"
  | "Bachelor of Science in Tourism Management"
  | "Bachelor of Science in Nursing"
  | "Bachelor of Science in Medical Technology"
  | "Bachelor of Science in Pharmacy"
  | "Bachelor of Science in Physical Therapy"
  | "Bachelor of Science in Occupational Therapy"
  | "Bachelor of Science in Biology"
  | "Bachelor of Science in Chemistry"
  | "Bachelor of Science in Physics"
  | "Bachelor of Science in Mathematics"
  | "Bachelor of Science in Statistics"
  | "Bachelor of Science in Psychology"
  | "Bachelor of Arts in Communication"
  | "Bachelor of Arts in Political Science"
  | "Bachelor of Arts in Sociology"
  | "Bachelor of Arts in Philosophy"
  | "Bachelor of Arts in Literature"
  | "Bachelor of Arts in History"
  | "Bachelor of Arts in International Studies"
  | "Bachelor of Arts in Economics"
  | "Bachelor of Arts in Journalism"
  | "Bachelor of Arts in Fine Arts";
export const CollegeCourseEnum: CollegeCourseType[] = [
  "Bachelor of Science Major in Software Technology",
  "Bachelor of Science in Computer Science",
  "Bachelor of Science in Information Technology",
  "Bachelor of Science in Information Systems",
  "Bachelor of Science in Computer Engineering",
  "Bachelor of Science in Electronics and Communications Engineering",
  "Bachelor of Science in Electrical Engineering",
  "Bachelor of Science in Mechanical Engineering",
  "Bachelor of Science in Civil Engineering",
  "Bachelor of Science in Chemical Engineering",
  "Bachelor of Science in Industrial Engineering",
  "Bachelor of Science in Architecture",
  "Bachelor of Science in Accountancy",
  "Bachelor of Science in Business Administration",
  "Bachelor of Science in Entrepreneurship",
  "Bachelor of Science in Marketing Management",
  "Bachelor of Science in Financial Management",
  "Bachelor of Science in Hospitality Management",
  "Bachelor of Science in Tourism Management",
  "Bachelor of Science in Nursing",
  "Bachelor of Science in Medical Technology",
  "Bachelor of Science in Pharmacy",
  "Bachelor of Science in Physical Therapy",
  "Bachelor of Science in Occupational Therapy",
  "Bachelor of Science in Biology",
  "Bachelor of Science in Chemistry",
  "Bachelor of Science in Physics",
  "Bachelor of Science in Mathematics",
  "Bachelor of Science in Statistics",
  "Bachelor of Science in Psychology",
  "Bachelor of Arts in Communication",
  "Bachelor of Arts in Political Science",
  "Bachelor of Arts in Sociology",
  "Bachelor of Arts in Philosophy",
  "Bachelor of Arts in Literature",
  "Bachelor of Arts in History",
  "Bachelor of Arts in International Studies",
  "Bachelor of Arts in Economics",
  "Bachelor of Arts in Journalism",
  "Bachelor of Arts in Fine Arts",
];

