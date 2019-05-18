const Discord = require("discord.js");
const config = require("../botsettings.json");
const logs = require("../utils/logs.js");
const errors = require("../utils/errors.js");
const time = require("moment");

module.exports.run = async (bot, message, args, x, con) => {
try{
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPermission(message, "MANAGE_MESSAGES");

    if(!args[0]) return errors.missingParameters(message,"purge",exports.help.usage,exports.help.description,"message count");
    if(parseInt(args[0],"10") >= 100 || parseInt(args[0],"10") < 1 || !parseInt(args[0],"10")) return errors.uError(message,"You can't purge more than 99 messages at time.",exports.help.usage);
    const fetched = await message.channel.fetchMessages({limit: parseInt(args[0],"10")+1});
    message.channel.bulkDelete(fetched).catch(error => message.channel.send(`Couldn't delete messages because of: ${error}`));
    time.locale("pl");
    message.guild.channels.get(bot.config.logs).send(`:wastebasket: `+ "`"+ `${time().format('LTS')}` + "`" + ` `+parseInt(args[0],"10")+` wiadomości zostało usuniętych.`);
    
}catch(e){
    console.log("AN UNEXPECTED ERROR OCCURED (PURGE): " + e)
    try{
        message.channel.send("A͖̻͉Ń͕ U͓̩͜N̫͚̠E̤̩͎X̫̳͡P̬͕̘E̮̱ͅC͍͘T̮͝E͠D͚̩̰ E̹̜̩R̛͕͍R̼̞ͅO̺̦͟R̘̦̼ O̺̯̫C̨̱͕C͓̳͠U͝R̝̟̺Ḙ̸͍D͙:"+ "\n```PURGE: " + e + "```")
    }catch(e){
        console.log("PURGE: COULDN'T SEND ERROR MESSAGE")
    } 
  }
}

module.exports.help = {
    name: "Purge",
    command: "purge",
    description: "Służy do masowego usuwania wiadomości.",
    usage: config.prefix+"purge [ilość wiadomości(od 1 do 99)]"
}