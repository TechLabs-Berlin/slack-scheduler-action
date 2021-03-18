// const sum = require('./sum');

const { messageBuilder, areMessagesCorrect } = require('../src/message-builder')

test('adds 1 + 2 to equal 3', () => {
    expect(3).toBe(3);
});

function generateCorrectMessages() {
    return [
        {
            text: "Just stuff",
            post_at: "2021-02-27T14:25+01:00",
            channel: "scheduler_test",
            user: "max",
            file: "test.yaml"
        }
    ]
}

function generateWrongMessages() {
    return [
        {
            text: "Just stuff",
            // post_at: "2021-02-27T14:25+01:00",
            channel: "scheduler_test",
            user: "max",
            file: "test.yaml"
        }
    ]
}

test('Check Correct Messages Formatting', () => {
    const messages = generateCorrectMessages();
    const userChannels = {
        "max": [
            {
                id: "test",
                name: "scheduler_test"
            }
        ]
    };

    const userTokens = {
        "max": "test"

    };
    areMessagesCorrect(messages, userChannels, userTokens);
})

test('Check Correct Messages Formatting', () => {
    const messages = generateCorrectMessages().concat(generateCorrectMessages());
    const userChannels = {
        "max": [
            {
                id: "test",
                name: "scheduler_test"
            }
        ]
    };

    const userTokens = {
        "max": "test"

    };
    areMessagesCorrect(messages, userChannels, userTokens);
})

test('Check Wrong Messages Formatting', () => {
    const messages = generateWrongMessages();
    const userChannels = {
        "max": [
            {
                id: "test",
                name: "scheduler_test"
            }
        ]
    };

    const userTokens = {
        "max": "test"

    };

    expect(() => { areMessagesCorrect(messages, userChannels, userTokens) }).toThrow("post_at is missing in a message in test.yaml");
})