const Discord = require("discord.js");
const mysql = require("mysql");
const error = require("../utils/errors.js");
//ALTER TABLE `quotes` ADD COLUMN `statusmessageId` VARCHAR(50) NULL AFTER `acceptorId`;

module.exports.run = async(bot,message,args,x,conn) => {
    var con = conn;

    //#region Config
    var channel_id = "550690109163307023"; //Quote channel id
    const Accept_perm = "MANAGE_MESSAGES"; //Accept/Deny permission
    const AutoAccept_perm = "MANAGE_MESSAGES"; //Auto Accept permission
    const OVRemove_perm = "ADMINISTRATOR"; //Remove others quote permission
    //#endregion
    /*if(message.guild.name == "test")*/ //var channel_id = "555776027104903188";
    bot.UC = null;
    var UC = new Object();
    if(!bot) {
        var bot = "";
        UC.run = async(bot,message,args,error,usage,opctions) => {
            message.channel.send(error).catch(err => console.error("UC(quote) ERROR REPORT: "+err));
            if(!opctions) {
                message.channel.send("```Correct fromat:\n"+"!"+usage+"\n```").catch(err => console.error("UC(quote) ERROR REPORT: "+err));
            } else {
                message.channel.send("```Correct fromat:\n"+"!"+usage+"\n\n"+opctions+"```").catch(err => console.error("UC(quote) ERROR REPORT: "+err));
            }
        }
    } else {
        if(!bot.UC) {
            UC.run = async(bot,message,args,error,usage,opctions) => {
                message.channel.send(error).catch(err => console.error("UC(quote) ERROR REPORT: "+err));
                if(!opctions) {
                    message.channel.send("```Correct fromat:\n"+"!"+usage+"\n```").catch(err => console.error("UC(quote) ERROR REPORT: "+err));
                } else {
                    message.channel.send("```Correct fromat:\n"+"!"+usage+"\n\n"+opctions+"```").catch(err => console.error("UC(quote) ERROR REPORT: "+err));
                }
            }
        } else {
            UC = bot.UC;
            //console.log("Detected UC override");
        }
    }
    //if(args[1].includes("--") || args[2].includes("--") || args[1].includes("'") || args[2].includes("'") || args[1].includes(";") || args[2].includes(";")) return UC.run(bot,message,args,"You can't use '--', ';' or ''' in name or content of you quote","quote submit [name] [content]",null,true);
    if(!args[0]) {
        return UC.run(bot,message,args,"Unknown Command",exports.help.usage,"Types:\nsubmit\nremove\nlist\nQuote name, example: !quote Diana Output: SŁUCHAM?");
    } else {
        switch(args[0]) {
            case"submit": {
                if(!args[1]) {
                    return error.uError(message,"You did not specify a name","quote submit [name] [content]");
                } else {
                    var content = args.slice(2).join(" ");

                    if(content == "") return error.uError(message,"You did not specify a content","quote submit [name] [content]");
                    if(args[1] == "list" || args[1] == "submit" || args[1] == "remove" || args[1] == "deny" || args[1] == "accept") return error.uError(message,"This quote name is already in-use","quote submit [name] [content]");
                    var sql = `SELECT * FROM quotes WHERE name = ${mysql.escape(args[1])};`;
                    con.query(sql,(err,rows) => {
                        if(err) throw err;
                        if(rows.length >= 1 && rows[0]) return error.uError(message,args,"This quote name is already in-use","quote submit [name] [content]");
                        
                        var tb1 = message.member.hasPermission(AutoAccept_perm);
                        if(tb1) {
                            message.channel.send("Done. You have a accept permissions so quote was automatically accepted.");
                            var sql = `INSERT INTO quotes(content,userId,name,accepted) VALUE(${mysql.escape(content)},${mysql.escape(message.member.id)},${mysql.escape(args[1].toLowerCase())},${mysql.escape(true)});`;
                            con.query(sql,err => {
                                if(err) throw err;
                                
                            });

                        } else {
                            
                            
                            var embed = new Discord.RichEmbed()
                            .setTitle("New Quote to check")
                            .setDescription("Say quote accept [name] or quote deny [name]")
                            .setColor("#0000FF")
                            .addField("User",message.member)
                            .addField("Name",args[1])
                            .addField("Content",content);
                            if(!bot) return message.channel.send("(DEBUG)!bot");
                            if(!bot.channels) return message.channel.send("(DEBUG)!bot.channels");
                            var nm;
                            bot.channels.forEach(async channel => {
                                if(channel.id == channel_id) {
                                    nm = await channel.send(embed);
                                    var sql = `INSERT INTO quotes(content,userId,name,accepted,statusmessageId) VALUE(${mysql.escape(content)},${mysql.escape(message.member.id)},${mysql.escape(args[1].toLowerCase())},${mysql.escape(false)},${mysql.escape(nm.id)});`;
                                    con.query(sql,err => {
                                        if(err) throw err;
                                        message.channel.send("Done. Now wait for admin to accept your quote.");
                                    });
                                }
                            });
                        } 
                    });
                }
                break;
            }

            case"remove": {
                if(!args[1]) {
                    return error.Unknown(message,"quote remove [name]");  
                } else {
                    var sql = `SELECT * FROM quotes WHERE name = ${mysql.escape(args[1])};`;
                    con.query(sql,(err,rows) => {
                        if(err) throw err;
                        if(rows.length == 0 || !rows[0]) return error.uError(message,"Quote not found","quote remove [name]");
                        
                        var crow;
                        rows.forEach(row => {
                            if(row.userId == message.member.user.id) {
                                crow = true;
                            }
                        });
                        if(!crow && args[2] != "-a" && args[2] != "-fd") {
                            return error.uError(message,"You can't remove not your quote","quote remove [name]");
                        } else if(args[2] == "-a"){
                            if(!message.member.hasPermission(OVRemove_perm)) return error.noPermission(message,OVRemove_perm);
                            sql = `DELETE FROM quotes WHERE name = ${mysql.escape(args[1])};`;
                            con.query(sql,err => {
                                if(err) throw err;
                                var admin = message.member;
                                message.channel.send("Done");
                                if(rows[0].statusmessageId != "") {
                                    bot.channels.forEach(channel => {
                                        if(channel.id == channel_id) {
                                            channel.messages.forEach(message => {
                                                if(message.id == rows[0].statusmessageId) {
                                                    var embed = new Discord.RichEmbed()
                                                    .setColor("000000")
                                                    .setTitle("Quote status")
                                                    .setDescription("This quote is removed by admin.")
                                                    .addField("Admin",admin)
                                                    .addField("User","<@"+rows[0].userId+">")
                                                    .addField("Name",rows[0].name)
                                                    .addField("Content",rows[0].content);
                                                    message.edit(embed);
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    console.log("NO SMID");
                                }
                            });
                        }else if(args[2] == "-fd") {
                            message.channel.send("Working");
                        } else {
                            var sql = `DELETE FROM quotes WHERE name = ${mysql.escape(args[1])} AND userId = ${mysql.escape(message.member.user.id)};`;
                            con.query(sql,err => {
                                if(err) throw err;
                                message.channel.send("Done");
                                if(rows[0].statusmessageId != "") {
                                    bot.channels.forEach(channel => {
                                        if(channel.id == channel_id) {
                                            channel.messages.forEach(message => {
                                                if(message.id == rows[0].statusmessageId) {
                                                    var embed = new Discord.RichEmbed()
                                                    .setColor("000000")
                                                    .setTitle("Quote status")
                                                    .setDescription("This quote is removed by user.")
                                                    .addField("User","<@"+rows[0].userId+">")
                                                    .addField("Name",rows[0].name)
                                                    .addField("Content",rows[0].content);
                                                    message.edit(embed);
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    console.log("NO SMID");
                                }
                            });
                        }
                        
                    });   
                }
                break;
            }

            case"accept": {
                if(!message.member.hasPermission(Accept_perm)) return error.noPermission(message,Accept_perm);
                if(args[1] == "" || args.length < 2) return error.uError(message,"You did not specify a name","queue accept [name]");
                con.query(`SELECT * FROM quotes WHERE name = ${mysql.escape(args[1])};`,(err,rows) => {
                    if(err) throw err;
                    if(rows.length == 0 || !rows[0]) return error.uError(message,"Quote does not exist","queue accept [name]");
                    var b1 = false;
                    rows.forEach(row => {
                        if(row.accepted == "1") return;
                        b1 = true;
                    });
                    if(b1) {
                        con.query(`UPDATE quotes SET accepted = true , acceptorId = ${mysql.escape(message.member.id)} WHERE name = ${mysql.escape(args[1])};`,err => {
                            if(err) throw err;
                            
                            message.channel.send("Quote accepted");
                            var admin = message.member;
                            if(rows[0].statusmessageId != "") {
                                bot.channels.forEach(channel => {
                                    if(channel.id == channel_id) {
                                        channel.messages.forEach(message => {
                                            if(message.id == rows[0].statusmessageId) {
                                                var embed = new Discord.RichEmbed()
                                                .setColor("00FF00")
                                                .setTitle("Quote status")
                                                .setDescription("This quote is accepted.")
                                                .addField("Admin",admin)
                                                .addField("User","<@"+rows[0].userId+">")
                                                .addField("Name",rows[0].name)
                                                .addField("Content",rows[0].content);
                                                message.edit(embed);
                                            }
                                        });
                                    }
                                });
                            } else {
                                console.log("NO SMID");
                            }
                        });
                    } else {
                        error.uError(message,"You can't accept accepted quote","quote accept [name]");
                    }
                });
                
                break;
            }

            case"deny": {
                if(!message.member.hasPermission(Accept_perm)) return error.noPermission(message,Accept_perm);
                if(args[1] == "" || args.length < 2) return error.uError(message,"You did not specify a name","queue deny [name]");
                con.query(`SELECT * FROM quotes WHERE name = ${mysql.escape(args[1])};`,(err,rows) => {
                    if(err) throw err;
                    if(rows.length == 0 || !rows[0]) return error.uError(message,"Quote does not exist","queue deny [name]");
                    var b1 = false;
                    rows.forEach(row => {
                        if(row.accepted == "1") return;
                        b1 = true;
                    });
                    if(b1) {
                        con.query(`DELETE FROM quotes WHERE name = ${mysql.escape(args[1])} && accepted = false;`,err => {
                            if(err) throw err;
                            message.channel.send("Quote denied");

                            var admin = message.member;
                            if(rows[0].statusmessageId != "") {
                                bot.channels.forEach(channel => {
                                    if(channel.id == channel_id) {
                                        channel.messages.forEach(message => {
                                            if(message.id == rows[0].statusmessageId) {
                                                console.log("#2");
                                                var embed = new Discord.RichEmbed()
                                                .setColor("FF0000")
                                                .setTitle("Quote status")
                                                .setDescription("This quote is denied.")
                                                .addField("Admin",admin)
                                                .addField("User","<@"+rows[0].userId+">")
                                                .addField("Name",rows[0].name)
                                                .addField("Content",rows[0].content);
                                                message.edit(embed);
                                            }
                                        });
                                    }
                                });
                            } else {
                                console.log("NO SMID");
                            }
                        });
                    } else {
                        error.uError(message,"You can't deny accepted quote","quote deny [name]");
                    }
                });
                break;
            }

            case"list": {
                con.query(`SELECT * FROM quotes WHERE accepted = true;`,(err,rows) => {
                    if(err) throw err;
                    if(rows.length == 0) return error.uError(message,"No quotes.","quote list");
                    if(!rows[0]) return error.uError(message,args,"No quotes.","quote list");
                    var ttxt = "Quotes list:\n";

                    var ti1 = 0;

                    rows.forEach(row => {
                        ti1++;
                        var authorId = row.userId;
                        var author;
                        bot.users.forEach(user => {
                            if(user.id == authorId) author = user.tag;
                        });
                        ttxt += ti1 + ". " + row.name+" **Author:** "+author + "\n";
                        
                    });
                    message.channel.send(ttxt);
                });
                break;
            }

            case"debug": {
                var b1 = false;
                b1 = message.member.hasPermission("ADMINISTRATOR");
                message.member.roles.forEach(role => {
                    if(role.name == "Owner" || role.name == "Developers") b1 = true;
                });
                if(!b1) return error.Unknown(message,exports.help.usage);
                message.channel.send("AP:"+Accept_perm);
                message.channel.send("AAP:"+AutoAccept_perm);
                message.channel.send("ORP:"+OVRemove_perm);
                if(args[1] != null) {
                    if(message.mentions.members.first() != null) {
                        console.log(message.mentions.members.first());
                        con.query(`SELECT * FROM quotes WHERE userId = ${mysql.escape(message.mentions.members.first().id)};`,(err,rows) => {
                            if(err) throw err;
                            if(rows.length == 0) return error.uError(message,"Unknown quote",exports.help.usage);
                            if(!rows[0]) return error.uError(message,"Unknown quote",exports.help.usage);
                            var embed = new Discord.RichEmbed();
                            embed.setTitle("DEBUG")
                            .addField("Accepted",rows[0].accepted)
                            .addField("Accepted by","<@"+rows[0].acceptorId+">")
                            .addField("Author","<@"+rows[0].userId+">")
                            .addField("name",rows[0].name)
                            .addField("content",rows[0].content)
                            .addField("Date",rows[0].date);
                            message.channel.send(embed);
                            
                        });
                    } else {
                        con.query(`SELECT * FROM quotes WHERE name = ${mysql.escape(args[1])};`,(err,rows) => {
                            if(err) throw err;
                            if(rows.length == 0) return error.uError(message,"Unknown quote",exports.help.usage);
                            if(!rows[0]) return error.uError(message,"Unknown quote",exports.help.usage);
                            var embed = new Discord.RichEmbed();
                            embed.setTitle("DEBUG")
                            .addField("Accepted",rows[0].accepted)
                            .addField("Accepted by","<@"+rows[0].acceptorId+">")
                            .addField("Author","<@"+rows[0].userId+">")
                            .addField("name",rows[0].name)
                            .addField("content",rows[0].content)
                            .addField("Date",rows[0].date);
                            message.channel.send(embed);
                            
                        });
                    }
                }
                break;
            }

            case"toaccept": {
                con.query(`SELECT * FROM quotes WHERE accepted = 0;`,(err,rows) => {
                    if(err) throw err;
                    if(rows.length == 0) return error.uError(message,"No quotes to accept",exports.help.usage);
                    var list = "List of unaccepted quotes:";
                    var i = 1;
                    rows.forEach(row => {
                        if(i > 20) return;
                        var user;
                        message.guild.members.forEach(member => {
                            if(row.userId == member.id) user = member;
                        });
                        if(row == undefined) return;
                        list+="\n"+i+". Name:"+row.name + " | Content:"+row.content + " | Autor:"+user.user.tag;
                        i++;
                    });
                    list+="\nShown "+(i-1)+" items(All quotes:"+rows.length+")";
                    message.channel.send(list);
                });
                break;
            }

            default:{
                con.query(`SELECT * FROM quotes WHERE name = ${mysql.escape(args[0].toLowerCase())};`,(err,rows) => {
                    if(err) throw err;
                    if(rows.length == 0) return error.uError(message,"Unknown quote",exports.help.usage);
                    if(!rows[0]) return error.uError(message,"Unknown quote",exports.help.usage);
                    if(rows[0].accepted != 1) return error.uError(message,"Quote is not accepted",exports.help.usage);
                    message.channel.send(rows[0].content);
                });
                break;
            }
        }
    }
    
}

module.exports.help = {
    name:"quote",
    command:"quote",
    usage:"quote [list/submit/remove/[quote name]] (args)",
    version:"1.2.0"
}