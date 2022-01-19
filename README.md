# Wisdom
The wonderful wanderer, who wills wisdom willingly.

A discord bot that has a few simple commands.

[Example page for the speak dictionaries.](https://wisdom.nimja.com/)

# Using Wisdom
If you are on the Nimja Hypnosis Discord server, you only have to start typing: `/` and you will see all that is possible.


# Running it yourself
Feel free to make a copy, etc but please do credit me. Thank you!

I've done my best to describe the instructions here, please contact me if anything is missing.

## Requirements

* Nodejs.
* [Setup Discord bot](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)
* OPTIONAL: Web server with PHP/htaccess support - For the example page.

## Configuration
Config should be put in `config.json` - An example is included in `config.example.json`

* `token` - string - The token from setting up the discord bot.
* `report_user` - string - User ID of (probably admin) user that bot reports to, for suggestions.
* `bot_status` - What status the bot should be. Values: `online`, `idle`, `invisible`, `dnd`
* `default_channel_id` - string - Default channel for echo or anniversary messages.

## Installation

* Check out repository.
* Run: `npm install .` - To install dependencies.
* Run: `cp config.example.json config.json` - Copies example config to config, needs to be edited!
* Run: `node wisdom`

## Bot commands
Each of the bot commands is kept in the related JS file in `wisdom/commands/*.js`
The speak dictionaries are kept in the related JSON files in `wisdom/dicts/*.json`

You have to add the commands to the module export for them to be picked up.

Included commands:

* `/help` - Show a help/intro message, others don't see this.
* `/suggest [msg]` - Send the mssage to the report_user, others don't see this.
* `/decide` - Use one of the dictionaries, to show yes/no.
* `/hug [user]` - Use one of the dictionaries, to hug someone else.
