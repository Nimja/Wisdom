# Wisdom
The wonderful wanderer, who wills wisdom willingly.

A discord bot that has a few simple commands.

[Example page for the speak commands.](https://wisdom.nimja.com/)

## Requirements

* Nodejs.
* Web server with PHP/htaccess support - For the example page.
* [Setup Discord bot](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)

## Configuration
Config should be put in config.json - An example is included in config.example.json

* `token` - The token from setting up the discord bot.
* `prefix` - The prefix character for the bot commands - default: !
* `bot_status` - What status the bot should be. Values: `online`, `idle`, `invisible`, `dnd`
* `timeout` - int seconds - Timeout to prevent spamming/flooding.
* `welcome_joiners` - boolean - Should we send a private message to new joiners?
* `default_channel_id` - string - Default channel for echo or anniversary messages.
* `idle_channels` - array of string - Channel names (without \#) in which we do idle monitoring.
* `idle_timeout` - int seconds - After how long the bot will say something automatically. Min 60 seconds.

## Installation

* Check out repository.
* Run: `npm install .` - To install dependencies.
* Run: `node wisdom`

## Bot commands
Each of the bot commands is kept in the related JS file in `wisdom/command/*.js`

Adding a new file there automatically adds it to the bot.

* `!who` - Report on who you are.
* `!echo [channel] [message]` - Repeat the message on the specified channel. Only works for admins (see config).
* `!choose this or that` - Randomly selects one, can be "or" or comma.
* `!intro` - Repeat the intro text, goes to private message.

## Speak commands
Each of the speak commands is kept in the related JSON file in `wisdom/dicts/*.json`

Adding a new file there automatically adds it to the bot.

* `!dream|advice|compliment|decide|question` - Simple commands that return a relevant reply.

