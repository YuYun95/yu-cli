const { checkName, error } = require('../utils')

// 检查项目是否已经存在
const projestIsExists = async project => {
  const isExists = await checkName(project)
  if (isExists) {
    const path = process.cwd() + '\\' + project
    const logMessage = `Target directory ${path} already exists`
    error(logMessage)
    return true
  }
}

module.exports = projestIsExists
