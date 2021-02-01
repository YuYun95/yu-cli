const program = require('commander')
const { createProjectAction } = require('./actions')

// 创建其它指令
const createCommands = () => {
  // 创建项目
  program
    .command('create <project> [others...]')
    .description('create project')
    .action((project, others) => {
      createProjectAction(project)
    })

  // 创建vue项目
  program
    .command('vue <project>')
    .description('create vue project')
    .action(project => {
      createProjectAction(project)
    })
}

module.exports = createCommands
