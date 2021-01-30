const buildMessage = (channel, text) => {
    // TODO Think about channel resolution later. Would be nice if someone could just schedule based on channel-name

    return {channel: channel, text: text}
}

module.exports = buildMessage;