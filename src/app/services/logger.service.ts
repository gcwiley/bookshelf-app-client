import { Injectable } from '@angular/core';

// environment variables
import { environment } from '../../environments/environment';

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
  None = 4
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: unknown;
  source?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private logLevel: LogLevel = environment.production ? LogLevel.Warn : LogLevel.Debug;

  public log(level: LogLevel, message: string, data?: unknown): void {
    if (level >= this.logLevel) {
      const formattedMessage = `[${LogLevel[level]}] ${message}`;
      if (level === LogLevel.Error) {
        console.error(formattedMessage, data || '');
      } else if (level === LogLevel.Warn) {
        console.warn(formattedMessage, data || '');
      } else {
        console.log(formattedMessage, data || '');
      }
    }
  }

  public debug(message: string, data?: unknown): void {
    this.log(LogLevel.Debug, message, data);
  }

  public info(message: string, data?: unknown): void {
    this.log(LogLevel.Info, message, data);
  }

  public warn(message: string, data?: unknown): void {
    this.log(LogLevel.Warn, message, data);
  }

  public error(message: string, data?: unknown): void {
    this.log(LogLevel.Error, message, data);
  }
}
