/*
 * * Poki - a multi-purpose Discord bot by Micky-kun
 * The sun is shining. Let's go to the beach!
 *
 * Licensed under the MIT License. Please read LICENSE for more information.
 */

/*
 * Here lies the messy outcome of a lazy programmer.
 * Either that or it's Javascripts fault.
*/

'use strict'

// Configuring winston
const chalk = require('chalk')
const { createLogger, format, transports } = require('winston')
const logger = createLogger({
  format: format.combine(
    format.splat(),
    format.timestamp(),
    format.label({ label: '==>' }),
    format.printf(({ timestamp, label, level, message }) => {
      return `[${timestamp}] ${label} ${level}: ${message}`
    })
  ),
  transports: [
    new transports.File({
      filename: 'console.log'
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple(),
      format.printf(({ timestamp, label, level, message }) => {
        return `${chalk.black.cyan(`[${timestamp}]`)} ${label} ${level}: ${message}`
      })
    )
  }))
}

// Say hello!
const { version } = require('../package.json')
logger.info(' ____       _    _ ')
logger.info('|  _ \\ ___ | | _(_)')
logger.info('| |_) / _ \\| |/ / |')
logger.info('|  __/ (_) |   <| |')
logger.info('|_|   \\___/|_|\\_\\_|')
logger.log('info', `Poki - Surf's up! v${version}`)
// Looks like shit lol.

if (process.versions.node < '14.0.0') {
  logger.error('PokiMusic requires at least Node.js v%s. You have v%s installed. Please update your existing Node installation. Aborting...', '14.0.0', process.versions.node)
  process.exit(1)
}

logger.info('Loading libraries...')
const { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } = require('discord-akairo')
const prefix = require('discord-prefix')
const { Structures, MessageEmbed, Intents } = require('discord.js')
const Enmap = require('enmap')
const DisTube = require('distube')
const moment = require('moment')
const StarboardManager = require('discord-starboards')

const starboard = new Enmap('starboards')
starboard.ensure('starboards', [])

const config = require('./config.json')
const emoji = require('./emoji.json')
const color = require('./colorcode.json')
const urlicon = require('./urlicon.json')

// Extending a few things...
Structures.extend('Message', Message => {
  class MessageStructure extends Message {
    // Universal Embed dialogs.
    say (type, description, title) {
      const embedColor = {
        ok: color.ok,
        warn: color.warn,
        error: color.error,
        info: color.info,
        no: color.no
      }

      const emojiPerms = this.channel.permissionsFor(this.client.user.id).has(['USE_EXTERNAL_EMOJIS'])
      const embedEmoji = {
        ok: emojiPerms ? emoji.ok : '✅',
        warn: emojiPerms ? emoji.warn : '⚠',
        error: emojiPerms ? emoji.error : '❌',
        info: emojiPerms ? emoji.info : 'ℹ',
        no: emojiPerms ? emoji.no : '🚫'
      }

      const embedIcon = {
        ok: urlicon.ok,
        warn: urlicon.warn,
        error: urlicon.error,
        info: urlicon.info,
        no: urlicon.no
      }

      const embed = new MessageEmbed()
        .setColor(embedColor[type])

      if (title) {
        embed.setAuthor(title, embedIcon[type])
        embed.setDescription(description)
      } else {
        if (type === 'error' || type === 'warn') {
          embed.setAuthor(type === 'error' ? 'Error' : 'Warning', embedIcon[type])
          embed.setDescription(description)
        } else {
          embed.setDescription(`${embedEmoji[type]} ${description}`)
        }
      }

      if (this.channel.type === 'dm') {
        return this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
      } else {
        if (!this.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS'])) {
          return this.reply(title
            ? `${embedEmoji[type]} **${title}** | ${description}`
            : `${embedEmoji[type]} ${description}`
          , { allowedMentions: { repliedUser: false } })
        } else return this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
      }
    }

    // Shows the commands usage in case no arguments were provided for
    // some commands.
    usage (syntax) {
      const guildPrefix = prefix.getPrefix(this.guild.id) || config.prefix
      const embed = new MessageEmbed()
        .setColor(color.info)
        .setAuthor('Usage', urlicon.info)
        .setDescription(`\`${guildPrefix}${syntax}\``)
      this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
    }

    // Custom style embeds.
    custom (emoji, color, description, title) {
      const embed = new MessageEmbed()
        .setColor(color)

      if (title) {
        embed.setTitle(`${emoji} ${title}`)
        embed.setDescription(description)
      } else {
        embed.setDescription(`${emoji} ${description}`)
      }

      if (this.channel.type === 'dm') {
        return this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
      } else {
        if (!this.channel.permissionsFor(this.client.user.id).has(['EMBED_LINKS'])) {
          return this.reply(title
            ? `${emoji} **${title}** | ${description}`
            : `${emoji} ${description}`
          , { allowedMentions: { repliedUser: false } })
        } else return this.reply({ embed: embed, allowedMentions: { repliedUser: false } })
      }
    }

    // Error Handling. Used to send to the support server.
    // This will not be useful if self-hosting this bot.
    async recordError (type, command, title, error) {
      // Consider replacing the channel ID for your own error reporting
      // channel until the feature is supported in the configs.
      const errorChannel = this.client.channels.cache.get('603735567733227531')
      const embed = new MessageEmbed()
        .setTimestamp()
        .addField('Server', this.channel.type === 'dm'
          ? 'Direct Message'
          : this.guild.name + '\nID: ' + this.guild.id, true
        )
        .addField('Channel', this.channel.type === 'dm'
          ? 'Direct Message'
          : this.channel.name + '\nID: ' + this.channel.id, true
        )

      if (command) {
        // I was rather lazy with this one. I'm not sure if Akairo is able to
        // provide what command is invoked. Hard coding seems to not be an issue atm...
        embed.addField('Command', command, true)
      }

      if (type === 'warning') {
        logger.warn(error)
        embed.setColor(color.warn)
        embed.setTitle(emoji.warn + title)
      }

      if (type === 'error') {
        logger.error(error)
        embed.setColor(color.error)
        embed.setTitle(emoji.error + title)
      }

      await errorChannel.send(embed)
      return errorChannel.send(error, { code: 'js', split: true })
    }
  }

  return MessageStructure
})

