const fs = require('fs')

// 把命令交互信息写入模板
const writeInformationToTheTemplate = (answers, file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf-8', (error, data) => {
      if (error) {
        return reject(error)
      }
      const fileContent = Object.assign({}, JSON.parse(data), answers)
      fs.writeFile(file, JSON.stringify(fileContent, null, 2), 'utf-8', (error, data) => {
        if (error) {
          return reject(error)
        }
        return resolve()
      })
    })
  })
}

module.exports = writeInformationToTheTemplate
