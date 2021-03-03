const ora = require('ora')
const path = require('path')
const downloadGitRepo = require('download-git-repo')
const logSymbols = require('log-symbols')
const chalk = require('chalk')

// 下载模板
const downloadTemplate = (gitUrl, name) => {
  const spinner = ora('download template......').start()

  return new Promise((resolve, reject) => {
    const outPut = path.resolve(process.cwd(), name)

    downloadGitRepo(gitUrl, outPut, { clone: true }, error => {
      if (error) {
        spinner.fail()
        console.log(logSymbols.error, chalk.red(error))
        return reject(error)
      }
      spinner.succeed() // 下载成功提示
      resolve()
    })
  })
}

module.exports = downloadTemplate
