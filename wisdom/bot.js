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
        this.taskAnniversaryEnabled = config.anniversaries_enabled;
        this.reportUserId = config.report_user;
        this.reportUser = false;
        this.defaultChannelId = config.default_channel;
        this.reportChannelId = config.report_channel;
        this.channel = false;
        this.commands = new Commands(client);

    }

    /**
     * Init methods and set up scheduler.
     */
    init() {
        this.client.user.setStatus(this.status);
        // Setup report user.
        if (this.reportUserId) {
            this.client.users.fetch(this.reportUserId).then(
                user => {
                    global.setData('reportUser', user);
                    // Report.
                    console.log('Reporting DM : ' + user.username);
                }
            );
        } else {
            console.log('Reporting DM : NOT CONFIGURED');
        }
        // Setup report communication channel.
        if (this.reportChannelId) {
            this.client.channels.fetch(this.reportChannelId).then(
                channel => {
                    global.setData('reportChannel', channel);
                    // Report.
                    console.log('Reporting to : ' + channel.name);
                }
            );
        } else {
            console.log('Reporting to : NOT CONFIGURED');
        }
        // Setup main communication channel.
        if (this.defaultChannelId) {
            this.client.channels.fetch(this.defaultChannelId).then(
                channel => {
                    global.setData('mainChannel', channel);
                    this.commands.init();
                    this.anniversary = new Anniversary(this.client, channel);
                    // To trigger cleanup, for now let's do this manual check sometimes.
                    // this.anniversary.cleanRolesWithoutAnniversary();
                    // Schedule the daily update.
                    schedule.scheduleJob('0 11 * * *', this.daily.bind(this));
                    // Report.
                    console.log('Main messages: ' + channel.name);
                }
            );
        } else {
            console.log('Main messages: NOT CONFIGURED');
        }
    }
    /**
     * Daily jobs, this allows for actions not tied to a message.
     */
    daily() {
        if (this.taskAnniversaryEnabled) {
            this.anniversary.callout();
        }
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