// Extending the Guild class.
Structures.extend('Guild', Guild => {
  class GuildStructure extends Guild {
    // Records a moderation case.
    // Anytime someone with the appropriate elavated permissions uses
    // a moderation command, the case will be recorded only if the guild
    // has a modlog channel set.
    async recordCase (type, modid, userid, reason) {
      await this.client.modlog.ensure(this.id, {}) // Makes sure that the database exists.
      const modlog = this.client.modlog.get(this.id) // Gets the mod log for the guild.
      const caseid = Object.keys(modlog).length // Gets the current amount of entries in the mod log.

      // Embed colors!
      const colors = {
        ban: color.ban,
        kick: color.kick,
        softban: color.softban,
        unban: color.unban
      }

      const moderator = this.members.cache.get(modid) // The moderators user ID.
      const user = this.client.users.cache.find(val => val.id === userid) // The affected users ID.

      const _type = type.charAt(0).toUpperCase() + type.slice(1)
      const emojiType = {
        ban: '🔨',
        kick: '👢',
        softban: '💨',
        unban: '🕊'
      }

      // Used to construct the embed.
      if (!reason) reason = `No reason provided. Type \`${this.client.config.prefix}reason ${caseid + 1}\` to add it.`

      const __type = `**Action:** ${_type} ${emojiType[type]}\n`
      const __user = `**User:** ${user.tag} (\`${user.id}\`)\n`
      const __reason = `**Reason:** ${reason}`

      const embed = new MessageEmbed()
        .setColor(colors[type])
        .setAuthor(moderator.user.tag + ` (${moderator.user.id})`, moderator.user.avatarURL({ dynamic: true }))
        .setDescription(`${__type}${__user}${__reason}`)
        .setThumbnail(user.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setFooter(`Case ${caseid + 1}`) // Adds 1 from the caseid variable.

      const modlogSetting = this.client.settings.get(this.id, 'modlog') // The modlog channel.
      const modlogChannel = this.channels.cache.find(val => val.id === modlogSetting) // Get's the modlog channel for the guild.

      if (!modlogChannel) return // The modlog channel doesn't exist.

      return modlogChannel.send(embed).then(msg => {
        // Adds a case into the modlog DB.
        // Then it'll be possible to retrieve the case's message ID to edit the modlog case.
        this.client.modlog.set(this.id, {
          type: type,
          mod_id: modid,
          message_id: msg.id,
          user_tag: user.tag,
          user_avatar: user.avatarURL({ dynamic: true }),
          user_id: userid,
          caseid: caseid + 1
        }, caseid + 1)
      }).catch(err => {
        // Some stupid shit happened idk...
        if (err.name === 'DiscordAPIError') return
        const errorChannel = this.client.channels.cache.find(val => val.id === '603735567733227531')
        const embed = new MessageEmbed()
          .setColor(color.error)
          .setTitle(emoji.error + 'Internal Error')
          .setDescription(`\`\`\`js\n${err}\`\`\``)
          .setTimestamp()
        errorChannel.send(embed)
      })
    }
  }

  return GuildStructure
})

class Poki extends AkairoClient {
  constructor () {
    super({
      ownerID: config.owner
    }, {
      disableMentions: 'true',
      // Changing the offset to a lower number than 500 will cause the
      // reactions to show faster, but it also comes with a cost of having
      // your bot rate-limited.
      restTimeOffset: 175,
      intents: new Intents(Intents.ALL)
    })

    // Configuration files.
    this.config = config
    this.emoji = emoji
    this.color = color

    // Packages
    this.utils = require('bot-utils')
    this.moment = moment
    this.prefix = prefix
    this.logger = logger
    this.si = require('systeminformation')
    this.player = new DisTube(this, {
      emitNewSongOnly: true,
      leaveOnStop: true,
      leaveOnEmpty: true,
      leaveOnFinish: true,
      youtubeCookie: config.ytCookie,
      highWaterMark: 1 << 25,
      youtubeDL: true,
      updateYouTubeDL: false
    })

    // Data Management
    // Server Defaults
    this.defaults = {
      noInvites: false,
      modlog: null,
      messagelog: null,
      memberlog: null,
      voicelog: null,
      taglog: null,
      guildMemberAdd: null,
      guildMemberRemove: null,
      guildMemberUpdate: null,
      messageDelete: null,
      messageUpdate: null,
      voiceStateUpdate: null,
      djMode: false,
      djRole: null,
      allowFreeVolume: true,
      nowPlayingAlerts: true,
      maxTime: null,
      maxQueueLimit: null,
      textChannel: null,
      voiceChannel: null,
      timezone: 'UTC'
    }

    logger.info('Loading settings...')
    this.settings = new Enmap({
      name: 'settings',
      fetchAll: true
    })
    logger.log('info', 'Retrieving Modlog cases...')
    this.modlog = new Enmap('modlog')
    this.tags = new Enmap('tags')

    // Starboard!
    // Moved to the main client so data can be easily accessed.
    class StarSaver extends StarboardManager {
      async getAllStarboards () {
        return starboard.get('starboards')
      }

      async saveStarboard (data) {
        starboard.push('starboards', data)
        return true
      }

      async deleteStarboard (channel, emoji) {
        const starboardArray = starboard.get('starboards').filter((sb) => !(sb.channelID === channel && sb.options.emoji === emoji))
        starboard.set('starboards', starboardArray)
        return true
      }
    }

    logger.info('Initializing starboards...')
    this.starboard = new StarSaver(this, {
      storage: false
    })

    this.commands = new CommandHandler(this, {
      directory: './src/commands',
      prefix: message => message.channel.type === 'text'
        ? prefix.getPrefix(message.guild.id) || config.prefix
        : config.prefix,
      commandUtil: true,
      handleEdits: true,
      allowMention: true
    })
    this.listeners = new ListenerHandler(this, {
      directory: './src/listeners'
    })
    this.inhibitors = new InhibitorHandler(this, {
      directory: './src/inhibitors'
    })

    this.listeners.setEmitters({
      process: process,
      commandHandler: this.commands,
      player: this.player
    })

    this.commands.useInhibitorHandler(this.inhibitors)
    this.commands.useListenerHandler(this.listeners)

    this.commands.loadAll()
    this.listeners.loadAll()

    if (process.env.NODE_ENV === 'production') {
      this.inhibitors.loadAll()
    }
  }
}

module.exports = Poki
