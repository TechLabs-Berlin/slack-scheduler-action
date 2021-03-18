const { parseUserTokens, parseMessageFileInput } = require('../src/input')

test('Parse User Tokens Single', () => {
    const userToken = 'xoxp-12345'
    expect(parseUserTokens(userToken)).toStrictEqual({ "default": userToken })
})

test('Parse User Tokens Multiple', () => {
    const userToken = '{"default": "xoxp-12345", "max": "xoxp-123456"}'

    expect(parseUserTokens(userToken)).toStrictEqual(JSON.parse(userToken))
})
