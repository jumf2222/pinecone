/* Amplify Params - DO NOT EDIT
	API_PINECONE_GRAPHQLAPIENDPOINTOUTPUT
	API_PINECONE_GRAPHQLAPIIDOUTPUT
	AUTH_PINECONEE519DA81_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

// global.WebSocket = require("ws");
require("es6-promise").polyfill();
// require("isomorphic-fetch");

const fetch = require("node-fetch");
const JSDOM = require("jsdom").JSDOM;

const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl =
  "https://nsgbba532re57pmty6n7gzqzha.appsync-api.us-east-2.amazonaws.com/graphql";
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();

let courseList = require("./courses.json");

async function graphQlOP(name, query, variables) {
  const req = new AWS.HttpRequest(appsyncUrl, region);

  req.method = "POST";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify({
    query: query,
    operationName: name,
    variables: variables,
  });

  const signer = new AWS.Signers.V4(req, "appsync", true);
  signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());

  return await new Promise((resolve, reject) => {
    const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
      result.on("data", (data) => {
        resolve(JSON.parse(data.toString()));
      });
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });
}

async function createCourse(course) {
  const statement = `mutation CreateCourse($input: CreateCourseInput!, $condition: ModelCourseConditionInput) {
    createCourse(input: $input, condition: $condition) {
      id
    }
  }`;

  return await graphQlOP("CreateCourse", statement, { input: course });
}

async function updateCourse(course) {
  const statement = `mutation UpdateCourse($input: UpdateCourseInput!, $condition: ModelCourseConditionInput) {
    updateCourse(input: $input, condition: $condition) {
      id
    }
  }`;

  return await graphQlOP("UpdateCourse", statement, { input: course });
}

async function createSection(section) {
  const statement = `mutation CreateSection($input: CreateSectionInput!, $condition: ModelSectionConditionInput) {
        createSection(input: $input, condition: $condition) {
          id
        }
      }`;

  return await graphQlOP("CreateSection", statement, { input: section });
}

async function updateSection(section) {
  const statement = `mutation UpdateSection($input: UpdateSectionInput!, $condition: ModelSectionConditionInput) {
    updateSection(input: $input, condition: $condition) {
      id
    }
  }`;

  return await graphQlOP("UpdateSection", statement, { input: section });
}

function convertTimeString(time) {
  if (!time) return 0;

  let tokens = time.split(":");
  return parseInt(tokens[0]) * 2 + parseInt(tokens[1]) / 30;
}

function splitString(raw) {
  if (!raw) return [];

  let split = raw.trim().split("\n");
  for (let ind = 0; ind < split.length; ind++) {
    split[ind] = split[ind].trim();
  }
  return split;
}

function createSessions(rawTimes, rawLocations) {
  if (!rawTimes.trim()) return [];

  let sessions = [];
  let timeStrings = rawTimes.trim().split("\n");
  let strippedLocations = splitString(rawLocations);

  for (let ind = 0; ind < timeStrings.length; ind++) {
    if (!timeStrings[ind].trim()) continue;

    let strippedTimes = timeStrings[ind].trim().split(" ");

    if (strippedTimes.length < 2) continue;
    let tokens = strippedTimes[1].split("-");

    sessions.push({
      day: strippedTimes[0],
      location: strippedLocations[ind] || "",
      start: convertTimeString(tokens[0]),
      end: convertTimeString(tokens[1]),
    });
  }

  return sessions;
}

async function loadCourseData(
  code,
  campus,
  credit,
  term,
  year,
  update = true,
  includeCourseInfo = false
) {
  let urlTerm = term;
  let academicSession = "9";

  if (urlTerm.length === 2) {
    urlTerm = urlTerm.slice(1, 2);
    academicSession = "5" + (urlTerm !== "Y" ? urlTerm : "");
  } else if (urlTerm[0] === "S") {
    academicSession = "1";
  }

  let courseUrl = `https://coursefinder.utoronto.ca/course-search/search/courseInquiry?methodToCall=start&viewId=CourseDetails-InquiryView&courseId=${code}${credit}${campus}${urlTerm}${year}${academicSession}`;

  let res = await (await fetch(courseUrl, { cache: "no-store" })).text();
  const { document } = new JSDOM(res).window;

  if (
    document.querySelector("span.uif-headerText-span").textContent.trim() ===
    "Error"
  ) {
    console.log("FETCH ERROR", courseUrl);
    return [];
  }

  let requests = [];
  let rawName = document
    .querySelector("span.uif-headerText-span")
    .textContent.trim();
  let course = {
    id: code + credit + campus + term + year,
    code: code,
    term: term,
    year: year,
    campus: campus,
    credit: credit,
    name: rawName.slice(10, rawName.length),
    description: document.querySelector("span[id='u32']").textContent.trim(),
    prerequisites: document.querySelector("span[id='u50']")
      ? document.querySelector("span[id='u50']").textContent.trim()
      : "",
    corequisites: document.querySelector("span[id='u59']")
      ? document.querySelector("span[id='u59']").textContent.trim()
      : "",
    exclusions: document.querySelector("span[id='u68']")
      ? document.querySelector("span[id='u68']").textContent.trim()
      : "",
    breadth: "",
    distribution: "",
  };

  // Distribution and breadth requirement
  if (campus === "1") {
    course.distribution = document.querySelector("span[id='u131']")
      ? document.querySelector("span[id='u131']").textContent.trim()
      : "";
    course.breadth = document.querySelector("span[id='u122']")
      ? document.querySelector("span[id='u122']").textContent.trim()
      : "";
  } else if (campus === "3") {
    course.breadth = document.querySelector("span[id='u104']")
      ? document.querySelector("span[id='u104']").textContent.trim()
      : "";
  } else if (campus === "5") {
    course.distribution = document.querySelector("span[id='u113']")
      ? document.querySelector("span[id='u113']").textContent.trim()
      : "";
  }

  if (includeCourseInfo) {
    if (update) {
      requests.push(updateCourse(course));
    } else {
      requests.push(createCourse(course));
    }
  }

  // Sections
  let sections = document.querySelectorAll("tbody tr");

  for (const sectionElm of sections) {
    let rawRowInfo = sectionElm.querySelectorAll("td");

    if (rawRowInfo.length < 8) continue;

    let sectionCode = rawRowInfo[0].textContent
      .trim()
      .replace(" ", "")
      .toUpperCase();
    let sectionData = {
      id: course.id + sectionCode,
      code: sectionCode,
      courseID: course.id,
      instructors: splitString(rawRowInfo[2].textContent.trim()),
      method: rawRowInfo[7].textContent.trim(),
      curEnroll: parseInt(rawRowInfo[5].textContent.trim()) || 0,
      maxEnroll: parseInt(rawRowInfo[4].textContent.trim()) || 0,
      sessions: createSessions(
        rawRowInfo[1].textContent.trim(),
        rawRowInfo[3].textContent.trim()
      ),
    };

    if (update) {
      requests.push(updateSection(sectionData));
    } else {
      requests.push(createSection(sectionData));
    }
  }

  let results = await Promise.all(requests);

  for (const req of results) {
    if (!req || req.errors) {
      console.log(
        "ERROR",
        course.code,
        course.campus,
        course.term,
        course.year,
        req ? req.errors : ""
      );
    }
  }
}

exports.handler = async (event) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };

  let requests = [];
  for (
    let ind = event.skip;
    ind < courseList.length && ind < event.skip + event.limit;
    ind++
  ) {
    const course = courseList[ind];

    requests.push(
      loadCourseData(
        course.code,
        course.campus,
        course.credit,
        course.term,
        course.year,
        false,
        true
      )
    );

    if (ind % 10 === 0) {
      await Promise.all(requests);
      requests = [];
      console.log("Done", ind);
    }
  }

  await Promise.all(requests);
  console.log("Finished, total", courseList.length);
  return response;
};
