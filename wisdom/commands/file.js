

module.exports = {
    'file': {
        config: {
            description: 'Get information for a file',
            options: [{
                name: 'file',
                type: 'STRING',
                description: 'File',
                required: true,
            }]
        },
        handler: handle
    },
}

const request = require('request');
const schedule = require('node-schedule');

schedule.scheduleJob('2 20 * * *', updateCache);


var cache = {};
var hour = 3600000;

updateCache();

function handle(interaction) {
    var rest = interaction.options.get('file');
    rest = rest ? rest.value.toLowerCase().trim() : '';

    var filter = cache.content.filter;
    var file = false;
    if (rest === 'last') {
        file = cache.content.files[0]
    } else if (rest.length > 0) {
        file = searchFile(rest)
    } else {
        file = cache.content.files[Math.floor(Math.random() * cache.content.files.length)];
    }
    if (file) {
        message = formatFile(filter, file);
        return message
    } else {
        return {
            "content": "I couldn't find anything for: " + rest,
            "ephemeral": true,
        };
    }
}

function searchFile(rest) {
    var result = [];
    for (var i in cache.content.files) {
        var file = cache.content.files[i];
        if (file.search.search(rest) > -1) {
            return file;
        }
    }
    return false;
}

function formatFile(filter, file) {
    let message = {
        content: file.name + ' - ' + file.links.details,
        ephemeral: true,
    };
    let embed = {
        "color": 4215449,
        "fields": [
            { name: 'Description', value: file.description },
            { name: 'Intended effect', value: file.intended },
            { name: 'Length', value: secondsToTime(file.length) }
        ]
    }

    applyFilterTags(filter.category, ['Category', 'Categories'], file.tags, embed);
    applyFilterTags(filter.feature, ['Feature', 'Features'], file.tags, embed);
    applyOtherTags(filter.tags, file.tags, embed);
    message.embeds = [embed];
    return message;
}

function secondsToTime(seconds) {
    var date = new Date(seconds * 1000);
    var result = date.toISOString().substr(11, 8);
    return result.replace(/^00\:/, '');
}

function applyFilterTags(filters, names, filetags, embed) {
    var result = [];
    for (var tag in filters) {
        if (filetags.indexOf(tag) > -1) {
            result.push(filters[tag]);
        }
    }
    if (result.length == 0) {
        return;
    }
    var name = result.length == 1 ? names[0] : names[1];
    embed.fields.push({ name: name, value: result.join(', ') });
}

function applyOtherTags(tags, filetags, embed) {
    for (var name in tags) {
        if (name == 'Length' || name == 'Platform') {
            continue;
        }
        var cur = null;
        for (var tag in tags[name]) {
            if (tag[1] == '0' || tag[1] == '1') {
                continue;
            }
            if (filetags.indexOf(tag) > -1) {
                cur = tags[name][tag];
            }
        }
        if (cur !== null) {
            embed.fields.push({ name: name, value: cur });
        }
    }
}

function updateCache() {
    request('https://hypno.nimja.com/app', function (error, response, body) {
        if (error) {
            console.log(error);
        }
        var data = JSON.parse(body);
        if (data) {
            cache = data;
            createTextSearch();
            cache.time = new Date(cache.time * 1000);
        }
    });
}

function createTextSearch() {
    for (var i in cache.content.files) {
        var file = cache.content.files[i];
        var search = file.name; // + ' ' + file.description + ' ' + file.intended;
        file.search = search.toLowerCase();
    }
}