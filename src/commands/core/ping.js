/**
 *  ChadMusic - The Chad Music Bot
 *  Copyright (C) 2022  Micky D. | @200percentmicky | Micky-kun#3836
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

const { Command } = require('discord-akairo');

module.exports = class PingCommand extends Command {
    constructor () {
        super('ping', {
            aliases: ['ping'],
            description: {
                text: 'Shows the bot\'s latency to Discord.'
            },
            category: '💻 Core'
        });
    }

    async exec (message) {
        const ping = await message.channel.send(process.env.EMOJI_LOADING + 'Ping?');

        const timeDiff = (ping.editedAt || ping.createdAt) - (message.editedAt || message.createdAt);

        await ping.edit(`${process.env.EMOJI_OK} **Pong!**\n📩 \`${timeDiff}ms.\`\n💟 \`${Math.round(this.client.ws.ping)}ms.\``);
    }
};
