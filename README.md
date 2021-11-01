# Slack Scheduling Action 

This action wraps the [chat.scheduleMessage](https://api.slack.com/methods/chat.scheduleMessage) API call, to schedule messages based on given yaml-files for specified users. 

## Usage

### Example usage
<!-- 
## Example usage

uses: actions/hello-world-javascript-action@v1.1
with:
  who-to-greet: 'Mona the Octocat' -->

### Tests
Run the following to run unit tests:

```
npm run test
```
## Inputs

### `slack-user-oauth-access-token`

**Required** The user-token of the user to post. Can either be a JSON for multi-user support, or just the token for single-user usage, which will map to the user `default`

**Example of json usage**
```json
slack-user-oauth-access-token: '{
  "max": "${{ secrets.SLACK_USER_OAUTH_ACCESS_TOKEN_MAX }}",
  "merlin":  "${{ secrets.SLACK_USER_OAUTH_ACCESS_TOKEN_MERLIN }}"
}'
```

**Warning!**

The action requires for every message a specified token. So if you don`t have a default user, every message needs a defined user.



### `message-file`

**Required** The yaml-file which specifies the message, the channel and the datetime to post it. To specify multiple files, seperate them with a `;`

**Example Yaml File**
```yaml
- text: | 
    *Hey,*,

    :rocket: I am happy that the first people already started our program!
  post_at: "2021-02-15T21:18+01:00"
  channel: "G01LXNY9F6J" # Channel-ID or Channel-Name
  user: "max" # Optional, if none is specified the message will be send with the token of the default user
- text: |
    *Hey everyone*,

    Wish you all a nice evening
 
  post_at: "2021-02-16T17:12+01:00"
  channel: "general" # Channel-ID or Channel-Name
```

**Text-format**
We use [Slackify-Markdown](https://github.com/jsarafajr/slackify-markdown) to convert markdown in text to the slack-specific format.


## Formatting messages
Please refer to Slack's documentation on [message formatting](https://api.slack.com/reference/surfaces/formatting). They also have a [message builder](https://api.slack.com/docs/messages/builder) that's great for playing around and previewing messages. Your messages can contain attachments, markdown, buttons, and more.

## License
The associated scripts and documentation in this project are released under the MIT License.

