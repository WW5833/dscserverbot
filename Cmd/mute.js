const Discord = require("discord.js");
const config = require("../botsettings.json");
const logs = require("../utils/logs.js");
const errors = require("../utils/errors.js");
const mysql = require("mysql");

module.exports.run = async (bot, message, args, x, con) => {

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPermission(message, "MANAGE_MESSAGES");

    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!wUser) return errors.missingUser(message, "mute",exports.help.usage,exports.help.description);
    if(wUser.id === message.author.id) return message.channel.send("Nie możesz sam siebie wyciszyć :/");
    if(wUser.highestRole.position >= message.member.highestRole.position) return errors.uError(message,"Nie możesz zmutować użytkownika który ma wyższą lub tą samą rolę co ty.",exports.help.usage);
    if(!args[1]) return errors.missingParameters(message, "mute",exports.help.usage,exports.help.description,"duration");

    let reason = "";
    for (let index = 2; index < args.length; index++) {
        const element = args[index];
        reason = reason + " "+element;
        
    }
    if(wUser.roles.get(message.guild.roles.get(config.mutedrole)) != null) return message.channel.send("Ten użytkonik jest już wyciszony.");
    if(!reason)
    {
        reason = `Brak powodu.`;
    }

    if(args[1] == "perm") {
        logs.mute(message,wUser,reason);
    } else {
        var long = -1;
        if(args[1].substring(args[1].length-1,args[1].length) == "m") {
            logs.tmute(message,wUser,reason,args[1].substring(0,args[1].length-1),args[1].substring(0,args[1].length-1)==1?"minuta":"minut");
            var text = args[1].substring(0,args[1].length-1);
            long = parseInt(text, 10);
        } else if(args[1].substring(args[1].length-1,args[1].length) == "h") {
            logs.tmute(message,wUser,reason,args[1].substring(0,args[1].length-1),args[1].substring(0,args[1].length-1)==1?"godzia":"godziny");
            var text = args[1].substring(0,args[1].length-1);
            long = parseInt(text, 10)*60;
        } else if(args[1].substring(args[1].length-1,args[1].length) == "d") {
            logs.tmute(message,wUser,reason,args[1].substring(0,args[1].length-1),args[1].substring(0,args[1].length-1)==1?"dzień":"dni");
            var text = args[1].substring(0,args[1].length-1);
            long = parseInt(text, 10)*60*24;
        } else {
            if(!args[1]) return errors.missingParameters(message, "mute",exports.help.usage,exports.help.description,"duration");
        }
        if(long != -1) {
            console.log(long);
            setTimeout(() => {
                if(wUser.roles.get(message.guild.roles.get(config.mutedrole)) != null) {
                    wUser.removeRole(message.guild.roles.get(config.mutedrole),"unmute:Czas minął");
                    logs.unmute(message,wUser,"Czas minął");
                } else {
                    console.log("Użytkownik nie jest już wyciszony|"+wUser.user.tag);
                }
            },1000*60*long);
        } else {
            console.warn("Wrong mute duration");
        }
    }
    wUser.addRole(message.guild.roles.get(config.mutedrole),"mute:"+reason);
    console.log("User muted|"+wUser.user.tag+"|"+reason);
    let warnembed = new Discord.RichEmbed()
        .setAuthor("Mute")
        .setColor(config.colors.mute)
        .addField("User", `${wUser} z ID: ${wUser.id}`)
        .addField("Wyciszający", `<@${message.author.id}> z ID: ${message.author.id}`)
        .addField("Długość",args[1])
        .addField("Powód", reason)
        .addField("Data", message.createdAt)
        .setTimestamp();
        
        message.channel.send(warnembed);

}

module.exports.help = {
    name: "Mute",
    command: "mute",
    description: "Służy do wyciszania użytkowników dla użytkowników",
    usage: config.prefix+"mute [użytkownik] [czas(np 1m=1 minuta/1h = 1 godzina/1d = 1 dzień)]/perm (powód)"
}