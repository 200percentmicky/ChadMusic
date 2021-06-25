const { Command } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const { splitBar } = require('string-progressbar')

module.exports = class CommandNowPlaying extends Command {
  constructor () {
    super('nowplaying', {
      aliases: ['nowplaying', 'np'],
      category: '🎶 Music',
      description: {
        text: 'Shows the currently playing song.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const djMode = this.client.settings.get(message.guild.id, 'djMode')
    const djRole = this.client.settings.get(message.guild.id, 'djRole')
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.', 'DJ Mode')
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (!this.client.player.isPlaying(message) || !currentVc) return message.say('warn', 'Nothing is currently playing in this server.')
    else if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')

    const queue = this.client.player.getQueue(message)

    const song = queue.songs[0]
    const total = song.duration + '000'
    const current = queue.currentTime

    const progressBar = splitBar(total, current, 17)[0]
    const duration = song.isLive ? '📡 **Live**' : `${queue.formattedCurrentTime} [${progressBar}] ${song.formattedDuration}`
    const embed = new MessageEmbed()
      .setColor(this.client.utils.randColor())
      .setAuthor(`Currently playing in ${currentVc.channel.name}`, message.guild.iconURL({ dynamic: true }))
      .setDescription(`${duration}`)
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)

    if (song.youtube) {
      const author = queue.songs[0].info.videoDetails.author
      embed.addField('Channel', `[${author.name}](${author.channel_url})`)
    }

    embed
      .addField('Requested by', `${song.user}`, true)
      .addField('Volume', `${queue.volume}%`, true)
      .addField('📢 Filters', `${queue.filter != null ? queue.filter.map(x => `**${x.name}:** ${x.value}`) : 'None'}`)
      .setTimestamp()

    return message.channel.send({ embed: embed })
  }
}
