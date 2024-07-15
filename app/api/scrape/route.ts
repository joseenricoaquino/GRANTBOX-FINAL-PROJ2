import prisma from "@/lib/prismadb";

import { ObjectId } from "bson";

import puppeteer from "puppeteer";

import { NextResponse } from "next/server";
import { Criteria, Scholarship } from "@prisma/client";
import {
  CoverageType,
  FinancialStatusEnum,
  FinancialStatusType,
  UniversityPreferenceEnum,
} from "@/utils/types";
import clsx from "clsx";

interface Scraped {
  title: string;
  description: string;
  benefits: string;
  eligibility: string;
  deadline: string;
  url: string;
  formLink: string;
  gwa: string | undefined;
  financial: string | undefined;
  citizenship: string | undefined;
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
  | "Colegio de San Juan de Letran";

//Handles Scraping for DLSU Benilde
async function handleBenildeScrape(url: string, university: UniversityEnum) {
  //Check first the college if in the database
  const existingCollege = await prisma.college.findFirst({
    where: { name: university },
    select: { id: true },
  });

  if (!existingCollege) {
    console.log("Error: College isn't in the system yet!");
    return [];
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
      const scholarformElement = scholarr.querySelector("li > span > a") as HTMLAnchorElement;
      const clickformLink = scholarformElement && scholarformElement.textContent?.includes("CLICK HERE")
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
      };
    });
  });

  await browser.close();

  let cleanedData = DataClean(scholarDataScrape, existingCollege.id);

  //Remove all the scholarship for that university if a new data has been scraped and then add the new scholarships
  if (cleanedData.length > 0) {
    await prisma.$transaction([
      prisma.scholarship.deleteMany({
        where: { collegeId: existingCollege.id },
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

//SCraping Process Letran
async function handleLetranScrape(url: string, university: UniversityEnum) {
  // //Check first the college if in the database
  // const existingCollege = await prisma.college.findFirst({
  //   where: { name: university },
  //   select: { id: true },
  // });

  // if (!existingCollege) {
  //   console.log("Error: College isn't in the system yet!");
  //   return [];
  // }

  // Scrape the data
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url);

  const scholarDataScrape = await page.evaluate(() => {
    const scholarships = Array.from(document.querySelectorAll("#mCSB_2_container div:nth-of-type(n+3)"));
  
    if (!scholarships || scholarships.length === 0) {
      console.log("No scholarship elements found.");
      return [];
    }

    const cleanText = (text: any) => {
      return text
        .replace(/\n/g, ' ') // replace newlines with spaces
        .replace(/\s\s+/g, ' ') // replace multiple spaces with a single space
        .replace(/according to the following scheme:/g, '') // remove the specified phrase
        .replace(/In addition, the scholars will enjoy the following/g, '') // remove specific phrase
        .trim(); // trim leading and trailing spaces
        
    };
  
    const data = scholarships.map(scholarship => {
      const titleElement = scholarship.querySelector("a");
      const title = titleElement ? cleanText(titleElement.textContent).trim() : "N/A";
      const detailsElement = scholarship.querySelector(".panel-body p#pcontentwhite:nth-of-type(1)");
      const details = detailsElement ? cleanText(detailsElement.textContent).trim() : "N/A";
  
      let criteria = "";
      let eligibility = "";
      let coverageType = "";
      let extracurricularActivities =""
  
      const sections = Array.from(scholarship.querySelectorAll("p#titlewhite, p#pcontentwhite"));
  
      sections.forEach(section => {
        const sectionTitle = cleanText(section.textContent);

        if (sectionTitle.includes("Benefits and Privileges")) {
          const benefitsList = section.nextElementSibling;
          if (benefitsList) {
            coverageType = cleanText(benefitsList.textContent);
          }
        }

        if (sectionTitle.includes("Other Requirements")) {
          const extracurricularList = section.nextElementSibling?.nextElementSibling;
          if (extracurricularList) {
            extracurricularActivities = cleanText(extracurricularList.textContent);
          }
        }
  
        if (sectionTitle.includes("Criteria/Qualifications")) {
          const criteriaList = section.nextElementSibling?.nextElementSibling;
          if (criteriaList) {
            criteria = cleanText(criteriaList.textContent);
          }
        }
  
        if (sectionTitle.includes("Eligibility")) {
          const eligibilityList = section.nextElementSibling;
          if (eligibilityList) {
            eligibility = cleanText(eligibilityList.textContent);
          }
        }
      });

      const combinedEligibility = cleanText(`${criteria} ${eligibility}`.trim());
  
      return {
        title,
        details,
        eligibility: combinedEligibility,
        coverageType,
        extracurricularActivities

      };
    });
  
    return data;
  });
  
  console.log(scholarDataScrape);
  await browser.close()
  return scholarDataScrape;
}

//SCraping Process Ateneo
async function handleAteneoScrape(url: string, university: UniversityEnum) {
  // //Check first the college if in the database
  // const existingCollege = await prisma.college.findFirst({
  //   where: { name: university },
  //   select: { id: true },
  // });

  // if (!existingCollege) {
  //   console.log("Error: College isn't in the system yet!");
  //   return [];
  // }

  // Scrape the data
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  const scholarDataScrape = await page.evaluate(() => {
   
    const scholarships = Array.from(document.querySelectorAll("div.accordion-item"));
  
    if (!scholarships || scholarships.length === 0) {
      console.log("No scholarship elements found.");
      return [];
    }

    const cleanText = (text: any) => {
      return text
        .replace(/\n/g, ' ') // replace newlines with spaces
        .replace(/\s\s+/g, ' ') // replace multiple spaces with a single space
        .replace(/according to the following scheme:/g, '') // remove the specified phrase
        .replace(/In addition, the scholars will enjoy the following/g, '') // remove specific phrase
        .trim(); // trim leading and trailing spaces
        
    };
  
    const data = scholarships.map(scholarship => {
      const titleElement = scholarship.querySelector("h4");
      const title = titleElement ? cleanText(titleElement.textContent).trim() : "N/A";
      const detailsElement = scholarship.querySelector("div.accordion-body");
      const details = detailsElement ? cleanText(detailsElement.textContent).trim() : "N/A";
  
      let criteria = "";
      let eligibility = "";
      let coverageType = "";
      let extracurricularActivities =""
  
      const sections = Array.from(scholarship.querySelectorAll("p#titlewhite, p#pcontentwhite"));
  
      sections.forEach(section => {
        const sectionTitle = cleanText(section.textContent);

        if (sectionTitle.includes("Benefits and Privileges")) {
          const benefitsList = section.nextElementSibling;
          if (benefitsList) {
            coverageType = cleanText(benefitsList.textContent);
          }
        }

        if (sectionTitle.includes("Other Requirements")) {
          const extracurricularList = section.nextElementSibling?.nextElementSibling;
          if (extracurricularList) {
            extracurricularActivities = cleanText(extracurricularList.textContent);
          }
        }
  
        if (sectionTitle.includes("Criteria/Qualifications")) {
          const criteriaList = section.nextElementSibling?.nextElementSibling;
          if (criteriaList) {
            criteria = cleanText(criteriaList.textContent);
          }
        }
  
        if (sectionTitle.includes("Eligibility")) {
          const eligibilityList = section.nextElementSibling;
          if (eligibilityList) {
            eligibility = cleanText(eligibilityList.textContent);

          }
        }
      });

      const combinedEligibility = cleanText(`${criteria} ${eligibility}`.trim());
  
      return {
        title,
        details,
        eligibility: combinedEligibility,
        coverageType,
        extracurricularActivities

      };
    });
  
    return data;
  });
  
  console.log(scholarDataScrape);
  await browser.close()
  return scholarDataScrape;
}


async function handleFEUScrape(url: string, university: UniversityEnum) {
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

  const scholarshipData = await page.evaluate(() => {
    const scholarshipElements = Array.from(
      document.querySelectorAll("p:nth-of-type(n+5) a")
    );

    if (!scholarshipElements) {
      console.log(
        "No elements found with the selector p:nth-of-type(n+5) a[target]"
      );
      return [];
    }

    return scholarshipElements.map((element: any) => {
      return {
        title: element.innerText,
        url: element.href,
      };
    });
  });

  // Array to hold detailed scholarship data
  const scholarDataScrape: Scraped[] = [];

  console.log(scholarshipData);

  for (const scholarship of scholarshipData) {
    try {
      //console.log(`Navigating to URL: ${scholarship.url}`);

      // Navigate to the scholarship's individual page
      await page.goto(scholarship.url, { waitUntil: "domcontentloaded" });

      // Locate and scrape benefits from the page
      const benefits: string[] = (await page.evaluate(() => {
        const benefitsData: string[] = [];

        // Find all elements containing benefits information
        const benefitsElements = Array.from(
          document.querySelectorAll(
            "h2, h3, h4, h5, h6, p:nth-of-type(5) strong"
          )
        ).filter((el) => el.textContent?.toLowerCase().includes("benefits"));

        benefitsElements.forEach((benefitsHeaderElement) => {
          // Find the next sibling elements containing benefits text
          let sibling = benefitsHeaderElement.nextElementSibling;

          while (
            sibling &&
            !["H2", "H3", "H4", "H5", "H6"].includes(sibling.tagName)
          ) {
            if (sibling.textContent) {
              benefitsData.push(sibling.textContent.trim());
            }
            sibling = sibling.nextElementSibling;
          }
        });

        return benefitsData.length > 0 ? benefitsData : ["Benefits not found"];
      })) as any;

      // Locate and scrape ELIGIBILITY from the page
      const eligibility: string[] = (await page.evaluate(() => {
        const eligibilityData: string[] = [];

        // Find all elements containing ELIGIBILITY information
        const eligibilityElements = Array.from(
          document.querySelectorAll(
            "h2, h3, h4, h5, h6, p:nth-of-type(5) strong"
          )
        ).filter(
          (el) =>
            el.textContent?.toLowerCase().includes("eligibility") ||
            el.textContent?.toLowerCase().includes("additional eligibility")
        );

        eligibilityElements.forEach((eligibilityHeaderElement) => {
          // Find the next sibling elements containing benefits text
          let sibling = eligibilityHeaderElement.nextElementSibling;

          while (
            sibling &&
            !["H2", "H3", "H4", "H5", "H6"].includes(sibling.tagName)
          ) {
            if (sibling.textContent) {
              eligibilityData.push(sibling.textContent.trim());
            }
            sibling = sibling.nextElementSibling;
          }
        });

        return eligibilityData.length > 0
          ? eligibilityData
          : ["Eligibility not found"];
      })) as any[];

      console.log(`Benefits for ${scholarship.title}:`, benefits);
      console.log(`Eligibility for ${scholarship.title}:`, eligibility);

      // Extract GWA from eligibility description
      let gwa: string | undefined;
      let financial: string | undefined;
      let citizenship: string | undefined;
      const gwaRegex = /GWA\D*(\d+)/i;
      const financialRegex = /P(\d+(?:,\d+)*)/;
      const citizenshipRegex = /(\w+)\s+citizen/i;

      console.log(eligibility);

      eligibility.forEach((text) => {
        console.log("Eligibility text:", text); // Debug logging

        if (text.includes("GWA")) {
          
          let match = text.match(gwaRegex);
          if (match && match[1]) {
            gwa = match[1];
          }
        }

        if (text.includes("income")) {
          // has financial status
          let match = text.match(financialRegex);
          if (match && match[1]) {
            financial = match[1];
          }
        }

        if (text.includes("citizen")) {
          // has citizen status
          let match = text.match(citizenshipRegex);
          if (match && match[1]) {
            citizenship = match[1];
          }
        }
      });

      const newScholarship: Scraped = {
        title: scholarship.title,
        description: "",
        benefits: benefits.join(" ").replace(/\n/g, " ").trim(),
        eligibility: eligibility.join(" ").replace(/\n/g, " ").trim(),
        url: scholarship.url,
        formLink: "NA",
        deadline: "N/A",
        gwa,
        financial,
        citizenship,
      };

      console.log(newScholarship)

      scholarDataScrape.push(newScholarship);

      // Optional: Add a delay between requests to be polite to the server
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error scraping ${scholarship.url}:`, error);
    }
  }

  await browser.close();

  let cleanedData = DataClean(scholarDataScrape, existingCollege?.id || "");

  //Remove all the scholarship for that university if a new data has been scraped and then add the new scholarships
  if (cleanedData.length > 0) {
    await prisma.$transaction([
      prisma.scholarship.deleteMany({
        where: { collegeId: existingCollege?.id || "" },
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

// Handles browsing for a specific university
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
        case "Ateneo de Manila University":
          return handleAteneoScrape(
            "https://www.ateneo.edu/college/scholarships/programs",
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
       "De La Salle Benilde",
      //"Far Eastern University",
    // "Colegio de San Juan de Letran",
      // "Ateneo de Manila University"
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
  console.log(data);

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
        formLink: element.url,
      };

      let coverageType = parseCoverage(element.benefits);

      newScholarship.coverageType = coverageType;

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
      };

      let financialType = parseFinancial(element.financial);
      newCriteria.financialStatus = financialType;
      

      return { newScholarship, newCriteria };
    });

  return cleanedData;
}

function parseCoverage(t: string): CoverageType | string {
  if (t.toLocaleLowerCase().includes("full scholarship") || t.toLocaleLowerCase().includes("full tuition")) {
    return "Full Tuition";
  } else if (t.toLocaleLowerCase().includes("partial scholarship")) {
    return "Partial Tuition";
  } else {
    // nothing matches
    return "N/A";
  }
}
function parseFinancial(t: string | undefined): FinancialStatusType | string {
  if (!t) return "N/A";

  let checking = parseInt(t.split(",").join(""));
  if (checking <= 100000) {
    return FinancialStatusEnum[0];
  } else if (checking > 100000 && checking <= 200000)
    return FinancialStatusEnum[1];
  else {
    return "N/A";
  }
}
