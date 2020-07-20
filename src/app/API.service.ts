/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation } from "@aws-amplify/api";
import { GraphQLResult } from "@aws-amplify/api/lib/types";
import { Observable } from "zen-observable-ts";

export type CreateCourseInput = {
  id?: string | null;
  name?: string | null;
  code: string;
  year: string;
  term: string;
  campus?: string | null;
  distributionRequirement?: string | null;
  description?: string | null;
  prerequisites?: string | null;
  exclusions?: string | null;
  enrollControlsType?: string | null;
  enrollControls?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ModelCourseConditionInput = {
  name?: ModelStringInput | null;
  code?: ModelStringInput | null;
  year?: ModelStringInput | null;
  term?: ModelStringInput | null;
  campus?: ModelStringInput | null;
  distributionRequirement?: ModelStringInput | null;
  description?: ModelStringInput | null;
  prerequisites?: ModelStringInput | null;
  exclusions?: ModelStringInput | null;
  enrollControlsType?: ModelStringInput | null;
  enrollControls?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelCourseConditionInput | null> | null;
  or?: Array<ModelCourseConditionInput | null> | null;
  not?: ModelCourseConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null"
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type UpdateCourseInput = {
  id: string;
  name?: string | null;
  code?: string | null;
  year?: string | null;
  term?: string | null;
  campus?: string | null;
  distributionRequirement?: string | null;
  description?: string | null;
  prerequisites?: string | null;
  exclusions?: string | null;
  enrollControlsType?: string | null;
  enrollControls?: Array<string | null> | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type DeleteCourseInput = {
  id?: string | null;
};

export type CreateSectionInput = {
  id?: string | null;
  courseID: string;
  sessions?: Array<SessionInput | null> | null;
  syllabus?: string | null;
  code?: string | null;
  instructor?: string | null;
  curEnroll?: number | null;
  maxEnroll?: number | null;
  notes?: string | null;
};

export type SessionInput = {
  day?: string | null;
  start?: number | null;
  end?: number | null;
  room?: string | null;
};

export type ModelSectionConditionInput = {
  courseID?: ModelIDInput | null;
  syllabus?: ModelStringInput | null;
  code?: ModelStringInput | null;
  instructor?: ModelStringInput | null;
  curEnroll?: ModelIntInput | null;
  maxEnroll?: ModelIntInput | null;
  notes?: ModelStringInput | null;
  and?: Array<ModelSectionConditionInput | null> | null;
  or?: Array<ModelSectionConditionInput | null> | null;
  not?: ModelSectionConditionInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ModelIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type UpdateSectionInput = {
  id: string;
  courseID?: string | null;
  sessions?: Array<SessionInput | null> | null;
  syllabus?: string | null;
  code?: string | null;
  instructor?: string | null;
  curEnroll?: number | null;
  maxEnroll?: number | null;
  notes?: string | null;
};

export type DeleteSectionInput = {
  id?: string | null;
};

export type CreateScheduleInput = {
  id?: string | null;
  year?: string | null;
  term?: string | null;
  name?: string | null;
  courses?: Array<CourseOptionInput | null> | null;
  times?: string | null;
  score?: number | null;
};

export type CourseOptionInput = {
  courseID: string;
  autoLecture?: boolean | null;
  autoPratical?: boolean | null;
  autoTutorial?: boolean | null;
};

export type ModelScheduleConditionInput = {
  year?: ModelStringInput | null;
  term?: ModelStringInput | null;
  name?: ModelStringInput | null;
  times?: ModelStringInput | null;
  score?: ModelIntInput | null;
  and?: Array<ModelScheduleConditionInput | null> | null;
  or?: Array<ModelScheduleConditionInput | null> | null;
  not?: ModelScheduleConditionInput | null;
};

export type UpdateScheduleInput = {
  id: string;
  year?: string | null;
  term?: string | null;
  name?: string | null;
  courses?: Array<CourseOptionInput | null> | null;
  times?: string | null;
  score?: number | null;
};

export type DeleteScheduleInput = {
  id?: string | null;
};

export type ModelCourseFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  code?: ModelStringInput | null;
  year?: ModelStringInput | null;
  term?: ModelStringInput | null;
  campus?: ModelStringInput | null;
  distributionRequirement?: ModelStringInput | null;
  description?: ModelStringInput | null;
  prerequisites?: ModelStringInput | null;
  exclusions?: ModelStringInput | null;
  enrollControlsType?: ModelStringInput | null;
  enrollControls?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  and?: Array<ModelCourseFilterInput | null> | null;
  or?: Array<ModelCourseFilterInput | null> | null;
  not?: ModelCourseFilterInput | null;
};

export type ModelSectionFilterInput = {
  id?: ModelIDInput | null;
  courseID?: ModelIDInput | null;
  syllabus?: ModelStringInput | null;
  code?: ModelStringInput | null;
  instructor?: ModelStringInput | null;
  curEnroll?: ModelIntInput | null;
  maxEnroll?: ModelIntInput | null;
  notes?: ModelStringInput | null;
  and?: Array<ModelSectionFilterInput | null> | null;
  or?: Array<ModelSectionFilterInput | null> | null;
  not?: ModelSectionFilterInput | null;
};

export type ModelScheduleFilterInput = {
  id?: ModelIDInput | null;
  year?: ModelStringInput | null;
  term?: ModelStringInput | null;
  name?: ModelStringInput | null;
  times?: ModelStringInput | null;
  score?: ModelIntInput | null;
  and?: Array<ModelScheduleFilterInput | null> | null;
  or?: Array<ModelScheduleFilterInput | null> | null;
  not?: ModelScheduleFilterInput | null;
};

export type ModelCourseByYearTermCampusCodeCompositeKeyConditionInput = {
  eq?: ModelCourseByYearTermCampusCodeCompositeKeyInput | null;
  le?: ModelCourseByYearTermCampusCodeCompositeKeyInput | null;
  lt?: ModelCourseByYearTermCampusCodeCompositeKeyInput | null;
  ge?: ModelCourseByYearTermCampusCodeCompositeKeyInput | null;
  gt?: ModelCourseByYearTermCampusCodeCompositeKeyInput | null;
  between?: Array<ModelCourseByYearTermCampusCodeCompositeKeyInput | null> | null;
  beginsWith?: ModelCourseByYearTermCampusCodeCompositeKeyInput | null;
};

export type ModelCourseByYearTermCampusCodeCompositeKeyInput = {
  term?: string | null;
  campus?: string | null;
  code?: string | null;
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export type ModelStringKeyConditionInput = {
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type SearchableCourseFilterInput = {
  id?: SearchableIDFilterInput | null;
  name?: SearchableStringFilterInput | null;
  code?: SearchableStringFilterInput | null;
  year?: SearchableStringFilterInput | null;
  term?: SearchableStringFilterInput | null;
  campus?: SearchableStringFilterInput | null;
  distributionRequirement?: SearchableStringFilterInput | null;
  description?: SearchableStringFilterInput | null;
  prerequisites?: SearchableStringFilterInput | null;
  exclusions?: SearchableStringFilterInput | null;
  enrollControlsType?: SearchableStringFilterInput | null;
  enrollControls?: SearchableStringFilterInput | null;
  createdAt?: SearchableStringFilterInput | null;
  updatedAt?: SearchableStringFilterInput | null;
  and?: Array<SearchableCourseFilterInput | null> | null;
  or?: Array<SearchableCourseFilterInput | null> | null;
  not?: SearchableCourseFilterInput | null;
};

export type SearchableIDFilterInput = {
  ne?: string | null;
  gt?: string | null;
  lt?: string | null;
  gte?: string | null;
  lte?: string | null;
  eq?: string | null;
  match?: string | null;
  matchPhrase?: string | null;
  matchPhrasePrefix?: string | null;
  multiMatch?: string | null;
  exists?: boolean | null;
  wildcard?: string | null;
  regexp?: string | null;
};

export type SearchableStringFilterInput = {
  ne?: string | null;
  gt?: string | null;
  lt?: string | null;
  gte?: string | null;
  lte?: string | null;
  eq?: string | null;
  match?: string | null;
  matchPhrase?: string | null;
  matchPhrasePrefix?: string | null;
  multiMatch?: string | null;
  exists?: boolean | null;
  wildcard?: string | null;
  regexp?: string | null;
};

export type SearchableCourseSortInput = {
  field?: SearchableCourseSortableFields | null;
  direction?: SearchableSortDirection | null;
};

export enum SearchableCourseSortableFields {
  id = "id",
  name = "name",
  code = "code",
  year = "year",
  term = "term",
  campus = "campus",
  distributionRequirement = "distributionRequirement",
  description = "description",
  prerequisites = "prerequisites",
  exclusions = "exclusions",
  enrollControlsType = "enrollControlsType",
  enrollControls = "enrollControls",
  createdAt = "createdAt",
  updatedAt = "updatedAt"
}

export enum SearchableSortDirection {
  asc = "asc",
  desc = "desc"
}

export type CreateCourseMutation = {
  __typename: "Course";
  id: string;
  name: string | null;
  code: string;
  year: string;
  term: string;
  campus: string | null;
  distributionRequirement: string | null;
  description: string | null;
  prerequisites: string | null;
  exclusions: string | null;
  enrollControlsType: string | null;
  enrollControls: Array<string | null> | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateCourseMutation = {
  __typename: "Course";
  id: string;
  name: string | null;
  code: string;
  year: string;
  term: string;
  campus: string | null;
  distributionRequirement: string | null;
  description: string | null;
  prerequisites: string | null;
  exclusions: string | null;
  enrollControlsType: string | null;
  enrollControls: Array<string | null> | null;
  createdAt: string;
  updatedAt: string;
};

export type DeleteCourseMutation = {
  __typename: "Course";
  id: string;
  name: string | null;
  code: string;
  year: string;
  term: string;
  campus: string | null;
  distributionRequirement: string | null;
  description: string | null;
  prerequisites: string | null;
  exclusions: string | null;
  enrollControlsType: string | null;
  enrollControls: Array<string | null> | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateSectionMutation = {
  __typename: "Section";
  id: string;
  courseID: string;
  sessions: Array<{
    __typename: "Session";
    day: string | null;
    start: number | null;
    end: number | null;
    room: string | null;
  } | null> | null;
  syllabus: string | null;
  code: string | null;
  instructor: string | null;
  curEnroll: number | null;
  maxEnroll: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSectionMutation = {
  __typename: "Section";
  id: string;
  courseID: string;
  sessions: Array<{
    __typename: "Session";
    day: string | null;
    start: number | null;
    end: number | null;
    room: string | null;
  } | null> | null;
  syllabus: string | null;
  code: string | null;
  instructor: string | null;
  curEnroll: number | null;
  maxEnroll: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DeleteSectionMutation = {
  __typename: "Section";
  id: string;
  courseID: string;
  sessions: Array<{
    __typename: "Session";
    day: string | null;
    start: number | null;
    end: number | null;
    room: string | null;
  } | null> | null;
  syllabus: string | null;
  code: string | null;
  instructor: string | null;
  curEnroll: number | null;
  maxEnroll: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateScheduleMutation = {
  __typename: "Schedule";
  id: string;
  year: string | null;
  term: string | null;
  name: string | null;
  courses: Array<{
    __typename: "CourseOption";
    courseID: string;
    autoLecture: boolean | null;
    autoPratical: boolean | null;
    autoTutorial: boolean | null;
  } | null> | null;
  times: string | null;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  owner: string | null;
};

export type UpdateScheduleMutation = {
  __typename: "Schedule";
  id: string;
  year: string | null;
  term: string | null;
  name: string | null;
  courses: Array<{
    __typename: "CourseOption";
    courseID: string;
    autoLecture: boolean | null;
    autoPratical: boolean | null;
    autoTutorial: boolean | null;
  } | null> | null;
  times: string | null;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  owner: string | null;
};

export type DeleteScheduleMutation = {
  __typename: "Schedule";
  id: string;
  year: string | null;
  term: string | null;
  name: string | null;
  courses: Array<{
    __typename: "CourseOption";
    courseID: string;
    autoLecture: boolean | null;
    autoPratical: boolean | null;
    autoTutorial: boolean | null;
  } | null> | null;
  times: string | null;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  owner: string | null;
};

export type GetCourseQuery = {
  __typename: "Course";
  id: string;
  name: string | null;
  code: string;
  year: string;
  term: string;
  campus: string | null;
  distributionRequirement: string | null;
  description: string | null;
  prerequisites: string | null;
  exclusions: string | null;
  enrollControlsType: string | null;
  enrollControls: Array<string | null> | null;
  createdAt: string;
  updatedAt: string;
};

export type ListCoursesQuery = {
  __typename: "ModelCourseConnection";
  items: Array<{
    __typename: "Course";
    id: string;
    name: string | null;
    code: string;
    year: string;
    term: string;
    campus: string | null;
    distributionRequirement: string | null;
    description: string | null;
    prerequisites: string | null;
    exclusions: string | null;
    enrollControlsType: string | null;
    enrollControls: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken: string | null;
};

export type GetSectionQuery = {
  __typename: "Section";
  id: string;
  courseID: string;
  sessions: Array<{
    __typename: "Session";
    day: string | null;
    start: number | null;
    end: number | null;
    room: string | null;
  } | null> | null;
  syllabus: string | null;
  code: string | null;
  instructor: string | null;
  curEnroll: number | null;
  maxEnroll: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ListSectionsQuery = {
  __typename: "ModelSectionConnection";
  items: Array<{
    __typename: "Section";
    id: string;
    courseID: string;
    sessions: Array<{
      __typename: "Session";
      day: string | null;
      start: number | null;
      end: number | null;
      room: string | null;
    } | null> | null;
    syllabus: string | null;
    code: string | null;
    instructor: string | null;
    curEnroll: number | null;
    maxEnroll: number | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken: string | null;
};

export type GetScheduleQuery = {
  __typename: "Schedule";
  id: string;
  year: string | null;
  term: string | null;
  name: string | null;
  courses: Array<{
    __typename: "CourseOption";
    courseID: string;
    autoLecture: boolean | null;
    autoPratical: boolean | null;
    autoTutorial: boolean | null;
  } | null> | null;
  times: string | null;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  owner: string | null;
};

export type ListSchedulesQuery = {
  __typename: "ModelScheduleConnection";
  items: Array<{
    __typename: "Schedule";
    id: string;
    year: string | null;
    term: string | null;
    name: string | null;
    courses: Array<{
      __typename: "CourseOption";
      courseID: string;
      autoLecture: boolean | null;
      autoPratical: boolean | null;
      autoTutorial: boolean | null;
    } | null> | null;
    times: string | null;
    score: number | null;
    createdAt: string;
    updatedAt: string;
    owner: string | null;
  } | null> | null;
  nextToken: string | null;
};

export type ByYearTermCampusCodeQuery = {
  __typename: "ModelCourseConnection";
  items: Array<{
    __typename: "Course";
    id: string;
    name: string | null;
    code: string;
    year: string;
    term: string;
    campus: string | null;
    distributionRequirement: string | null;
    description: string | null;
    prerequisites: string | null;
    exclusions: string | null;
    enrollControlsType: string | null;
    enrollControls: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken: string | null;
};

export type ByCourseIdCodeQuery = {
  __typename: "ModelSectionConnection";
  items: Array<{
    __typename: "Section";
    id: string;
    courseID: string;
    sessions: Array<{
      __typename: "Session";
      day: string | null;
      start: number | null;
      end: number | null;
      room: string | null;
    } | null> | null;
    syllabus: string | null;
    code: string | null;
    instructor: string | null;
    curEnroll: number | null;
    maxEnroll: number | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken: string | null;
};

export type SearchCoursesQuery = {
  __typename: "SearchableCourseConnection";
  items: Array<{
    __typename: "Course";
    id: string;
    name: string | null;
    code: string;
    year: string;
    term: string;
    campus: string | null;
    distributionRequirement: string | null;
    description: string | null;
    prerequisites: string | null;
    exclusions: string | null;
    enrollControlsType: string | null;
    enrollControls: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
  } | null> | null;
  nextToken: string | null;
  total: number | null;
};

export type OnCreateCourseSubscription = {
  __typename: "Course";
  id: string;
  name: string | null;
  code: string;
  year: string;
  term: string;
  campus: string | null;
  distributionRequirement: string | null;
  description: string | null;
  prerequisites: string | null;
  exclusions: string | null;
  enrollControlsType: string | null;
  enrollControls: Array<string | null> | null;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateCourseSubscription = {
  __typename: "Course";
  id: string;
  name: string | null;
  code: string;
  year: string;
  term: string;
  campus: string | null;
  distributionRequirement: string | null;
  description: string | null;
  prerequisites: string | null;
  exclusions: string | null;
  enrollControlsType: string | null;
  enrollControls: Array<string | null> | null;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteCourseSubscription = {
  __typename: "Course";
  id: string;
  name: string | null;
  code: string;
  year: string;
  term: string;
  campus: string | null;
  distributionRequirement: string | null;
  description: string | null;
  prerequisites: string | null;
  exclusions: string | null;
  enrollControlsType: string | null;
  enrollControls: Array<string | null> | null;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateSectionSubscription = {
  __typename: "Section";
  id: string;
  courseID: string;
  sessions: Array<{
    __typename: "Session";
    day: string | null;
    start: number | null;
    end: number | null;
    room: string | null;
  } | null> | null;
  syllabus: string | null;
  code: string | null;
  instructor: string | null;
  curEnroll: number | null;
  maxEnroll: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateSectionSubscription = {
  __typename: "Section";
  id: string;
  courseID: string;
  sessions: Array<{
    __typename: "Session";
    day: string | null;
    start: number | null;
    end: number | null;
    room: string | null;
  } | null> | null;
  syllabus: string | null;
  code: string | null;
  instructor: string | null;
  curEnroll: number | null;
  maxEnroll: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteSectionSubscription = {
  __typename: "Section";
  id: string;
  courseID: string;
  sessions: Array<{
    __typename: "Session";
    day: string | null;
    start: number | null;
    end: number | null;
    room: string | null;
  } | null> | null;
  syllabus: string | null;
  code: string | null;
  instructor: string | null;
  curEnroll: number | null;
  maxEnroll: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateScheduleSubscription = {
  __typename: "Schedule";
  id: string;
  year: string | null;
  term: string | null;
  name: string | null;
  courses: Array<{
    __typename: "CourseOption";
    courseID: string;
    autoLecture: boolean | null;
    autoPratical: boolean | null;
    autoTutorial: boolean | null;
  } | null> | null;
  times: string | null;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  owner: string | null;
};

export type OnUpdateScheduleSubscription = {
  __typename: "Schedule";
  id: string;
  year: string | null;
  term: string | null;
  name: string | null;
  courses: Array<{
    __typename: "CourseOption";
    courseID: string;
    autoLecture: boolean | null;
    autoPratical: boolean | null;
    autoTutorial: boolean | null;
  } | null> | null;
  times: string | null;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  owner: string | null;
};

export type OnDeleteScheduleSubscription = {
  __typename: "Schedule";
  id: string;
  year: string | null;
  term: string | null;
  name: string | null;
  courses: Array<{
    __typename: "CourseOption";
    courseID: string;
    autoLecture: boolean | null;
    autoPratical: boolean | null;
    autoTutorial: boolean | null;
  } | null> | null;
  times: string | null;
  score: number | null;
  createdAt: string;
  updatedAt: string;
  owner: string | null;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateCourse(
    input: CreateCourseInput,
    condition?: ModelCourseConditionInput
  ): Promise<CreateCourseMutation> {
    const statement = `mutation CreateCourse($input: CreateCourseInput!, $condition: ModelCourseConditionInput) {
        createCourse(input: $input, condition: $condition) {
          __typename
          id
          name
          code
          year
          term
          campus
          distributionRequirement
          description
          prerequisites
          exclusions
          enrollControlsType
          enrollControls
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateCourseMutation>response.data.createCourse;
  }
  async UpdateCourse(
    input: UpdateCourseInput,
    condition?: ModelCourseConditionInput
  ): Promise<UpdateCourseMutation> {
    const statement = `mutation UpdateCourse($input: UpdateCourseInput!, $condition: ModelCourseConditionInput) {
        updateCourse(input: $input, condition: $condition) {
          __typename
          id
          name
          code
          year
          term
          campus
          distributionRequirement
          description
          prerequisites
          exclusions
          enrollControlsType
          enrollControls
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateCourseMutation>response.data.updateCourse;
  }
  async DeleteCourse(
    input: DeleteCourseInput,
    condition?: ModelCourseConditionInput
  ): Promise<DeleteCourseMutation> {
    const statement = `mutation DeleteCourse($input: DeleteCourseInput!, $condition: ModelCourseConditionInput) {
        deleteCourse(input: $input, condition: $condition) {
          __typename
          id
          name
          code
          year
          term
          campus
          distributionRequirement
          description
          prerequisites
          exclusions
          enrollControlsType
          enrollControls
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteCourseMutation>response.data.deleteCourse;
  }
  async CreateSection(
    input: CreateSectionInput,
    condition?: ModelSectionConditionInput
  ): Promise<CreateSectionMutation> {
    const statement = `mutation CreateSection($input: CreateSectionInput!, $condition: ModelSectionConditionInput) {
        createSection(input: $input, condition: $condition) {
          __typename
          id
          courseID
          sessions {
            __typename
            day
            start
            end
            room
          }
          syllabus
          code
          instructor
          curEnroll
          maxEnroll
          notes
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateSectionMutation>response.data.createSection;
  }
  async UpdateSection(
    input: UpdateSectionInput,
    condition?: ModelSectionConditionInput
  ): Promise<UpdateSectionMutation> {
    const statement = `mutation UpdateSection($input: UpdateSectionInput!, $condition: ModelSectionConditionInput) {
        updateSection(input: $input, condition: $condition) {
          __typename
          id
          courseID
          sessions {
            __typename
            day
            start
            end
            room
          }
          syllabus
          code
          instructor
          curEnroll
          maxEnroll
          notes
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateSectionMutation>response.data.updateSection;
  }
  async DeleteSection(
    input: DeleteSectionInput,
    condition?: ModelSectionConditionInput
  ): Promise<DeleteSectionMutation> {
    const statement = `mutation DeleteSection($input: DeleteSectionInput!, $condition: ModelSectionConditionInput) {
        deleteSection(input: $input, condition: $condition) {
          __typename
          id
          courseID
          sessions {
            __typename
            day
            start
            end
            room
          }
          syllabus
          code
          instructor
          curEnroll
          maxEnroll
          notes
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteSectionMutation>response.data.deleteSection;
  }
  async CreateSchedule(
    input: CreateScheduleInput,
    condition?: ModelScheduleConditionInput
  ): Promise<CreateScheduleMutation> {
    const statement = `mutation CreateSchedule($input: CreateScheduleInput!, $condition: ModelScheduleConditionInput) {
        createSchedule(input: $input, condition: $condition) {
          __typename
          id
          year
          term
          name
          courses {
            __typename
            courseID
            autoLecture
            autoPratical
            autoTutorial
          }
          times
          score
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateScheduleMutation>response.data.createSchedule;
  }
  async UpdateSchedule(
    input: UpdateScheduleInput,
    condition?: ModelScheduleConditionInput
  ): Promise<UpdateScheduleMutation> {
    const statement = `mutation UpdateSchedule($input: UpdateScheduleInput!, $condition: ModelScheduleConditionInput) {
        updateSchedule(input: $input, condition: $condition) {
          __typename
          id
          year
          term
          name
          courses {
            __typename
            courseID
            autoLecture
            autoPratical
            autoTutorial
          }
          times
          score
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateScheduleMutation>response.data.updateSchedule;
  }
  async DeleteSchedule(
    input: DeleteScheduleInput,
    condition?: ModelScheduleConditionInput
  ): Promise<DeleteScheduleMutation> {
    const statement = `mutation DeleteSchedule($input: DeleteScheduleInput!, $condition: ModelScheduleConditionInput) {
        deleteSchedule(input: $input, condition: $condition) {
          __typename
          id
          year
          term
          name
          courses {
            __typename
            courseID
            autoLecture
            autoPratical
            autoTutorial
          }
          times
          score
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteScheduleMutation>response.data.deleteSchedule;
  }
  async GetCourse(id: string): Promise<GetCourseQuery> {
    const statement = `query GetCourse($id: ID!) {
        getCourse(id: $id) {
          __typename
          id
          name
          code
          year
          term
          campus
          distributionRequirement
          description
          prerequisites
          exclusions
          enrollControlsType
          enrollControls
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetCourseQuery>response.data.getCourse;
  }
  async ListCourses(
    filter?: ModelCourseFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListCoursesQuery> {
    const statement = `query ListCourses($filter: ModelCourseFilterInput, $limit: Int, $nextToken: String) {
        listCourses(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            code
            year
            term
            campus
            distributionRequirement
            description
            prerequisites
            exclusions
            enrollControlsType
            enrollControls
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListCoursesQuery>response.data.listCourses;
  }
  async GetSection(id: string): Promise<GetSectionQuery> {
    const statement = `query GetSection($id: ID!) {
        getSection(id: $id) {
          __typename
          id
          courseID
          sessions {
            __typename
            day
            start
            end
            room
          }
          syllabus
          code
          instructor
          curEnroll
          maxEnroll
          notes
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetSectionQuery>response.data.getSection;
  }
  async ListSections(
    filter?: ModelSectionFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListSectionsQuery> {
    const statement = `query ListSections($filter: ModelSectionFilterInput, $limit: Int, $nextToken: String) {
        listSections(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            courseID
            sessions {
              __typename
              day
              start
              end
              room
            }
            syllabus
            code
            instructor
            curEnroll
            maxEnroll
            notes
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListSectionsQuery>response.data.listSections;
  }
  async GetSchedule(id: string): Promise<GetScheduleQuery> {
    const statement = `query GetSchedule($id: ID!) {
        getSchedule(id: $id) {
          __typename
          id
          year
          term
          name
          courses {
            __typename
            courseID
            autoLecture
            autoPratical
            autoTutorial
          }
          times
          score
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetScheduleQuery>response.data.getSchedule;
  }
  async ListSchedules(
    filter?: ModelScheduleFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListSchedulesQuery> {
    const statement = `query ListSchedules($filter: ModelScheduleFilterInput, $limit: Int, $nextToken: String) {
        listSchedules(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            year
            term
            name
            courses {
              __typename
              courseID
              autoLecture
              autoPratical
              autoTutorial
            }
            times
            score
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListSchedulesQuery>response.data.listSchedules;
  }
  async ByYearTermCampusCode(
    year?: string,
    termCampusCode?: ModelCourseByYearTermCampusCodeCompositeKeyConditionInput,
    sortDirection?: ModelSortDirection,
    filter?: ModelCourseFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ByYearTermCampusCodeQuery> {
    const statement = `query ByYearTermCampusCode($year: String, $termCampusCode: ModelCourseByYearTermCampusCodeCompositeKeyConditionInput, $sortDirection: ModelSortDirection, $filter: ModelCourseFilterInput, $limit: Int, $nextToken: String) {
        byYearTermCampusCode(year: $year, termCampusCode: $termCampusCode, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            code
            year
            term
            campus
            distributionRequirement
            description
            prerequisites
            exclusions
            enrollControlsType
            enrollControls
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (year) {
      gqlAPIServiceArguments.year = year;
    }
    if (termCampusCode) {
      gqlAPIServiceArguments.termCampusCode = termCampusCode;
    }
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ByYearTermCampusCodeQuery>response.data.byYearTermCampusCode;
  }
  async ByCourseIdCode(
    courseID?: string,
    code?: ModelStringKeyConditionInput,
    sortDirection?: ModelSortDirection,
    filter?: ModelSectionFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ByCourseIdCodeQuery> {
    const statement = `query ByCourseIdCode($courseID: ID, $code: ModelStringKeyConditionInput, $sortDirection: ModelSortDirection, $filter: ModelSectionFilterInput, $limit: Int, $nextToken: String) {
        byCourseIDCode(courseID: $courseID, code: $code, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            courseID
            sessions {
              __typename
              day
              start
              end
              room
            }
            syllabus
            code
            instructor
            curEnroll
            maxEnroll
            notes
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (courseID) {
      gqlAPIServiceArguments.courseID = courseID;
    }
    if (code) {
      gqlAPIServiceArguments.code = code;
    }
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ByCourseIdCodeQuery>response.data.byCourseIDCode;
  }
  async SearchCourses(
    filter?: SearchableCourseFilterInput,
    sort?: SearchableCourseSortInput,
    limit?: number,
    nextToken?: string
  ): Promise<SearchCoursesQuery> {
    const statement = `query SearchCourses($filter: SearchableCourseFilterInput, $sort: SearchableCourseSortInput, $limit: Int, $nextToken: String) {
        searchCourses(filter: $filter, sort: $sort, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            code
            year
            term
            campus
            distributionRequirement
            description
            prerequisites
            exclusions
            enrollControlsType
            enrollControls
            createdAt
            updatedAt
          }
          nextToken
          total
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (sort) {
      gqlAPIServiceArguments.sort = sort;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SearchCoursesQuery>response.data.searchCourses;
  }
  OnCreateCourseListener: Observable<OnCreateCourseSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnCreateCourse {
        onCreateCourse {
          __typename
          id
          name
          code
          year
          term
          campus
          distributionRequirement
          description
          prerequisites
          exclusions
          enrollControlsType
          enrollControls
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<OnCreateCourseSubscription>;

  OnUpdateCourseListener: Observable<OnUpdateCourseSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnUpdateCourse {
        onUpdateCourse {
          __typename
          id
          name
          code
          year
          term
          campus
          distributionRequirement
          description
          prerequisites
          exclusions
          enrollControlsType
          enrollControls
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<OnUpdateCourseSubscription>;

  OnDeleteCourseListener: Observable<OnDeleteCourseSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnDeleteCourse {
        onDeleteCourse {
          __typename
          id
          name
          code
          year
          term
          campus
          distributionRequirement
          description
          prerequisites
          exclusions
          enrollControlsType
          enrollControls
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<OnDeleteCourseSubscription>;

  OnCreateSectionListener: Observable<
    OnCreateSectionSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateSection {
        onCreateSection {
          __typename
          id
          courseID
          sessions {
            __typename
            day
            start
            end
            room
          }
          syllabus
          code
          instructor
          curEnroll
          maxEnroll
          notes
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<OnCreateSectionSubscription>;

  OnUpdateSectionListener: Observable<
    OnUpdateSectionSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateSection {
        onUpdateSection {
          __typename
          id
          courseID
          sessions {
            __typename
            day
            start
            end
            room
          }
          syllabus
          code
          instructor
          curEnroll
          maxEnroll
          notes
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<OnUpdateSectionSubscription>;

  OnDeleteSectionListener: Observable<
    OnDeleteSectionSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteSection {
        onDeleteSection {
          __typename
          id
          courseID
          sessions {
            __typename
            day
            start
            end
            room
          }
          syllabus
          code
          instructor
          curEnroll
          maxEnroll
          notes
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<OnDeleteSectionSubscription>;

  OnCreateScheduleListener: Observable<
    OnCreateScheduleSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateSchedule($owner: String!) {
        onCreateSchedule(owner: $owner) {
          __typename
          id
          year
          term
          name
          courses {
            __typename
            courseID
            autoLecture
            autoPratical
            autoTutorial
          }
          times
          score
          createdAt
          updatedAt
          owner
        }
      }`
    )
  ) as Observable<OnCreateScheduleSubscription>;

  OnUpdateScheduleListener: Observable<
    OnUpdateScheduleSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateSchedule($owner: String!) {
        onUpdateSchedule(owner: $owner) {
          __typename
          id
          year
          term
          name
          courses {
            __typename
            courseID
            autoLecture
            autoPratical
            autoTutorial
          }
          times
          score
          createdAt
          updatedAt
          owner
        }
      }`
    )
  ) as Observable<OnUpdateScheduleSubscription>;

  OnDeleteScheduleListener: Observable<
    OnDeleteScheduleSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteSchedule($owner: String!) {
        onDeleteSchedule(owner: $owner) {
          __typename
          id
          year
          term
          name
          courses {
            __typename
            courseID
            autoLecture
            autoPratical
            autoTutorial
          }
          times
          score
          createdAt
          updatedAt
          owner
        }
      }`
    )
  ) as Observable<OnDeleteScheduleSubscription>;
}
