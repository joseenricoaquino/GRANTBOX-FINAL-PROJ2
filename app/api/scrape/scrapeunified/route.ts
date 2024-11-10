import prisma from "@/lib/prismadb";

import { ObjectId } from "bson";

import { NextResponse } from "next/server";
import { Criteria, Scholarship } from "@prisma/client";
import {
  CoverageType,
  EducationalLevelEnum,
  FinancialStatusEnum,
  FinancialStatusType,
  UniversityPreferenceEnum,
} from "@/utils/types";
import clsx from "clsx";
import { title } from "process";
import puppeteer from 'puppeteer';
import { Page } from 'puppeteer';

import fs from 'fs';
import path from 'path';

interface ScrapedInterfaceCriteria {
    title: string | null;
    description: string;
    scholarshipType: string;
    benefits: string[];
    deadline: string[];
    link: string;
    sourceType: string;
    percentageGrade: string[];
    financialStatus: string[];
    educationalLevel: string[];
    courseload: string[];
    nationality: string[];
    disability: string[];
    militaryExperience: string[];
    courses: string[];
    extracurrAct: string[];
    sports: string[];
    currSchool: string[];
    awards: string[];
    goodmoral: string[];
    deanlister: string[];
    goodHealth: string[];
    age: string[];
    nosiblings: string[];
    parents: string[];
    enrolled: string[];
    imageUrl: string;      // URL of the scholarship image
    imageAltText?: string
  }


  const unifiedKeywords = {
    award: [
      "excellent academic performance",
      "good academic standing",
      "exemplary performance in their academics",
      "first honors",
      "second honors",
      "third honors",
      "with high honors",
      "with the highest honor",
      "president's list",
      'top 1', 'top 2', 'top 3', 'valedictorian', 'salutatorian', 'first honorable mention', 'editors-in-chief'
    ],
    enrolled: [
        "enrolled"
      ],
    nationality: [
        "filipino",
        "indigenous people",
        "guam",
      ],
    benefit: [
      "100% discount",
      "20% discount",
      "50% discount",
      "90% discount",
      "80% discount",
      "full scholarship",
      "partial scholarship",
      "20% discount",
      "100% or 50% basic tuition fee",
      "100% full discount",
      "100% basic tuition fee",
      "full (100%) basic tuition fee",
      "50 basic tuition fee",
      "basic tuition fee",
      "miscellaneous",
      "supplemental",
      "Free books",
      "Free four (4) sets of school uniform",
      "full amount of tuition",
      "other school fees",
      "free matriculation fee",
      "a quarterly stipend of php 5,000",
      "quarterly book allowance of php 3,000",
      "a quarterly stipend of Php 10,000",
      "100% discount",
      "full academic scholarship",
      '50% on tuition discount',
      '100% on tuition discount',
      "50% tuition discount",
      "Partial Tuition Fee",
      "75% of the tuition fee",
      "50% of the tuition fee",
      "25% of the tuition fee",
      "php10,000.00",
      "php 25,000.00",
      "$400 grant",
      '50%','free tuition', 'discount', 'tuition fee', 'miscellaneous fee','full tuition',
      '75% miscellaneous fee subsidy', '100% tuition', 'matriculation fees', 'Php 60,000 per year',
    ],
    courseload: [
      "regular load",
      "regular status",
      "regular academic status",
      "full load",
      "15-units",
      "18 units",
      "21 units",
      "12 academic units",
      "(10) units",
      "regular load",
    ],
    financialStatus: [
      "in need of financial assistance",
      "financially handicapped",
      "10,000",
      "monthly income",
      "Php 15,000 financial assistance",
      "in need of financial assistance",
      "financial need",
      "php 400,000.00",
      "php 450,000.00",
      "php 500,000.00",
      "php 250,000.00",
    ],
    percentageGrade: [
      "70",
      "80",
      "83",
      "84",
      "85",
      "90",
      "92.99",
      "93",
      "95.99",
      "1.00",
      "1.50",
      "1.51",
      "1.75",
      "1.99",
      "2.00",
      "2.25",
      "2.44",
      "2.50",
      "2.65",
      "2.75",
      "3.00",
    ],
    educationalLevel: [
      "senior high school",
      "college",
      "freshmen",
      "grade 12",
      "2nd year college",
      "first year",
      "shs",
      "freshman",
      "3rd",
      "4th",
      "5th",
      "2nd year",
      "3rd year",
      "4th-year",
    ],
    noSiblings: [
      "brother or sister",
      "two or more"
    ],
    militaryExperience: [
      "children of military personnel",
      "dependent of military personnel",
    ],
    courses: [
      "bachelor",
      "leap med",
      "faculty of civil law",
      "faculty of medicine and surgery",
      "degree programs",
      "education",
      "psychology",
      "dietetics",
      "nutrition",
      "accountancy",
      "engineering",
      "department of education",
      "bachelor of science in business administration",
      "bachelor of science in global management",
      "bachelor of science in financial technology",
      "bachelor of science in business intelligence and analytics",
      "bachelor of science in marketing",
      "bachelor of science in accountancy",
      "bachelor of science in customs administration",
      "bachelor of science major in psychology",
      "interior design",
      "engineering and sciences",
      "architecture and design",
      "information technology",
      "computer engineering",
      "computer science",
      "multimedia arts",
      "music education",
      "science student",
      "engineering",
      "architecture",
      "che",
      "chm",
      "bt",
    ],
    extracurrAct: [
      "music",
      "singers",
      "rotc",
      "arts",
      "domnet",
      "recognized student organization",
      "academic scholars activities",
      "sunday eucharist",
      "officership",
      "active membership",
      "cultural artist",
      "creative media artist",
      "campus journalist",
      'dance troupe', 'chorale grant'
    ],
    goodmoral: [
      "good moral character",
      "good moral",
    ],
    deanlister: [
      "dean's list"
    ],
    sports: [
      "sports",
      "student athlete",
      "athletic",
    ],
    parent: [
      "solo parent",
      "indigent family/clan",
      "ofw",
    ],
    disability: [
      "pwd",
      "pwd students",
    ],
    deadline: [
      "one week after the adjustment period of each semester",
      "october 1, 2024",
      "january 5 to february 15, 2024"
    ],
    currentSchool: [
      "mapúa",
      "science high school",
    ],
    goodHealth: [
      "good health",
    ],

  };


