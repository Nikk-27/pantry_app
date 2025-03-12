import {transports,winston} from 'winston';

const logger = winston.createLogger({
  level: 'info', // Log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new transports.Console()
],
});

export default logger;
