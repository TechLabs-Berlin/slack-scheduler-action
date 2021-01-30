const core = require('@actions/core');
const github = require('@actions/github');
const messageBuilder = require('./src/message-builder')
const slack = require('./src/slack')
const fs = require('fs');

//todo make proper async
try {
    const messageFilePath = core.getInput("message-file");
    let rawdata = fs.readFileSync(messageFilePath);
    let messages = JSON.parse(rawdata);

    const token = core.getInput('slack-user-oauth-access-token');

    


    for(let message of  messages){
        const messageBuilded = messageBuilder(message.channel, message.text, message.post_at);
        const result = slack.sendMessage(token,messageBuilded);
        //TODO put in proper error handling
    }
    // TODO Output scheduled messages
    // `who-to-greet` input defined in action metadata file
  
} catch (error) {
    core.setFailed(error.message);
}