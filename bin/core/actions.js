const childProcess = require('child_process')
const path = require('path')
const inquirer = require('inquirer')
const initTemplateDefault = require('./initTemplateDefault')
const writeInformationToTheTemplate = require('./writeInformationToTheTemplate')
const { checkName, spawn } = require('../utils')
const { prompt, templates } = require('../config')

const createProjectAction = async (project) => {
    // 1. 坚持项目是否存在
    const isExists = await checkName(project)
    if (isExists) {
        return console.log(new Error(`Project ${project} already exists!`))
    }

    // 2. 命令行交互
    const answers = await inquirer.prompt(prompt)

    // 3. clone 项目
    if (!answers.confirm) return
    const templateURL = templates[answers.template.split(' ')[0]].downloadUrl
    answers.name = project

    await initTemplateDefault(answers, templateURL)


    // 4. 把用户信息写入模板
    const file = path.resolve(process.cwd(), project, 'package.json')
    await writeInformationToTheTemplate(answers, file)

    // 5. 执行npm install
    const hasYarn = childProcess.execSync('yarnpkg --version').toString()
    const isWin = process.platform === 'win32'
    const command =
        (hasYarn && isWin) ? 'yarn.cmd' :
            (hasYarn && !isWin) ? 'yarn' :
                (!hasYarn && isWin) ? 'npm.cmd' :
                    'npm'
    const projectPath = process.cwd() + '/' + project
    await spawn(command, ['install'], { cwd: projectPath })
}



module.exports = {
    createProjectAction
}