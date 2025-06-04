/* eslint-disable no-console */
const { colours } = require('leeks.js');
const figlet = require('figlet');
const link = require('terminal-link');

module.exports = version => {
        figlet
                .textSync('dctickets.fi', { font: 'Banner3' })
                .split('\n')
                .forEach(line => console.log(colours.cyan(line)));
        console.log('');
        console.log(colours.cyanBright(`${link('dctickets.fi', 'https://dctickets.fi')} v${version}`));
	console.log('\n');
};
