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

import puppeteer, { Browser } from 'puppeteer';
import fs from 'fs';
import path from 'path';

//Used For Clearing Temp before Scraping
function clearPuppeteerTemp() {
  const tempPath = path.join(process.env.TEMP || '/tmp', 'puppeteer_dev_chrome_profile-Okya1q');
  if (fs.existsSync(tempPath)) {
    fs.rmdirSync(tempPath, { recursive: true });
  }
}

//Used To handle Navigation Timeout
async function initializeScraping() {
  // Clear temp directory
  clearPuppeteerTemp();

  // Launch Puppeteer with unique user data directory and necessary arguments
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    userDataDir: path.join(process.env.TEMP || '/tmp', `puppeteer_profile_${Date.now()}`)
  });

  // Create and configure a new page with timeouts
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000); // 60 seconds default

  return { browser, page };
}

//Used For Retry Browser/SafeClose
async function safeClose(browser: Browser) {
  let retries = 3;
  while (retries--) {
    try {
      await browser.close();
      break;
    } catch (error) {
      console.log('Retrying browser close...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

//Used For Checking if College Website is Slow or My Network is Slow
// async function setupConsoleLogging(page: Page) {
//   page.on('console', msg => console.log('PAGE LOG:', msg.text()));
// }

interface ScrapedInterfaceCriteria {
  title: string;
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

interface ScrapedScholarshipMapua {
  title: string;
  description: string;
  deadline: string;
}

interface Scraped {
  title: string;
  description: string;
  benefits: string;
  eligibility: string;
  deadline: string;
  url: string;
  formLink: string | null;
  gwa: string | undefined;
  financial: string | undefined;
  citizenship: string | undefined;
  disability: string | undefined;
}


type UniversityEnum =
  | "Adamson University"
  | "Air Link International Aviation College"
  | "AMA Computer University"
  | "De La Salle Manila"
  | "De La Salle Benilde"
  | "Ateneo de Manila University"
  | "University of the Philippines Diliman"
  | "University of Santo Tomas"
  | "Far Eastern University"
  | "Pamantasan ng Lungsod ng Maynila"
  | "Colegio de San Juan de Letran"
  | "Polytechnic University of the Philippines"
  | "Mapua University"
  | "Lyceum of the Philippines University"
  | "Arellano University"
  | "St. Paul University"
  | "National Teachers College"
  | "FEU Institute Of Technology";


//   // Function to determine scholarship type based on title keywords
// const getScholarshipType = (title: string): string => {
//   const lowerTitle = title.toLowerCase();
//   if (lowerTitle.includes("academic")) return "Academic Scholarship";
//   if (lowerTitle.includes("athletic")) return "Athletic Scholarship";
//   if (lowerTitle.includes("need-based")) return "Need-Based Scholarship";
//   if (lowerTitle.includes("merit")) return "Merit Scholarship";
//   if (lowerTitle.includes("minority")) return "Minority Scholarship";
//   if (lowerTitle.includes("creative")) return "Creative Scholarship";
//   if (lowerTitle.includes("pwd")) return "PWD Scholarship";
//   if (lowerTitle.includes("equity")) return "Student Equity Scholarship";
//   if (lowerTitle.includes("gifted")) return "Scholarship for the Gifted";
//   if (lowerTitle.includes("assitance")) return "Student Assistance Scholarship";

//   return "Other"; // Default type if none match
// };



//Handles Scraping for DLSU Benilde
async function handleBenildeScrape(url: string, university: UniversityEnum) {
  //Check first the college if in the database
  let existingCollege = await prisma.college.findFirst({
    where: { name: university },
    select: { id: true },
  });

  if (!existingCollege) {
    console.log("Error: College isn't in the system yet!");
    existingCollege = (await prisma.college.create({
      data: { name: university, location: "N/A", details: "N/A" },
    })) as any;
    console.log(existingCollege);
    console.log("Created blank college!");
  }

  // Scrape the data
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const scholarDataScrape: Scraped[] = await page.evaluate(() => {
    const scholarshipTab = Array.from(
      document.querySelectorAll("div.jltma-accordion-item")
    );

    if (!scholarshipTab) {
      console.log(
        "No elements found with the selector div.jltma-accordion-item"
      );
      return [];
    }

    return scholarshipTab.map((scholarr: Element) => {
      const titleElement = scholarr.querySelector(
        "div.jltma-accordion-title-text"
      ) as HTMLElement;
      const descriptionElement = scholarr.querySelector(
        'p[style*="font-weight: 400;"]'
      ) as HTMLElement;
      const benefitsElement = scholarr.querySelector(
        "ul:nth-of-type(2)"
      ) as HTMLElement;
      const requirementsElement = scholarr.querySelector(
        "ul:nth-of-type(1)"
      ) as HTMLElement;
      const deadlineElement = scholarr.querySelector(
        "ul:nth-of-type(3), p:nth-of-type(8)"
      ) as HTMLElement;
      const gwaElement = scholarr.querySelector(
        "ul:nth-of-type(3), p:nth-of-type(8)"
      ) as HTMLElement;

      // Extract the scholarship application form link
      const scholarformElement = scholarr.querySelector(
        "li > span > a"
      ) as HTMLAnchorElement;
      const clickformLink =
        scholarformElement &&
        scholarformElement.textContent?.includes("CLICK HERE")
          ? scholarformElement.href
          : "N/A";

      return {
        title: titleElement ? titleElement.innerText : "N/A",
        description: descriptionElement ? descriptionElement.innerText : "N/A",
        benefits: benefitsElement ? benefitsElement.innerText : "N/A",
        eligibility: requirementsElement
          ? requirementsElement.innerText
          : "N/A",
        deadline: deadlineElement ? deadlineElement.innerText : "N/A",
        url: "N/A",
        formLink: clickformLink,
        gwa: gwaElement ? gwaElement.innerText : "N/A",
        financial: undefined,
        citizenship: undefined,
        disability: undefined,
      };
    });
  });

  console.log('Scholarship List:', scholarDataScrape);

  await browser.close();

  let cleanedData = DataClean(scholarDataScrape, existingCollege?.id || "");

  //Remove all the scholarship for that university if a new data has been scraped and then add the new scholarships
  if (cleanedData.length > 0) {
    await prisma.$transaction([
      prisma.scholarship.deleteMany({
        where: { collegeId: existingCollege?.id || "", sourceType: "SCRAPED" },
      }),
      prisma.scholarship.createMany({
        data: cleanedData.map((d) => d.newScholarship),
      }),
      prisma.criteria.createMany({
        data: cleanedData.map((d) => d.newCriteria),
      }),
    ]);
  }
  return cleanedData;
}

async function handleNTCScrape(url: string, university: UniversityEnum) {
 
  // Scrape the data
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Step 1: Scrape scholarship types and links
  const scholarshipData: ScrapedInterfaceCriteria[] = await page.evaluate(() => {
    const scholarshipPods = Array.from(document.querySelectorAll('div.wp-block-kadence-pane'));

    // Define keywords to match benefits
    const awardKeywords = [
      "exemplary performance in their academics",
      "good academic standing",
    ];
    const benefitKeywords = [
      "100% or 50% basic tuition fee",
      "full scholarship",
      "partial scholarship",
      "100% basic tuition fee",
      "50% basic tuition fee",
      "miscellaneous fees",
      "basic tuition fee",
      "20% discount",
      "full (100%) basic tuition fee",
    ];
    const courseloadKeywords = [
      "18 units",
      "15-units",
      "full load",
      "21 units",
    ];
    const financialStatusKeywords = [
      "10,000",
      "monthly income",
      "financially handicapped",
      "Php 15,000 financial assistance",
    ];
    const percentageGradeKeywords = [
      "80",
      "84",
    ];
    const educationalLevelKeywords = [
      "freshmen",
    ];
    const noSiblingsKeywords = [
      "brother or sister",
    ];
    const militaryExperienceKeywords = [
      "children of military personnel",
    ];
    const coursesKeywords = [
      "degree programs",
    ];

     return scholarshipPods.map((scholarshipElement: Element) => {
      const titleElement = scholarshipElement.querySelector('strong') as HTMLElement; // Cast to HTMLElement
      const titleText = titleElement ? titleElement.innerText : 'No title'     
      const descriptionElement = scholarshipElement.querySelector('.kt-accordion-panel-inner') as HTMLElement; // Cast to HTMLElement
      const descriptionText = descriptionElement ? descriptionElement.innerText : 'No description'

      // Extract benefits based on keywords
      const awardsText = awardKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const benefitText = benefitKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const courseloadText = courseloadKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const financialStatusText = financialStatusKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const percentageGradeText = percentageGradeKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const educLevelText = educationalLevelKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const nosiblingsText = noSiblingsKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const militaryText = militaryExperienceKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const coursesText = coursesKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );

      return {
        title: titleText,
        description: descriptionText,
        scholarshipType: "", // Default or dummy value if necessary
        benefits: benefitText,
        deadline: [], // Default or dummy value if necessary
        link: window.location.href,
        sourceType: "Scraped",
        percentageGrade: percentageGradeText,
        financialStatus: financialStatusText,// Default or dummy value if necessary
        educationalLevel: educLevelText,
        courseload: courseloadText,
        nationality: [], // Default or dummy value if necessary
        disability: [], // Default or dummy value if necessary
        militaryExperience: militaryText, // Default or dummy value if necessary
        courses: coursesText,
        extracurrAct: [],
        sports: [], // Default or dummy value if necessary
        currSchool: [], // Default or dummy value if necessary
        awards: awardsText,
        goodmoral: [],
        deanlister: [],
        goodHealth: [], // Default or dummy value if necessary
        age: [], // Default or dummy value if necessary
        nosiblings: nosiblingsText, // Default or dummy value if necessary
        parents: [], // Default or dummy value if necessary
        enrolled: [], // Default or dummy value if necessary
        imageUrl: "", // Default or dummy value if necessary
        imageAltText: ""
      };
    });
  });


  console.log('Scholarship Types:', scholarshipData);

  await browser.close();
  
}
async function handleMapuaScrape(url: string, university: UniversityEnum) {
 
  // Scrape the data
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  await page.waitForSelector('.accordion-item', { timeout: 5000 });

  // Step 1: Scrape scholarship types and links
  const scholarshipData: ScrapedInterfaceCriteria[] = await page.evaluate(() => {
    const scholarshipPods = Array.from(document.querySelectorAll('.accordion-item'));

    // Define keywords to match benefits
    const benefitKeywords = [
      "free matriculation fee",
      "a quarterly stipend of php 5,000",
      "quarterly book allowance of php 3,000",
      "a quarterly stipend of Php 10,000",
      "100% discount",
      "full academic scholarship",
      "100% tuition discount",
      "100% tuition discount",
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
    ];
    const currSchoolKeywords = [
      "mapúa",
      "public science high school",
    ];
    const nationalityKeywords = [
      "filipino",
      "guam",
    ];
    const sportsKeywords = [
      "athletic",
    ];
    const parentKeyword = [
      "ofw",
    ];
    const goodHealthKeywords = [
      "good health",
    ];
    const financialStatusKeywords = [
      "php 400,000.00",
      "php 450,000.00",
      "php 500,000.00",
      "php 250,000.00",
    ];
    const educationalLevelKeywords = [
      "shs",
      "freshman",
      "3rd",
      "4th",
      "5th",
      "2nd year",
      "3rd year",
      "4th-year",
    ];
    const coursesKeywords = [
      "department of education",
      "bachelor of science in business administration",
      "bachelor of science in global management",
      "bachelor of science in financial technology",
      "bachelor of science in business intelligence and analytics",
      "bachelor of science in marketing",
      "interior design",
      "engineering and sciences",
      "architecture and design",
      "information technology",
      "computer engineering",
      "computer science",
      "multimedia arts",
      "science student",
      "engineering",
      "architecture",
      "che",
      "chm",
      "bt",

    ];
    const awardKeywords = [
      "with the highest honor",
      "president's list",
    ];
    const goodmoralKeywords = [
      "good moral character",
    ];
    const courseloadKeywords = [
      "12 academic units",
      "(10) units",
      "regular load",
    ];
    const deanlisterKeywords = [
      "dean's List",
    ];
    const percentageGradeKeywords = [
      "70",
      "85",
      "80",
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
    ];

     return scholarshipPods.map((scholarshipElement: Element) => {
      const titleElement = scholarshipElement.querySelector('h3.text-base.font-semibold') as HTMLElement; // Cast to HTMLElement
      const titleText = titleElement ? titleElement.innerText : 'No title'     
      const descriptionElement = scholarshipElement.querySelector('.accordion-desc') as HTMLElement; // Cast to HTMLElement
      const descriptionText = descriptionElement ? descriptionElement.innerText : 'No description'

      // Extract benefits based on keywords
      const benefitText = benefitKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const currSchoolText = currSchoolKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const nationalityText = nationalityKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const sportsText = sportsKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const parentText = parentKeyword.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const goodHealthText = goodHealthKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const educLevelText = educationalLevelKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const coursesText = coursesKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const awardsText = awardKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const goodmoralText = goodmoralKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const courseloadText = courseloadKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const deanlisterText = deanlisterKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const percentageGradeText = percentageGradeKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );
      const financialStatusText = financialStatusKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword)
      );

      return {
        title: titleText,
        description: descriptionText,
        scholarshipType: "", // Default or dummy value if necessary
        benefits: benefitText,
        deadline: [], // Default or dummy value if necessary
        link: window.location.href,
        sourceType: "Scraped",
        percentageGrade: percentageGradeText,
        financialStatus: financialStatusText, // Default or dummy value if necessary
        educationalLevel: educLevelText,
        courseload: courseloadText,
        nationality: nationalityText, // Default or dummy value if necessary
        disability: [], // Default or dummy value if necessary
        militaryExperience: [], // Default or dummy value if necessary
        courses: coursesText,
        extracurrAct: [],
        sports: sportsText, // Default or dummy value if necessary
        currSchool: currSchoolText, // Default or dummy value if necessary
        awards: awardsText,
        goodmoral: goodmoralText,
        deanlister: deanlisterText,
        goodHealth: goodHealthText, // Default or dummy value if necessary
        age: [], // Default or dummy value if necessary
        nosiblings: [], // Default or dummy value if necessary
        parents: parentText, // Default or dummy value if necessary
        enrolled: [], // Default or dummy value if necessary
        imageUrl: "", // Default or dummy value if necessary
        imageAltText: ""
      };
    });
  });

  // Ensure scholarshipData is an array before filtering
  if (Array.isArray(scholarshipData)) {
    // Filter out undesired scholarship titles
    const filteredScholarshipData = scholarshipData.filter(scholarship => {
      const titleLower = scholarship.title.toLowerCase();
      return !(
        titleLower.includes("schedule of scholarship application") ||
        titleLower.includes("financial assistance and tuition discounts") || 
        titleLower.includes("submission of requirements")
      );
    });

    // Output the filtered scholarship data with titles and descriptions
    console.log('Filtered Scholarship Data:', filteredScholarshipData);
  } else {
    console.error('scholarshipData is not an array.');
  }

  await browser.close();
  
}
async function handleFEUTECHScrape(url: string, university: UniversityEnum) {
 
  // Scrape the data
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  await page.waitForSelector('h3.clh3', { timeout: 5000 });

  // Step 1: Scrape scholarship types and links
  const scholarshipData = await page.evaluate(() => {
    const scholarshipPods = Array.from(document.querySelectorAll("h3.clh3"));

   
     return scholarshipPods.map((scholarshipElement) => {
      const titleElement = scholarshipElement.textContent?.trim() || ''; 
      const titleText = titleElement;
      // Find the next sibling element that matches the description selector
      const descriptionElement = scholarshipElement.nextElementSibling; 

      const descriptionText = descriptionElement
          ? Array.from(descriptionElement.querySelectorAll('li')).map((item) => item.textContent?.trim() || '')
          : [];

      // const descriptionElement = scholarshipElement.querySelector('.accordion-desc') as HTMLElement; // Cast to HTMLElement
      // const descriptionText = descriptionElement ? descriptionElement.innerText : 'No description'

   
      return {
        title: titleText,
        description: descriptionText,
        // description: descriptionText,

      };
    });
  });


    // Output the  scholarship data with titles and descriptions
    console.log('Scholarship Data:', scholarshipData);

  await browser.close();
  
}

async function handleLetranScrape(url: string, university: UniversityEnum) {

  const { browser, page } = await initializeScraping();


  try {
      // Try to navigate to the page with a wait condition
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });


  const scholarDataScrape: ScrapedInterfaceCriteria[] = await page.evaluate(() => {
    const scholarshipsTab= Array.from(
      document.querySelectorAll('#mCSB_2_container div:nth-of-type(n+3)')
    );
    
    // Define keywords to match benefits
    const benefitKeywords = [
      "100% discount",
      "90% discount",
      "80% discount",
      "100% full discount",
      "miscellaneous",
      "supplemental",
      "Free books",
      "Free four (4) sets of school uniform",
    ];
    const percentageGradeKeywords = [
      "90%",
      "93",
      "95.99",
      "90",
      "92.99",
    ];
    const educLevelKeywords = [
      "college",
      "senior high school",
      "grade 12",
    ];
    const courseloadKeywords = [
      "regular load",
    ];
    const coursesKeywords = [
      "education",
      "pychology",
      "dietetics",
      "nutrition",
      "accountancy",
      "engineering",
    ];
    const extracurrActKeywords = [
      "recognized student organization",
      "academic scholars activities",
      "sunday eucharist",
      "officership",
      "officership",
      "active membership",
    ];
    const awardsKeywords = [
      "first honors",
      "second honors",
      "third honors",
      "with high honors",
 
    ];
    const goodmoralKeywords = [
      "good moral character",
    ];
    const deanlisterKeywords = [
      "dean's list",
    ];

    return scholarshipsTab.map((scholarshipElement: Element) => {
      const titleElement = scholarshipElement.querySelector("a") as HTMLElement;
      const descriptionElement = scholarshipElement.querySelector("#collapse2 > div, #collapse3 > div") as HTMLElement;

      const descriptionText = descriptionElement ? descriptionElement.innerText : "N/A"
      const titleText = titleElement ? titleElement.textContent || "N/A" : "N/A"
      
      // Find benefits based on keywords
      const matchedBenefits = benefitKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword.toLowerCase())
      );
      const matchedpercentageGrade = percentageGradeKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword.toLowerCase())
      );
      const matchededucLevel = educLevelKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword.toLowerCase())
      );
      const matchedcourseload = courseloadKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword.toLowerCase())
      );
      const matchedcourses = coursesKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword.toLowerCase())
      );
      const matchedextracurrAct = extracurrActKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword.toLowerCase())
      );
      const matchedawards = awardsKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword.toLowerCase())
      );
      const matchedgoodmoral = goodmoralKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword.toLowerCase())
      );
      const matcheddeanlister = deanlisterKeywords.filter(keyword => 
        descriptionText.toLowerCase().includes(keyword.toLowerCase())
      );

      return {
        title: titleText,
        description: descriptionText,
        scholarshipType: "", // Default or dummy value if necessary
        benefits: matchedBenefits,
        deadline: [], // Default or dummy value if necessary
        link: window.location.href,
        sourceType: "Scraped",
        percentageGrade: matchedpercentageGrade,
        financialStatus: [], // Default or dummy value if necessary
        educationalLevel: matchededucLevel,
        courseload: matchedcourseload,
        nationality: [], // Default or dummy value if necessary
        disability: [], // Default or dummy value if necessary
        militaryExperience: [], // Default or dummy value if necessary
        courses: matchedcourses,
        extracurrAct: matchedextracurrAct,
        sports: [], // Default or dummy value if necessary
        currSchool: [], // Default or dummy value if necessary
        awards: matchedawards,
        goodmoral: matchedgoodmoral,
        deanlister: matcheddeanlister,
        goodHealth: [], // Default or dummy value if necessary
        age: [], // Default or dummy value if necessary
        nosiblings: [], // Default or dummy value if necessary
        parents: [], // Default or dummy value if necessary
        enrolled: [], // Default or dummy value if necessary
        imageUrl: "", // Default or dummy value if necessary
        imageAltText: ""
      };
    });

  });

  console.log(scholarDataScrape);
  
  return scholarDataScrape;

} catch (error) {
  console.error(`Failed to load ${url} due to timeout or error:`, error);
  return []; // Return empty if scraping fails
} finally {
  await safeClose(browser); // Ensure the browser is closed
}

}

