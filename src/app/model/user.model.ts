import { Education } from "./education.model";
import { WorkHistory } from "./work-history.model";

export interface User {
    id: string,
    avatar: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    gender: string,
    major: string,
    address: string,
    createdDate: string,
    cv: string,
    dateOfBirth: string,
    educations: Education[],
    languages: any[],
    link: string,
    position: string,
    skills: any[],
    status: string,
    summary: string,
    role: string,
    updatedDate: string,
    workHistories: WorkHistory[],
    yearExperience: string,
    jobsApplied: any[]
}