const { parseUserTokens, parseMessageFileInput, checkUserTokens } = require('../src/input')

test('Parse User Tokens Single', () => {
    const userToken = 'xoxp-12345'
    expect(parseUserTokens(userToken)).toStrictEqual({ "default": userToken })
})

test('Parse User Tokens Multiple', () => {
    const userToken = '{"default": "xoxp-12345", "max": "xoxp-123456"}'

    expect(parseUserTokens(userToken)).toStrictEqual(JSON.parse(userToken))
})

test('Check User Tokens Success', () => {
    const userToken = '{"default": "xoxp-12345-1234", "max": "xoxp-12345-123"}'
    const users = parseUserTokens(userToken)
    checkUserTokens(users)
})

test('Check User Tokens Fails', () => {
    const userToken = '{"default": "xosp-12345-1234", "max": "xoxp-12345-123"}'
    const users = parseUserTokens(userToken)
    const t = () => {
        checkUserTokens(users)
    };
    expect(t).toThrow();
})

test('Check User Tokens Workspace Success', () => {
    const userToken = '{"default": "xoxp-12345-1234", "max": "xoxp-12345-123"}'
    const users = parseUserTokens(userToken)
    checkUserTokens(users, "12345")
})

test('Check User Tokens Fails', () => {
    const userToken = '{"default": "xoxp-12345-1234", "max": "xoxp-1234-123"}'
    const users = parseUserTokens(userToken)
    const t = () => {
        checkUserTokens(users, "12345");
    };
    expect(t).toThrow();
})