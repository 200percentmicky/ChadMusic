const { Command } = require('discord-akairo')
const { stripIndents } = require('common-tags')

module.exports = class CommandSetLog extends Command {
  constructor () {
    super('setlog', {
      aliases: ['setlog'],
      category: '🔑 Administration',
      description: {
        text: stripIndents`
        Allows you to set various logs and event alerts for the server.

        **Available Logs:**
        \`modlog\` Logs moderation actions.
        \`taglog\` Logs tags being created or deleted.

        **Available Events:**
        \`guildMemberAdd\` A user joins the server.
        \`guildMemberRemove\` A user leaves or was kicked from the server.
        \`guildMemberUpdate\` A member changes their nickname.
        \`messageDelete\` When a message has been deleted from the chat.
        \`messageUpdate\` When a message was edited in chat.
        \`voiceStateUpdate\` Tracks members joining, moving, and leaving voice channels.\n
        `,
        usage: '<logtype> [channel]',
        details: '`<logtype>` The type of log to set.\n`[channel]` A channel to set. If no channel is provided, uses the current channel this command was executed in. If "None" was used as the channel, disables the log for the server.'
      },
      channel: 'guild',
      userPermissions: ['MANAGE_GUILD']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)

    if (!args[1]) {
      return message.say('info', stripIndents`
        Please provide a log to set.

        **Available Logs:**
        \`modlog\` Logs moderation actions.
        \`taglog\` Logs tags being created or deleted.

        **Available Events:**
        \`guildMemberAdd\` A user joins the server.
        \`guildMemberRemove\` A user leaves or was kicked from the server.
        \`guildMemberUpdate\` A member changes their nickname.
        \`messageDelete\` When a message has been deleted from the chat.
        \`messageUpdate\` When a message was edited in chat.
        \`voiceStateUpdate\` Tracks members joining, moving, and leaving voice channels.
        `)
    }

    const logType = { // Again, pure lazy programming.
      modlog: 'Moderation logs',
      taglog: 'Tag logs',
      guildMemberAdd: '`guildMemberAdd`',
      guildMemberRemove: '`guildMemberRemove`',
      guildMemberUpdate: '`guildMemberUpdate`',
      messageDelete: '`messageDelete`',
      messageUpdate: '`messageUpdate`',
      voiceStateUpdate: '`voiceStateUpdate`'
    }

    if (!logType[args[1]]) {
      return message.say('warn', stripIndents`
            \`${args[1]}\` is not a valid log type you can set.

            **Available Logs:**
            \`modlog\` Logs moderation actions.
            \`taglog\` Logs tags being created or deleted.

            **Available Events:**
            \`guildMemberAdd\` A user joins the server.
            \`guildMemberRemove\` A user leaves or was kicked from the server.
            \`guildMemberUpdate\` A member changes their nickname.
            \`messageDelete\` When a message has been deleted from the chat.
            \`messageUpdate\` When a message was edited in chat.
            \`voiceStateUpdate\` Tracks members joining, moving, and leaving voice channels.
            `)
    }

    // Use NONE to remove the log from the server.
    if (args[2] === 'NONE'.toLowerCase()) {
      if (!this.client.settings.has(message.guild.id, args[1])) {
        return message.say('warn', `${logType[args[1]]} are already disabled or were never set.`)
      }
      await this.client.settings.delete(message.guild.id, args[1])
      return message.say('ok', `${logType[args[1]]} will no longer be sent to a channel.`)
    }

    try {
      const channel = args[2] ? message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) : message.channel
      await this.client.settings.set(message.guild.id, channel.id, args[1])
      return message.say('ok', `Added ${logType[args[1]]} to ${channel.toString()}.`)
    } catch (err) {
      message.say('error', err.message)
      return message.recordError('error', 'setlog', 'Command Error', err.stack)
    }
  }
}
