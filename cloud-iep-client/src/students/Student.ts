import type { GoalPreview } from "./GoalPreview";


export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  goals: GoalPreview[];
}
