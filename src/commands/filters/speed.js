const { Command } = require('discord-akairo')

module.exports = class CommandSpeed extends Command {
  constructor () {
    super('speed', {
      aliases: ['speed'],
      category: '📢 Filter',
      description: {
        text: 'Changes the rhythm of the player. Anything lower than 5 will slow down playback.',
        usage: '<int:rate[1-15]>',
        details: '`<int:rate[1-15]>` The rate of speed to change.'
      },
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS']
    })
  }

  async exec (message) {
    const args = message.content.split(/ +/g)
    const djMode = await this.client.djMode.get(message.guild.id)
    const djRole = await this.client.djRole.get(message.guild.id)
    const allowFilters = await this.client.allowFilters.get(message.guild.id)
    const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(['MANAGE_CHANNELS'])

    if (djMode) {
      if (!dj) return message.say('no', 'DJ Mode is currently active. You must have the DJ Role or the **Manage Channels** permission to use music commands at this time.')
    }

    if (allowFilters === 'dj') {
      if (!dj) {
        return message.say('no', 'You must have the DJ Role or the **Manage Channels** permission to use filters.')
      }
    }

    const vc = message.member.voice.channel
    if (!vc) return message.say('error', 'You are not in a voice channel.')

    const queue = this.client.player.getQueue(message.guild.id)
    if (!queue) return message.say('warn', 'Nothing is currently playing on this server.')

    const currentVc = this.client.voice.connections.get(message.guild.id)
    if (currentVc) {
      const rate = parseInt(args[1])
      if (!rate) {
        return message.usage('speed <int:rate[1-15]>')
      }
      if (rate === 'OFF'.toLowerCase()) {
        await this.client.player.setFilter(message, 'asetrate', 'off')
        return message.custom('📢', process.env.COLOR_INFO, '**Rhythm** Off')
      }
      if (isNaN(rate)) {
        return message.say('error', 'Rate of speed requires a number or **off**.')
      }
      if (rate <= 0 || rate >= 16) {
        return message.say('error', 'Rate of speed must be between **1-15** or **off**.')
      }
      await this.client.player.setFilter(message, 'asetrate', `asetrate=${rate}*10000`)
      return message.custom('📢', process.env.COLOR_INFO, `**Rhythm** Rate: \`${rate}\``)
    } else {
      if (vc.id !== currentVc.channel.id) return message.say('error', 'You must be in the same voice channel that I\'m in to use that command.')
    }
  }
}
