const port = process.env.PORT || 3001;
const nodeEnv = process.env.NODE_ENV || 'development';
const postgresUrl = process.env.POSTGRES_URL || 'postgresql://postgres:postgres@localhost:5432/auth_service';
const jwtSecret = process.env.JWT_SECRET || 'change_me_in_dev';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

module.exports = {
  port,
  nodeEnv,
  postgresUrl,
  jwtSecret,
  jwtExpiresIn,
  refreshTokenExpiresIn
};