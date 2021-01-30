const program = require('commander')

// 帮助信息
const helpOptions = () => {
    program.option('-i, --init', 'Initialize the project')
    program.option('-l, --list', 'View the list of available templates')
    program.option('-d --dest <dest>', 'A destination folder, E.g: -d /src/components')
    program.option('-f --framework <framework>', 'Your framework')

    // 输入 yu --help时，追加输出内容
    // program.on('--help', () => {
    //     console.log('')
    //     console.log('Other')
    //     console.log(' other options')
    // })
}

module.exports = helpOptions
