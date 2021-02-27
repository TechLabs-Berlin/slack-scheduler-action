const core = require('@actions/core');

//TODO Get all Scheduled messages from Token
const slack = require('./src/slack')
//TODO Delete all scheduled messages from token

async function deleteAllScheduledMessages(userTokens) {
    for (let key in userTokens) {
        const token = userTokens[key];
        const scheduledMessages = await slack.getScheduledMessages(token);
        for (let message of scheduledMessages) {
            slack.deleteScheduledMessage(token, message.channel_id, message.id);
        }
    }
}
// const token = core.getInput('slack-user-oauth-access-token');

module.exports = { deleteAllScheduledMessages }
// deleteAllScheduledMessages(token);