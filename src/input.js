const fs = require('fs');
const yaml = require('js-yaml');

function parseUserTokens(input) {
    if (input.trim().startsWith("xoxp-")) {
        return { "default": input.trim() };
    } else {
        return JSON.parse(input);
    }
}

function parseMessageFileInput(input) {
    return input.split(";");
}

function loadMessage(filepaths) {
    const messages = [];
    for (let messageFilePath of filepaths) {
        const fileMessages = yaml.load(fs.readFileSync(messageFilePath, 'utf8'))
        for (let fMessage of fileMessages) {
            fMessage["file"] = messageFilePath;
        }
        messages.push(...fileMessages);
    }
    return messages;
}

module.exports = { parseUserTokens, parseMessageFileInput, loadMessage }