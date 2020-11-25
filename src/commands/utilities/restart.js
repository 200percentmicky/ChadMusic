const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class CommandRestart extends Command
{
    constructor()
    {
        super('restart', {
            aliases: ['restart', 'reboot'],
            ownerOnly: true,
            category: '⚙ Utilities',
            description: {
                text: 'Attempts to restart the bot.',
                usage: '[reason]'
            }
        });
    }

    async exec(message)
    {
        const args = message.content.split(/ +/g);
        var restartReport = args.slice(1).join(' ');
        if (!restartReport) restartReport = 'Just refreshing... nothing serious. (☞ﾟヮﾟ)☞ ¯\\_(ツ)_/¯';
        const errChannel = this.client.channels.cache.find(val => val.id == '603735567733227531');
        await message.react('🔄');
        await errChannel.send(new MessageEmbed()
            .setColor(this.client.color.info)
            .setTitle('🔁 Restart')
            .setDescription(`\`\`\`js\n${restartReport}\`\`\``)
            .setTimestamp()
        );

        process.exit(0);
    }
};
