const discord = require('discord.js');
const fs = require('fs');
const config = require("./config.json")
let token = process.env.token;

const bot = new discord.Client();

function setUp() {
    if(fs.existsSync('./members')) return "Already exists.";
    fs.mkdirSync('./members');
}
function addMember(user,honor = 0, marks = 0) {
    if(fs.existsSync(`./members/${user}.txt`)) return "User already exists.";
    if(isNaN(honor) == true) return "Please enter a number.";
    if(isNaN(marks) == true) return "Please enter a number.";
    fs.writeFileSync(`./members/${user}.txt`, `${honor},${marks}`);
    return `Added **${user}** to the list.`;
}
function getData(user, a = false) {
    if(!fs.existsSync(`./members/${user}.txt`)) return "User not found.";
    let files = fs.readFileSync(`./members/${user}.txt`, "utf8");
    let newf = files.split(',');
    let gothonor = newf[0];
    let marks = newf[1];
    if(a==true) {
        return `${user} has ${gothonor} honor and ${marks} marks.`;
    }
    return [gothonor,marks];
}
function getAllData() {
    let placeholder = [];
    let data = fs.readdirSync("./members").forEach(val => {
        let tempholder = {};
        tempholder.member = {};
        tempholder.member.name = val.split('.')[0];
        [honor,marks] = getData(tempholder.member.name);
        tempholder.member.honor = parseInt(honor,10);
        tempholder.member.marks = parseInt(marks,10);
        placeholder.push(tempholder);
    })
    return placeholder;
}
function removeMember(user) {
    if(!fs.existsSync(`./members/${user}.txt`)) return "User not found.";
    fs.unlinkSync(`./members/${user}.txt`);
    return `**${user}** was successfully removed from the list.`
}
function addHonor(user,honor) {
    if(!fs.existsSync(`./members/${user}.txt`)) return "User not found.";
    if(isNaN(honor) == true) return "Please enter a number.";
    let [gothonor,marks] = getData(user);
    let a = parseInt(gothonor,10);
    let b = parseInt(honor,10);
    let newhonors = a + b;
    let newmarks = parseInt(marks,10);
    fs.writeFileSync(`./members/${user}.txt`, `${newhonors},${newmarks}`)
    return `Successfully added ${honor} honor. Current honor: ${newhonors}`;
}
function removeHonor(user,honor) {
    if(!fs.existsSync(`./members/${user}.txt`)) return "User not found.";
    if(isNaN(honor) == true) return "Please enter a number.";
    let [gothonor,marks] = getData(user);
    let a = parseInt(gothonor,10);
    let b = parseInt(honor,10);
    let newhonors = a - b;
    let newmarks = parseInt(marks,10);
    fs.writeFileSync(`./members/${user}.txt`, `${newhonors},${newmarks}`)
    return `Successfully removed ${honor} honor. Current honor: ${newhonors}`;
}
function markMember(user) {
    if(!fs.existsSync(`./members/${user}.txt`)) return "User not found.";
    let [honor,marks] = getData(user);
    let newmarks = parseInt(marks,10);
    let newmark = newmarks + 1;
    let newhonor = parseInt(honor,10);
    fs.writeFileSync(`./members/${user}.txt`, `${newhonor},${newmark}`)
    return `Successfully marked **${user}**.`;
}
function removeMark(user) {
    if(!fs.existsSync(`./members/${user}.txt`)) return "User not found.";
    let [honor,mark] = getData(user);
    let newmarks = parseInt(mark,10);
    let newmark = newmarks - 1;
    let newhonor = parseInt(honor,10);
    fs.writeFileSync(`./members/${user}.txt`, `${newhonor},${newmark}`);
    return `Successfully removed a mark from **${user}**.`;
}

bot.on('ready', () => {
    let r = setUp();
    if(r) console.log(r);
    console.log("Bot online.")
})

