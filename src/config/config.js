'use strict';
const dotenv = require('dotenv');
dotenv.config();

function envRequire(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`key ${key} is undefined`);
  }
  return value;
}

module.exports = {
  host: {
    port: envRequire('HOST_PORT', '8080'),
  },
  development: {
    username: envRequire('MYSQL_USER', 'root'),
    password: envRequire('MYSQL_PASSWORD'),
    database: envRequire('MYSQL_DATABASE'),
    host: envRequire('MYSQL_HOST', '127.0.0.1'),
    dialect: envRequire('MYSQL_DIALECT', 'mysql'),
  },
  test: {
    username: envRequire('MYSQL_USER', 'root'),
    password: envRequire('MYSQL_PASSWORD'),
    database: envRequire('MYSQL_DATABASE'),
    host: envRequire('MYSQL_HOST', '127.0.0.1'),
    dialect: envRequire('MYSQL_DIALECT', 'mysql'),
  },
  production: {
    username: envRequire('MYSQL_USER', 'root'),
    password: envRequire('MYSQL_PASSWORD'),
    database: envRequire('MYSQL_DATABASE'),
    host: envRequire('MYSQL_HOST', '127.0.0.1'),
    dialect: envRequire('MYSQL_DIALECT', 'mysql'),
  },
};
