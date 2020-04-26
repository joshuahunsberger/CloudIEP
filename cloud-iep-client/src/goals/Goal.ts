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
  studentId: string;
  objectives: Objective[];
}
