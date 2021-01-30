const buildMessage = (channel, text, time) => {
    // TODO Think about channel resolution later. Would be nice if someone could just schedule based on channel-name

    return {channel: channel, text: text, post_at: Date.parse(time)}
}

module.exports = buildMessage;