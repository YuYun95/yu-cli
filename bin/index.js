#!/usr/bin/env node
const program = require('commander')
const helpOptions = require('../src/core/help')
const createCommands = require('../src/core/create')

// 查看版本号
program.version(require('../package.json').version)

// 帮助信息，保存输入的用户参数
helpOptions()

// 创建其它指令
createCommands()

// 解析终端指令
program.parse(process.argv)
