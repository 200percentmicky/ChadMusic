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
const { PermissionsBitField } = require('discord.js');
const { isSameVoiceChannel } = require('../../modules/isSameVoiceChannel');
const { pushFormatFilter } = require('../../modules/pushFormatFilter');

module.exports = class CommandFilterOff extends Command {
    constructor () {
        super('filteroff', {
            aliases: ['filteroff', 'filtersoff', 'foff'],
            category: '📢 Filter',
            description: {
                text: 'Removes all filters from the player.'
            },
            channel: 'guild',
            clientPermissions: PermissionsBitField.Flags.EmbedLinks
        });
    }

    async exec (message) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const allowFilters = this.client.settings.get(message.guild.id, 'allowFilters');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(PermissionsBitField.Flags.ManageChannels);

        if (djMode) {
            if (!dj) return this.client.ui.send(message, 'DJ_MODE');
        }

        if (allowFilters === 'dj') {
            if (!dj) {
                return this.client.ui.send(message, 'FILTERS_NOT_ALLOWED');
            }
        }

        const vc = message.member.voice.channel;
        if (!vc) return this.client.ui.send(message, 'NOT_IN_VC');

        const queue = this.client.player.getQueue(message.guild.id);
        if (!queue) return this.client.ui.send(message, 'NOT_PLAYING');

        const currentVc = this.client.vc.get(vc);
        if (currentVc) {
            try {
                await queue.filters.clear();
                pushFormatFilter(queue, 'All', 'Off');
                return this.client.ui.reply(message, 'info', 'Removed all filters from the player.');
            } catch {
                return this.client.ui.reply(message, 'error', 'No filters are currently applied to the player.');
            }
        } else {
            if (!isSameVoiceChannel(this.client, message.member, vc)) return this.client.ui.send(message, 'ALREADY_SUMMONED_ELSEWHERE');
        }
    }
};
