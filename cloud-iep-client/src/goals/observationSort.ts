import { differenceInDays } from 'date-fns';
import type { Observation } from './Observation';

export const sortObservationsByDate = (
  a: Observation,
  b: Observation,
): number => {
  return differenceInDays(a.observationDate, b.observationDate);
};
