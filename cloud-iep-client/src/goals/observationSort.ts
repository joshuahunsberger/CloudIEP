import { differenceInDays } from 'date-fns';
import { Observation } from './Goal';

export const sortObservationsByDate = (
  a: Observation,
  b: Observation,
): number => {
  return differenceInDays(a.observationDate, b.observationDate);
};