async function handleUSTScrape(url: string, university: UniversityEnum) {

  const { browser, page } = await initializeScraping();

  try {
      // Try to navigate to the page with a wait condition
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });


  const scholarDataScrape:ScrapedInterfaceCriteria[] = await page.evaluate(() => {
    const scholarshipTab = Array.from(
      document.querySelectorAll("section:nth-of-type(n+2)")
    );

    // Define keywords to match benefits
    const educLevelKeywords = [
      "senior high school",
      "college",
    ];

    const sportsKeywords = [
      "sports",
    ];
    const extracurrActKeywords = [
      "music",
      "singers",
      "rotc",
      "arts",
      "domnet",
    ];
    const financialStatusKeywords = [
      "in need of financial assistance",
    ];
    const awardKeywords = [
      "excellent academic performance",
    ];
    const coursesKeywords = [
      "leap med",
      "faculty of civil law",
      "faculty of medicine and surgery",
    ];

    return scholarshipTab.map((scholarshipElements: Element) => {
      const titleElement = scholarshipElements.querySelector("h2") as HTMLElement;
      const titleText = titleElement ? titleElement.innerText : "N/A"
      
      const descriptionAElement = scholarshipElements.querySelector('.col-md-8 p:nth-of-type(1)') as HTMLElement;
      const descriptionAText = descriptionAElement ? descriptionAElement.innerText : "N/A"

      const descriptionBElement = scholarshipElements.querySelector('.col-md-8 p.lead') as HTMLElement;
      const descriptionBText = descriptionBElement ? descriptionBElement.innerText : "N/A"

      // Combine descriptionA and descriptionB
      const fullDescription = `${descriptionAText}\n\n${descriptionBText}`.trim();

       // Scrape the image URL (Assuming the image is inside an <img> tag within the scholarshipElements)
      const imageElement = scholarshipElements.querySelector("img.img-fluid.rounded-circle") as HTMLImageElement;
      const imageUrl = imageElement ? imageElement.src : "N/A"; // Get the src attribute of the <img> tag
      const imageAltText = imageElement ? imageElement.alt : "N/A"; // Optional: Get the alt text

      // Extract benefits based on keywords
      const educLevelText = educLevelKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const sportsText = sportsKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const extracurrActText = extracurrActKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const financialStatusText = financialStatusKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const courseText = coursesKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const awardsText = awardKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );

      return {
        title: titleText,
        description: fullDescription,
        scholarshipType:"N/A", // Call the function here
        benefits: [],                    // Initialize as an empty array
        deadline: [],                    // Initialize as an empty array
        link: window.location.href,                     // Example value, adjust as needed
        sourceType: "Scraped",               // Example value, adjust as needed
        percentageGrade: [],             // Initialize as an empty array
        financialStatus: financialStatusText,             // Initialize as an empty array
        educationalLevel: educLevelText,            // Initialize as an empty array
        courseload: [],                  // Initialize as an empty array
        nationality: [],                 // Initialize as an empty array
        disability: [],                  // Initialize as an empty array
        militaryExperience: [],          // Initialize as an empty array
        courses: courseText,                     // Initialize as an empty array
        extracurrAct: extracurrActText,                // Initialize as an empty array
        sports: sportsText,                      // Initialize as an empty array
        currSchool: [],                  // Initialize as an empty array
        awards: awardsText,                      // Initialize as an empty array
        goodmoral: [],                   // Initialize as an empty array
        deanlister: [],                  // Initialize as an empty array
        goodHealth: [],                  // Initialize as an empty array
        age: [],                         // Initialize as an empty array
        nosiblings: [],                  // Initialize as an empty array
        parents: [],                     // Initialize as an empty array
        enrolled: [],
        imageUrl: imageUrl,       // Include the image URL
        imageAltText: imageAltText
      };
    });
  });

  console.log(scholarDataScrape)

  return scholarDataScrape;

} catch (error) {
  console.error(`Failed to load ${url} due to timeout or error:`, error);
  return []; // Return empty if scraping fails
} finally {
  await safeClose(browser); // Ensure the browser is closed
}

  
}

