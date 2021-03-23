# CS:GO Server "Monitor"
___
A Discord bot that allows you to monitor (multiple) CSGO servers.

The bot when configured will post a message to the configured discord channel and update this message with new information about the server.

![](https://i.imgur.com/vuvtXqr.png)
![](https://i.imgur.com/AqhfyEN.png)

## Features
- Monitor multiple servers
- Allow your users to quickly see how full and who is in the server
- Easy join link through steam or more conventional command
- Doesn't need a RCON connection
- Auto-updating information
- Possibility to summon by command or be static in a channel

## Quickstart

1. Install [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)

```sh
$ npm install pm2@latest -g
# or
$ yarn global add pm2
```

2. Setup the `.env` and `config.js` file.

Set your Discord bot token in the `.env`, `DISCORD_TOKEN` field.

Modify the `config.js` to your liking.

3. Start the Discord bot:

```
pm2 start
```

4. Profit.

## Configuration
```js
config.prefix = 'string'; // Prefix of the command to look for
config.cleanOnStart = true; // Delete own messages when starting up

config.botName = "Name of the Bot";
config.botAvatar = "Image URL of the avatar";

config.defaultSummonCommand = 'players'; // Default command to listen for combined with the global prefix. (i.e. prefix+summonCommand). Only works if `allowSummonCommand` is enabled for that server

config.servers = [
    {
        id: 1,                              // Unique ID for this server, can be anything
        host: 'string',                     // The host of the server
        port: 'string',                     // The port of the server
        password: 'string',                 // Only needed to generate the invite command / link
        channel: 'string',                  // Which channel to watch for messages and post info for this server in
        updateRate: 60000,                  // in MS, how long between each automatic update. Only in combination with `enableStaticServerMessage`
        enableRefresh: true,                // Add an refresh reaction, which when clicked will refresh the server info
        includePlayerList: true,            // Display a player list with the server info
        allowSummonCommand: true,           // Allow a seperate server info to be summoned with a command
        summonCommand: 'string',            // Custom command to listen for combined with the global prefix. (i.e. prefix+summonCommand). Only works if `allowSummonCommand` is enabled for this server
        enableStaticServerMessage: true     // Enable if the bot will post a server info on startup and keep updating it
    },
    // ... as many as you like
];

// Name translations and thumbnails for the maps that could be running on the server.
config.mapTranslations = {
    'map_name' : {name: 'Translated Image', image: 'Image URL'},
}
```

For the most common map thumbnails, see this imgur post: https://imgur.com/a/t5CSK0n