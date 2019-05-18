const Discord = require("discord.js");
const fs = require("fs");
let config = require("../botsettings.json")

module.exports.noPermission = (message, perm) => {
    let embed = new Discord.RichEmbed()
        .setAuthor("You have no power here " + message.author.username + " the Grey!", message.guild.iconURL)
        .setColor(config.red)
        .addField("Insufficient permissions!", perm)
        .setFooter(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp()
        message.channel.send({embed: embed});
}

module.exports.Unknown = (message,usage) => {
    message.channel.send("`Unknown command`");
    message.channel.send("```"+usage+"```");
}

module.exports.uError = (message,error,usage) => {
    message.channel.send("`"+error+"`");
    message.channel.send("```"+usage+"```");
}

module.exports.noRoles = (message, roles) => {
    let embed = new Discord.RichEmbed()
        .setAuthor("You have no power here " + message.author.username + " the Grey!", message.guild.iconURL)
        .setColor(config.red)
        .addField("Only this roles can execute this command:", roles)
        .setFooter(message.author.tag, message.author.displayAvatarURL)
        .setTimestamp()
        message.channel.send({embed: embed});
}

module.exports.missingUser = (message, name, usage, description) => {
    
    message.channel.send("`You did not specify a user mention or ID!`");
    message.channel.send("```md" + `\n#${name}` + "\n\nCorrect format: "+ `\n\n ${usage}` + `\n\n${description}` + "```")

}

module.exports.missingParameters = (message, name, usage, description, parameters) => {
    message.channel.send("`Missing parameters: " + `${parameters}` +"`");
    message.channel.send("```md" + `\n#${name}` + "\n\nCorrect format: "+ `\n\n ${usage}` + `\n\n${description}` + "```")

}
module.exports.noUser = (message, command) => {
    
        message.channel.send("`You did not specify a user mention or ID!`");

        if(command === "mute")
        {
            message.channel.send("```Correct format:\n  !mute <User> [reason]```")
        }
        if(command === "warn")
        {
            message.channel.send("```Correct format:\n  !warn <User> [Reason]```")
        }
        if(command === "advert"){
            message.channel.send(("```Correct format:\n  !advertise <User>\n\nLet someone advertise on #advertisment.```"))
        }
}

module.exports.noSteamid = (message) => {
    
    message.channel.send("`You did not specify a SteamID64 (17 numbers)!`");
    message.channel.send("```Correct format:\n  !stats <SteamID>\nYou can check your SteamID64 here: https://steamid.io```")

}
module.exports.noSteamlink = (message) => {
    
    message.channel.send("`You did not specify a correct link!`");
    message.channel.send("```Correct format:\n  !steamid <URL>\nExample URL: https://steamcommunity.com/id/Example```")

}

module.exports.noScp = (message) => {
    
    message.channel.send("`You did not specify a correct SCP Number!`");
    message.channel.send("```Correct format:\n  !scp <Number>```")

}

module.exports.noData = (message) => {
    
    message.channel.send("`You do not exist in our database or provided wrong SteamID64!`");

}

module.exports.noQuestion = (message) => {
    
    message.channel.send("`You didn't ask a question!`");
    message.channel.send("```Correct format:\n  !ask <Question>\nMake sure it's longer than two words.```")

}

module.exports.noGame = (message) => {
    
    message.channel.send("`You didn't specify correct game!`");
    message.channel.send("```Correct format:\n  !status <Game>\nAvailable for games:\n  - SCP:SL```")

}
