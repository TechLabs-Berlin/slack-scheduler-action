const core = require('@actions/core');
const github = require('@actions/github');
const { messageBuilder, areMessagesCorrect } = require('./src/message-builder')
const { parseUserTokens, parseMessageFileInput, loadMessage } = require('./src/input')
const slack = require('./src/slack')
const setup = require('./setup')





async function main() {
    //TODO make proper async
    try {
        const messageFilePaths = parseMessageFileInput(core.getInput("message-file"));

        console.log(`${messageFilePaths.length} files found`);
        const messages = loadMessage(messageFilePaths);

        const userTokens = parseUserTokens(core.getInput('slack-user-oauth-access-token'));

        console.log(`${Object.keys(userTokens)} found as user`);
        const userChannels = await slack.getChannelsFromUser(userTokens);

        //TODO Change from implizit fail to explizit fail by collecting all failures and printing them before existing
        areMessagesCorrect(messages, userChannels, Object.keys(userTokens));

        setup.deleteAllScheduledMessages(userTokens);

        for (let message of messages) {
            const user = message.user || "default";
            const channels = userChannels[user];
            const token = userTokens[user];
            const messageBuilded = messageBuilder(convertChannelNameToId(message.channel, channels), message.text, message.post_at);
            const result = slack.sendMessage(token, messageBuilded);
            //TODO put in proper error handling
        }
        // TODO Output scheduled messages        

    } catch (error) {
        core.setFailed(error);
    }
}

main();