const fs = require('fs')
const dir = process.cwd()
const args = process.argv
const noPrompt = args[2] === '-list'
const select = require('select-prompt')
const spawn = require('child_process').spawn
require('colors')
const npm = (process.platform === "win32" ? "npm.cmd" : "npm")

const packageJsonPath = dir + '/package.json'

if (!fs.existsSync(packageJsonPath)) {
  return console.log('ERROR: No package.json found in this directory.'.bgRed.white)
}

const scripts = JSON.parse(fs.readFileSync(packageJsonPath).toString()).scripts
const scriptCommands = Object.keys(scripts)

console.log('Available scripts:'.green)

if (noPrompt) {
  console.log(scriptCommands.join('\n').bgGreen.black)
} else {
  const options = scriptCommands.map(c => {
    return {
      title: c,
      value: c
    }
  })
  select('Select a script to run', options).on('submit', chosen => {
    console.log('Running script "chosen"...')
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
