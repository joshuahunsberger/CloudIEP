import { StudentPreview } from './StudentPreview';
export interface User {
  id: string;
  auth0Id: string;
  firstName: string;
  lastName: string;
  students: StudentPreview[];
}
