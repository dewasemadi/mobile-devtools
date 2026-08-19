import { LOG_LEVELS } from '../constants';

export type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

export interface LogEntry {
  id: string;
  level: LogLevel;
  args: any[];
  timestamp: number;
  stack?: string;
  count: number;
}
