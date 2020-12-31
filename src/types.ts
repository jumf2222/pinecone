export interface Course {
    name: string;
    assessments: Assessment[];
    mark: number;
}

export interface Assessment {
    name: string;
    weight: number;
    grades: Grade[];
}

export interface Grade {
    mark: number;
    total: number;
}