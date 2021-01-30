const core = require('@actions/core');
const github = require('@actions/github');
const messageBuilder = require('./src/message-builder')
const slack = require('./src/slack')
const fs = require('fs');

try {
 // TODO GET JSON/yaml FILE
    const messageFilePath = core.getInput("message-file");
    let rawdata = fs.readFileSync(messageFilePath);
    let messages = JSON.parse(rawdata);

// TODO GET SETUP (TOKENS)
    const token = core.getInput('slack-user-oauth-access-token');

    const nameToGreet = core.getInput('who-to-greet');

 // TODO PARSE
    for(let message of  messages){
        const messageBuilded = messageBuilder(message.channel, message.text, message.post_at);
        const result = slack(token,messageBuilded);
    }

 // TODO SEND
    
    

 // TODO Output scheduled messages
  // `who-to-greet` input defined in action metadata file
  
//   console.log(`Hello ${nameToGreet}!`);
//   const time = (new Date()).toTimeString();
//   core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2)
//   console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}