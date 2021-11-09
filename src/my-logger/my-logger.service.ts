import { Injectable, LoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger implements LoggerService {
  log(message: string) {
    /* your implementation */
    console.log('log',message);
  }
  error(message: string, trace: string) {
    /* your implementation */
    console.log('error',message,trace);
  }
  warn(message: string) {
    /* your implementation */
    console.log('warn',message);
  }
  debug(message: string) {
    /* your implementation */
    console.log('debug',message);
  }
  verbose(message: string) {
    /* your implementation */
    console.log('verbose',message);
  }
}