async function handlePUPScrape(url: string, university: UniversityEnum) {

  const { browser, page } = await initializeScraping();

  try {
      // Try to navigate to the page with a wait condition
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });


  const scholarDataScrape:ScrapedInterfaceCriteria[] = await page.evaluate(() => {
    const scholarshipTab = Array.from(
      document.querySelectorAll("tbody tr")
    );

// Define keywords to match benefits
    const enrolledKeywords = [
      "enrolled",
    ];
    const educLevelKeywords = [
      "2nd year college",
    ];
    const courseloadKeywords = [
      "regular status",
    ];

    const sportsKeywords = [
      "student athlete",
    ];
    const nationalityKeywords = [
      "indigenous people",
      "filipino",
    ];
    const parentKeyword = [
      "solo parent",
      "indigent family/clan",
    ];
    const extracurrActKeywords = [
      "cultural artist",
      "creative media artist",
      "campus journalist",
    ];
    const disabilityKeywords = [
      "pwd",
      "pwd students",
    ];
    const financialStatusKeywords = [
      "in need of financial assistance",
      "financial need",
    ];
    const benefitKeywords = [
      "full amount of tuition",
      "other school fees",
    ];

    return scholarshipTab.map((scholarshipElements: Element) => {
      const titleElement = scholarshipElements.querySelector(".tblD h4") as HTMLElement; 
      const titleText = titleElement ? titleElement.innerText : "N/A"
      const descriptionElement = scholarshipElements.querySelector("td.tblD.dtr-control") as HTMLElement;
      const descriptionText = descriptionElement ? descriptionElement.innerText : "N/A"
      const eligibilityElement = scholarshipElements.querySelector("td.tblD:nth-of-type(2)") as HTMLElement;
      const eligibilityText = eligibilityElement ? eligibilityElement.innerText : "N/A"
      const tosubmitElement = scholarshipElements.querySelector("td.tblD:nth-of-type(3)") as HTMLElement;
      const tosubmitText = tosubmitElement ? tosubmitElement.innerText : "N/A"
      const contactpersonElement = scholarshipElements.querySelector("td.tblD:nth-of-type(4)") as HTMLElement;
      const contactpersonText = contactpersonElement ? contactpersonElement.innerText : "N/A"
      const deadlineElement = scholarshipElements.querySelector("td.tblD:nth-of-type(5)") as HTMLElement;
      const deadlineText = deadlineElement ? deadlineElement.innerText : "N/A" 
      const remarksElement = scholarshipElements.querySelector("td.tblD:nth-of-type(6)") as HTMLElement;
      const remarksText = remarksElement ? remarksElement.innerText : "N/A"

      const fullDescription = `${descriptionText}\n\nHOW TO APPLY:\n\n${eligibilityText}\n\nWHERE TO SUBMIT:${tosubmitText}\nContact Person:${contactpersonText}\n\nDEADLINE OF APPLICATION:${deadlineText}\n\nREMARKS${remarksText}`.trim();

      // Extract benefits based on keywords
      const enrolledText = enrolledKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const educLevelText = educLevelKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const courseloadText = courseloadKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const sportsText = sportsKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const nationalityText = nationalityKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const parentText = parentKeyword.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const extracurrActText = extracurrActKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const disabilityText = disabilityKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const financialStatusText = financialStatusKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );
      const benefitText = benefitKeywords.filter(keyword => 
        fullDescription.toLowerCase().includes(keyword)
      );


      return {
        title: titleText,
        description: fullDescription,
        scholarshipType:"N/A", // Call the function here
        benefits: benefitText,                    // Initialize as an empty array
        deadline: [],                    // Initialize as an empty array
        link: window.location.href,                     // Example value, adjust as needed
        sourceType: "Scraped",               // Example value, adjust as needed
        percentageGrade: [],             // Initialize as an empty array
        financialStatus: financialStatusText,             // Initialize as an empty array
        educationalLevel: educLevelText,            // Initialize as an empty array
        courseload: courseloadText,                  // Initialize as an empty array
        nationality: nationalityText,                 // Initialize as an empty array
        disability: disabilityText,                  // Initialize as an empty array
        militaryExperience: [],          // Initialize as an empty array
        courses: [],                     // Initialize as an empty array
        extracurrAct: extracurrActText,                // Initialize as an empty array
        sports: sportsText,                      // Initialize as an empty array
        currSchool: [],                  // Initialize as an empty array
        awards: [],                      // Initialize as an empty array
        goodmoral: [],                   // Initialize as an empty array
        deanlister: [],                  // Initialize as an empty array
        goodHealth: [],                  // Initialize as an empty array
        age: [],                         // Initialize as an empty array
        nosiblings: [],                  // Initialize as an empty array
        parents: parentText,                     // Initialize as an empty array
        enrolled: enrolledText,
        imageUrl: "",       // Include the image URL
        imageAltText: ""
      };
    });
  });

  console.log(scholarDataScrape)

  return scholarDataScrape;

} catch (error) {
  console.error(`Failed to load ${url} due to timeout or error:`, error);
  return []; // Return empty if scraping fails
} finally {
  await safeClose(browser); // Ensure the browser is closed
}

 
}

