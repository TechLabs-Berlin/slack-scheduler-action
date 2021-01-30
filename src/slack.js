const https = require("https");

async function sendMessage(token, message){
    const response = await request("POST", token,"/api/chat.scheduleMessage", message);
    const result = JSON.parse(response.result);
  
    if (!result || !result.ok || response.statusCode !== 200) {
      throw `Error! ${JSON.stringify(response)}`;
    }
  
    return response;
}

async function getScheduledMessages(token) {
    const response = await request("POST",token,"/api/chat.scheduledMessages.list", {});
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
    const response = await request("POST",token,"/api/chat.deleteScheduledMessage", {
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
 
async function getChannelsFromUser(token) {
    const response = await request("GET",token,"/api/conversations.list?types=public_channel,private_channel", {});
    console.log(response);
    if(response.statusCode == 200){
        const parsedBody = JSON.parse(response.result);
        if(parsedBody.ok){
            return parsedBody.channels
        }

    }else{
        return null;
    }
}

const getOptions = (method, token, path) => {
    return {
      hostname: "slack.com",
      port: 443,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${token}`,
      },
    };
  };
  
  
  function request(method, token, path, message){
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify(message);
  
      const options = getOptions(method, token, path);
  
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

  module.exports = { sendMessage, getScheduledMessages, deleteScheduledMessage, getChannelsFromUser}
//   module.exports = sendMessage;