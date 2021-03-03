const fs = require('fs')

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
          resolve(true)
        }
        resolve(false)
      }
    })
  })
}

module.exports = checkName
