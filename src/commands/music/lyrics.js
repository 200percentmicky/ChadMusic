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
const { Permissions, EmbedBuilder } = require('discord.js');
const Genius = require('genius-lyrics');

module.exports = class CommandLyrics extends Command {
    constructor () {
        super('lyrics', {
            aliases: ['lyrics'],
            category: '🎶 Music',
            description: {
                text: 'Retrieves lyrics from the playing track or from search query.',
                usage: 'lyrics [query]',
                details: '`[query]` The search query to find lyrics.'
            },
            channel: 'guild',
            clientPermissions: ['EMBED_LINKS'],
            args: [
                {
                    id: 'query',
                    match: 'rest'
                }
            ],
            cooldown: 10 * 1000
        });
    }

    async exec (message, args) {
        const djMode = this.client.settings.get(message.guild.id, 'djMode');
        const djRole = this.client.settings.get(message.guild.id, 'djRole');
        const dj = message.member.roles.cache.has(djRole) || message.channel.permissionsFor(message.member.user.id).has(Permissions.FLAGS.MANAGE_CHANNELS);
        if (djMode) {
            if (!dj) return this.client.ui.send(message, 'DJ_MODE');
        }

        const geniusClient = new Genius.Client(process.env.GENIUS_TOKEN);
        const queue = this.client.player.getQueue(message.guild);
        const query = queue?.songs[0]?.name ?? args.query;

        if (!queue && !query) {
            return this.client.ui.reply(message, 'warn', 'Nothing is currently playing in this server. You can `lyrics [query]` to manually search for lyrics.');
        }

        message.channel.sendTyping();

        try {
            const songSearch = await geniusClient.songs.search(query);
            const songLyrics = await songSearch[0].lyrics();

            if (songLyrics.length > 4096) {
                // Since Genius likes to give you weird results, it most likely didn't
                // retrieve lyrics causing the embed to exceed its limits.
                return this.client.ui.reply(message, 'error', 'Unable to retrieve lyrics from currently playing song. Try manually searching for the song using `lyrics [query]`.');
            }

            const embed = new EmbedBuilder()
                .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : null)
                .setAuthor({
                    name: songSearch[0].artist.name,
                    url: songSearch[0].artist.url,
                    iconURL: songSearch[0].artist.image
                })
                .setTitle(songSearch[0].title)
                .setURL(songSearch[0].url)
                .setDescription(`${songLyrics}`)
                .setThumbnail(songSearch[0].image)
                .setFooter({
                    text: `${message.member.user.tag} • Powered by Genius API. (https://genius.com)`,
                    iconURL: message.member.user.avatarURL({ dynamic: true })
                });
            return message.reply({ embeds: [embed] });
        } catch (err) {
            return this.client.ui.reply(message, 'error', err.message, 'Genius API Error');
        }
    }
};
