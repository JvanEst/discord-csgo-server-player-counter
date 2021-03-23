const Gamedig = require('gamedig');
const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv');
const _ = require('lodash');
dotenv.config();
const config = require('./config');
const configHelper = require('./helpers/configHelper');
const serverMonitor = require('./helpers/serverMonitor');

const serverMonitors = [];

client.on('ready', () => {
    if (config.cleanOnStart) { // Remove all old bot messages from the linked server channels
        config.servers.forEach((server) => {
            cleanMessagesFromChannel(server.channel);
        });
    }

    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("Not loaded yet");
//   client.user.setUsername(process.env.BOT_NAME);


    // Start each server monitor
    _.forEach(config.servers, (server) => {
        let channel = client.channels.cache.find(channel => channel.name === server.channel);
        let monitor = new serverMonitor(server, channel, client);
        monitor.start();

        serverMonitors.push(monitor);
    })

    client.user.setActivity(serverMonitors.length + ' CS:GO servers', { type: 'WATCHING' });
});

client.login(process.env.DISCORD_TOKEN);


function cleanMessagesFromChannel(channelName) {
    let channel = client.channels.cache.find(channel => channel.name === channelName);

    channel.messages.fetch({
        limit: 100
    }).then(messages => {
        const msgs = messages.filter(m => m.author.id === client.user.id)
        msgs.forEach(m => {
            m.delete();
        })
    })
}

// function startPresenceLoop() {
//     updatePresence();
//     setInterval(updatePresence, process.env.PRESENCE_UPDATE_TIME_IN_MS)
// }

// function updatePresence() {
//     getGameData(client, (state) => {
//         client.user.setActivity(state.raw.numplayers + " players on: " + getMapTranslation(state.map)/*, { type: 'WATCHING'}*/);
//     });
// }

// 822247901022650409
// https://discord.com/oauth2/authorize?client_id=822247901022650409&scope=bot