const child_process = require('child_process')

console.log(child_process.execSync('yarnpkg --version').toString())