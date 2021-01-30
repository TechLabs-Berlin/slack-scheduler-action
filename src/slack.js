const https = require("https");

async function sendMessage(token, message){
    const response = await post(token,"/api/chat.scheduleMessage", message);
    const result = JSON.parse(response.result);
  
    if (!result || !result.ok || response.statusCode !== 200) {
      throw `Error! ${JSON.stringify(response)}`;
    }
  
    return response;
}

async function getScheduledMessages(token) {
    const response = await post(token,"/api/chat.scheduledMessages.list", {});
    if(response.statusCode == 200){
        const parsedBody = JSON.parse(response.result);
        if(parsedBody.ok){
            return parsedBody.scheduled_messages
        }

    }else{
        return null;
    }
}

async function deleteScheduledMessage(token, channel, scheduledMessageId) {
    const response = await post(token,"/api/chat.deleteScheduledMessage", {
        scheduled_message_id: scheduledMessageId,
        channel: channel
    });
    if(response.statusCode == 200){
        const parsedBody = JSON.parse(response.result);
        if(parsedBody.ok){
            return parsedBody.scheduled_messages
        }

    }else{
        return null;
    }
}
 
const getOptions = (token, path) => {
    return {
      hostname: "slack.com",
      port: 443,
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
    };
  };
  
function post(token, path, message){
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify(message);
  
      const options = getOptions(token, path);
  
      const req = https.request(options, (res) => {
        const chunks = [];
  
        res.on("data", (chunk) => {
          chunks.push(chunk);
        });
  
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            result: Buffer.concat(chunks).toString(),
          });
        });
      });
  
      req.on("error", (error) => {
        reject(error);
      });
  
      req.write(payload);
      req.end();
    });
  };
  
  
  module.exports = { sendMessage, getScheduledMessages, deleteScheduledMessage}
//   module.exports = sendMessage;