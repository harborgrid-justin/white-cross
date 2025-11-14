/**
 * Re-export from refactored CommunicationHistory module
 *
 * This file maintains backward compatibility by re-exporting from the new
 * modular structure in the CommunicationHistory/ subdirectory.
 */

export { CommunicationHistory, default } from './CommunicationHistory/index';
export type { CommunicationHistoryProps, CommunicationRecord, HistoryFilters } from './CommunicationHistory/types';
