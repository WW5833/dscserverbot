const Discord = require("discord.js");
const time = require("moment");

module.exports.run = async(bot) => {

    bot.on("channelCreate",(channel)=>{
        time.locale("pl")
        //if(guild == null) return console.log("(logs/logs.js)Failed to find guild!");
        channel.guild.channels.get(bot.config.logs).send(`:wrench: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${channel} został stworzony.`);
    });

    bot.on("channelDelete",(channel)=>{
        time.locale("pl")
        channel.guild.channels.get(bot.config.logs).send(`:wrench: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${channel.name} został usunięty.`);
    });

    bot.on("channelUpdate",(oldchannel,newChannel)=>{
        time.locale("pl");
        if(newChannel.id == bot.config.statsChannels.all || newChannel.id == bot.config.statsChannels.users || newChannel.id == bot.config.statsChannels.bots) return;
        newChannel.guild.channels.get(bot.config.logs).send(`:wrench: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${newChannel.name} został zmodyfikowany.`);
    });

    bot.on("guildBanAdd",(guild,user)=>{
        time.locale("pl")
        guild.channels.get(bot.config.logs).send(`:no_entry_sign: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${user.tag} został zbanowany.`);
    });

    bot.on("guildBanRemove",(guild,user)=>{
        time.locale("pl")
        guild.channels.get(bot.config.logs).send(`:wrench: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${user.tag} został odbanowany.`);
    });

    bot.on("guildMemberAdd",(member)=>{
        time.locale("pl")
        member.guild.channels.get(bot.config.logs).send(`:inbox_tray: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${member.tag} dołączył.`);
    });

    bot.on("guildMemberRemove",(member)=>{
        time.locale("pl")
        member.guild.channels.get(bot.config.logs).send(`:outbox_tray: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${member.tag} opuścił serwer.`);
    });

    bot.on("guildMemberUpdate",(oldmember,newmember)=>{
        time.locale("pl");
        oldmember.roles.forEach(orole => {
            if(newmember.roles.get(orole.id) == null) {
                newmember.guild.channels.get(bot.config.logs).send(`:tools: `+ "`"+ `${time().format('LTS')}` + "`" + `Role gracza ${newmember.user.tag} zostały zmodyfikowane. Usunięto rolę:${orole.name}`);
            }
        });
        newmember.roles.forEach(nrole => {
            if(oldmember.roles.get(nrole.id) == null) {
                newmember.guild.channels.get(bot.config.logs).send(`:tools: `+ "`"+ `${time().format('LTS')}` + "`" + `Role gracza ${newmember.user.tag} zostały zmodyfikowane. Dodano rolę:${nrole.name}`);
            }
        });
        if(oldmember.nickname != newmember.nickname) 
        {
            newmember.guild.channels.get(bot.config.logs).send(`:tools: `+ "`"+ `${time().format('LTS')}` + "`" + `Nick gracza ${newmember.user.tag} został zmodyfikowany z ${oldmember.nickname==null?oldmember.user.username:oldmember.nickname} na ${newmember.nickname==null?newmember.user.username:newmember.nickname}.`);
        }
    });

    bot.on("messageDelete",(message)=>{
        time.locale("pl")
        message.guild.channels.get(bot.config.logs).send(`:wastebasket: `+ "`"+ `${time().format('LTS')}` + "`" + ` Wiadomość ${message.member.user.tag} została usunięta. Zawartość:`+"`"+`${message.content}`+"`.");
    });

    bot.on("messageUpdate",(oldmessage,newmessage)=>{
        time.locale("pl")
        newmessage.guild.channels.get(bot.config.logs).send(`:wastebasket: `+ "`"+ `${time().format('LTS')}` + "`" + ` Wiadomość ${newmessage.member.user.tag} została edytowana z `+"`"+`${oldmessage.content}`+"` na `"+`${newmessage.content}`+"`.");
    });

    /*bot.on("messageDeleteBulk",(messages)=>{
        time.locale("pl")
        messages.first().guild.channels.get(bot.config.logs).send(`:wastebasket: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${messages.array.length} wiadomości zostało usuniętych.`);
    });*/
}