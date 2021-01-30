const { execSync } = require('child_process')

const author = execSync('git config user.name', { encoding: 'utf8' }).trim()

const prompt = [
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
        default: author || ''
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

module.exports = {
    prompt,
    templates
}