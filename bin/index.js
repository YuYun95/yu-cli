#!/usr/bin/env node
const program = require('commander')
const helpOptions = require('./core/help')
const createCommands = require('./core/create')

// 查看版本号
program.version(require('../package.json').version)

// 帮助信息
helpOptions()

// 创建其它指令
createCommands()

program.parse(process.argv)
