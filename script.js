const discord = require('discord.js');
const smysql = require("sync-mysql");
const config = require("./config.json");
let token = process.env.token;

const db = new smysql({
    host : 'us-cdbr-iron-east-05.cleardb.net',
    user : 'b97e35f4657d49',
    password : 'a005e07f',
    database : 'heroku_2c4325fb79d2ce7'
});

const bot = new discord.Client();

function addMember(user,honor = 0, marks = 0) {
    if(isNaN(honor) == true) return "Please enter a number.";
    if(isNaN(marks) == true) return "Please enter a number.";
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`;
    let a = db.query(quer);
    for (let key in a){
        if(a[key]==1) return 'User already exists';
    };
    let ab = db.query(`INSERT INTO users(username, honor, marks) values('${user}',${honor},${marks})`);
    return `Added **${user}** to the list.`;
}
function getData(user, ab = false) {
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`;
    let a = db.query(quer);
    for (let key in a){
        if(a[key]==0) return 'User not found';
    };
    let b = db.query(`SELECT * FROM users WHERE username = '${user}'`);
    let gothonor;
    let marks;
    Object.keys(b).forEach(key=>{
        gothonor = b[key].honor;
        marks = b[key].marks;
    });
    if(ab==true) {
        return `${user} has ${gothonor} honor and ${marks} marks.`;
    }
    return [gothonor,marks];
}
function getAllData() {
    let placeholder = [];
        const quer = "SELECT * FROM users";
        let res = db.query(quer);
        Object.keys(res).forEach(key=>{
            let tempholder = {};
            tempholder.member = {};
            tempholder.member.name = res[key].username
            tempholder.member.honor = res[key].honor
            tempholder.member.marks = res[key].marks
            placeholder.push(tempholder);
        });
    return placeholder;
}
function removeMember(user) {
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`;
    let a = db.query(quer);
    for (let key in a){
        if(a[key]==0) return 'User not found';
    };
    let b = db.query(`DELETE FROM users WHERE username = '${user}';`);
    return `**${user}** was successfully removed from the list.`;
}
function addHonor(user,honor) {
    if(isNaN(honor) == true) return "Please enter a number.";
    console.log(`addhonor user: |${user}| and ${typeof user}`);
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`;
    let a = db.query(quer);
    for (let key in a){
        if(a[key]==0) return 'User not found';
    };
    let [gothonor,marks] = getData(user);
    let sumn = parseInt(honor,10);
    let newhonors = gothonor + sumn;
    let ab = db.query(`UPDATE users SET honor = ${newhonors} WHERE username = '${user}';`);
    return `Successfully added ${honor} honor. Current honor: ${newhonors}`;
}
function removeHonor(user,honor) {
    if(isNaN(honor) == true) return "Please enter a number.";
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`;
    let a = db.query(quer);
    for (let key in a){
        if(a[key]==0) return 'User not found';
    };
    let [gothonor,marks] = getData(user);
    let sumn = parseInt(honor,10);
    let newhonors = gothonor - sumn;
    let ab = db.query(`UPDATE users SET honor = ${newhonors} WHERE username = '${user}';`);
    return `Successfully removed ${honor} honor. Current honor: ${newhonors}`;
}
function markMember(user) {
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`;
    let a = db.query(quer);
    for (let key in a){
        if(a[key]==0) return 'User not found';
    };
    let [honor,marks] = getData(user);
    let newmark = marks + 1;
    let b = db.query(`UPDATE users SET marks = ${newmark} WHERE username = '${user}'`);
    return `Successfully marked **${user}**.`;
}
function removeMark(user) {
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`;
    let a = db.query(quer);
    for (let key in a){
        if(a[key]==0) return 'User not found';
    };
    let [honor,marks] = getData(user);
    let newmark = marks - 1;
    let b = db.query(`UPDATE users SET marks = ${newmark} WHERE username = '${user}'`);
    return `Successfully removed a mark from **${user}**.`;
}

bot.on('ready', () => {  
    console.log("Bot online.");
})

bot.on('message', msg => {
    if(msg.content.startsWith('.') === false) {return};
    if(!msg.member.roles.find("name","bot access")) return;

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