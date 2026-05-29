import pino from 'pino'
import 'dotenv/config'

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// Logger configuration untuk development
const developmentConfig = {
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      singleLine: false,
    },
  },
}

// Logger configuration untuk production
const productionConfig = {
  level: 'info',
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    }),
    res: (res) => ({
      statusCode: res.statusCode,
      responseTime: res.responseTime,
    }),
  },
}

// Logger configuration untuk testing
const testConfig = {
  level: 'silent',
}

// Determine which config to use
let loggerConfig
if (isProduction) {
  loggerConfig = productionConfig
} else if (process.env.NODE_ENV === 'test') {
  loggerConfig = testConfig
} else {
  loggerConfig = developmentConfig
}

// Create logger instance
const logger = pino(loggerConfig)

export default logger
