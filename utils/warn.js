const Discord = require("discord.js");
const fs = require("fs");
const time = require("moment");
let config = require("../botsettings.json");
const mysql = require("mysql");

module.exports.warn = (message, user, reason,channel,con,server) => {
    if(server == null) 
    {
        con.query(`SELECT * FROM warns WHERE did = '${user.id}'`, (err, rows) =>{
            if(err) throw err;
        
            let sql;
            //sql = `INSERT INTO mutes(did, reason) VALUES (${toMute.id}, ${mysql.escape(reason)})`
            sql = `INSERT INTO warns(did, reason,  mid) VALUES (${user.id}, ${mysql.escape(reason)},  ${mysql.escape(message.author.id)})`   //${mysql.escape(toMute.user.username + "#" + toMute.user.discriminator)}
            con.query(sql)
                
            console.log(rows.length + `Warn uzytkownika (${user.id}) zapisany w bazie danych!`)
        });
        let cid = -1;
        con.query(`SELECT MAX(id) FROM warns WHERE did = ${user.id}`, (err, rows) =>{
            if(err) throw err;
            cid = (JSON.parse(JSON.stringify(rows)));
            cid = (cid[0]['MAX(id)']);
    
            setTimeout(function() {
                let warnembed = new Discord.RichEmbed()
                .setAuthor("Warn | " + `#${cid}`)
                .setColor(config.colors.warn)
                .addField("User", `${user} z ID: ${user.id}`)
                .addField("Ostrzegający", `<@${message.author.id}> z ID: ${message.author.id}`)
                .addField("Powód", reason)
                .addField("Nadano w", message.channel) 
                .addField("Data", message.createdAt)
                .setTimestamp();
                
                message.channel.send(warnembed);
            },2000)
        });
        setTimeout(function() {
            con.query(`SELECT count(id) AS ilosc FROM warns WHERE did = ${user.id}`, (err, rows) =>{
                if(err) throw err;
                console.log()
                setTimeout(function() {
                    time.locale("pl");
                    message.guild.channels.get(config.warns).send(`:warning: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${user} has been warned on channel ${channel}. Total warns now: `+ rows[0].ilosc+ " | " + message.author.tag + "\n**Reason:** ```\n" + `${reason}` + "```");
                },2000);
            });
        },1000);
    }
    else 
    {
        con.query(`SELECT * FROM warns WHERE did = '${user.id}'`, (err, rows) =>{
            if(err) throw err;
        
            let sql;
            //sql = `INSERT INTO mutes(did, reason) VALUES (${toMute.id}, ${mysql.escape(reason)})`
            sql = `INSERT INTO warns(did, reason,  mid) VALUES (${user.id}, ${mysql.escape(reason)},  ${mysql.escape(server)})`   //${mysql.escape(toMute.user.username + "#" + toMute.user.discriminator)}
            con.query(sql)
                
            console.log(rows.length + `Warn uzytkownika (${user.id}) zapisany w bazie danych!`)
        });
        let cid = 0;
        con.query(`SELECT MAX(id) FROM warns WHERE did = ${user.id}`, (err, rows) =>{
            if(err) throw err;
            cid = (JSON.parse(JSON.stringify(rows)));
            cid = (cid[0]['MAX(id)']);
    
            setTimeout(function() {
                let warnembed = new Discord.RichEmbed()
                .setAuthor("Warn | " + `#${cid}`)
                .setColor(config.colors.warn)
                .addField("User", `${user} z ID: ${user.id}`)
                .addField("Ostrzegający", `<@${message.author.id}> z ID: ${message.author.id}`)
                .addField("Powód", reason)
                .addField("Nadano w", message.channel) 
                .addField("Data", message.createdAt)
                .setTimestamp();
                
                message.channel.send(warnembed);
            },2000);
        });
        setTimeout(function() {
            con.query(`SELECT count(id) AS ilosc FROM warns WHERE did = ${user.id}`, (err, rows) =>{
                if(err) throw err;
                console.log()
                setTimeout(function() {
                    time.locale("pl");
                    message.guild.channels.get(config.warns).send(`:warning: `+ "`"+ `${time().format('LTS')}` + "`" + ` ${user} został ostrzeżony na kanale ${channel}. Obecna ilośc ostrzeżeń: `+ rows[0].ilosc+ " | " + `(SYSTEM)${server}` + "\n**Powód:** ```\n" + `${reason}` + "```");
                },2000);
            });
        },1000); 
    }
}