async function handleLPUScrape(url: string, university: UniversityEnum) {
  const { browser, page } = await initializeScraping();

  try {
      // Try to navigate to the page with a wait condition
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Scrape the data
  const scholarDataScrape: ScrapedInterfaceCriteria[] = await page.evaluate(() => {
    // Keywords to filter relevant benefit sentences
     const benefitKeywordList = ['50%','Free Tuition', 'discount', 'tuition fee', 'miscellaneous fee','Full tuition', 'recommendation'];
     const rankKeywordList = ['rank', 'top 1', 'top 2', 'top 3', 'valedictorian', 'salutatorian', 'honorable mention', 'Editor-in-Chief', 'Editors-in-Chief'];
     const gradesKeywordList = ['GWA', 'GPA'];
     const educLevelKeywordList = ['Grade 12'];
     const nationalityKeywordList = ['Filipino'];
     const goodmoralKeywordList = ['good moral'];
     const coursesKeywordList = ['bachelor'];
     const deadlineKeywordList = ['AY', 'January'];
     const extracurrActKeywordList = ['Athletic', 'Dance Troupe', 'Chorale Grant'];
     const courseloadActKeywordList = ['units', 'load'];
     const nosiblingsKeywordList = ['two or more'];
     
     

     // Exclusion list for keywords to ignore
    //const exclusionKeywordList = [ 'Upload','Certification', 'Published', 'Card','Director', 'A-LEAP', 'ALEAP', 'Bukas', 'interest', 'inquiries', '104A'];
    const exclusionKeywordList = [ 'Top 10%', 'Upload', 'bukas', '104A', 'requirements', 'A-LEAP', 'ALEAP','installments', 'inquiries'];
 
    // Select all scholarship pods
    const scholarPods = Array.from(document.querySelectorAll("div.wp-block-pb-accordion-item"));

    const link = window.location.href;

    return scholarPods.map((slide: Element) => {
      // Get the title of the scholarship
      const titleElement = slide.querySelector("h2.c-accordion__title") as HTMLElement;
      const descriptionElement = slide.querySelector("div#ac-1310, div#ac-1311, div#ac-1312") as HTMLElement;
      const descriptionText = descriptionElement ? descriptionElement.innerText : 'No description'
      // Extract the CriteriaElements list
      const CriteriaElements = Array.from(slide.querySelectorAll("li , strong, p")) as HTMLElement[];

      let benefits: string[] = [];
      let awards: string[] = [];
      let percentageGrade: string[] = [];
      let educationalLevel: string[] = [];
      let nationality: string[] = [];
      let goodmoral: string[] = [];
      let courses: string[] = [];
      let deadline: string[] = [];
      let extracurrAct: string[] = [];
      let courseload: string [] = [];
      let nosiblings: string [] = [];

        // Loop through each list item to filter sentences with keywords
        CriteriaElements.forEach((li) => {
        const sentences = li.innerText.split('. '); // Split by sentences

        sentences.forEach((sentence) => {

          // Check if the sentence should be excluded
          const isExcluded = exclusionKeywordList.some(exclusion =>
            sentence.toLowerCase().includes(exclusion.toLowerCase())
          );

          // If the sentence matches an exclusion keyword, skip it
          if (isExcluded) return;


          // Check if the sentence is a benefit
          const isBenefit = benefitKeywordList.some(keyword =>
            sentence.toLowerCase().includes(keyword.toLowerCase())
          );
          // Check if the sentence is a rank
          const isAwards = rankKeywordList.some(keyword =>
            sentence.toLowerCase().includes(keyword.toLowerCase())
          ) ;

          const isGrades = gradesKeywordList.some(keyword =>
            sentence.toLowerCase().includes(keyword.toLowerCase())
          );

          const isEducLevel = educLevelKeywordList.some(keyword =>
            sentence.toLowerCase().includes(keyword.toLowerCase())
          );

          const isNationality = nationalityKeywordList.some(keyword =>
            sentence.toLowerCase().includes(keyword.toLowerCase())
          );

          const isGoodMoral = goodmoralKeywordList.some(keyword =>
            sentence.toLowerCase().includes(keyword.toLowerCase())
          );
          const isCourses = coursesKeywordList.some(keyword =>
            sentence.toLowerCase().includes(keyword.toLowerCase())
          );
          const isDeadline = deadlineKeywordList.some(keyword =>
            sentence.toLowerCase().includes(keyword.toLowerCase())
          );
           // Check if the sentence belongs to extracurricular activities but is not a benefit
        const isExtracurrAct = extracurrActKeywordList.some(keyword =>
          sentence.toLowerCase().includes(keyword.toLowerCase())
        ) && !benefitKeywordList.some(keyword =>
          sentence.toLowerCase().includes(keyword.toLowerCase())
        );
          const isCourseLoad = courseloadActKeywordList.some(keyword =>
            sentence.toLowerCase().includes(keyword.toLowerCase())
          );
          const isNoSiblings = nosiblingsKeywordList.some(keyword =>
            sentence.toLowerCase().includes(keyword.toLowerCase())
          );


          // Only add to the respective array if it matches one of the keywords
          if (isBenefit && !isAwards) {
            benefits.push(sentence);
          }
          if (isAwards && !isBenefit) {
            awards.push(sentence);
          }
          if (isGrades) {
            percentageGrade.push(sentence);
          }
          if (isEducLevel) {
            educationalLevel.push(sentence);
          }
          if (isNationality) {
            nationality.push(sentence);
          }
          if (isGoodMoral) {
            goodmoral.push(sentence);
          }
          if (isCourses) {
            courses.push(sentence);
          }
          if (isDeadline) {
            deadline.push(sentence);
          }
          if (isExtracurrAct) {
            extracurrAct.push(sentence);
          }
          if (isCourseLoad) {
            courseload.push(sentence);
          }
          if (isNoSiblings) {
            nosiblings.push(sentence);
          }
        });
      });

      
      // Get the link for the scholarship if available
      //const linkElement = slide.querySelector('a') as HTMLAnchorElement;

      return {
        title: titleElement ? titleElement.innerText : 'No title',
        description: descriptionText,
        scholarshipType: "N/A",
        benefits: benefits.length > 0 ? benefits : ['No Benefits'], // If no matches, return 'No Benefits'
        deadline: deadline.length > 0 ? deadline : ['No Deadline'],
        link: link,      
        sourceType: "Scraped",      
        percentageGrade: percentageGrade.length > 0 ? percentageGrade : ['No Grades'],
        financialStatus: [],      
        educationalLevel: educationalLevel.length > 0 ? educationalLevel : ['No Education Level'],
        courseload: courseload.length > 0 ? courseload : ['No Course Load'],
        nationality: nationality.length > 0 ? nationality : ['No Nationality'],
        disability: [],
        militaryExperience: [],       
        courses: courses.length > 0 ? courses : ['No Courses'],
        extracurrAct: extracurrAct.length > 0 ? extracurrAct : ['No Extracurricular Activities'],
        sports: [],
        currSchool: [],        
        awards: awards.length > 0 ? awards : ['No Rank Info'],// If no rank matches, return 'No Rank Info'       
        goodmoral: goodmoral.length > 0 ? goodmoral : ['No Good Moral'],
        deanlister: [],
        goodHealth: [],
        age: [],
        nosiblings: nosiblings.length > 0 ? nosiblings : ['No No. of Siblings'],
        parents: [],
        enrolled: [],
        imageUrl: "N/A",
        imageAltText: "N/A",
      };
    });
  });

  console.log('Scholarship List:', scholarDataScrape);

} catch (error) {
  console.error(`Failed to load ${url} due to timeout or error:`, error);
  return []; // Return empty if scraping fails
} finally {
  await safeClose(browser); // Ensure the browser is closed
}

}

