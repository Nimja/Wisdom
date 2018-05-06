# Wisdom
The wonderful wanderer, who wills wisdom willingly.

A discord bot that has a few simple commands.

[Example page for the speak commands.](https://wisdom.nimja.com/)

## Requirements

* Nodejs.
* Web server with PHP/htaccess support - For the example page.
* [Setup Discord bot](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)

## Configuration
All config is in config.json.

* `token` - The token from setting up the discord bot.
* `prefix` - The prefix character for the bot commands - default: !
* `bot_status` - What status the bot should be. Values: `online`, `idle`, `invisible`, `dnd`
* `timeout` - int seconds - Timeout to prevent spamming/flooding.
* `idle_channels` - array of string - Channel names (without \#) in which we do idle monitoring.
* `idle_timeout` - int seconds - After how long the bot will say something automatically. Min 60 seconds.

## Installation

* Check out repository.
* Run: `npm install .` - To install dependencies.
* Run: `node wisdom`

## Commands

* `!who` - Report on who you are.
* `!dream` - Create a dream for the user.
* `!advice` - Give some advice.
* `!decide` - Like a magic 8-ball, returns a yes/no answer. Sort of.
