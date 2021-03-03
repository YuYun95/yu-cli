const chalk = require('chalk')

const hint = (...info) => {
  console.log(chalk.rgb(36, 143, 255)(info))
}

const error = (...info) => {
  console.log(chalk.red(info))
}

module.exports = {
  hint,
  error
}
