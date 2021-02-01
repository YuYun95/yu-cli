const { exec, spawn } = require('child_process')
const crossSpawn = require('cross-spawn')

// 执行终端命令相关的代码
const spawnCommand = (...args) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(...args)
    // 把子进程的输出流放到主进程输出流，从而把信息显示
    childProcess.stdout.pipe(process.stdout)
    // 子进程错误信息放到主进程
    childProcess.stderr.pipe(process.stderr)
    // 子进程执行完
    childProcess.on('close', () => {
      resolve()
    })
  })
}

const execCommand = (...args) => {
  return new Promise((resolve, reject) => {
    exec(...args, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }
      console.log(stdout.replace('\n', ''))
      resolve()
    })
  })
}

// 异步创建子进程执行
const asynchCrossSpawn = (...args) => {
  crossSpawn(...args)
}

// 同步创建子进程执行
const syncCrossSpawn = (...args) => {
  crossSpawn.sync(...args)
}

module.exports = {
  spawn: spawnCommand,
  exec: execCommand,
  asynchSpawn: asynchCrossSpawn,
  syncSpawn: syncCrossSpawn
}
