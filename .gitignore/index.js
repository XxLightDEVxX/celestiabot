//////////////////REQUIRE///////////////////

const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

fs.readdir("./commands", (err, files) => {

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0 ){
        console.log("Je ne trouve pas les commandes.");
        return;
    }
    jsfile.forEach((f, i) =>{
        let props = require(`./commands/${f}`);
        console.log(`${f} chargé !`);
        bot.commands.set(props.help.name, props);
    });
        
    });


/////////////////PRET//////////////////////

bot.on("ready", async() => {
    console.log(`${bot.user.username} est prêt`)
    bot.user.setActivity("en développement", {type: "Je suis"});
});

/////////////////EVENEMENT/////////////////

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandsfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandsfile) commandsfile.run(bot,message,args);

});

//////////////////CONNEXION/////////////////

bot.login(process.env.TOKEN);
