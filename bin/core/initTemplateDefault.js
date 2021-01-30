const { templates } = require('../config')
const downloadTemplate = require('./downloadTemplate')

const initTemplateDefault = async (answers, templateURL) => {
    try {
        // 下载模板
        const gitUrl = templates[answers.template].downloadUrl
        await downloadTemplate(gitUrl, answers.name)
    } catch (error) {
        console.log(error)
    }
}

module.exports = initTemplateDefault