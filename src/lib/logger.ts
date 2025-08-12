type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';

export interface LogEntry {
  timestamp: string;
  message: string;
  level: LogLevel;
}

class Logger {
  private logs: LogEntry[] = [];
  private listeners: ((logs: LogEntry[]) => void)[] = [];

  constructor() {
    this.addLog('SYSTEM_CORE', 'INITIALIZED', 'SUCCESS');
  }

  private addLog(module: string, message: string, level: LogLevel) {
    const entry: LogEntry = {
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      message: `[${module}] ${message}`,
      level,
    };
    this.logs = [entry, ...this.logs].slice(0, 100); // Držíme posledních 100 logů
    this.notify();
  }

  info(module: string, message: string) { this.addLog(module, message, 'INFO'); }
  warn(module: string, message: string) { this.addLog(module, message, 'WARN'); }
  error(module: string, message: string) { this.addLog(module, message, 'ERROR'); }
  success(module: string, message: string) { this.addLog(module, message, 'SUCCESS'); }

  subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener);
    listener(this.logs);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getLogs() { return this.logs; }

  private notify() {
    this.listeners.forEach(l => l(this.logs));
  }
}

export const appLogger = new Logger();
