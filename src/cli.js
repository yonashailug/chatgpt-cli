import chalk from 'chalk'
import yargs from 'yargs'

import { question } from './questions.js'

const log = console.log

yargs(process.argv)
  .scriptName('chatgpt-cli')
  .showHelpOnFail(false)
  .alias('v', 'version')
  .alias('h', 'help')
  .command(
    '*',
    'Do something awesome with Chatgpt',
    () => {},
    async argv => {
      log(` ${chalk.blue('Chatgpt-cli ')}${chalk.cyan(` model: ${argv.model}`)} \n`)

      question(argv)
    })
  .option('model', {
    type: 'string',
    default: 'text-davinci-003',
    desc: 'Show completion model',
    alias: 'm'
  })
  .option('temperature', {
    type: 'number',
    default: 0.5,
    desc: 'What sampling temperature to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.',
    alias: 't'
  })
  .option('maxTokens', {
    type: 'number',
    default: 600,
    desc: 'The maximum number of tokens to generate in the completion.',
    alias: 's'
  })
  .parse()
