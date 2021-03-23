module.exports = {
  apps : [{
    name: 'csgo_player_counter',
    script: 'index.js',
    watch: '.',
    "env": {
      "NODE_ENV": "debug"
    },
    // Environment variables injected when starting with --env production
    // http://pm2.keymetrics.io/docs/usage/application-declaration/#switching-to-different-environments
    "env_production" : {
      "NODE_ENV": "production"
    }
  }],
};
