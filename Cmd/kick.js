const Discord = require("discord.js");
const config = require("../botsettings.json");
const logs = require("../utils/logs.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args, x, con) => {//https://discord.gg/HdQmAs

    if(!message.member.hasPermission("BAN_MEMBERS")) return errors.noPermission(message, "BAN_MEMBERS");

    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!wUser) return errors.missingUser(message, "kick",exports.help.usage,exports.help.description);
    if(wUser.id === message.author.id) return message.channel.send("Nie możesz wyrzucić samego siebie :/");
    if(wUser.highestRole.position >= message.member.highestRole.position) return message.channel.send("Nie możesz wyrzucić użytkownika z wyższą lub tą samą rolą co ty.");

    let reason = args.join(" ").slice(22);

    if(!reason)
    {
        reason = `Brak powodu.`;
    }
    if(wUser.kickable) {
        wUser.kick(reason).then(() =>{
            console.log("User kicked|"+wUser.user.tag+"|"+reason);
            let warnembed = new Discord.RichEmbed()
                .setAuthor("Kick")
                .setColor(config.colors.kick)
                .addField("User", `${wUser} z ID: ${wUser.id}`)
                .addField("Wyrzucający", `<@${message.author.id}> z ID: ${message.author.id}`)
                .addField("Powód", reason)
                .addField("Data", message.createdAt)
                .setTimestamp();
                
                message.channel.send(warnembed);
                logs.kick(message,message.member,reason);
        }).catch(err => console.error(err));
        
    } else {
        message.channel.send("Bot nie ma uprawnień by wyrzucić tego użytkownika");
    }
    
}

module.exports.help = {
    name: "Kick",
    command: "kick",
    description: "Służy do wyrzucania użytkowników z serwera.",
    usage: config.prefix+"kick [użytkownik] (powód)"
}