async function handleArellanoScrapeOnFix(urls: string[], university: UniversityEnum) {

  let allScholarships: ScrapedInterfaceCriteria[] = [];

    // Scrape the data
    for (const url of urls) {
      const { browser, page } =  await initializeScraping();

      try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  
      const scholarships: ScrapedInterfaceCriteria[] = await page.evaluate(() => {
        const scholarshipElements = Array.from(document.querySelectorAll('p'));
  
        let scholarships: ScrapedInterfaceCriteria[] = [];
        let currentTitle = '';
  
        const awardKeywords = [
          'highest honors', 
          'with honors', 
          'first honor', 
          'second honor',
          'high honors',  
          'honor',
          '1st honor',
          '2nd honor',
          '3rd honor',
          'highest average',
          'second highest average',
          'third highest average',
        ];
  
        const percentageGradeKeywords = [
          'GWA 98-100%',
          'GWA 95-97%',
          'GWA 90-94%',
          'GWA 85-89%',
          'GWA 80-84%'
        ];
  
        const benefitKeywords = [
          'miscellaneous fee',
          'Misc. fee',
          '100% of tuition',
          '100% on tuition fee',
          '75% on tuition fee',
          '60% on tuition fee',
          '50% on tuition fee',
          '25% on tuition fee',
          '20% on tuition fee',
          '15% on tuition fee',
          '10% on tuition fee',
        ];
  
        const educationalLevelKeywords = [
          'freshmen',
          'au graduates',
          'non-au graduates',
          'college students',
        ];
  
        const courseloadKeywords = [
          '18 units'
        ];

        const extracurrActKeywords = [
          'president of the student council',
          'editor-in-chief',
          'special cultural group',
          'special cultural',
          'talent group',
          'editor-in-chief',
          'ambassadors of goodwill',
          'au employee',
          'performing arts',
        ];

        const militaryExpirienceKeywords = [
          'dependent of afp personnel',
          'children of personnel of the armed forces',
          'rotc corps commandant',
          'rotc first class cadet officer',
          'police officer',
        ];

        const noSiblingsKeywords = [
          '3rd or the succeeding brother or sister',
          '2nd brother or sister',
        ];
  
        scholarshipElements.forEach((element) => {
          const titleElement = element.querySelector('strong');
  
          if (titleElement) {
            currentTitle = titleElement.innerText;
            scholarships.push({
              title: currentTitle,
            description: '',
            scholarshipType: '', // Default value
            benefits: [],
            deadline: [], // Default value
            link: '',
            sourceType: 'SCRAPED', // Assuming the source type is always scraped
            percentageGrade: [],
            financialStatus: [],
            educationalLevel: [],
            courseload: [],
            nationality: [], // Default value
            disability: [], // Default value
            militaryExperience: [],
            courses: [], // Default value
            extracurrAct: [],
            sports: [], // Default value
            currSchool: [], // Default value
            awards: [],
            goodmoral: [], // Default value
            deanlister: [], // Default value
            goodHealth: [], // Default value
            age: [], // Default value
            nosiblings: [],
            parents: [], // Default value
            enrolled: [], // Default value
            imageUrl: '', // Default value
            imageAltText: undefined // Optional
            });

          } else if (currentTitle && element.innerText.trim() !== '') {
            const lastScholarship = scholarships[scholarships.length - 1];
            lastScholarship.description += element.innerText.trim() + ' ';
          }
  
          const nextUlElement = element.nextElementSibling?.tagName === 'UL' 
            ? element.nextElementSibling 
            : null;
  
          if (nextUlElement) {
            const requirements = Array.from(nextUlElement.querySelectorAll('li'))
              .map(li => li.innerText)
              .join(', ');
  
            if (currentTitle && requirements) {
              const lastScholarship = scholarships[scholarships.length - 1];
              lastScholarship.description += `Requirements: ${requirements}. `;
            }
          }
        });
  
        scholarships.forEach(scholarship => {
          awardKeywords.forEach(keyword => {
            if (scholarship.description.toLowerCase().includes(keyword)) {
              scholarship.awards.push(keyword);
            }
          });
  
          percentageGradeKeywords.forEach(keyword => {
            if (scholarship.description.toLowerCase().includes(keyword.toLowerCase())) {
              scholarship.percentageGrade.push(keyword);
            }
          });
  
          benefitKeywords.forEach(keyword => {
            if (scholarship.description.toLowerCase().includes(keyword)) {
              scholarship.benefits.push(keyword);
            }
          });
  
          educationalLevelKeywords.forEach(keyword => {
            if (scholarship.description.toLowerCase().includes(keyword)) {
              scholarship.educationalLevel.push(keyword);
            }
          });
  
          courseloadKeywords.forEach(keyword => {
            if (scholarship.description.toLowerCase().includes(keyword)) {
              scholarship.courseload.push(keyword);
            }
          });

          extracurrActKeywords.forEach(keyword => {
            if (scholarship.title.toLowerCase().includes(keyword) || 
            scholarship.description.toLowerCase().includes(keyword)
          ) {
              scholarship.extracurrAct.push(keyword);
            }
          });

          militaryExpirienceKeywords.forEach(keyword => {
            if (scholarship.title.toLowerCase().includes(keyword) || 
            scholarship.description.toLowerCase().includes(keyword)
          ) {
              scholarship.militaryExperience.push(keyword);
            }
          });

          noSiblingsKeywords.forEach(keyword => {
            if (scholarship.description.toLowerCase().includes(keyword)) {
              scholarship.nosiblings.push(keyword);
            }
          });


        });
  
        return scholarships.map(scholarship => ({
          title: scholarship.title,
        description: scholarship.description.trim(),
        scholarshipType: scholarship.scholarshipType, // Ensure all properties are included
        benefits: scholarship.benefits,
        deadline: scholarship.deadline,
        link: window.location.href,
        sourceType: scholarship.sourceType,
        percentageGrade: scholarship.percentageGrade,
        financialStatus: scholarship.financialStatus,
        educationalLevel: scholarship.educationalLevel,
        courseload: scholarship.courseload,
        nationality: scholarship.nationality,
        disability: scholarship.disability,
        militaryExperience: scholarship.militaryExperience,
        courses: scholarship.courses,
        extracurrAct: scholarship.extracurrAct,
        sports: scholarship.sports,
        currSchool: scholarship.currSchool,
        awards: scholarship.awards,
        goodmoral: scholarship.goodmoral,
        deanlister: scholarship.deanlister,
        goodHealth: scholarship.goodHealth,
        age: scholarship.age,
        nosiblings: scholarship.nosiblings,
        parents: scholarship.parents,
        enrolled: scholarship.enrolled,
        imageUrl: scholarship.imageUrl, // Ensure to set appropriate value later
        imageAltText: scholarship.imageAltText, // Optional
        }));
      });
  
      // Add the scholarships from this page to the allScholarships array
      allScholarships = allScholarships.concat(scholarships);
  
      } catch (error) {
      console.error(`Error scraping ${url}:`, error);
    } finally {
      await safeClose(browser);
    }
  }
  
    console.log('Combined scholarships:', allScholarships); // Log the combined scholarships
  
    return allScholarships;

}

