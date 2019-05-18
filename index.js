const botconfig = require("./botsettings.json");
const Discord = require("discord.js");
const pack = require("./package.json");
const mysql = require("mysql");
const bot = new Discord.Client({disableEveryone: true});
const fs = require("fs");
const warn = require("./utils/warn.js");

bot.ranksList = {
    [0]:"TEST"
};
bot.ranks = {
    "TEST":"571989160248999946"
};

//#region SQLIntr
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: botconfig.sqlpassword,
        database: "server_bot"
    });

    con.connect(err => {
        if(err) throw err;
        console.log("Connected to discord database");  
    });
    con.on("error",err => {
        console.error(err);
    });

//#endregion

bot.on("ready", async ()=> {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity(pack.botname+" v"+pack.version+" "+pack.versiontype,{type: 'WATCHING'});
});
bot.CMD = new Discord.Collection();
bot.servers = new Discord.Collection();
//bot.UC = require("./UsageCorrector.js");
//console.log("Loaded Module: UsageCorrector.js");
bot.config = botconfig;
UpdateRoles();
setTimeout(() => UpdateCounter(),1000);
SearchCmds();
require("./logs/logs.js").run(bot);
bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(message.channel.id == botconfig.welcomechannel) {
        if(message.content == "przeczytane") {
            message.member.addRole(message.guild.roles.get(botconfig.userrole),"Weryfikacja");
            message.delete();
        } else {
            message.author.send("Nie pisz na tym kanale innych rzeczy niż 'przeczytane'!");
            message.delete();
        }
    } else {
        let prefix = botconfig.prefix;
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
        if(cmd.substring(0,prefix.length)!=botconfig.prefix) return;
        cmd = cmd.substring(prefix.length,messageArray[0].length).toLowerCase();
        let args = messageArray.slice(1);
        let cmdfile = bot.CMD.get(cmd);
        if(cmdfile) cmdfile.run(bot,message,args,null,con);
        
        switch(cmd) {
            case"say": {
                if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPermission(message, "MANAGE_MESSAGES")
                message.channel.send(args[0]);
                break;
            }
        }
    }
});

bot.login(botconfig.token);
//#region  LoadCMD
function SearchCmds() {
    //if(!fs.exists("./Cmd/Cmd.meta",function(){})) return console.error("No meta file found in ./Cmd/");
    fs.readFile("./Cmd/Cmd.meta",(err,file) => {
        if(err) throw err;
        file += "";
        CmdMetaData = file.split(";");
        LoadCmds();
    });
}
function LoadCmds() {
    fs.readdir("./Cmd/", (err, files) => {
        if(err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js");
        if(jsfile.length <= 0) {
            console.log("No cmdfiles in Main Location.");
        }
        
        jsfile.forEach((f,a) => {
            let props = require(`./Cmd/${f}`);
            console.log(`${f} loaded.`);
            bot.CMD.set(props.help.command, props);
        });
        if(CmdMetaData.length == 0) return console.log("No other locations.");
        SearchCustomCmds();
    });
}

function SearchCustomCmds() {
    var c = 0
    while(c < CmdMetaData.length) {
        LoadCustomCmds(c);
        c++;
    }
}
function LoadCustomCmds(c) {
    var PathPart = CmdMetaData[c];
    fs.readdir("./Cmd/"+ PathPart +"/",(err,files) => {
        if(err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js")
        if(jsfile.length <= 0) {
                
            console.log("No cmdfiles in "+ PathPart +".");
            c++;
            return;
        }
        jsfile.forEach((f,b) => {
            let props = require(`./Cmd/`+ PathPart +`/`+`${f}`);
            console.log(PathPart +"/"+`${f} loaded.`);
            bot.CMD.set(props.help.command, props);
        });
            
    });
}
//#endregion

function UpdateRoles() {
    console.log("Starting ranks update");
    con.query("SELECT * FROM ranks;",(err,rows) => {
        if(err) throw err;
        if(rows.length == 0) return console.log("No ranks");
        
        bot.guilds.forEach(guild => {  
            console.log("Removing ranks");
            guild.members.forEach(member => {
                for(i = 0; i < 1;i++) {
                    if(member.roles.get(bot.ranks[bot.ranksList[i]])) {
                        member.removeRole(bot.ranks[bot.ranksList[i]]);
                    } else {
                        console.log(member.user.tag+" has no "+bot.ranksList[i]);
                    }
                }
            });
            setTimeout( () => {
                console.log("Adding ranks");
                rows.forEach(row => {
                    if(guild.members.get(row["did"])) {
                        guild.members.get(row["did"]).addRole(bot.ranks[row["role_name"]],"Roles update");
                    } else {
                        console.log("(UpdateRanks)User:"+row["username"]+"(id:"+row["did"]+")" +" not found");
                    }
                });
                console.log("Ranks added");
            },1000);
            
        });

    });
    setTimeout(() => UpdateRoles(),30*60*1000);
}

function UpdateCounter() {
    console.log("Starting counter update");
    if(botconfig.statsChannels.all != "") {
        bot.guilds.forEach(guild => {
            if(guild.channels.get(botconfig.statsChannels.all) != null) {
                guild.channels.get(botconfig.statsChannels.all).setName(name = "Wszyscy:"+guild.memberCount,"Counter update"); 
            }
        }); 
    }
    if(botconfig.statsChannels.users != "") {
        bot.guilds.forEach(guild => {
            if(guild.channels.get(botconfig.statsChannels.users) != null) {
                var c = 0;
                guild.members.forEach(member => {if(!member.user.bot) {
                    c++;
                }});
                guild.channels.get(botconfig.statsChannels.users).setName(name = "Użytkownicy:"+c,"Counter update"); 
            }
        }); 
    }
    if(botconfig.statsChannels.bots != "") {
        bot.guilds.forEach(guild => {
            if(guild.channels.get(botconfig.statsChannels.bots) != null) {
                var c = 0;
                guild.members.forEach(member => {if(member.user.bot) {
                    c++;
                }});
                guild.channels.get(botconfig.statsChannels.bots).setName(name = "Boty:"+c,"Counter update"); 
            }
        }); 
    }
    setTimeout(() => UpdateCounter(),30*60*1000);
}