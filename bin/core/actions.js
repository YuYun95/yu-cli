const path = require('path')
const inquirer = require('inquirer')
const spawn = require('cross-spawn')
const childProcess = require('child_process')
const { hint } = require('../utils')
const { prompt, templates } = require('../config')
const initTemplateDefault = require('./initTemplateDefault')
const writeInformationToTheTemplate = require('./writeInformationToTheTemplate')
const projestIsExists = require('./checkProjectExists')

const createProjectAction = async project => {
  // 1. 检查项目是否存在
  if (await projestIsExists(project)) return

  // 2. 命令行交互
  const answers = await inquirer.prompt(prompt)

  // 3. clone 项目
  if (!answers.confirm) return
  const templateURL = templates[answers.template.split(' ')[0]].downloadUrl
  answers.name = project
  await initTemplateDefault(answers, templateURL)

  // TODO 使用模板引擎
  // 4. 把用户信息写入模板
  const file = path.resolve(process.cwd(), answers.name, 'package.json')
  await writeInformationToTheTemplate(answers, file)

  // 5. 安装项目依赖
  const existYarn = childProcess.execSync('yarnpkg --version').toString()
  const command = existYarn ? 'yarn' : 'npm'
  const projectPath = process.cwd() + '/' + answers.name
  process.chdir(projectPath)
  await spawn.sync(command, ['install'], { stdio: 'inherit' })

  // 6. 依赖安装完成提示
  const cdTip = `$ cd ${answers.name}`
  const runTip = existYarn ? '$ yarn server' : '$ npm run serve'
  hint(cdTip)
  hint(runTip)
}

module.exports = {
  createProjectAction
}
