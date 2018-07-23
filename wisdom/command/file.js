var request = require('request');

var cache = {};
var hour = 3600000;

module.exports = function (cmd, env) {
    if (!env.isDm) {
        return;
    }
    if (refreshCache()) {
        updateCache(env);
    } else {
        makeResponse(env);
    }
};

function refreshCache()
{
    var now = new Date();
    return !cache.time || cache.time.getTime() < now.getTime() - hour || cache.time.getHours() < now.getHours();
}


function makeResponse(env)
{
    var filter = cache.content.filter;
    var latest = cache.content.files[Math.floor(Math.random() * cache.content.files.length)];
    message = formatFile(filter, latest);
    env.user.send(message.text, message);
}

function formatFile(filter, file)
{
    var message = {
        "text": file.name + ' - ' + file.links.details,
        "embed": {
            "color": 4215449,
            "fields": [
                {name: 'Description', value: file.description},
                {name: 'Length', value: secondsToTime(file.length)}
            ]
        }
    };
    applyFilterTags(filter.category, ['Category', 'Categories'], file.tags, message);
    applyFilterTags(filter.feature, ['Feature', 'Features'], file.tags, message);
    applyOtherTags(filter.tags, file.tags, message);
    return message;
}

function secondsToTime(seconds)
{
    var date = new Date(seconds * 1000);
    var result = date.toISOString().substr(11, 8);
    return result.replace(/^00\:/, '');
}

function applyFilterTags(filters, names, filetags, message)
{
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
    message.embed.fields.push({name: name, value: result.join(', ')});
}

function applyOtherTags(tags, filetags, message)
{
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
            message.embed.fields.push({name: name, value: cur});
        }
    }
}

function updateCache(env) {
    request('https://hypno.nimja.com/app', function (error, response, body) {
        if (error) {
            console.log(error);
        }
        var data = JSON.parse(body);
        if (data) {
            cache = data;
            cache.time = new Date(cache.time * 1000);
        }
        makeResponse(env);
    });
}