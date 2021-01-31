const childProcess = require('child_process')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const initTemplateDefault = require('./initTemplateDefault')
const writeInformationToTheTemplate = require('./writeInformationToTheTemplate')
const { checkName } = require('../utils')
const { prompt, templates } = require('../config')
const spawn = require('cross-spawn')

const createProjectAction = async (project) => {
    // 1. 检查项目是否存在
    const isExists = await checkName(project)
    if (isExists) {
        const path = process.cwd() + '\\' + project
        return console.log(`Target directory ${chalk.rgb(0, 255, 255)(path)} already exists`)
        console.log(new Error(`Project ${project} already exists!`))
    }

    // 2. 命令行交互
    const answers = await inquirer.prompt(prompt)

    // 3. clone 项目
    if (!answers.confirm) return
    const templateURL = templates[answers.template.split(' ')[0]].downloadUrl
    answers.name = project
    await initTemplateDefault(answers, templateURL)

    // 4. 把用户信息写入模板
    const file = path.resolve(process.cwd(), answers.name, 'package.json')
    await writeInformationToTheTemplate(answers, file)

    // 5. 安装项目依赖
    const hasYarn = childProcess.execSync('yarnpkg --version').toString()
    const isWin = process.platform === 'win32'
    // const command =
    //     (hasYarn && isWin) ? 'yarn.cmd' :
    //     (hasYarn && !isWin) ? 'yarn' :
    //     (!hasYarn && isWin) ? 'npm.cmd' :
    //     'npm'
    const command = hasYarn ? 'yarn' : 'npm'
    const projectPath = process.cwd() + '/' + answers.name
    process.chdir(projectPath)
    await spawn.sync(command, ['install'], { stdio: 'inherit' })

    // 6. 依赖安装完成提示
    const cdTip = chalk.rgb(0, 255, 255)(`$ cd ${answers.name}`)
    const runTip = hasYarn ? chalk.rgb(0, 255, 255)('yarn server') : chalk.rgb(0, 255, 255)('npm run serve')
    console.log(cdTip)
    console.log(runTip)
}



module.exports = {
    createProjectAction
}