const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    'file': {
        config: new SlashCommandBuilder()
            .setName('file')
            .setDescription('Get information for a file.')
            .addStringOption(option =>
                option.setName('file')
                    .setDescription('Text in title/description.')
                    .setRequired(true)
            )
            .toJSON(),
        handler: handle
    },
}

if (global.isConsole) { // Don't start the scheduler or any rest.
    return;
}

const bent = require('bent')
const schedule = require('node-schedule');

schedule.scheduleJob('2 20 * * *', updateCache);

var cache = {}; // Local cache, to avoid having to do network requests every search.

updateCache();

function handle(interaction) {
    var searchText = interaction.options.get('file');
    searchText = searchText ? searchText.value.toLowerCase().trim() : '';

    searchText = cleanRegex(searchText);
    var filter = cache.content.filter;
    var file = false;
    if (searchText === 'last') {
        file = cache.content.files[0]
    } else if (searchText.length > 0) {
        if (searchText.match(/^[0-9]+$/)) { // All numbers, assume file.
            searchText = 'f' + searchText
        }
        file = searchFileId(searchText);
        if (!file) {
            file = searchFile(searchText);
        }
    } else {
        file = cache.content.files[Math.floor(Math.random() * cache.content.files.length)];
    }
    if (file) {
        message = formatFile(filter, file);
        return message
    } else {
        return formatNotFound(searchText);
    }
}

/**
 * Clean up the search from regex characters that can break.
 */
function cleanRegex(searchText) {
    return searchText.toString().replace(/[\(\)\[\]\?]/gm, ' ');
}

/**
 * Search for file IDs.
 */
function searchFileId(searchText) {
    if (searchText in cache.indexes) {
        return cache.content.files[cache.indexes[searchText]];
    }
    return false;
}

/**
 * Search for text in files.
 */
function searchFile(searchText) {
    for (var i in cache.content.files) {
        var file = cache.content.files[i];
        try {
            if (file.search.search(searchText) > -1) {
                return file;
            }
        } catch (error) {
            console.log("Search error:", error.message);
            break;
        }
    }
    return false;
}

function formatNotFound(searchText) {
    let message = {
        content: "I couldn't find anything for: " + searchText,
        ephemeral: true,
    };
    let embed = {
        "color": 4215449,
        "fields": [
            { name: 'Help', value: "You can search using parts of words and very basic regex (no brackets)" },
            {
                name: 'File number', value: [
                    "A file number on its own is assumed to be one of the normal files.",
                    "`10` for '10 - Fun...'",
                ].join("\n")
            },
            {
                name: 'Short codes', value: [
                    "Use short-codes (same as playlist url) to find specific files:",
                    "`f10` for '10 - Fun...'",
                    "`l10` for 'Live 10 - Brainwashing...'",
                    "`i10` for 'Live Light 10 - Incubus...'",
                ].join("\n")
            },
        ]
    }
    message.embeds = [embed];
    return message;

}

/**
 * Search for file IDs.
 */
function formatFile(filter, file) {
    let message = {
        content: "This is what I found:\n" +
            "# " + file.name +
            "\n" + file.links.details,
        ephemeral: true,
    };
    var embed = {
        "color": 4215449,
        "fields": [
            { name: 'Name', value: file.name },
            { name: 'Description', value: file.description },
            { name: 'Intended effect', value: file.intended },
            { name: 'Length', value: secondsToTime(file.length), inline: true }
        ]
    }
    applyFilterTags(filter.category, ['Category', 'Categories'], file.tags, embed);
    applyFilterTags(filter.feature, ['Feature', 'Features'], file.tags, embed);
    message.embeds = [embed];
    // Button to file links.
    message.components = [
        {
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "Open details page",
                    "style": 5,
                    "url": file.links.details
                }
            ]
        }
    ]
    return message;
}

function secondsToTime(seconds) {
    var date = new Date(seconds * 1000);
    var result = date.toISOString().substr(11, 8);
    return result.replace(/^00\:/, '');
}

/**
 * Add the tags with support for plural names.
 */
function applyFilterTags(filters, names, filetags, embed) {
    var result = [];
    for (var tag in filters) {
        tag = parseInt(tag);
        if (filetags.indexOf(tag) > -1) {
            result.push(filters[tag]);
        }
    }
    if (result.length == 0) {
        return;
    }
    var name = result.length == 1 ? names[0] : names[1];
    // Add to the embed list.
    embed.fields.push(
        {
            name: name,
            value: result.join(', '),
            inline: true
        }
    );
}

/**
 * Apply the tags.
 */
function applyOtherTags(tags, filetags, embed) {
    let skipTags = [
        'length', 'platform', 'category', 'feature'
    ];
    console.log(skipTags, tags);
    for (var name in tags) {
        if (skipTags.indexOf(name) > -1) {
            continue;
        }
        var cur = null;
        for (var tag in tags[name]) {
            if (tag[1] == '0' || tag[1] == '1') {
                continue;
            }
            tag = parseInt(tag);
            if (filetags.indexOf(tag) > -1) {
                cur = tags[name][tag];
            }
        }
        if (cur !== null) {
            embed.fields.push({ name: name, value: cur });
        }
    }
}

/**
 * Update the cache, this calls the Nimja Hypnosis site to get all the file data.
 */
function updateCache() {
    const getJSON = bent('json')
    getJSON('https://hypno.nimja.com/app').then((data) => {
        cache = data;
        parseCacheForSearchAndLookup();
    });
}

/**
 * Compile the search text, and create a lookup for ID to index.
 */
function parseCacheForSearchAndLookup() {
    let indexes = {};
    for (var i in cache.content.files) {
        var file = cache.content.files[i];
        var search = file.name; // + ' ' + file.description + ' ' + file.intended;
        file.search = search.toLowerCase();
        indexes[file.id] = i;
    }
    cache.indexes = indexes;
}