async function handleSPUScrape(url: string, university: UniversityEnum) {

const { browser, page } = await initializeScraping();

try {
    // Try to navigate to the page with a wait condition
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const scholarDataScrape: ScrapedInterfaceCriteria[] = await page.evaluate(() => {
    const scholarshipTab = Array.from(document.querySelectorAll("div:nth-of-type(3) li p"));
    const requirementsList = Array.from(document.querySelectorAll("ol:nth-of-type(2)"));
    
    const benefitsKeywords = ['100% tuition fee subsidy', '75% miscellaneous fee subsidy', '100% tuition', 'miscellaneous fees subsidy', 'matriculation fees', 'discount', 'discount', 'Php 60,000 per year', 'miscellaneous'];
    const percentageGradeKeywords = ['GPA of at least 83%'];
    const courseloadKeywords = ['18 units'];
    const goodmoralKeywords = ['good moral character'];
    const coursesKeywords = ['education', 'music education'];
    const militaryExperienceKeywords = ['dependent of military personnel'];

    if (!scholarshipTab) {
      console.log(
        "No elements found with the selector div.jltma-accordion-item"
      );
      return [];
    }

    // Collect all requirements
  const requirements = requirementsList.map((li: Element) => (li as HTMLElement).innerText.trim());

    return scholarshipTab.map((scholarshipElement: Element) => {
      const titleElement = scholarshipElement.querySelector(
        "li p b"
      ) as HTMLElement;
      const descriptionText = (scholarshipElement as HTMLElement).innerText.replace(titleElement?.innerText || '', '').trim();

       // Combine description with requirements
    const combinedDescription = `${descriptionText}\nRequirements: ${requirements.join(", ")}`;

    const matchedBenefits = benefitsKeywords.filter(keyword => combinedDescription.toLowerCase().includes(keyword.toLowerCase()));
    const matchedgradepercentage = percentageGradeKeywords.filter(keyword => combinedDescription.toLowerCase().includes(keyword.toLowerCase()));
    const matchedcourseload = courseloadKeywords.filter(keyword => combinedDescription.toLowerCase().includes(keyword.toLowerCase()));
    const matchedgoodmoral = goodmoralKeywords.filter(keyword => combinedDescription.toLowerCase().includes(keyword.toLowerCase()));
    const matchedcourses = coursesKeywords.filter(keyword => combinedDescription.toLowerCase().includes(keyword.toLowerCase()));
    const matchedmilitaryExpi = militaryExperienceKeywords.filter(keyword => combinedDescription.toLowerCase().includes(keyword.toLowerCase()));
      return {
        title: titleElement ? titleElement.innerText : "N/A",
      description: combinedDescription,
      scholarshipType: '', // Default or specific value
      benefits: matchedBenefits,
      deadline: [], // Default or specific value
      link: window.location.href,
      sourceType: 'SCRAPED', // Assuming 'SCRAPED' is correct here
      percentageGrade: matchedgradepercentage,
      financialStatus: [], // Default or specific value
      educationalLevel: [], // Default or specific value
      courseload: matchedcourseload,
      nationality: [], // Default or specific value
      disability: [], // Default or specific value
      militaryExperience: matchedmilitaryExpi,
      courses: matchedcourses,
      extracurrAct: [], // Default or specific value
      sports: [], // Default or specific value
      currSchool: [], // Default or specific value
      awards: [], // Default or specific value
      goodmoral: matchedgoodmoral,
      deanlister: [], // Default or specific value
      goodHealth: [], // Default or specific value
      age: [], // Default or specific value
      nosiblings: [], // Default or specific value
      parents: [], // Default or specific value
      enrolled: [], // Default or specific value
      imageUrl: '', // Default or specific value
      imageAltText: undefined // Optional
      };
    });
  });

  console.log(scholarDataScrape)
  await browser.close();

  return scholarDataScrape;

} catch (error) {
    console.error(`Failed to load ${url} due to timeout or error:`, error);
    return []; // Return empty if scraping fails
  } finally {
    await safeClose(browser); // Ensure the browser is closed
  }
}

