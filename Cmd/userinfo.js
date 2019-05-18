const Discord = require("discord.js")



module.exports.run = async (bot, message, args) => {
try{


    var Status = {
        "online": "Online",
        "idle": "Idle",
        "dnd": "DND",
        "streaming": "Streaming",
        "offline": "Offline or Invisible"
    };

    let target = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])

    if(!target){
        var millisCreated = new Date().getTime() - (message.mentions.users.first() || message.author).createdAt.getTime();
        var millisCreated2 = new Date().getTime() - (message.mentions.members.first() || message.member).joinedAt.getTime();
        
        var daysCreated = millisCreated / 1000 / 60 / 60 / 24;
        var daysCreated2 = millisCreated2 / 1000 / 60 / 60 / 24;
    let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL)
        .setDescription("User's info")
        .setColor("#00FFFF")
        .setFooter("User ID: " + message.author.id)
        .addField("Full Username", `${message.author.username}#${message.author.discriminator}`)
        .addField("Now playing", (message.mentions.users.first() || message.author).presence.game ? (message.mentions.users.first() || message.author).presence.game.name : 'None',true)
        .addField("Status", Status[message.mentions.users.first() || message.author.presence.status], true)
        .addField("Created At", `${((message.mentions.users.first() || message.author).createdAt)} (That\'s ${daysCreated.toFixed(0)} days ago!)`)
        .addField("Joined At", `${((message.mentions.members.first() || message.member).joinedAt)} (That\'s ${daysCreated2.toFixed(0)} days ago!)`)
        .addField("Roles", (message.mentions.members.first() || message.member).roles.map(role => {
        if (role.name !== '@everyone') return role.name;
            return '';
        }).join(', ').substring(2), true);
        message.channel.send(embed);
        return;
    }
    else
    {
        var millisCreated = new Date().getTime() - target.user.createdAt.getTime();
        var millisCreated2 = new Date().getTime() - target.joinedAt.getTime();
        var daysCreated = millisCreated / 1000 / 60 / 60 / 24;
        var daysCreated2 = millisCreated2 / 1000 / 60 / 60 / 24;

        let embed = new Discord.RichEmbed()
        .setAuthor(target.user.username, target.user.displayAvatarURL)
        .setDescription("User's info")
        .setColor("#00FFFF")
        .setFooter("User ID: " + target.id)
        .addField("Full Username", `${target.user.username}#${target.user.discriminator}`)
        .addField("Now playing", (target).presence.game ? (target).presence.game.name : 'None',true)
        .addField("Status", Status[target.presence.status], true)
        .addField("Created At", `${(target.user.createdAt)} (That\'s ${daysCreated.toFixed(0)} days ago!)`)
        .addField("Joined At", `${(target.joinedAt)} (That\'s ${daysCreated2.toFixed(0)} days ago!)`)
        .addField("Roles", (target || message.member).roles.map(role => {
        if (role.name !== '@everyone') return role.name;
            return '';
        }).join(', ').substring(2), true)
        .setTimestamp();
        message.channel.send(embed);
        return;
    }
}catch(e){
    console.log("AN UNEXPECTED ERROR OCCURED (USERINFO): " + e)
    try{
        message.channel.send("A͖̻͉Ń͕ U͓̩͜N̫͚̠E̤̩͎X̫̳͡P̬͕̘E̮̱ͅC͍͘T̮͝E͠D͚̩̰ E̹̜̩R̛͕͍R̼̞ͅO̺̦͟R̘̦̼ O̺̯̫C̨̱͕C͓̳͠U͝R̝̟̺Ḙ̸͍D͙:"+ "\n```USERINFO: " + e + "```")
    }catch(e){
        console.log("USERINFO: COULDN'T SEND ERROR MESSAGE")
    } 
}
}

module.exports.help = {
    name: "Userinfo",
    command: "userinfo",
    description: "Show user information",
    usage: "!userinfo"
}