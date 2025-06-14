const { SlashCommand } = require('@eartharoid/dbf');
const { isStaff } = require('../../lib/users');
const ExtendedEmbedBuilder = require('../../lib/embed');
const { version } = require('../../../package.json');

module.exports = class ClaimSlashCommand extends SlashCommand {
	constructor(client, options) {
		const name = 'help';
		super(client, {
			...options,
			description: client.i18n.getMessage(null, `commands.slash.${name}.description`),
			descriptionLocalizations: client.i18n.getAllMessages(`commands.slash.${name}.description`),
			dmPermission: false,
			name,
			nameLocalizations: client.i18n.getAllMessages(`commands.slash.${name}.name`),
		});
	}

	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 */
	async run(interaction) {
		/** @type {import("client")} */
		const client = this.client;

		await interaction.deferReply({ ephemeral: true });
		const staff = await isStaff(interaction.guild, interaction.member.id);
		const settings = await client.prisma.guild.findUnique({ where: { id: interaction.guild.id } });
		const getMessage = client.i18n.getLocale(settings.locale);
		const commands = client.application.commands.cache
			.filter(c => c.type === 1)
			.map(c => `> </${c.name}:${c.id}>: ${c.description}`)
			.join('\n');
		const newCommand = client.application.commands.cache.find(c => c.name === 'new');
		const fields = [
			{
				name: getMessage('commands.slash.help.response.commands'),
				value: commands,
			},
		];

		if (staff) {
			fields.unshift(
				{
					inline: true,
					name: getMessage('commands.slash.help.response.links.links'),
					value: [
                                                ['commands', 'https://dctickets.fi/komennot'],
                                                ['docs', 'https://dctickets.fi'],
                                                ['feedback', 'https://dctickets.fi/palaute'],
                                                ['support', 'https://dctickets.fi/discord'],
					]
						.map(([l, url]) => `> [${getMessage('commands.slash.help.response.links.' + l)}](${url})`)
						.join('\n'),
				},
				{
					inline: true,
					name: getMessage('commands.slash.help.response.settings'),
					value: '> ' + process.env.HTTP_EXTERNAL + '/settings',
				},
			);
		}

		interaction.editReply({
			embeds: [
				new ExtendedEmbedBuilder({
					iconURL: interaction.guild.iconURL(),
					text: settings.footer,
				})
					.setColor(settings.primaryColour)
					.setTitle(getMessage('commands.slash.help.title'))
					.setDescription(staff
                                                ? `**dctickets.fi v${version}**`
						: getMessage('commands.slash.help.response.description', { command: `</${newCommand.name}:${newCommand.id}>` }))
					.setFields(fields),
			],
		});
	}
};