interface ScholarshipArell {
  title: string;
  description: string;
  requirements: string[];
}
async function handleArellanoScrape(url: string, university: UniversityEnum) {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'domcontentloaded' });


        const scholarshipData = await page.evaluate(() => {
          // Find all scholarship titles using <strong> tags
          const scholarshipSections = Array.from(document.querySelectorAll('p strong'));
      
          return scholarshipSections.map((strongElement) => {
            const title = strongElement.textContent?.trim() || 'No title';
      
            // Collect all content that follows the title, until the next title or end of page
            let details = '';
            let nextElement = strongElement.parentElement?.nextElementSibling;
      
            while (nextElement && !(nextElement.querySelector('strong'))) {
              // Append the text content of each relevant element to details
              if (nextElement.textContent) {
                details += nextElement.textContent.trim() + ' ';
              }
              nextElement = nextElement.nextElementSibling;
            }
      
            return {
              title,
              details: details.trim() || 'No details available',
            };
          });
        });

        console.log('Scholarship Data:', scholarshipData);
        await browser.close();

       
}

async function handleFEUScrape(url: string, university: UniversityEnum) {

  const { browser, page } = await initializeScraping();

  try {
    // Increase timeout for this navigation and add a wait condition
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  } catch (error) {
    console.error(`Failed to load ${url} due to timeout.`);
    await safeClose(browser);
    return [];
  }

  // Define keywords for benefits and criteria
  const benefitsKeywords = ['full tuition', 'miscellaneous fees discount', 'allowances'];
  const percentageGradeKeywords = ['88', '2.00', '3.0'];
  const educLevelKeywords = ['1st year'];
  const nationalityKeywords = ['filipino'];
  const goodmoralKeywords = ['good moral character'];
  const coursesKeywords = ['education'];
  const sportsKeywords = ['athletics'];
  const financialStatusKeywords = ['P100,000', 'P360,000.00'];
  const extracurrActKeywords = ['Drummers', 'Chorale'];

  const scholarDataScrape: ScrapedInterfaceCriteria[] = await page.evaluate(() => {
    const scholarshipTab = Array.from(document.querySelectorAll("div.wp-block-column"));

    return scholarshipTab.map((scholarshipElement: Element) => {
      const titleElement = scholarshipElement.querySelector("strong a, strong") as HTMLElement;
      const linkElement = scholarshipElement.querySelector("a") as HTMLAnchorElement;
      let descriptionElement = scholarshipElement.querySelector(".wp-block-column p:nth-of-type(2)") as HTMLElement;

      if (!descriptionElement) {
        descriptionElement = scholarshipElement.querySelector("p") as HTMLElement;
      }
      const descriptionText = descriptionElement ? descriptionElement.innerText : "N/A";
      return {
        title: titleElement ? titleElement.innerText : "N/A",
        description: descriptionText,
        link: linkElement ? linkElement.href : "",
        scholarshipType: "",
        deadline: [],
        sourceType: "",
        benefits: [],
        percentageGrade: [],
        educationalLevel: [],
        extracurrAct: [],
        sports: [],
        nationality: [],
        goodmoral: [],
        financialStatus: [],
        courses: [],
        courseload: [],
        disability: [],
        militaryExperience: [],
        currSchool: [],
        awards: [],
        goodHealth: [],
        age: [],
        nosiblings: [],
        parents: [],
        enrolled: [],
        imageUrl: "",
        imageAltText: "",
        deanlister: [],
      };
    });
  });

  // Follow each link to get additional details
  for (const scholarship of scholarDataScrape) {
    if (scholarship.link) {
      const detailPage = await browser.newPage();
      detailPage.setDefaultNavigationTimeout(60000); // Set timeout for detail pages

      try {
        await detailPage.goto(scholarship.link, { waitUntil: 'networkidle2', timeout: 60000 });
      } catch (error) {
        console.error(`Failed to load details page for ${scholarship.title}`);
        scholarship.description += "\nAdditional Details: Unable to load page";
        await detailPage.close();
        continue;
      }

      const additionalDetails = await detailPage.evaluate(() => {
        const detailElement = document.querySelector("article") as HTMLElement;
        return detailElement ? detailElement.innerText : "No additional details available";
      });

      scholarship.description += `\nFull Details: ${additionalDetails}`;
      await detailPage.close();
    } else {
      scholarship.description += "\nAdditional Details: No link provided";
    }

    // Extract benefits and criteria based on keywords
    scholarship.benefits = benefitsKeywords.filter(keyword =>
      scholarship.description.toLowerCase().includes(keyword.toLowerCase())
    );

    scholarship.percentageGrade = percentageGradeKeywords.filter(keyword =>
      scholarship.description.toLowerCase().includes(keyword.toLowerCase())
    );

    scholarship.educationalLevel = educLevelKeywords.filter(keyword =>
      scholarship.description.toLowerCase().includes(keyword.toLowerCase())
    );

    scholarship.extracurrAct = extracurrActKeywords.filter(keyword =>
      scholarship.description.toLowerCase().includes(keyword.toLowerCase())
    );

    scholarship.sports = sportsKeywords.filter(keyword =>
      scholarship.description.toLowerCase().includes(keyword.toLowerCase())
    );

    scholarship.nationality = nationalityKeywords.filter(keyword =>
      scholarship.description.toLowerCase().includes(keyword.toLowerCase())
    );

    scholarship.goodmoral = goodmoralKeywords.filter(keyword =>
      scholarship.description.toLowerCase().includes(keyword.toLowerCase())
    );

    scholarship.financialStatus = financialStatusKeywords.filter(keyword =>
      scholarship.description.toLowerCase().includes(keyword.toLowerCase())
    );

    scholarship.courses = coursesKeywords.filter(keyword =>
      scholarship.description.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  console.log(scholarDataScrape);
  await safeClose(browser);
  return scholarDataScrape;
}


async function handleBrowseUniversity(university: UniversityEnum) {
  switch (university) {
    case "De La Salle Benilde":
      return handleBenildeScrape(
        "https://www.benilde.edu.ph/admissions/scholarships-and-grants/",
        university
      );
    case "Far Eastern University":
      return handleFEUScrape(
        "https://www.feu.edu.ph/cost-and-aid/scholarship-grants/",
        university
      );

    case "Colegio de San Juan de Letran":
      return handleLetranScrape(
        "https://www.letran.edu.ph/Admission/Home",
        university
      );
    case "Mapua University": 
      return handleMapuaScrape(
        "https://www.mapua.edu.ph/pages/admissions/mapua-scholarships/undergraduate",
        university
      );
      
    case "University of Santo Tomas":
        return handleUSTScrape(
          "https://manila.ust.edu.ph/osawebapp/osainfo-scholarshipoffered",
        university
        );
    case "Polytechnic University of the Philippines":
          return handlePUPScrape(
            "https://www.pup.edu.ph/students/scholarships",
        university
          );
    case "Lyceum of the Philippines University":
            return handleLPUScrape(
              "https://manila.lpu.edu.ph/admissions/academic-scholarships-and-financial-aid-grants/",
          university
            );
    case "Arellano University":
            return handleArellanoScrape(
              "https://www.arellano.edu.ph/admission/scholarship-programs/",
              // [
              // "https://www.arellano.edu.ph/admission/scholarship-programs/",
              // "https://www.arellano.edu.ph/admission/special-student-discounts/"
              // ],
          university
            );
    case "National Teachers College":
            return handleNTCScrape(
              "https://ntc.edu.ph/scholarships/",
          university
            );
    case "St. Paul University":
            return handleSPUScrape(
              "https://spumanila.edu.ph/students/scholarships",
          university
            );
    case "FEU Institute Of Technology":
            return handleFEUTECHScrape(
              "https://www.feutech.edu.ph/admission/scholarship-grants",
          university
            );
        
    default:
      return [];
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {} = body;

    const UNIVERSITIES: UniversityEnum[] = [
      //"De La Salle Benilde",
      // "Mapua University",
      // "National Teachers College",
      // "Colegio de San Juan de Letran",  
      // "University of Santo Tomas",
      // "Polytechnic University of the Philippines", 
      // "Lyceum of the Philippines University",    
      // "Arellano University",
      "FEU Institute Of Technology",
      // "St. Paul University",
      // "St. Paul University",

    ];

    const allScholarships = await Promise.all(
      UNIVERSITIES.map((university) => handleBrowseUniversity(university))
    );

    console.log(allScholarships);

    return NextResponse.json("Success");
  } catch (error) {
    console.log(error, "SCRAPE_ERROR");
    return new NextResponse(`Internal Error: ${error}`, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

function DataClean(
  data: Scraped[],
  collegeId: string
): { newScholarship: Scholarship; newCriteria: Criteria }[] {
  if (data.length <= 0) return [];

  let cleanedData: { newScholarship: Scholarship; newCriteria: Criteria }[] =
    data.map((element) => {
      let newScholarship: Scholarship = {
        id: new ObjectId().toHexString(),
        collegeId,
        title: element.title,
        details: element.description,
        scholarshipType: "N/A",
        coverageType: "",
        deadline: new Date(),
        formLink: element.formLink ? element.formLink : "",
        sourceType: "SCRAPED",
        number_of_clicks: 0,
      };

      let parsedDisability = parseDisability(element.description); // Parse and set disability

      if (
        (parsedDisability !== undefined && parsedDisability !== null) ||
        element.title.toLowerCase().includes("pwd")
      ) {
        newScholarship.scholarshipType = "PWD Scholarship";
      }

      if (
        element.title.toLowerCase().includes("athletic") ||
        element.title.toLowerCase().includes("talent")
      ) {
        newScholarship.scholarshipType = "Athletic Scholarship";
      }

      if (element.title.toLowerCase().includes("arts")) {
        newScholarship.scholarshipType = "Creative Scholarship";
      }

      if (
        element.title.toLowerCase().includes("honor") ||
        element.title.toLowerCase().includes("honors") ||
        element.title.toLowerCase().includes("academic")
      ) {
        newScholarship.scholarshipType = "Academic Scholarship";
      }

      let coverageType = parseCoverage(element.benefits);
      let parsedDeadline = parseDeadline(element.deadline);

      newScholarship.coverageType = coverageType;
      newScholarship.deadline = parsedDeadline;

      let newCriteria: Criteria = {
        id: new ObjectId().toHexString(),
        scholarshipId: newScholarship.id,

        grades: element.gwa ? parseInt(element.gwa) : null,
        financialStatus: null,
        prevSchool: null,
        location: null,
        citizenship: element.citizenship ? element.citizenship : null,
        extracurricularActivities: null,
        courseInterest: null,
        disability: parsedDisability,
      };

      newCriteria.financialStatus = parseFinancial(element.eligibility);
      newCriteria.grades = parseGPA(element.eligibility);
      newCriteria.citizenship = parseCitizen(element.eligibility);
      newCriteria.extracurricularActivities = parseExtraCurricular(
        element.benefits
      );

      return { newScholarship, newCriteria };
    });

  return cleanedData;
}

function parseCoverage(t: string): CoverageType | string {
  if (
    t.toLocaleLowerCase().includes("full scholarship") ||
    t.toLocaleLowerCase().includes("full tuition") ||
    t.toLocaleLowerCase().includes("full discount") ||
    t.toLocaleLowerCase().includes("100% tuition")
  ) {
    return "Full Tuition";
  } else if (
    t.toLocaleLowerCase().includes("partial scholarship") ||
    t.toLocaleLowerCase().includes("tuition discounts")
  ) {
    return "Partial Tuition";
  } else {
    // nothing matches
    return "N/A";
  }
}
function parseFinancial(strEligibility: string): FinancialStatusType {
  let monthlyIncomeRegex;
  if (strEligibility.includes("monthly income")) {
    monthlyIncomeRegex = /monthly income.*?(\d[\d,]*)/;

    // Extract the nearest number to "monthly income"
    const incomeMatch = strEligibility.match(monthlyIncomeRegex);

    if (incomeMatch) {
      return getFinancial(incomeMatch[1].split(",").join());
    } else {
      console.log("No match found");
    }
  }

  return "Not Specified";
}
function getFinancial(t: string | undefined): FinancialStatusType {
  if (!t) return "Not Specified";

  let checking = parseInt(t.split(",").join(""));
  if (checking <= 100000) {
    return FinancialStatusEnum[0];
  } else if (checking > 100000 && checking <= 200000)
    return FinancialStatusEnum[1];
  else {
    return "Not Specified";
  }
}
function parseDeadline(strDeadline: string) {
  const dateRegex =
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}-\b(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}/g;
  const dates = strDeadline.match(dateRegex);
  if (dates) {
    let singleDateStr = dates[0];
    const firstDateRegex =
      /\b(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}/;
    const firstDateMatch = singleDateStr.match(firstDateRegex);
    if (firstDateMatch) {
      let newDate = new Date(firstDateMatch[0]);
      newDate.setFullYear(new Date().getFullYear());
      return newDate;
    } else {
      console.log("No match found");
    }
  }
  return new Date();
}
function parseGPA(strEligibility: string) {
  let gpaRegex;
  if (strEligibility.includes("Grade Point Average")) {
    gpaRegex = /Grade Point Average.*?(\d+)/;

    const gpaMatch = strEligibility.match(gpaRegex);

    if (gpaMatch) {
      return parseInt(gpaMatch[1]);
    } else {
      console.log("No match found");
    }
  } else if (strEligibility.includes("weighted average")) {
    gpaRegex = /weighted average.*?(\d+)/;

    const gpaMatch = strEligibility.match(gpaRegex);

    if (gpaMatch) {
      return parseInt(gpaMatch[1]);
    } else {
      console.log("No match found");
    }
  }
  return null;
}
function parseCitizen(strEligibility: string) {
  let citizenshipRegex;
  if (strEligibility.includes("citizen")) {
    // has citizen status
    citizenshipRegex = /(\w+)\s+citizen/i;
    let match = strEligibility.match(citizenshipRegex);
    if (match && match[1]) {
      let ct = match[1];

      let found = ["Filipino", "American", "Chinese"].find(
        (t) => ct.toLocaleLowerCase() === t.toLocaleLowerCase()
      );

      if (found) {
        return found;
      }
    }
  }

  return null;
}
function parseExtraCurricular(strEligibility: string) {
  let regex;
  if (strEligibility.includes("student-athletes")) {
    return "Student Athlete";
  }

  return null;
}
function parseDisability(strDescription: string): string | null {
  // Define keywords to search for in the description
  const disabilityKeywords = [
    "Hearing",
    "Hard of Hearing",
    "Hearing Impaired",
    "Blind",
    "Visually Impaired",
    "Deaf",
  ];

  // Convert the description to lowercase for case-insensitive matching
  const lowerCaseDescription = strDescription.toLowerCase();

  // Loop through keywords to find a match
  for (let keyword of disabilityKeywords) {
    if (lowerCaseDescription.includes(keyword.toLowerCase())) {
      console.log(`Keyword found: ${keyword}`);
      return keyword;
    }
  }

  console.log(`No keyword found in description: ${lowerCaseDescription}`);

  // If no match found, return null
  return null;
}
