const config = require('../config');
const _ = require('lodash');

function getAllLinkedChannels() {
    return _.map(config.servers, 'channel');
}

function getMapTranslation(raw_mapcode) {
    return _.get(config.mapTranslations, raw_mapcode + '.name', raw_mapcode);
}

function getMapImage(raw_mapcode) {
    return _.get(config.mapTranslations, raw_mapcode + '.image', '');
}

function getJoinConsoleCommand(id) {
    return 'connect '+getConnectionHostAndPort(id)+(hasPassword(id) ? '; password ' + getPassword(id) : '');
}

function getJoinLink(id) {
    return 'steam://connect/'+getConnectionHostAndPort(id)+(hasPassword(id) ? '/' + getPassword(id) : '' );
}

function getConnectionHostAndPort(id) {
    let server = getServerById(id);

    return server.host + ':' + server.port;
}

function hasPassword(id) {
    let server = getServerById(id);

    if (!_.isEmpty(server.password))
        return true;

    return false;
}

function getPassword(id) {
    let server = getServerById(id);

    if (!_.isEmpty(server.password))
        return server.password;

    return false;
}

function getServerById(id) {
    let server = _.find(config.servers, {'id': id});

    if (_.isEmpty(server))
        return false;

    return server;
}

function getSummonCommand(server) {
    return server.summonCommand ? server.summonCommand : config.defaultSummonCommand;
}

module.exports = {
    getAllLinkedChannels,
    getMapTranslation,
    getMapImage,
    getJoinConsoleCommand,
    getJoinLink,
    getConnectionHostAndPort,
    hasPassword,
    getPassword,
    getServerById,
    getSummonCommand
};