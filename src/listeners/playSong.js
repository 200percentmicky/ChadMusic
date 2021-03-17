/// ChadMusic - The Chad Music Bot
/// A feature-rich music bot based on a forked build of DisTube.js

/// Copyright (c) 2021 Michael L. Dickerson (Micky-kun) <iiz10ninja@gmail.com>

/// This software is licensed under the MIT License. By using this software, you agree
/// to use this software in any way as long its under the terms and conditions stated
/// in the license. You can find a copy of the license in the root of this project.

const { stripIndents } = require('common-tags')
const { Listener } = require('discord-akairo')
const { MessageEmbed } = require('discord.js')
const prettyms = require('pretty-ms')

module.exports = class ListenerPlaySong extends Listener {
  constructor () {
    super('playSong', {
      emitter: 'player',
      event: 'playSong'
    })
  }

  async exec (message, queue, song) {
    const msg = queue.initMessage // message sometimes returns 'undefined'
    const textChannel = msg.channel // Again, message sometimes returns 'undefined'.
    const channel = queue.connection.channel // Same.
    const guild = channel.guild // This as well...
    // This be some weird shit above...

    if (queue.songs.length === 1) { // If someone started a new queue.
      const settings = this.client.settings.get(guild.id)
      const dj = msg.member.roles.cache.has(settings.djRole) || channel.permissionsFor(msg.member.user.id).has(['MANAGE_CHANNELS'])
      if (settings.maxTime) {
        if (!dj) {
          if (parseInt(song.duration + '000') > settings.maxTime) { // DisTube omits the last three digits in the songs duration.
            // Stupid fix.
            if (msg.content.includes(this.client.prefix.getPrefix(guild.id) + ('skip' || 's'))) return
            this.client.player.stop(message)
            return msg.say('no', `You cannot add this song to the queue since the duration of this song exceeds the max limit of \`${prettyms(settings.maxTime, { colonNotation: true })}\` for this server.`)
          }
        }
      }
    }

    textChannel.send(new MessageEmbed()
      .setColor(this.client.utils.randColor())
      .setAuthor(`Now playing in ${channel.name}`, guild.iconURL({ dynamic: true }))
      .setDescription(stripIndents`
      **Requested by:** ${song.user}
      **Duration:** ${song.formattedDuration}
      `)
      .setTitle(song.name)
      .setURL(song.url)
      .setThumbnail(song.thumbnail)
      .setTimestamp()
    )
  }
}
