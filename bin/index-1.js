#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')
const ora = require('ora')
const program = require('commander')
const inquirer = require('inquirer')
const logSymbols = require('log-symbols')
const chalk = require('chalk')
const downloadGitRepo = require('download-git-repo')

const author = childProcess.execSync('git config user.name', { encoding: 'utf8' }).trim()

const prompt = [
  {
    type: 'input',
    name: 'projectName',
    message: 'Please enter the project name',
    default: 'app'
  },
  {
    type: 'list',
    name: 'template',
    message: 'Please select a project template',
    choices: ['Vue-typeScript', 'React-typeScript']
  },
  {
    type: 'input',
    name: 'author',
    message: 'Please enter the author',
    default: author
  },
  {
    type: 'input',
    name: 'description',
    message: 'Please enter the project description',
    default: ''
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Is this ok?',
    default: true
  }
]

const templates = {
  'Vue-typeScript': {
    url: 'https://github.com/easy-wheel/ts-vue',
    downloadUrl: 'https://github.com:easy-wheel/ts-vue#master',
    description: 'ts-vue是一个中后台前端解决方案，它基于 vue, typescript 和 element-ui实现。'
  },
  'React-typeScript': {
    url: 'https://github.com/easy-wheel/Umi-hooks',
    downloadUrl: 'https://github.com:easy-wheel/Umi-hooks#master',
    description: 'Umi-Hooks是一个中后台前端解决方案，它基于 umi, react, typescript 和 ant-design实现。'
  }
}

// 显示模板
const templateList = () => {
  for (const key in templates) {
    console.log(`${key}: ${templates[key].description}`)
  }
}

// 文件列表转小写 检查项目是否已经存在
const checkName = name => {
  return new Promise((resolve, reject) => {
    fs.readdir(process.cwd(), (error, data) => {
      if (error) {
        return reject(error)
      } else {
        const files = []
        data.forEach(file => {
          files.push(file.toLowerCase())
        })
        if (files.includes(name.toLowerCase())) {
          return reject(new Error(`Project ${name} already exists!`))
        }
        resolve()
      }
    })
  })
}

// 下载模板
const downloadTemplate = (gitUrl, projectName) => {
  const spinner = ora('download template......').start()

  return new Promise((resolve, reject) => {
    const outPut = path.resolve(process.cwd(), projectName)

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

// 把命令交互信息写入模板
const writeInformationToTheTemplate = answers => {
  const { projectName, author, description } = answers
  return new Promise((resolve, reject) => {
    const packageJSON = path.resolve(process.cwd(), projectName, 'package.json')

    fs.readFile(packageJSON, 'utf-8', (error, data) => {
      if (error) {
        return reject(error)
      }

      const packageContent = JSON.parse(data)
      packageContent.name = projectName
      packageContent.author = author
      packageContent.description = description

      fs.writeFile(packageJSON, JSON.stringify(packageContent, null, 2), 'utf-8', (error, data) => {
        if (error) {
          return reject(error)
        }
        return resolve()
      })
    })
  })
}

// 安装项目依赖
const installPackage = (projectName) => {
  // 进入项目
  const npmDir = process.cwd() + '/' + projectName
  // 是否存在yarn
  childProcess.spawn('git', ['init'], { cwd: npmDir })

  const hasYarn = childProcess.execSync('yarnpkg --version').toString()
  const install = hasYarn ? childProcess.spawn('yarn', ['install'], { cwd: npmDir }) : childProcess.spawn('npm', ['install'], { cwd: npmDir })
  
}

// 处理模板
const initTemplateDefault = async (answers, templateURL) => {
  try {
    // 检查项目名称是否已经存在
    await checkName(answers.projectName)

    // 下载模板
    const gitUrl = templates[answers.template].downloadUrl
    await downloadTemplate(gitUrl, answers.projectName)
    await installPackage(answers.projectName)
    // 向模板写入信息
    await writeInformationToTheTemplate(answers)
  } catch (error) {
    console.log(error)
  }
}

// 发起命令行交互
const initiatePrompt = () => {
  inquirer.prompt(prompt).then(answers => {
    if (!answers.confirm) return
    const templateURL = templates[answers.template.split(' ')[0]].downloadUrl
    initTemplateDefault(answers, templateURL)
  })
}

// 命令行工具
program
  .version(require('../package.json').version)
  .option('-i, --init', '初始化项目')
  .option('-V, --version', '查看版本号信息')
  .option('-l, --list', '查看可用模板列表')

// 解析命令
program.parse(process.argv)

// 获取命令交互信息
const opts = program.opts()
const keyList = Reflect.ownKeys(opts)

// 输入多个命令时，获取最后一个
const lastKey = keyList.length && keyList[keyList.length - 1]

// 判断输入的命令做相应的操作
switch (lastKey) {
  case 'init':
    initiatePrompt()
    break
  case 'list':
    templateList()
    break
}
