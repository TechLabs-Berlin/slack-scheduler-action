const core = require('@actions/core');
const github = require('@actions/github');
const messageBuilder = require('./src/message-builder')
const slack = require('./src/slack')
const fs = require('fs');
const yaml = require('js-yaml');

const setup = require('./setup')

function convertChannelNameToId(channel, channels) {
    for (let c of channels) {
        if (c.id == channel) {
            return channel;
        }
        if (c.name == channel) {
            return c.id;
        }
    }
    return null;
}

function parseUserTokens(input) {
    if (input.trim().startsWith("xoxp-")) {
        return { "default": input.trim() };
    } else {
        return JSON.parse(core.getInput('slack-user-oauth-access-token'));
    }
}

async function main() {
    //todo make proper async
    try {
        const messageFilePaths = core.getInput("message-file").split(";");
        const messages = [];
        for (let messageFilePath of messageFilePaths) {
            messages.push(...yaml.load(fs.readFileSync(messageFilePath, 'utf8')));
        }


        const userTokens = parseUserTokens(core.getInput('slack-user-oauth-access-token'));


        // TODO check first if everything is defined properly (Every channel is properly specified, every user is properly specified and has permissions)
        setup.deleteAllScheduledMessages(userTokens);

        const userChannels = await slack.getChannelsFromUser(userTokens);



        for (let message of messages) {
            const user = message.user || "default";
            const channels = userChannels[user];
            const token = userTokens[user];
            // TODO Implement proper handling of markdown to slack-markdown https://github.com/jsarafajr/slackify-markdown
            const messageBuilded = messageBuilder(convertChannelNameToId(message.channel, channels), message.text, message.post_at);
            const result = slack.sendMessage(token, messageBuilded);
            //TODO put in proper error handling
        }
        // TODO Output scheduled messages
        // `who-to-greet` input defined in action metadata file

    } catch (error) {
        core.setFailed(error.message);
    }
}

main();