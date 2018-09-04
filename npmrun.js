const fs = require('fs')
const util = require('util')
const dir = process.cwd()
const args = process.argv
const colors = require('colors')
const prompt = args[2] === '-p'
const select = require('select-prompt')
const spawn = require('child_process').spawn

const npm = (process.platform === "win32" ? "npm.cmd" : "npm")

if (prompt) {
}

const packageJsonPath = dir + '/package.json'
if (!fs.existsSync(packageJsonPath)) {
  return console.log('ERROR: No package.json found in this directory.'.bgRed.white)
}
const scripts = JSON.parse(fs.readFileSync(packageJsonPath).toString()).scripts
const scriptCommands = Object.keys(scripts)

console.log('\n')
console.log('Available scripts:'.green)

if (!prompt) {
  console.log(scriptCommands.join('\n').bgGreen.black)
} else {
  const options = scriptCommands.map(c => {
    return {
      title: c,
      value: c
    }
  })
  select('Select a script to run', options)
    .on('submit', chosen => {
      console.log(chosen)
      // const command = spawn('npm run ' + chosen)
      const command = spawn(npm, ['run', chosen])
      command.on('data', data => {
        console.log(data.toString())
      })
      command.stderr.on('data', data => {
        console.log('stderr: ' + data.toString())
      })
      command.on('exit', code => {
        console.log('child process exited with code ' + code.toString())
      })
    })
}
