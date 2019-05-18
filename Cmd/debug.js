const Discord = require("discord.js");
const error = require("../utils/errors.js");
const mysql = require("mysql");
module.exports.run = async(bot,message,args,x,con) => {
    switch(args[0]) {
        case"reaction":{
            const collector = await message.awaitReactions((reaction,user) => !user.bot,{max: 1,time:60000});
            message.reactions.forEach(reaction => {
                message.channel.send("ID:"+reaction.emoji.id+" || Name:"+reaction.emoji.name).catch(err => console.warn("(ERROR)"+err));
            });
            break;
        }

        case"user":{
            if(!message.mentions.members.first()) return error.uError(message,"No user","debug user [user]");
            message.channel.send("Seleced user id:"+message.mentions.members.first().id);
            break;
        }
        
        case"channel":{
            if(!args[1]) return error.uError(message,"No channel","debug channel [channel]");
            bot.channels.forEach(channel => {
                if(channel == args[1]) {
                    message.channel.send("Seleced channel id:"+channel.id);
                }
            });
            
            break;
        }

        case"role":{
            if(!args[1]) return error.uError(message,"No role","debug role [role]");
            message.guild.roles.forEach(role => {
                if(role == args[1]) {
                    message.channel.send("Seleced role id:"+role.id);
                }
            });
            
            break;
        }

        case"sql":{
            //if(!args[1]) return error.uError(message,"No table","debug sql [table]");
            con.query(`SELECT * FROM quotes`,(err,rows) => {
                if(err) throw err;
                if(!rows[0]) return message.channel.send("table is none");
                message.channel.send(rows[0].statusmessageId+"");
            });
            
            break;
        }
    }
}

module.exports.help = {
    name:"debug",
    usage:"debug",
    command:"debug",
    type:"command"
}