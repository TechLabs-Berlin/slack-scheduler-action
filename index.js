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

function checkField(message, key) {
    if (!message[key]) {
        throw `${key} is missing in a message in ${message.file}`
    }
}

function areMessagesCorrect(messages, userChannels, users) {
    for (let message of messages) {
        // TODO FOR EACH MESSAGE
        // CHECK IF FIELDS EXIST TEXT, CHANNEL, ITEM
        checkField(message, "text")
        checkField(message, "post_at")
        checkField(message, "channel")

        try {
            Date.parse(message.post_at)
        } catch (e) {
            throw `${e} in file ${message.file}`;
        }
        users = users.concat(["default"])
        // CHECK IF HAS USER || DEFAULT AND IF USER EXISTS
        const user = message.user || "default";
        if (!users.includes(user)) {
            throw `${user} is not found in token list in a message in file ${message.file}`
        }
        const channels = userChannels[user];
        // TODO Implement proper handling of markdown to slack-markdown https://github.com/jsarafajr/slackify-markdown
        if (convertChannelNameToId(message.channel, channels) == null) {
            throw "Channel not found for message";
        }



    }
}

async function main() {
    //todo make proper async
    try {
        const messageFilePaths = core.getInput("message-file").split(";");
        const messages = [];
        for (let messageFilePath of messageFilePaths) {
            const fileMessages = yaml.load(fs.readFileSync(messageFilePath, 'utf8'))
            for (let fMessage of fileMessages) {
                fMessage["file"] = messageFilePath;
            }
            messages.push(...fileMessages);
        }


        const userTokens = parseUserTokens(core.getInput('slack-user-oauth-access-token'));
        const userChannels = await slack.getChannelsFromUser(userTokens);


        areMessagesCorrect(messages, userChannels, Object.keys(userTokens));

        // TODO check first if everything is defined properly (Every channel is properly specified, every user is properly specified and has permissions)
        setup.deleteAllScheduledMessages(userTokens);

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