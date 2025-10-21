/**
 * Communication Domain Hooks
 */

import { useAppSelector } from '../../hooks/reduxHooks';
import { selectCommunicationStats } from './selectors';

export const useCommunication = () => {
  const stats = useAppSelector(selectCommunicationStats);
  return { stats };
};