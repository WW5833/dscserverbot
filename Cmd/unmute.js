const Discord = require("discord.js");
const config = require("../botsettings.json");
const logs = require("../utils/logs.js");
const errors = require("../utils/errors.js");
const mysql = require("mysql");

module.exports.run = async (bot, message, args, x, con) => {

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPermission(message, "MANAGE_MESSAGES")

    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!wUser) return errors.missingUser(message, "unmute",exports.help.usage,exports.help.description);
    if(wUser.id === message.author.id) return message.channel.send("Nie możesz sam siebie odciszyć :/");
    if(wUser.highestRole.position >= message.member.highestRole.position) return message.channel.send("Nie możesz odciszyć użytkownika który ma wyższą lub tą samą rolę co ty.");

    let reason = args.join(" ").slice(22);

    if(!reason)
    {
        reason = `Brak powodu.`;
    }
    if(wUser.roles.get(config.mutedrole) != null) {
        wUser.removeRole(message.guild.roles.get(config.mutedrole),"unmute:"+reason);
        logs.unmute(message,wUser,reason);

        console.log("User unmuted|"+wUser.user.tag+"|"+reason);
        let warnembed = new Discord.RichEmbed()
            .setAuthor("UnMute")
            .setColor(config.colors.unmute)
            .addField("User", `${wUser} z ID: ${wUser.id}`)
            .addField("Odciszający", `<@${message.author.id}> z ID: ${message.author.id}`)
            .addField("Powód", reason)
            .addField("Data", message.createdAt)
            .setTimestamp();
            
            message.channel.send(warnembed);
    } else {
        console.log(wUser.roles.get(message.guild.roles.get(config.mutedrole)));
        message.channel.send("Użytkownik nie jest wyciszony!");
    }
}

module.exports.help = {
    name: "UnMute",
    command: "unmute",
    description: "Służy do odciszania użytkowników dla użytkowników",
    usage: config.prefix+"unmute [użytkownik] (powód)"
}