/// ChadMusic - The Chad Music Bot
/// A feature-rich music bot based on a forked build of DisTube.js

/// Copyright (c) 2021 Michael L. Dickerson (Micky-kun) <iiz10ninja@gmail.com>

/// This software is licensed under the MIT License. By using this software, you agree
/// to use this software in any way as long its under the terms and conditions stated
/// in the license. You can find a copy of the license in the root of this project.

const { Listener } = require('discord-akairo')

module.exports = class ListenerSIGINT extends Listener {
  constructor () {
    super('SIGINT', {
      emitter: 'process',
      event: 'SIGINT'
    })
  }

  async exec () {
    this.client.logger.warn('SIGINT received!')
    this.client.logger.warn('Shutting down...')
    this.client.destroy()
    process.exit(0)
  }
}
