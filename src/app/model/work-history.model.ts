import { Project } from "./project.model";

export interface WorkHistory {
    id: string,
    companyName: string,
    position: string,
    current: boolean,
    fromDate: string,
    toDate: string,
    description: string,
    userId: string,
    projects: Project[],
}