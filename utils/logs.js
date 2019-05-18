const Discord = require("discord.js");
const fs = require("fs");
const time = require("moment")
let config = require("../botsettings.json")

module.exports.mute = (message, user, reason) => {
    time.locale("pl")
    message.guild.channels.get(config.warns).send(`:mute: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${user} został **pernamentnie** wyciszony.`+ " | " + message.author.tag + "\n**Powód:** ```\n" + `${reason}` + "```");
}

module.exports.tmute = (message, user, reason, duration, type) => {
    time.locale("pl")
    message.guild.channels.get(config.warns).send(`:mute: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${user} został wyciszony na **` + duration + type + `**.`+ " | " + message.author.tag + "\n**Powód:** ```\n" + `${reason}` + "```");
}

module.exports.kick = (message, user, reason) => {
    time.locale("pl")
    message.guild.channels.get(config.warns).send(`:x: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${user} został **wyrzucony**.`+ " | " + message.author.tag + "\n**Powód:** ```\n" + `${reason}` + "```");
}

module.exports.ban = (message, user, reason) => {
    time.locale("pl")
    message.guild.channels.get(config.warns).send(`:no_entry_sign:  `+ "`"+ `${time().format('LTS')}` + "`" + ` ${user} został **zbanowany**.`+ " | " + message.author.tag + "\n**Powód:** ```\n" + `${reason}` + "```");
}

module.exports.unmute = (message, user, reason) => {
    time.locale("pl")
    if(!reason)
    {
        reason = "Brak powodu.";
    }
    //message.guild.channels.get(config.warns).send(`:no_mouth: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${user} has been umuted.`+ " | " + message.author.tag + "\n**Unmute Reason:** ```\n" + `${reason}` + "```");
    message.guild.channels.get(config.warns).send(`:sound: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${user} został odciszony.`+ " | " + message.author.tag + "\n**Powód:** ```\n" + `${reason}` + "```");
}