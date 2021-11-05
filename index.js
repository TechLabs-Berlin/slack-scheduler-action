const core = require("@actions/core");
const github = require("@actions/github");
const {
  buildMessage,
  areMessagesCorrect,
  convertChannelNameToId,
  buildRepeatMessages,
} = require("./src/message-builder");
const {
  parseUserTokens,
  checkUserTokens,
  parseMessageFileInput,
  loadMessage,
} = require("./src/input");
const slack = require("./src/slack");
const setup = require("./setup");

// TODO Optimize api calls to avoid rate limits. E.g. don't delete messages which we would identically schedule again
// TODO Add files: 1. Upload file, 2. Make file sharable 3. generte image text based on: https://stackoverflow.com/questions/58186399/how-to-create-a-slack-message-containing-an-uploaded-image/58189401#58189401

function Sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function main() {
  //TODO make proper async
  try {
    const messageFilePaths = parseMessageFileInput(
      core.getInput("message-file")
    );

    console.log(`${messageFilePaths.length} files found`);
    const messages = loadMessage(messageFilePaths);

    const userTokens = parseUserTokens(
      core.getInput("slack-user-oauth-access-token")
    );

    const workspaceId = core.getInput("slack-workspace-id");

    const isDryRun = core.getInput("dry-run");
    const sendMessagesPast = core.getInput('send-messages-from-past').toLowerCase() === 'true';
    console.log('Configuration:' + JSON.stringify({
      isDryRunL: isDryRun,
      sendMessagesPast: sendMessagesPast
    }));

    const workspaceIdConverted = workspaceId === "" ? null : workspaceId;
    checkUserTokens(userTokens, workspaceIdConverted);

    console.log(`${Object.keys(userTokens)} found as user`);
    const userChannels = await slack.getChannelsFromUser(userTokens);

    //TODO Change from implizit fail to explizit fail by collecting all failures and printing them before existing
    areMessagesCorrect(messages, userChannels, userTokens);
    const allMessages = buildRepeatMessages(messages);

    setup.deleteAllScheduledMessages(userTokens);

    const results = [];

    const now = Date.now();
    
    const messagesNotSend = 0;

    for (let message of allMessages) {
      const user = message.user || "default";
      const channels = userChannels[user];
      const token = userTokens[user];
      const messageBuilded = buildMessage(
        convertChannelNameToId(message.channel, channels),
        message.text,
        message.post_at
      );

      if (sendMessagesPast || message.post_at > now) {
        const result = slack.sendMessage(token, messageBuilded);
        result.catch((error) => {
          console.error(`${error} for mesage: \n ${message.text}`);
        });
        results.push(result);
        await Sleep(1000)
      }
      else{
        messagesNotSend++;
      }
      //TODO put in proper error handling
    }

    console.log('Messages not send: ' + messagesNotSend);
    // TODO Output scheduled messages

    for (let result of results) {
      try {
        let r = await result;
        console.log(r);
      } catch (error) {
        // console.error(error);
      }
    }
  } catch (error) {
    core.setFailed(error);
  }
}

main();