enum CollegeEnum {
    NTC = "NTC",
    Letran = "Letran",
    UST = "UST",
    PUP = "PUP",
    MAPUA = "MAPUA",
    LPU = "LPU",
    SPU = "SPU",
    FEU = "FEU",
  }
  
  interface ScrapingConfig {
    selectors: {
      scholarshipContainer: string;
      title?: string;
      description?: string;
      additionaldescription: string;
      eligibility?: string;  // Optional selector
      tosubmit?: string;     // Optional selector for where to submit
      contactperson?: string; // Optional selector for contact person
      deadline?: string;     // Optional selector for deadline
      remarks?: string; 
      image?: string; 
      requirementsContainer?: string;
    };
    keywords: {
      award: string[];
      benefit: string[];
      courseload: string[];
      financialStatus: string[];
      percentageGrade: string[];
      educationalLevel: string[];
      noSiblings: string[];
      militaryExperience: string[];
      courses: string[];
      extracurrAct: string[];  // Add extracurrAct   
      goodmoral: string[];      // Add goodmoral
      deanlister: string[];
      enrolled: string[];
      sports: string[];
      nationality: string[];
      parent: string[];
      disability: string[];
      deadline: string[];
      currentSchool: string[],
      goodHealth: string[],
      
    };
  }
  
  const scrapingConfigs: Record<CollegeEnum, ScrapingConfig> = {
    [CollegeEnum.NTC]: {
      selectors: {
        scholarshipContainer: 'div.wp-block-kadence-pane',
        title: 'strong',
        description: '.kt-accordion-panel-inner',
        additionaldescription: '.col-md-8 p.lead', //  optional
      },
      keywords: unifiedKeywords,
    },
    [CollegeEnum.Letran]: {
      selectors: {
        scholarshipContainer: '#mCSB_2_container div:nth-of-type(n+3)',
        title: 'a',
        description: '#collapse2 > div, #collapse3 > div',
        additionaldescription: '.col-md-8 p.lead', // optional
      },
      keywords: unifiedKeywords,
    },
    [CollegeEnum.UST]: {
      selectors: {
        scholarshipContainer: 'section:nth-of-type(n+2)',
        title: 'h2',
        description: '.col-md-8 p:nth-of-type(1)',
        additionaldescription: '.col-md-8 p.lead',
        image: 'img.img-fluid.rounded-circle',
      },
      keywords: unifiedKeywords,
    },
    [CollegeEnum.PUP]: {
      selectors: {
        scholarshipContainer: 'tbody tr',
        title: '.tblD h4',
        description: 'td.tblD.dtr-control',
        additionaldescription: '.col-md-8 p.lead', // optional
        eligibility: 'td.tblD:nth-of-type(2)',
        tosubmit: 'td.tblD:nth-of-type(3)',
        contactperson: 'td.tblD:nth-of-type(4)',
        deadline: 'td.tblD:nth-of-type(5)',
        remarks: 'td.tblD:nth-of-type(6)',
      },
      keywords: unifiedKeywords,
    },
    [CollegeEnum.MAPUA]: {
      selectors: {
        scholarshipContainer: '.accordion-item',
        title: 'h3.text-base.font-semibold',
        description: '.accordion-desc',
        additionaldescription: '.col-md-8 p.lead', //optional
      },
      keywords: unifiedKeywords,
    },
    [CollegeEnum.LPU]: {
      selectors: {
        scholarshipContainer: 'div.wp-block-pb-accordion-item',
        title: 'h2.c-accordion__title',
        description: 'div#ac-1310, div#ac-1311, div#ac-1312',
        additionaldescription: '.col-md-8 p.lead', //optional
      },
      keywords: unifiedKeywords,
    },
    [CollegeEnum.SPU]: {
      selectors: {
        scholarshipContainer: 'div:nth-of-type(3) ol:nth-of-type(1) li',
        requirementsContainer: 'ol:nth-of-type(2)',
        title: 'li p b',
        description: 'div:nth-of-type(3) li p',
        additionaldescription: '.col-md-8 p.lead', //optional
      },
      keywords: unifiedKeywords,
    },
    [CollegeEnum.FEU]: {
      selectors: {
        scholarshipContainer: 'h3.clh3',
        title: '',
        description: '',
        additionaldescription: '.col-md-8 p.lead', //optional
      },
      keywords: unifiedKeywords,
    },
  };


  // Helper function to retry navigation if it times out
  async function safeGoto(page: Page, url: string, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 }); // Increased timeout to 60 seconds
        return; // Exit if navigation succeeds
      } catch (error) {
        if (i === retries - 1) throw error; // Rethrow error if last retry fails
      }
    }
  }
 

  const undesiredTitles = ["schedule of scholarship application", "financial assistance and tuition discounts","submission of requirements"];
  
  async function scrapeScholarshipData(url: string, college: CollegeEnum) {
    const config = scrapingConfigs[college];
  
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    // Use safeGoto to navigate to the URL
    await safeGoto(page, url);

    await page.waitForSelector(config.selectors.scholarshipContainer, { timeout: 15000 });
  

    const scholarshipData: ScrapedInterfaceCriteria[] = await page.evaluate((config, college, undesiredTitles) => {
      const scholarshipsPod = Array.from(document.querySelectorAll(config.selectors.scholarshipContainer));
      // Only call querySelectorAll if requirementsContainer is defined
      const requirementsPod = config.selectors.requirementsContainer?Array.from
      (document.querySelectorAll(config.selectors.requirementsContainer)): []; // Return an empty array if requirementsContainer is not defined
      // Collect all requirements
      const requirementsText = requirementsPod.map((li: Element) => (li as HTMLElement).innerText.trim());
  
      return scholarshipsPod.map((scholarshipsPod) => {
        //main selectors
        const titleElement = config.selectors.title ? scholarshipsPod.querySelector(config.selectors.title) as HTMLElement : null;
        // Try to get the description element based on the selector if provided, else use the next sibling
        const descriptionElement = config.selectors.description
        ? scholarshipsPod.querySelector(config.selectors.description) as HTMLElement
       : scholarshipsPod.nextElementSibling as HTMLElement;
        const additionaldesElement = scholarshipsPod.querySelector(config.selectors.additionaldescription) as HTMLElement;
        //Optional selectors
        const eligibilityElement = config.selectors.eligibility ? 
        scholarshipsPod.querySelector(config.selectors.eligibility) as HTMLElement : null;
        const tosubmitElement = config.selectors.tosubmit ? 
        scholarshipsPod.querySelector(config.selectors.tosubmit) as HTMLElement : null;
        const contactpersonElement = config.selectors.contactperson ? 
        scholarshipsPod.querySelector(config.selectors.contactperson) as HTMLElement : null;
        const deadlineElement = config.selectors.deadline ? 
        scholarshipsPod.querySelector(config.selectors.deadline) as HTMLElement : null;
        const remarksElement = config.selectors.remarks ? 
        scholarshipsPod.querySelector(config.selectors.remarks) as HTMLElement : null;
        const imageElement = config.selectors.image ? 
        scholarshipsPod.querySelector(config.selectors.image) as HTMLImageElement : null;
        // Elements Text
        const titleText = titleElement?.textContent?.trim() || scholarshipsPod.textContent?.trim() || 'No title'; // Ensure titleText is never null
        
        let descriptionText;
        if (descriptionElement) {
        // If there are list items, map over them to get trimmed text content, else get plain text
        const listItems = Array.from(descriptionElement.querySelectorAll('li'));
        descriptionText = listItems.length > 0
        ? listItems.map(item => item.textContent?.trim() || '').join(', ')
        : descriptionElement.innerText.trim();
        } else {
          descriptionText = 'No description';
        }

        const additionaldesText = additionaldesElement ? additionaldesElement.innerText : 'No description';
        const eligibilityText = eligibilityElement ? eligibilityElement.innerText : "N/A";
        const tosubmitText = tosubmitElement ? tosubmitElement.innerText : "N/A";
        const contactpersonText = contactpersonElement ? contactpersonElement.innerText : "N/A";
        const deadlineElementText = deadlineElement ? deadlineElement.innerText : "N/A";
        const remarksText = remarksElement ? remarksElement.innerText : "N/A";
        // image Grab
        const imageUrl = imageElement ? imageElement.src : "N/A"; 
        const imageAltText = imageElement ? imageElement.alt : "N/A"; 

        // Combine criteria/requirements
        let specificDescriptionText = `${descriptionText}${additionaldesText}${requirementsText.join(", ")}${eligibilityText}${tosubmitText}${contactpersonText}${deadlineElementText}${remarksText}`;
      
  
        const awardsText = config.keywords.award.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const benefitText = config.keywords.benefit.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const courseloadText = config.keywords.courseload.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const financialStatusText = config.keywords.financialStatus.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const percentageGradeText = config.keywords.percentageGrade.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const educLevelText = config.keywords.educationalLevel.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const nosiblingsText = config.keywords.noSiblings.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const militaryText = config.keywords.militaryExperience.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const coursesText = config.keywords.courses.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const extracurrActText = config.keywords.extracurrAct.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const enrolledText = config.keywords.enrolled.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const nationailtyText = config.keywords.nationality.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const parentText = config.keywords.parent.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const disabilityText = config.keywords.disability.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const goodmoralText = config.keywords.goodmoral.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const deanlisterText = config.keywords.deanlister.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const sportsText = config.keywords.sports.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const deadlineText = config.keywords.deadline.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const currentSchoolText = config.keywords.currentSchool.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));
        const goodHealthText = config.keywords.goodHealth.filter(keyword => specificDescriptionText.toLowerCase().includes(keyword));

    
      if (college === "UST") {
        specificDescriptionText = `${descriptionText}\n\n${additionaldesText}`.trim();
      }
      if (college === "SPU" && titleText) {
        descriptionText = descriptionText.replace(titleText, '').trim();
        specificDescriptionText = `${descriptionText}\n\nREQUIREMENTS FOR ALL TYPES OF SCHOLARSHIP:\n\n${requirementsText.join(", ")}`.trim();
      }
     if (college === "PUP") {
        specificDescriptionText = `${descriptionText}\n\nHOW TO APPLY:\n\n${eligibilityText}\n\nWHERE TO SUBMIT:${tosubmitText}\nContact Person:${contactpersonText}\n\nDEADLINE OF APPLICATION:${deadlineElementText}\n\nREMARKS${remarksText}`.trim();
      }

     // Check if the title matches any undesired keywords
     if (undesiredTitles.some(undesired => titleText.toLowerCase().includes(undesired.toLowerCase()))) {
        return null; // Exclude this scholarship by returning null
    }

        return {
          title: titleText,
          description: specificDescriptionText,
          benefits: benefitText,
          percentageGrade: percentageGradeText,
          financialStatus: financialStatusText,
          educationalLevel: educLevelText,
          courseload: courseloadText,
          militaryExperience: militaryText,
          courses: coursesText,
          awards: awardsText,
          link: window.location.href,
          sourceType: "Scraped",
          scholarshipType: "",
          deadline: deadlineText,
          nationality: nationailtyText,
          disability: disabilityText,
          extracurrAct: extracurrActText,
          sports: sportsText,
          currSchool: currentSchoolText,
          goodmoral: goodmoralText,
          deanlister: deanlisterText,
          goodHealth: goodHealthText,
          age: [],
          nosiblings: nosiblingsText,
          parents: parentText,
          enrolled: enrolledText,
          imageUrl: imageUrl,
          imageAltText: imageAltText,
        } as ScrapedInterfaceCriteria;
      })
      .filter((scholarship): scholarship is ScrapedInterfaceCriteria => scholarship !== null); // Filter out any null values
    }, config, college, undesiredTitles);

    console.log(`Scholarship Data for ${college}:`, scholarshipData);
  
    await browser.close();
  }
  
  const universityUrls: Record<CollegeEnum, string> = {
    [CollegeEnum.Letran]: "https://www.letran.edu.ph/Admission/Home",
    [CollegeEnum.NTC]: "https://ntc.edu.ph/scholarships/",
    [CollegeEnum.UST]: "https://manila.ust.edu.ph/osawebapp/osainfo-scholarshipoffered",
    [CollegeEnum.PUP]: "https://www.pup.edu.ph/students/scholarships",
    [CollegeEnum.MAPUA]: "https://www.mapua.edu.ph/pages/admissions/mapua-scholarships/undergraduate",
    [CollegeEnum.LPU]: "https://manila.lpu.edu.ph/admissions/academic-scholarships-and-financial-aid-grants/",
    [CollegeEnum.SPU]: "https://spumanila.edu.ph/students/scholarships",
    [CollegeEnum.FEU]: "https://www.feutech.edu.ph/admission/scholarship-grants",
  };
  
  async function handleBrowseUniversity(university: CollegeEnum) {
    const url = universityUrls[university];
    if (!url) {
      throw new Error(`No URL found for university: ${university}`);
    }
  
    // Use the unified scraping function with the URL and university enum
    const scholarships = await scrapeScholarshipData(url, university);
    return scholarships;
  }

  export async function POST(request: Request) {
    try {
      const body = await request.json();
      const {} = body; // Use body properties if needed
  
      const UNIVERSITIES: CollegeEnum[] = [
        // CollegeEnum.Letran,
        // CollegeEnum.NTC,
        // CollegeEnum.UST,
        // CollegeEnum.PUP,
        // CollegeEnum.LPU,
        // CollegeEnum.MAPUA,
        // CollegeEnum.SPU,
        CollegeEnum.FEU,
        // Add more universities as needed
      ];
  
      const allScholarships = await Promise.all(
        UNIVERSITIES.map((university) => handleBrowseUniversity(university))
      );
  
      console.log(allScholarships);
  
      return NextResponse.json(allScholarships);
    } catch (error) {
      console.log(error, "SCRAPE_ERROR");
      return new NextResponse(`Internal Error: ${error}`, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }