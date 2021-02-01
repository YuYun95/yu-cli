const checkName = require('./checkName')
const { spawn, exec } = require('./terminal')
const { hint, error } = require('./log')

module.exports = {
  checkName,
  spawn,
  exec,
  hint,
  error
}
