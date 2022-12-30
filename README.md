# chatgpt-cli
Interactive Chatgpt cli made with nodejs

## Usage

I recommend installing the tool globally, so that you can make use of it no matter where you are, but you can take out `-g` flag if you want to use it in particular work instead:

```
npm i -g chatgpt-cli
```

> Note: You may need to run `sudo` before this command `sudo npm i -g chatgpt-cli`

Then, to kick off the tool, type:

```
chatgpt-cli
```

You will be guided through prompts

To use different model types you can pass the model type to end of the script
> `chatgpt-cli -m model-id-2` or `chatgpt-cli --model model-id-2`, the default model is `text-davinci-003`

## Configuration

To use chatgpt's feature require api key to be generated and can be generated [here](https://beta.openai.com/account/api-keys) and when you run this npm package it will prompt to enter api key and save it.