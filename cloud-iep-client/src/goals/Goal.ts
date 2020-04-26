interface Objective {
  objectiveName: string;
  complete: boolean;
}

interface Observation {
  id: string;
  observationDate: Date;
  successCount: number;
  totalCount: number;
}

export interface Goal {
  id: string;
  goalName: string;
  goalDescription: string;
  category: string;
  beginDate: Date;
  endDate: Date;
  studentId: string;
  objectives: Objective[];
  observations: Observation[];
}
