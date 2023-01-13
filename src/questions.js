import inquirer from 'inquirer'
import chalk from 'chalk'
import hyperlinker from 'hyperlinker'
import { Configuration, OpenAIApi } from 'openai'

import { store, API_KEY } from './store.js'

const log = console.log
const apiKeyExist = store.get(API_KEY)
let inProgress = false

const questions = [
  {
    type: 'password',
    name: 'apiKey',
    message: `Chatgpt's Api key not found. Please generate and enter your api-key. ${chalk.yellow(hyperlinker('Link'))} https://beta.openai.com/account/api-keys`,
    when () {
      return !apiKeyExist
    }
  },
  {
    type: 'input',
    name: 'question',
    message: 'What would you like to ask'
  },
  {
    type: 'confirm',
    name: 'askAgain',
    message: 'Would you like to ask again?',
    default: false,
    when() {
      return inProgress
    }
  },
]

export function question (argv) {
  inquirer.prompt(questions).then(async answer => {
    if (answer.apiKey) {
      store.set(API_KEY, answer.apiKey)
    }

    inProgress = true
    const configuration = new Configuration({
      apiKey: store.get(API_KEY)
    })

    const openai = new OpenAIApi(configuration)

    const { data } = await openai.createCompletion({
      model: argv.model,
      prompt: answer.question,
      temperature: argv.temperature,
      max_tokens: argv.maxTokens
    })

    data.choices.forEach(choice => {
      log(`\n ${chalk.blue(choice.text.trim())} \n`)
    })

    if (answer.askAgain) {
      console.log({ an: answer.askAgain })
    }
  })
    .catch(error => {
      log(`[Error: ${error?.message}]`)
    })
}
