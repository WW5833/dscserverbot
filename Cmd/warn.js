const Discord = require("discord.js");
const config = require("../botsettings.json");
const logs = require("../utils/logs.js");
const errors = require("../utils/errors.js");
const mysql = require("mysql");
const warn = require("../utils/warn.js");

module.exports.run = async (bot, message, args, x, con) => {

    if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPermission(message, "MANAGE_MESSAGES")

    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    if(!wUser) return errors.noUser(message, "warn");
    if(wUser.id === message.author.id) return message.channel.send("Nie możesz dać samemu sobie warna :/")
    //if(wUser.highestRole.position >= message.member.highestRole.position) return message.channel.send("You cannot mute member that is higher or has the same role as you.")

    let reason = args.join(" ").slice(22);

    if(!reason)
    {
        reason = `Brak powodu.`
    }

    warn.warn(message,wUser,reason,message.channel,con);
}

module.exports.help = {
    name: "Warn",
    command: "warn",
    description: "Służy do nadawania ostrzeżeń dla użytkowników",
    usage: config.prefix+"warn [użytkownik] (powód)"
}