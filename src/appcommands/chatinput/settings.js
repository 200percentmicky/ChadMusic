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

const { stripIndents } = require('common-tags');
const { SlashCommand, CommandOptionType } = require('slash-create');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { toColonNotation, toMilliseconds } = require('colon-notation');
const { version } = require('../../../package.json');

module.exports = class CommandSettings extends SlashCommand {
    constructor (creator) {
        super(creator, {
            name: 'settings',
            description: 'Manage the bot\'s settings.',
            options: [
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'current',
                    description: 'Shows the current settings for this server.'
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'remove',
                    description: 'Revert a setting to its default value.',
                    options: [{
                        type: CommandOptionType.STRING,
                        name: 'setting',
                        description: 'The setting you look like to revert.',
                        required: true,
                        choices: [
                            {
                                name: 'djrole',
                                value: 'djRole'
                            },
                            {
                                name: 'djmode',
                                value: 'djMode'
                            },
                            {
                                name: 'maxtime',
                                value: 'maxTime'
                            },
                            {
                                name: 'maxqueuelimit',
                                value: 'maxQueueLimit'
                            },
                            {
                                name: 'allowfilters',
                                value: 'allowFilters'
                            },
                            {
                                name: 'allowexplicit',
                                value: 'allowAgeRestricted'
                            },
                            {
                                name: 'unlimitedvolume',
                                value: 'allowFreeVolume'
                            },
                            {
                                name: 'defaultvolume',
                                value: 'defaultVolume'
                            },
                            {
                                name: 'blockedphrases',
                                value: 'blockedPhrases'
                            },
                            {
                                name: 'textchannel',
                                value: 'textChannel'
                            }
                        ]
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'djrole',
                    description: 'Sets the DJ Role for this server.',
                    options: [{
                        type: CommandOptionType.ROLE,
                        name: 'role',
                        description: 'The role to be recognized as a DJ.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'djmode',
                    description: 'Manages DJ mode on this server.',
                    options: [{
                        type: CommandOptionType.BOOLEAN,
                        name: 'toggle',
                        description: 'Toggles DJ Mode for the server.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'maxtime',
                    description: 'Sets the max duration allowed for a song to be added to the queue.',
                    options: [{
                        type: CommandOptionType.STRING,
                        name: 'time',
                        description: 'The duration of the song. This will prevent songs from being added to the queue that exceed this.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'maxqueuelimit',
                    description: 'Sets how many songs a user can add to the queue on this server.',
                    options: [{
                        type: CommandOptionType.INTEGER,
                        name: 'limit',
                        description: 'The max number of songs a user can add to the queue. This will also limit playlists.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'allowfilters',
                    description: 'Allows or denies the ability to add filters to the player.',
                    options: [{
                        type: CommandOptionType.BOOLEAN,
                        name: 'toggle',
                        description: 'Enables or disables the feature. If set to false, only DJs can use filters.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'allowexplicit',
                    description: 'Allows or denies the ability to add explicit tracks to the queue.',
                    options: [{
                        type: CommandOptionType.BOOLEAN,
                        name: 'toggle',
                        description: 'Whether explicit tracks should be added to the queue.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'allowlinks',
                    description: 'Allows or denies the ability to add songs to the queue from a URL link.',
                    options: [{
                        type: CommandOptionType.BOOLEAN,
                        name: 'toggle',
                        description: 'Whether URLs can be added to the queue.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'thumbnailsize',
                    description: "Changes the track's thumbnail size of the \"Now Playing\" embeds.",
                    options: [{
                        type: CommandOptionType.STRING,
                        name: 'size',
                        description: 'The size of the track\'s image.',
                        required: true,
                        choices: [
                            {
                                name: 'Small',
                                value: 'small'
                            },
                            {
                                name: 'Large',
                                value: 'large'
                            }
                        ]
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'unlimitedvolume',
                    description: 'Allows or denies the ability to freely set the player\'s volume to any value.',
                    options: [{
                        type: CommandOptionType.BOOLEAN,
                        name: 'toggle',
                        description: 'Enables or disables the feature. If set to false, the player\'s volume will be limited to 200%.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'defaultvolume',
                    description: 'Sets the player\'s default volume.',
                    options: [{
                        type: CommandOptionType.INTEGER,
                        name: 'volume',
                        min_value: 1,
                        max_value: 150,
                        description: 'The volume to set when a new player is created.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'textchannel',
                    description: '[Deprecated] Sets the text channel to limit commands to.',
                    options: [{
                        type: CommandOptionType.CHANNEL,
                        name: 'channel',
                        description: 'The text channel to use.',
                        required: true
                    }]
                },
                {
                    type: CommandOptionType.SUB_COMMAND_GROUP,
                    name: 'blocksong',
                    description: "Manages the server's list of blocked search phrases.",
                    options: [
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'add',
                            description: "Adds a phrase to the server's list.",
                            options: [{
                                type: CommandOptionType.STRING,
                                name: 'phrase',
                                description: 'The phrase to add to the list',
                                required: true
                            }]
                        },
                        {
                            type: CommandOptionType.SUB_COMMAND,
                            name: 'remove',
                            description: 'Removes a phrase from the list.',
                            options: [{
                                type: CommandOptionType.STRING,
                                name: 'phrase',
                                description: 'The phrase to remove from the list.',
                                required: true
                            }]
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'prefix',
                    description: "Changes the bot's prefix for this server.",
                    options: [
                        {
                            type: CommandOptionType.STRING,
                            name: 'newprefix',
                            description: "The prefix to use for the server. Only applies to the bot's message based commands.",
                            required: true
                        }
                    ]
                },
                {
                    type: CommandOptionType.SUB_COMMAND,
                    name: 'allowsilent',
                    description: 'Toggles the ability to silently add tracks to the queue.',
                    options: [
                        {
                            type: CommandOptionType.BOOLEAN,
                            name: 'toggle',
                            description: 'Enables or disables the feature.',
                            required: true
                        }
                    ]
                }
            ]
        });

        this.filePath = __filename;
    }

    async run (ctx) {
        const settings = this.creator.client.settings;
        const guild = this.client.guilds.cache.get(ctx.guildID);
        const channel = guild.channels.cache.get(ctx.channelID);

        if (!channel.permissionsFor(ctx.user.id).has(PermissionsBitField.Flags.ManageGuild)) {
            return this.client.ui.send(ctx, 'MISSING_PERMISSIONS', 'Manage Server');
        }

        await settings.ensure(ctx.guildID, this.client.defaultSettings);

        // All Settings
        const prefix = settings.get(guild.id, 'prefix'); // Prefix
        const djRole = settings.get(guild.id, 'djRole'); // DJ Role
        const djMode = settings.get(guild.id, 'djMode'); // Toggle DJ Mode
        const maxTime = settings.get(guild.id, 'maxTime'); // Max Song Duration
        const maxQueueLimit = settings.get(guild.id, 'maxQueueLimit'); // Max Entries in the Queue
        const allowFilters = settings.get(guild.id, 'allowFilters'); // Allow the use of Filters
        const allowFreeVolume = settings.get(guild.id, 'allowFreeVolume'); // Unlimited Volume
        const allowLinks = settings.get(guild.id, 'allowLinks'); // Allow Links
        const allowSilent = settings.get(guild.id, 'allowSilent'); // Allow Silent Tracks
        const defaultVolume = settings.get(guild.id, 'defaultVolume'); // Default Volume
        const textChannel = settings.get(guild.id, 'textChannel'); // Text Channel
        const blockedPhrases = settings.get(guild.id, 'blockedPhrases'); // Blocked Songs
        const thumbnailSize = settings.get(guild.id, 'thumbnailSize'); // Thumbnail Size
        // const voiceChannel = settings.get(guild.id, 'voiceChannel', null) // Voice Channel

        // ! This setting only affects videos from YouTube.
        // All pornographic websites are blocked.
        const allowAgeRestricted = settings.get(guild.id, 'allowAgeRestricted', true); // Allow Explicit Content.

        switch (ctx.subcommands[0]) {
        case 'current': {
            const embed = new EmbedBuilder()
                .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                .setAuthor({
                    name: `${guild.name}`,
                    iconURL: guild.iconURL({ dynamic: true })
                })
                .setTitle(':gear: Settings')
                .setDescription(stripIndents`
                **⁉ Prefix:** \`${prefix}\`
                **🔖 DJ Role:** ${djRole ? `<@&${djRole}>` : 'None'}
                **🎤 DJ Mode:** ${djMode === true ? 'On' : 'Off'}
                **⏲ Max Song Time:** ${maxTime ? toColonNotation(maxTime) : 'Unlimited'}
                **🔢 Max Entries in the Queue:** ${maxQueueLimit || 'Unlimited'}
                **📢 Allow Filters:** ${allowFilters ? 'Yes' : 'No'}
                **😂 Unlimited Volume:** ${allowFreeVolume === true ? 'On' : 'Off'}
                **🔗 Allow Links:** ${allowLinks === true ? 'Yes' : 'No'}
                **🔞 Allow Explicit Content:** ${allowAgeRestricted === true ? 'Yes' : 'No'}
                **🤫 Allow Silent Tracks:** ${allowSilent === true ? 'Yes' : 'No'}
                **🖼 Thumbnail Size:** ${thumbnailSize === 'large' ? 'Large' : 'Small'}
                **🔊 Default Volume:** ${defaultVolume}
                **#️⃣ Text Channel:** ${textChannel ? `<#${textChannel}>` : 'Any'}
                `)
                .setTimestamp()
                .setFooter({
                    text: `ChadMusic v${version}`,
                    iconURL: 'https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
                });

            const blockedEmbed = new EmbedBuilder()
                .setColor(guild.members.me.displayColor !== 0 ? guild.members.me.displayColor : null)
                .setAuthor({
                    name: `${guild.name}`,
                    iconURL: guild.iconURL({ dynamic: true })
                })
                .setTitle('🎶❌ Blocked Songs')
                .setDescription(`\`\`\`${blockedPhrases.join(', ')}\`\`\``)
                .setTimestamp()
                .setFooter({
                    text: `ChadMusic v${version}`,
                    iconURL: 'https://media.discordapp.net/attachments/375453081631981568/808626634210410506/deejaytreefiddy.png'
                });

            if (blockedPhrases.length === 0) {
                blockedEmbed.setDescription(null);
                blockedEmbed.addFields({
                    name: `${process.env.EMOJI_INFO} No phrases are being blocked in this server.`,
                    value: 'To add phrases to the list, run `/settings blocksong add <phrase>`.'
                });
            }

            return ctx.send({ embeds: [embed, blockedEmbed] });
        }

        case 'remove': {
            await settings.set(ctx.guildID, this.client.defaultSettings[ctx.options.remove.setting], ctx.options.remove.setting);
            return this.client.ui.reply(ctx, 'ok', `**${ctx.options.remove.setting}** has been reverted to the default setting.`);
        }

        case 'djrole': {
            await settings.set(ctx.guildID, ctx.options.djrole.role, 'djRole');
            return this.client.ui.reply(ctx, 'ok', `<@&${ctx.options.djrole.role}> has been set as the DJ role.`);
        }

        case 'djmode': {
            await settings.set(ctx.guildID, ctx.options.djmode.toggle, 'djMode');
            return this.client.ui.reply(ctx, 'ok', 'DJ Mode has been enabled.');
        }

        case 'maxtime': {
            const time = toMilliseconds(ctx.options.maxtime.time);
            if (isNaN(time)) return this.client.ui.reply(ctx, 'error', `\`${ctx.options.maxtime.time}\` doesn't parse to a time format. The format must be \`xx:xx\`.`);
            await settings.set(ctx.guildID, time, 'maxTime');
            return this.client.ui.reply(ctx, 'ok', `Max Time has been set to \`${ctx.options.maxtime.time}\``);
        }

        case 'maxqueuelimit': {
            await settings.set(ctx.guildID, ctx.options.maxqueuelimit.limit, 'maxQueueLimit');
            return this.client.ui.reply(ctx, 'ok', `Max Queue Limits have been set to \`${ctx.options.maxqueuelimit.limit}\`.`);
        }

        case 'allowfilters': {
            await settings.set(ctx.guildID, ctx.options.allowfilters.toggle, 'allowFilters');
            return this.client.ui.reply(ctx, 'ok', `Filters have been ${ctx.options.allowfilters.toggle ? '**enabled**.' : '**disabled**. Only DJs will be able to apply filters.'}`);
        }

        case 'allowexplicit': {
            await settings.set(ctx.guildID, ctx.options.allowexplicit.toggle, 'allowFilters');
            return this.client.ui.reply(ctx, 'ok', `Age restricted content is ${ctx.options.allowexplicit.toggle ? 'now allowed' : 'no longer allowed'} on this server.`);
        }

        case 'allowlinks': {
            await settings.set(ctx.guildID, ctx.options.allowlinks.toggle, 'allowLinks');
            return this.client.ui.reply(ctx, 'ok', `URLs can ${ctx.options.allowlinks.toggle ? 'now' : 'no longer'} be added to the queue.`);
        }

        case 'unlimitedvolume': {
            await settings.set(ctx.guildID, ctx.options.unlimitedvolume.toggle, 'allowFreeVolume');
            return this.client.ui.reply(ctx, 'ok', `Unlimited Volume has been ${ctx.options.unlimitedvolume.toggle ? '**enabled**.' : '**disabled**. Volume has been limited to 200%.'}`);
        }

        case 'thumbnailsize': {
            await settings.set(ctx.guildID, ctx.options.thumbnailsize.size, 'thumbnailSize');
            return this.client.ui.reply(ctx, 'ok', `Thumbnail size has been set to **${ctx.options.thumbnailsize.size}**.`);
        }

        case 'defaultvolume': {
            await settings.set(ctx.guildID, ctx.options.defaultvolume.volume, 'defaultVolume');
            return this.client.ui.reply(ctx, 'ok', `Default volume for the player has been set to **${ctx.options.defaultvolume.volume}%**.`);
        }

        case 'allowsilent': {
            await settings.set(ctx.guildID, ctx.options.allowsilent.toggle, 'allowSilent');
            return this.client.ui.reply(ctx, 'ok', `Silent tracks have been **${ctx.options.allowsilent.toggle === true ? 'enabled' : 'disabled'}**.`);
        }

        case 'blocksong': {
            switch (ctx.subcommands[1]) {
            case 'add': {
                if (this.client.settings.includes(guild.id, ctx.options.blocksong.add.phrase, 'blockedPhrases')) {
                    return this.client.ui.reply(ctx, 'warn', `\`${ctx.options.blocksong.add.phrase}\` already exists in the list.`);
                }
                await this.client.settings.push(guild.id, ctx.options.blocksong.add.phrase, 'blockedPhrases');
                return this.client.ui.reply(ctx, 'ok', `\`${ctx.options.blocksong.add.phrase}\` is now blocked on this server.`, null, 'Any phrases in the list will no longer be added to the player.');
            }

            case 'remove': {
                if (!this.client.settings.includes(guild.id, ctx.options.blocksong.remove.phrase, 'blockedPhrases')) {
                    return this.client.ui.reply(ctx, 'warn', `\`${ctx.options.blocksong.remove.phrase}\` doesn't exists in the list.`);
                }
                await this.client.settings.remove(guild.id, ctx.options.blocksong.remove.phrase, 'blockedPhrases');
                return this.client.ui.reply(ctx, 'ok', `\`${ctx.options.blocksong.remove.phrase}\` is no longer blocked on this server.`);
            }
            }
            break;
        }

        case 'textchannel': {
            await settings.set(ctx.guildID, ctx.options.textchannel.channel, 'textChannel');
            return this.client.ui.reply(ctx, 'ok', `<#${ctx.options.textchannel.channel}> will be used for music commands.`);
        }

        // Message based commands only.
        case 'prefix': {
            await this.client.settings.set(guild.id, ctx.options.prefix.newprefix, 'prefix');
            return this.client.ui.reply(ctx, 'ok', `The prefix has been set to \`${ctx.options.prefix.newprefix}\``);
        }
        }
    }
};
