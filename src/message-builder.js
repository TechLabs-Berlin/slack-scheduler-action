const slackifyMarkdown = require('slackify-markdown');

const buildMessage = (channel, text, time) => {
    return { channel: channel, text: slackifyMarkdown(text), post_at: Date.parse(time) / 1000 }
}

function checkField(message, key) {
    if (!message[key]) {
        throw `${key} is missing in a message in ${message.file}`
    }
}

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


function areMessagesCorrect(messages, userChannels, users) {
    for (let message of messages) {
        checkField(message, "text")
        checkField(message, "post_at")
        checkField(message, "channel")

        try {
            Date.parse(message.post_at)
        } catch (e) {
            throw `${e} in file ${message.file}`;
        }
        users = Object.keys(users).concat(["default"])
        // CHECK IF HAS USER || DEFAULT AND IF USER EXISTS
        const user = message.user || "default";
        if (!users.includes(user)) {
            throw `${user} is not found in token list in a message in file ${message.file}`
        }
        const channels = userChannels[user];

        if (convertChannelNameToId(message.channel, channels) == null) {
            throw "Channel not found for message";
        }
    }
}

module.exports = { buildMessage, areMessagesCorrect };