bot.on('message', msg => {
    console.log(msg.content);
    if(!msg.member.roles.find(n => n.name === "bot access")) return;

    let msgar = (msg.content).split(" ");
    let cmd = msgar[0];
    let args = msgar.slice(1);

    if(cmd===`${config.prefix}checkhonor`) {
        console.log("called checkhonor");
        let user = args[0];
        let info = getData(user, true);
        msg.channel.send(info);
    } else if(cmd===`${config.prefix}addhonor`) {
        let user = args[0];
        let givenHonor = args[1];
        console.log(givenHonor);
        let info = addHonor(user, givenHonor);
        msg.channel.send(info);
        console.log(info);
    } else if(cmd===`${config.prefix}removehonor`) {
        console.log("called removehonor");
        let user = args[0];
        let givenHonor = args[1];
        let info = removeHonor(user,givenHonor);
        msg.channel.send(info);
        console.log(info);
    } else if(cmd===`${config.prefix}mark`) {
        console.log("called mark");
        let user = args[0];
        let info = markMember(user);
        msg.channel.send(info);
        console.log(info);
    } else if(cmd===`${config.prefix}removemark`) {
        console.log("called removemark");
        let user = args[0];
        let info = removeMark(user);
        msg.channel.send(info);
        console.log(info);
    } else if(cmd===`${config.prefix}addmember`) {
        console.log("called addmember");
        let user = args[0];
        let honor = args[1];
        let marks = args[2];
        let info = addMember(user,honor,marks)
        msg.channel.send(info);
        console.log(info);
    } else if(cmd===`${config.prefix}removemember`) {
        console.log("called removemember");
        let user = args[0];
        let info = removeMember(user);
        msg.channel.send(info);
        console.log(info);
    } else if(cmd===`${config.prefix}getlist`) {
        console.log("called getwholelist");
        let placehold = getAllData();
        const honorembed = new discord.RichEmbed()
        .setColor('#0067c2')
        .setAuthor('RMS Bot', bot.user.displayAvatarURL)
        .setTitle('**Honor list**')
        .setDescription('Entire list for all of the honors.')
        .setTimestamp()
        .setFooter('Honor list', bot.user.displayAvatarURL);
        placehold.forEach(v => {
            honorembed.addField(v.member.name, `Honors: **${v.member.honor}** | Marks: **${v.member.marks}**`);
        })
        msg.channel.send({embed: honorembed});
    } else if(cmd===`${config.prefix}link`) {
        let linkembed = new discord.RichEmbed()
        .setColor('#0067c2')
        .setAuthor('Important links')
        .setDescription('All of the important document links.')
        .addField('**Protocol**',"[Click here to get access to the protocol](https://docs.google.com/document/d/1ANmv4rpq9MG6nk-G-RJO8qG3BtgSY-YsIenHSepB9uA/edit)")
        .addField('**HR Protocol**',"[Click here to get access to the HR protocol](https://docs.google.com/document/d/1s7D3ej2sq_qOp6ihrcL2GgKP9Ggq-WoU3FIQX8Kn3LQ/edit)")
        .setTimestamp()
        .setFooter("Links list", bot.user.displayAvatarURL);
        msg.channel.send({embed: linkembed});
        
    } else if(cmd===`${config.prefix}help`) {
        const helpembed = new discord.RichEmbed()
        .setColor('#0067c2')
        .setAuthor('Commands list', bot.user.displayAvatarURL)
        .setDescription(`Use this to access available commands. Note: commands are case sensitive`)
        .addField("**checkhonor**", "`Checks honor and marks of a given member\n`.checkhonor [member name]`")
        .addField("**addhonor**", "Adds honor to a given member\n`.addhonor [member name] [amount of honor]`")
        .addField("**removehonor**", "Subtracts given member's honor\n`.removehonor [member name] [amount of honor]`")
        .addField("**mark**", "Marks given member\n`.mark [member name]`")
        .addField("**removemark**", "Removes 1 mark of a given member\n`.removemark [member name]`")
        .addField("**addmember**", "Adds given member to the list (name is case sensitive)\n`.addmember [member name] [honor amount] [marks amount]`")
        .addField("**removemember**", "Removes a member from the honor list\n`.removemember [member name (case sensitive)]`")
        .addField("**link**", "Gives you the links of all the important documents\n`.link`")
        .addField("**getlist**", "Displays whole honor list\n`.getlist`")
        .setTimestamp()
        .setFooter('List of commands', bot.user.displayAvatarURL);

        msg.channel.send({embed: helpembed});
    }
})
bot.login(token);