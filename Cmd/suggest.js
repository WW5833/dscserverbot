const Discord = require("discord.js");
const config = require("../botsettings.json");

module.exports.run = async (bot, message, args) => {
    let suggestion = new Object({ title: {}, summary: {} })
    let requestTitle = () => { return request(message, suggestion.title, `Tytuł`, avgTimeToType(64), 256) }
    requestTitle().then(async () => {
        request(message, suggestion.summary, `Opis`, avgTimeToType(192), 1024).then(() => {
            var embed = new Discord.RichEmbed()
            .setAuthor("Sugestia")
            .addField("Tytuł",suggestion.title.contents)
            .addField("Opis",suggestion.summary.contents)
            .setColor(config.colors.sugestia)
            .setFooter(message.author.tag)
            message.guild.channels.get(config.suggestie).send(embed).then(async(suggestion) => {
                message.channel.send("Zrobione");
                suggestion.react(`⬆`).then(() => suggestion.react(`⬇`));
            });
        });
    });        
}

module.exports.help = {
    name: "Suggest",
    command: "suggest",
    description: "SUGGEST",
    usage: config.prefix+"suggest"
}

function avgTimeToType(characters, avgCPM) { characters / (avgCPM || 190) * 60000 }
function request(message, assign, inquiry, timeLimit, characterLimit, ignoreInquiry) {
    ignoreInquiry || inquiry && message.channel.send(`${inquiry}?`)
    return new Promise((resolve, reject) => {
        message.channel.awaitMessages(m => m.author.id === message.author.id, {
            max: 1, time: timeLimit, errors: [`time`]
        }).then(responses => {
            const response = responses.first()
            if (response.content === `cancel` || response.content === `anuluj`) {
                reject(`Tworzenie sugesti anulowane.`); return
            }
            if (response.content.length > characterLimit) {
                message.channel.send(`${inquiry} może maksymalnie mieć ${characterLimit} znaków.`)
                request(message, assign, inquiry, timeLimit, characterLimit, true).then(
                    responses => resolve(responses),
                    reason => reject(reason)
                )
            } else {
                (response.content === `null`) ? assign.contents = null : assign.contents = response.content
                if (response.attachments.first()) { assign.attached = response.attachments.first().url }
                resolve(responses)
            }
        }, () => {
            reject(`Tworzenie sugesti anulowane: Nie zmieszczono się w czasie.`)
        })
    })
}