import type { Observation } from './Observation';

interface Objective {
  objectiveName: string;
  complete: boolean;
}

export interface Goal {
  id: string;
  goalName: string;
  goalDescription: string;
  category: string;
  beginDate: Date;
  endDate: Date;
  goalPercentage: number;
  studentId: string;
  objectives: Objective[];
  observations: Observation[];
}
