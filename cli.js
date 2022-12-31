import chalk from 'chalk'
import yargs from 'yargs'
import inquirer from 'inquirer'
import { Configuration, OpenAIApi } from 'openai'

import { store, API_KEY } from './store.js'

yargs(process.argv)
.scriptName('chatgpt-cli')
.alias('v', 'version')
.alias('h', 'help')
.showHelpOnFail(false)
  .command(
    '*',
    'Do something awesome with Chatgpt',
    () => {},
    async argv => {

        console.log(` ${chalk.blue('Chatgpt-cli ')}${chalk.cyan(`default model: ${argv.model}`)} \n`)

        const apiKeyExists = store.get(API_KEY)

        const questions = [
            {
                type: 'password',
                name: 'apiKey',
                message: 'Chatgpt\'s Api key not found. Please generate and enter your api-key',
                when() {
                    return !apiKeyExists
                },
            },
            {
                type: 'input',
                name: 'question',
                message: 'Enter your question',
            }
        ]

        inquirer.prompt(questions).then(async answer => {

            if (answer.apiKey) {
                store.set(API_KEY, answer.apiKey)
            }

            const configuration = new Configuration({
                apiKey: store.get(API_KEY),
            })

            const openai = new OpenAIApi(configuration)

            const { data } = await openai.createCompletion({
                model: argv.model,
                prompt: answer.question,
                temperature: argv.temperature,
                max_tokens: argv.maxTokens
            })

            data.choices.forEach(choice => {
                console.log(`\n ${chalk.blue(choice.text.trim())} \n`)
            })

        })
        .catch(console.error)

  })
  .option('model', {
    type: 'string',
    default: 'text-davinci-003',
    alias: 'm',
    desc: 'Show completion model'
  })
  .option('temperature', {
    type: 'number',
    default: 0.5,
    desc: 'What sampling temperature to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.'
  })
  .option('maxTokens', {
    type: 'number',
    default: 600,
    desc: 'The maximum number of tokens to generate in the completion.'
  })
  .parse()