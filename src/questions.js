import inquirer from 'inquirer'
import chalk from 'chalk'
import hyperlinker from 'hyperlinker'
import { Configuration, OpenAIApi } from 'openai'
import { Subject } from 'rxjs';

import { store, API_KEY } from './store.js'

const prompts = new Subject()
let apiKeyNotExistOrExpire = !!store.get(API_KEY)
const log = console.log

const questions = [
  {
    type: 'password',
    name: 'apiKey',
    message: `Need Chatgpt's Api key. Please enter your api-key. ${chalk.yellow(hyperlinker('Link to generate'))} https://beta.openai.com/account/api-keys`,
    askAnswered: true,
    when () {
      return !apiKeyNotExistOrExpire
    }
  },
  {
    type: 'input',
    name: 'question',
    message: 'What would you like to ask',
    askAnswered: true,
  },
]

const confirm = {
  type: 'confirm',
  name: 'askAgain',
  message: 'Continue asking?',
  default: false,
  askAnswered: true,
}

export function question ({ model, temperature, maxTokens, enterApiKey }) {

  if (enterApiKey) {
    apiKeyNotExistOrExpire = false
  }

  inquirer.prompt(prompts).ui.process.subscribe({
    next: async ({ name, answer }) => {

      if (name === 'askAgain') {
        if (!answer) {
          prompts.complete()
          return process.exit(0)
        }

        return prompts.next(questions[1])
      }

      if (name === 'apiKey') {
        return store.set(API_KEY, answer)
      }

      const configuration = new Configuration({
        apiKey: store.get(API_KEY)
      })

      const openai = new OpenAIApi(configuration)

      const { data } = await openai.createCompletion({
        model,
        temperature,
        prompt: answer,
        max_tokens: maxTokens
      })

      data.choices.forEach(choice => {
        log(`\n ${chalk.blue(choice.text.trim())} \n`)
      })

      prompts.next(confirm)

    },
    error: (error) => {
      log(`[Error: ${error?.message}]`)
    },
  })

  questions.forEach(currentQuestion => {
    prompts.next(currentQuestion)
  })

}
