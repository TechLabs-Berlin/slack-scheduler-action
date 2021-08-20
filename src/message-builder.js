const slackifyMarkdown = require("slackify-markdown");

const buildMessage = (channel, text, time) => {
  return {
    channel: channel,
    text: slackifyMarkdown(text),
    post_at: Date.parse(time) / 1000,
  };
};

function checkField(message, key) {
  if (!message[key]) {
    throw `${key} is missing in a message in ${message.file}`;
  }
}
function stringToDateConverter(messages) {
  for (let message of messages) {
    message.post_at = new Date(message.post_at);
    if (message.repeat) {
      message.repeat = new Date(message.repeat);
    }
  }
  return messages;
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

function incrimentDateIterative(startDate, endDate) {
  let date = startDate;
  let dateList = [date];

  while (date < endDate) {
    date = new Date(date.setDate(date.getDate() + 7));
    dateList.push(date);
  }
  return dateList;
}

function buildRepeatMessages(messages) {
  allMessages = [];

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].repeat) {
      const dates = incrimentDateIterative(
        messages[i].post_at,
        messages[i].repeat
      );
      //TODO figure out how to modify indv object properties, instead of rebuilding it
      //! problem: modyfying indv object changed *all* object properties to be uniform
      //*This also gets rid of 'repeat' proterty
      for (let j = 0; j < dates.length; j++) {
        allMessages.push({
          channel: messages[i].channel,
          file: messages[i].file,
          post_at: dates[j],
          text: messages[i].text,
          user: messages[i].user,
        });
      }
    } else {
      allMessages.push(messages[i]);
    }
  }

  return allMessages;
}

function areMessagesCorrect(messages, userChannels, users) {
  users = Object.keys(users).concat(["default"]);

  stringToDateConverter(messages);

  messages = buildRepeatMessages(messages);

  for (let message of messages) {
    checkField(message, "text");
    checkField(message, "post_at");
    checkField(message, "channel");

    try {
      Date.parse(message.post_at);
    } catch (e) {
      throw `${e} in file ${message.file}`;
    }

    // CHECK IF HAS USER || DEFAULT AND IF USER EXISTS
    const user = message.user || "default";
    if (!users.includes(user)) {
      throw `${user} is not found in token list in a message in file ${message.file}`;
    }
    const channels = userChannels[user];

    if (convertChannelNameToId(message.channel, channels) == null) {
      throw `Channel ${message.channel} not found for message in file ${message.file}`;
    }
  }
}

module.exports = { buildMessage, areMessagesCorrect, convertChannelNameToId };
