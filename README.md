# CS:GO Server "Monitor"
___
A Discord bot that allows you to monitor (multiple) CSGO servers.

![](https://i.imgur.com/vuvtXqr.png)
![](https://i.imgur.com/AqhfyEN.png)

## Features
- Monitor multiple servers
- Allow your users to quickly see how full and who is in the server
- Easy join link through stream or more conventional command
- Doesn't need a RCON connection
- Auto-updating information
- Possibility to summon by command or be static in a channel

## Configuration
```js
config.prefix = 'string'; // Prefix of the command to look for
config.cleanOnStart = true; // Delete own messages when starting up

// botname
// botimage

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
        enableStaticServerMessage: true     // Enable if the bot will post a server info on startup and keep updating it
    },
   
];

// Name translations and thumbnails for the maps that could be running on the server.
config.mapTranslations = {
    'map_name' : {name: 'Translated Image', image: 'Image URL'},
}
```