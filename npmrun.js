const fs = require('fs')
const dir = process.cwd()
const args = process.argv
const colors = require('colors')

const packageJsonPath = dir + '/package.json'
if (!fs.existsSync(packageJsonPath)) {
  return console.log('Error: No package.json found in this directory.'.bgRed.white)
}
const scripts = JSON.parse(fs.readFileSync(packageJsonPath).toString()).scripts
const scriptCommands = Object.keys(scripts)

console.log('\n')
console.log('Available scripts:'.green)
console.log(scriptCommands.join('\n').bgGreen.black)
console.log('\n')

