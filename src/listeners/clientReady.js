/// ChadMusic - The Chad Music Bot
/// Copyright (C) 2024  Micky | 200percentmicky
///
/// This program is free software: you can redistribute it and/or modify
/// it under the terms of the GNU General Public License as published by
/// the Free Software Foundation, either version 3 of the License, or
/// (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
/// GNU General Public License for more details.
///
/// You should have received a copy of the GNU General Public License
/// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const { Listener } = require('discord-akairo');
const path = require('path');

module.exports = class SurferReady extends Listener {
    constructor () {
        super('ready', {
            emitter: 'client',
            event: 'ready',
            type: 'once'
        });
    }

    async exec () {
        // Register commands in the "commands" directory.
        this.client.logger.info('Registering app commands...');
        await this.client.creator.registerCommandsIn(path.join(__dirname, '..', 'appcommands'));
        await this.client.creator.syncCommands({ // Sync all commands with Discord.
            deleteCommands: process.env.DELETE_INVALID_COMMANDS === 'true' || false,
            skipGuildErrors: true,
            syncGuilds: true,
            syncPermissions: true
        });

        this.client.logger.info(`Logged in as ${this.client.user.tag.replace(/#0{1,1}$/, '')} (${this.client.user.id})`);
        this.client.logger.info('[Ready!<3♪] Let\'s party!!');
    }
};
