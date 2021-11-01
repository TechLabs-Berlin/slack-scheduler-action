const slackifyMarkdown = require("slackify-markdown");

class DateError extends Error {
  constructor(message) {
    super(message);
    this.name = "DateError";
  }
}
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
    if (message.repeat_until) {
      message.repeat_until = new Date(message.repeat_until);
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

function incrimentDateWeekly(startDate, endDate) {
  //Only push messages for the next 2 month
  let date = new Date(startDate);
  let dateList = [];


  var currentdate = new Date();
  
  var endDateLimit = new Date(currentdate.setMonth(currentdate.getMonth()+2));

  endDate = endDate < endDateLimit ? endDate : endDateLimit;

  while (date < endDate) {
    dateList.push(date);
    date = new Date(startDate.setDate(startDate.getDate() + 7));
  }

  return dateList;
}

function buildRepeatMessages(messages) {
  allMessages = [];

  for (let i = 0; i < messages.length; i++) {
    if (messages[i].repeat_until) {
      const dates = incrimentDateWeekly(
        messages[i].post_at,
        messages[i].repeat_until
      );

      //*This also gets rid of 'repeat_until' proterty
      for (let j = 0; j < dates.length; j++) {
        allMessages.push({
          text: messages[i].text,
          post_at: dates[j],
          channel: messages[i].channel,
          user: messages[i].user,
          file: messages[i].file,
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

  for (let message of messages) {
    checkField(message, "text");
    checkField(message, "post_at");
    checkField(message, "channel");

    //TODO: throw error for NaN date
    try {
      if (isNaN(Date.parse(message.post_at))) {
        throw new DateError(
          `'post_at' date is NaN: **${message.post_at}** of message: '${message.text}'`
        );
      }
      if (message.repeat_until && isNaN(Date.parse(message.repeat_until))) {
        throw new DateError(
          `'repeat_until' date is NaN: **${message.repeat_until}** of message: '${message.text}'`
        );
      }
    } catch (e) {
      if (e instanceof DateError) {
        console.log(`Your date syntax is incorrect: ${e.message}`);
        throw e;
      } else {
        throw `${e} in file ${message.file}`;
      }
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

  messages = stringToDateConverter(messages);
}

module.exports = {
  buildMessage,
  areMessagesCorrect,
  convertChannelNameToId,
  buildRepeatMessages,
};
