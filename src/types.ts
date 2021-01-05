export interface Course {
    id: string;
    name: string;
    assessments: Assessment[];
    mark: number;
}

export interface Assessment {
    id: string;
    name: string;
    weight: number;
    grades: Grade[];
}

export interface Grade {
    id: string;
    mark: number;
    total: number;
}