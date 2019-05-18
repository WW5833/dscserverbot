const Discord = require("discord.js");
const config = require("../botsettings.json");
const logs = require("../utils/logs.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args, x, con) => {

    if(!message.member.hasPermission("KICK_MEMBERS")) return errors.noPermission(message, "KICK_MEMBERS");

    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!wUser) return errors.missingUser(message, "kick",exports.help.usage,exports.help.description);
    if(wUser.id === message.author.id) return message.channel.send("Nie możesz wyrzucić samego siebie :/");
    if(wUser.highestRole.position >= message.member.highestRole.position) return message.channel.send("Nie możesz wyrzucić użytkownika z wyższą lub tą samą rolą co ty.");

    let reason = args.join(" ").slice(22);

    if(!reason)
    {
        reason = `Brak powodu.`;
    }
    if(wUser.bannable) {
        wUser.ban(reason).then(() =>{
            console.log("User banned|"+wUser.user.tag+"|"+reason+"|"+message.member.tag);
            let warnembed = new Discord.RichEmbed()
                .setAuthor("Ban")
                .setColor(config.colors.ban)
                .addField("User", `${wUser} z ID: ${wUser.id}`)
                .addField("Banujący", `<@${message.author.id}> z ID: ${message.author.id}`)
                .addField("Powód", reason)
                .addField("Data", message.createdAt)
                .setTimestamp();
                
                message.channel.send(warnembed);
                logs.ban(message,message.member,reason);
        }).catch(err => console.error(err));
        
    } else {
        message.channel.send("Bot nie ma uprawnień by wyrzucić tego użytkownika");
    }
    
}

module.exports.help = {
    name: "Ban",
    command: "ban",
    description: "Służy do banowania użytkowników z serwera.",
    usage: config.prefix+"ban [użytkownik] (powód)"
}