const Commands = require('./commands.js');
const Anniversary = require('./anniversary.js');
const Global = require('./global.js');
const schedule = require('node-schedule');

const global = new Global();

class Bot {
    constructor(client, config) {
        this.client = client;
        this.status = config.bot_status;
        this.admins = config.admins;
        this.reportUserId = config.report_user;
        this.reportUser;
        this.defaultChannelId = config.default_channel;
        this.channel;
        this.commands = new Commands(client);

    }

    /**
     * Init methods and set up scheduler.
     */
    init() {
        this.client.user.setStatus(this.status);
        // Setup report user.
        this.client.users.fetch(this.reportUserId).then(
            user => {
                global.setData('reportUser', user);
                // Report.
                console.log('Reporting to: ' + user.username);
            }
        )
        // Setup main communication channel.
        this.client.channels.fetch(this.defaultChannelId).then(
            channel => {
                global.setData('reportChannel', channel);
                this.commands.init(channel.guild);
                this.anniversary = new Anniversary(this.client, channel);
                // Schedule the daily update.
                schedule.scheduleJob('0 11 * * *', this.daily.bind(this));
                // Report.
                console.log('Sending to  : ' + channel.name);
            }
        );
    }
    /**
     * Daily jobs, this allows for actions not tied to a message.
     */
    daily() {
        this.anniversary.callout();
    }
    /**
     * Pass the command handling to the commands class.
     */
    handleCommand(interaction) {
        this.commands.handle(interaction);
    }

    /**
     * Pass the command handling to the commands class.
     */
    handleNewMember(member) {
        this.commands.sendWelcome(member.user);
    }
};

module.exports = Bot;