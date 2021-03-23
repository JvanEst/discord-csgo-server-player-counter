const configHelper = require('./configHelper');
const config = require('../config');
const Gamedig = require('gamedig');
const Discord = require('discord.js');
const _ = require('lodash');

class serverMonitor {
    constructor(serverObject, channel, client) {
        this.server = serverObject;
        this.channel = channel;
        this.client = client;
    }

    start() {
        if (this.server.enableStaticServerMessage) {
            let filter = (reaction, user) => {
                return reaction.emoji.name === '🔄' && user.id != this.client.user.id;
            };

            this.channel.send(this.getLoadingMessage())
                .then((msg) => {
                    this.startRefreshLoop(msg);
                    return msg;
                })
                .then((msg) => {
                    if (this.server.enableRefresh) {
                        msg.react('🔄');
                        const collector = msg.createReactionCollector(filter);

                        collector.on('collect', (reaction, user) => {
                            this.updatePlayerEmbed(msg);
                            reaction.users.remove(user.id);
                        });
                    }
                });
        }

        if (this.server.allowSummonCommand) {
            this.client.on('message', msg => {
                if (msg.channel.id == this.channel.id) {
                    if (msg.content === config.prefix + 'players') {
                        msg.react('👍');
                        this.getPlayers((embed) => {
                            msg.channel.send(embed);
                        });
                    }
                }
            });
        }
    }

    startRefreshLoop(msg) {
        this.updatePlayerEmbed(msg);

        setInterval(() => this.updatePlayerEmbed(msg), this.server.updateRate)
    }

    updatePlayerEmbed(msg) {
        this.getPlayers((embed) => {
            msg.edit(embed);
        });
    }

    getGameData(callback) {
        Gamedig.query({
            type: 'csgo',
            host: this.server.host,
            port: this.server.port
        }).then((state) => {
            callback(state);
        }).catch((error) => {
            // console.log(error);
            callback(false);
        });
    }

    getPlayers(callback) {
        this.getGameData((state) => {
            if (!state) {
                callback(this.getServerOfflineMessage());
                return;
            }

            let currentPlayerCount = state.raw.numplayers;
            let maxPlayerCount = state.maxplayers;
            let playerList = null;

            if(this.server.includePlayerList) {
                playerList = {name: 'Player list', value: ''};

                _.forEach(state.players, (player) => {
                    playerList.value += "\r\n" + player.name;
                })

                if (playerList.value == '') {
                    playerList.value = 'No-one! *Yet*'
                }
            }

            let playerEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(state.name)
                .setThumbnail(configHelper.getMapImage(state.map))
                .addField('Current map:', configHelper.getMapTranslation(state.map), true)
                .addField('Players online:', '' + currentPlayerCount + '/' + maxPlayerCount + ' ' + (currentPlayerCount >= maxPlayerCount ? '**FULL**' : ''), true);

                
            if(this.server.includePlayerList) {
                playerEmbed.addFields(
                    playerList
                );
            }

            playerEmbed.addField('Command', configHelper.getJoinConsoleCommand(this.server.id))
                .addField('Link', configHelper.getJoinLink(this.server.id))
                .setTimestamp()
                .setFooter(process.env.BOT_NAME + " Last updated at:", 'https://cdn.mee6.xyz/guild-images/597787815379730442/547e1828fe4221430faa95fabac1214503efdfa8f9954f4a30bc46c72f1af47e.png');

            callback(playerEmbed);
        })
    }

    getLoadingMessage() {
        let loadingEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle("Loading")
            .setDescription("Loading, please wait...")
            .setTimestamp()
            .setFooter(process.env.BOT_NAME, 'https://cdn.mee6.xyz/guild-images/597787815379730442/547e1828fe4221430faa95fabac1214503efdfa8f9954f4a30bc46c72f1af47e.png');

        return loadingEmbed;
    }

    getServerOfflineMessage() {
        let offlineEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle("Offline")
            .setDescription("This server is currently offline")
            .setTimestamp()
            .setFooter(process.env.BOT_NAME, 'https://cdn.mee6.xyz/guild-images/597787815379730442/547e1828fe4221430faa95fabac1214503efdfa8f9954f4a30bc46c72f1af47e.png');

        return offlineEmbed;
    }
}

module.exports = serverMonitor;