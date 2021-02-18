const { Command } = require('discord-akairo')

module.exports = class CommandBassBoost extends Command {
  constructor () {
    super('bassboost', {
      aliases: ['bassboost', 'bass'],
      category: '🗣 Filter',
      description: {
        text: 'Boosts the bass of the player.',
        filter: 'bass=g=10,dynaudnorm=f=150:g=15'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const settings = this.client.settings.get(message.guild.id)
    const dj = message.member.roles.cache.has(settings.djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])
    if (settings.djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.')
    }

    if (!args[1]) return message.usage('bassboost <gain:int(1-100)/off>')

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const queue = this.client.player.getQueue(message.guild.id)
    if (!queue) return message.say('warn', 'Nothing is currently playing on this server.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (currentVc) {
      if (args[1] === 'OFF'.toLowerCase()) {
        await this.client.player.setFilter(message.guild.id, 'bassboost', 'off')
        return message.custom('📢', this.client.color.info, '**Bass Boost** Off')
      } else {
        const gain = parseInt(args[1])
        if (gain < 1 || gain > 100 || isNaN(gain)) {
          return message.say('error', 'Bass gain must be between **1-100**, or **"off"**.')
        }
        await this.client.player.setFilter(message.guild.id, 'bassboost', `bass=g=${gain}`)
        return message.custom('📢', this.client.color.info, `**Bass Boost** Gain: \`${gain}dB\``)
      }
    } else {
      if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')
    }
  }
}
