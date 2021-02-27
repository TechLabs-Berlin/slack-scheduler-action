# Slack Scheduling Action 

This action wraps the [chat.scheduleMessage](https://api.slack.com/methods/chat.scheduleMessage) API call, to schedule messages based on given yaml-files for specified users. 

## Usage

## Inputs

### `slack-user-oauth-access-token`

**Required** The user-token of the user to post.

### `message-file`

**Required** The yaml-file which specifies the message, the channel and the datetime to post it.

**Example Yaml File**
```yaml
- text: |
    *Hey,*,

    :rocket: I am happy that the first people already started our program!
  post_at: "2021-02-15T21:18+01:00"
  channel: "G01LXNY9F6J" # Channel-ID or Channel-Name

- text: |
    *Hey everyone*,

    Wish you all a nice evening
 
  post_at: "2021-02-16T17:12+01:00"
  channel: "general" # Channel-ID or Channel-Name
```
<!-- 
## Example usage

uses: actions/hello-world-javascript-action@v1.1
with:
  who-to-greet: 'Mona the Octocat' -->

## Formatting messages
Please refer to Slack's documentation on [message formatting](https://api.slack.com/reference/surfaces/formatting). They also have a [message builder](https://api.slack.com/docs/messages/builder) that's great for playing around and previewing messages. Your messages can contain attachments, markdown, buttons, and more.

## License
The Dockerfile and associated scripts and documentation in this project are released under the MIT License.

