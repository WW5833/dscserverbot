const Discord = require("discord.js");

module.exports.run = async(bot,message,args) => {
    message.channel.send(args.join(" ")).catch(err => {});
    message.delete().catch(err => {});
}

module.exports.help = {
    name:"say",
    type:"command"
}