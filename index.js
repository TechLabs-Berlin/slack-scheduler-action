const core = require('@actions/core');
const github = require('@actions/github');
const messageBuilder = require('./src/message-builder')
const slack = require('./src/slack')
const fs = require('fs');
const yaml = require('js-yaml');

const setup = require('./setup')


//todo make proper async
try {    
    const messageFilePath = core.getInput("message-file");
    const messages = yaml.load(fs.readFileSync(messageFilePath, 'utf8'));


    const token = core.getInput('slack-user-oauth-access-token');

    setup.deleteAllScheduledMessages(token);


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