const discord = require('discord.js');
const smysql = require("sync-mysql");
const config = require("./config.json");
let token = "NjM3NjU5NDU1MjczNjk3Mjgw.XccVVQ.XOgGjSQHmT54sMgflj5kB5Xonik";

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
    let d = 0;
    a.forEach(ind => {
        Object.keys(ind).forEach(key=> {
            if(ind[key] == 1) d = 1;
        }); 
    });
    if(d==1) return `User **${user}** already exists. :x:`;
    let whole = getRank(0,true);
    let rank = 1;
    for(let i=0;i<whole.length;i++) {
        if(honor >= whole[i].minHonor) {
            rank = whole[i].id;
            break;
        }
    }
    let ab = db.query(`INSERT INTO users(username, honor, marks, rank) values('${user}',${honor},${marks},${rank});`);
    return `Added **${user}** to the list.`;
}
function pushInto(user,rank,condition) {
    const quer = db.query(`SELECT EXISTS( SELECT * FROM proctobedone WHERE namee = '${user}');`);
    console.log("ok");
    let d = 0;
    quer.forEach(ind => {
        Object.keys(ind).forEach(key=> {
            if(ind[key] == 1) d = 1;
        }); 
    });
    if(d==0) {
        const ba = db.query(`INSERT INTO proctobedone(namee, rankk, conditio) values('${user}',${rank},${condition});`);

    } else if(d==1) {
        const ad = db.query(`UPDATE proctobedone SET rankk = ${rank}, conditio = ${condition} WHERE namee = '${user}'`);
    };
}
function getProc() {
    const check = db.query("SELECT COUNT(*) FROM proctobedone;");
    let count = 0;
    check.forEach(ind => {
        Object.keys(ind).forEach(key=> {
            count = ind[key];
        }); 
    });
    if(count==0) return 51;
    let ab = db.query("SELECT * FROM proctobedone;");
    return ab;
}
function getData(user, ab = false) {
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`; 
    let a = db.query(quer);
    let d = 0;
    a.forEach(ind => {
        Object.keys(ind).forEach(key=> {
            if(ind[key] == 0) d = 1;
        }); 
    });
    if(d==1) return `User **${user}** not found. :x:`;
    let b = db.query(`SELECT * FROM users WHERE username = '${user}'`);
    let gothonor;
    let marks;
    let rank;
    b.forEach(key=>{
        gothonor = key.honor;
        marks = key.marks;
        rank = key.rank;
    });
    if(ab==true) {
        console.log(`rank-1 is ${rank-1}`);
        return `${getRank(rank-1)} **${user}** has ${gothonor} honor and ${marks} marks.`;
    }
    return [gothonor,marks,rank];
}
function divideInPages(page) {
    let required = 1;
    let lastIndex = [0];
    let tstr = "";
    let newString = [];
    let placeholder = getAllData();
    let a;
    while (true) {
        for(let i = lastIndex[lastIndex.length-1]; i<placeholder.length; i++) { //save current index
            a = i;
            if(tstr.length>1024) {
                let newtstr = tstr.replace(`**${placeholder[i-1].member.name}** - Honor: ${placeholder[i-1].member.honor} | Marks: ${placeholder[i-1].member.marks}\n`,"");
                lastIndex.push(i);
                required += 1;
                newString.push(newtstr);
                console.log(`Pushed at Ind: |${lastIndex[lastIndex.length-1]}| Req: |${required}| newTstrLen: |${newtstr.length}|`);
                tstr = "";
                break;
            }
            tstr += `**${placeholder[i].member.name}** - Honor: ${placeholder[i].member.honor} | Marks: ${placeholder[i].member.marks}\n`;
            if(i==placeholder.length-1) {
                lastIndex.push(i);
                required += 1;
                newString.push(tstr);
                console.log(`Pushed at Ind: |${lastIndex[lastIndex.length-1]}| Req: |${required}| newTstrLen: |${tstr.length}|`);
            }
        }
        if(a==placeholder.length-1) {
            console.log(`LAST-INDEX: |${a}|`);
            break;
        };
    }
    if(page>required-1) return "Page doesn't exist.";
    console.log(placeholder.length);
    newString.forEach(val => console.log(val.length));
    return [newString[page-1]];
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
function getRank(place,status = false) {
    let whole = [
        {
            name : "Recruit",
            minHonor : 0,
            id : 1
        },
        {
            name : "Junior Patrolman",
            minHonor : 20,
            id : 2
        },
        {
            name : "Patrolman",
            minHonor : 40,
            id : 3
        },
        {
            name : "Senior Patrolman",
            minHonor : 75,
            id : 4
        },
        {
            name : "Junior Guardsman",
            minHonor : 115,
            id : 5
        },
        {
            name : "Guardsman",
            minHonor : 175,
            id : 6
        },
        {
            name : "Senior Guardsman",
            minHonor : 250,
            id : 7
        },
        {
            name : "Field Officer",
            minHonor : 350,
            id : 8
        },
        {
            name : "Sergeant",
            minHonor : 450,
            id : 9
        },
        {
            name : "Lieutenant",
            minHonor : 600,
            id : 10
        },
        {
            name : "Captain",
            minHonor : 800,
            id : 11
        }
    ]
    if(status==false) return whole[place].name;
    if(place==511 && status==true) return whole;
    if(status==true) return whole.reverse();
}
function buildUpString() { //TODO: no duplicates in ranklist, make proctobedone with mysql
    let procToBeDone = getProc();
    if(procToBeDone == 51) return "No rank changes needed.";
    let holder = "";
    procToBeDone.forEach(val => {
        console.log(val);
        if(val.conditio == 2) {
            console.log(`${val.namee},${val.rankk},${val.conditio}`);
            let rank = getRank(val.rankk-1);
            holder += `**${val.namee}** is eligible to be demoted to **${rank}**.\n`;
        } else {
            console.log(`${val.namee},${val.rankk},${val.conditio}`);
            let rank = getRank(val.rankk-1);
            holder += `**${val.namee}** is eligible to be promoted to **${rank}**.\n`;
        }
    })
    return holder;
}
function modified(user, honor, rankk) {
    console.log(`${user},${honor},${rankk}`);
    let whole = getRank(0,true);
    let rank = 0;
    let rankname = "";
    let demotable = false;
    let promotable = false;
    let ranku = 0;
    let rankuname = "";
    let voul = getRank(511,true);
    if(honor < voul[rankk-1].minHonor) {
        console.log(`${honor} < ${voul[rankk-1].minHonor} and ${voul[rankk-1].name}`);
        demotable = true;
        for(let i=0;i<whole.length;i++) {
            if(honor >= whole[i].minHonor) {
                console.log(whole);
                console.log(whole[i]);
                console.log(`${whole[i].id}|${whole[i].name}`);
                ranku = whole[i].id;
                rankuname = whole[i].name;
                break;
            }
        }
        
    }
    if(demotable==false) {
        for(let i=0;i<whole.length;i++) {
            if(honor >= whole[i].minHonor) {
                if(whole[i].id!=rankk) {
                    rank = whole[i].id;
                    rankname = whole[i].name;
                    promotable = true;
                    break;
                } else break;
            }
        }
    }
    if(demotable==true) { 
        console.log("DEMOTABLE");
        pushInto(user,ranku,2); // ranku is an id to where the member should be demoted, not index.
        return `**${user}** is eligible to be demoted to **${rankuname}**.`;
    }else if(promotable==true) {
        console.log("PROMOTABLE");
        pushInto(user,rank,1); // 1 = PROMOTE, 2 = DEMOTE.
        return `**${user}** is eligible to be promoted to **${rankname}**.`;
    } else {
        neutralize(user);
        return false;
    }
}
function changeRank(user,rankstring) {
    let rank = 0;
    let getrankk = getRank(511,true);
    let minhonor = 0;
    getrankk.forEach(val => {
        if(val.name == rankstring) {
            rank = val.id; // the rank is being set to the id, not index.
            minhonor = val.minHonor;
         } 
    })
    if(rank==0) return "Couldn't find the rank name. :x:";
    let a = db.query(`UPDATE users SET rank = ${rank}, honor = ${minhonor} WHERE username = '${user}';`);
    return `Successfully changed **${user}'s** rank to **${rankstring}**`;
}
function neutralize(user) {
    const check = db.query("SELECT COUNT(*) FROM proctobedone;");
    let count = 0;
    check.forEach(ind => {
        Object.keys(ind).forEach(key=> {
            count = ind[key];
        }); 
    });
    if(count==0) return;
    let ab = db.query("SELECT * FROM proctobedone;");
    ab.forEach(val => {
        if(val.namee == user){
            let as = db.query(`DELETE FROM proctobedone WHERE namee = '${user}';`);
        }
    })
}
function saveChanges() {
    const check = db.query("SELECT COUNT(*) FROM proctobedone;");
    let count = 0;
    check.forEach(ind => {
        Object.keys(ind).forEach(key=> {
            count = ind[key];
        }); 
    });
    if(count==0) return "There are no rank changes. :x:";
    let ab = db.query("SELECT * FROM proctobedone;");
    ab.forEach(val => {
        let aes = db.query(`UPDATE users SET rank = ${val.rankk} WHERE username = '${val.namee}';`);
    })
    let aex = db.query("DELETE FROM proctobedone;");
    return "Saved all rank changes. :white_check_mark:";
}
function removeMember(user) {
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`;
    let a = db.query(quer);
    let d = 0;
    a.forEach(ind => {
        Object.keys(ind).forEach(key=> {
            if(ind[key] == 0) d = 1;
        }); 
    });
    if(d==1) return `User **${user}** not found. :x:`;
    let b = db.query(`DELETE FROM users WHERE username = '${user}';`);
    return `**${user}** was successfully removed from the list. :white_check_mark:`;
}
function addHonor(user,honor) {
    if(isNaN(honor) == true) return "Please enter a number. :x:";
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`;
    let a = db.query(quer);
    let d = 0;
    a.forEach(ind => {
        Object.keys(ind).forEach(key=> {
            if(ind[key] == 0) d = 1;
        }); 
    });
    if(d==1) return `User **${user}** not found. :x:`;
    let [gothonor,marks,rank] = getData(user);
    let sumn = parseInt(honor,10);
    let newhonors = gothonor + sumn;
    let ab = db.query(`UPDATE users SET honor = ${newhonors} WHERE username = '${user}';`);
    let response = modified(user,newhonors,rank)
    if(response == false) {
        return `Successfully added ${honor} honor. Current honor: ${newhonors}. :white_check_mark:`;
    } else {
        return `Successfully added ${honor} honor. Current honor: ${newhonors}. ${response} :white_check_mark:`;
    }
}
function setHonor(user,honor) {
    if(isNaN(honor) == true) return "Please enter a number. :x:";
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`;
    let a = db.query(quer);
    let d = 0;
    a.forEach(ind => {
        Object.keys(ind).forEach(key=> {
            if(ind[key] == 0) d = 1;
        }); 
    });
    if(d==1) return `User **${user}** not found. :x:`;
    let ab = db.query(`UPDATE users SET honor = ${honor} WHERE username = '${user}';`);
    let [gothonor,marks,rank] = getData(user);
    let response = modified(user,honor,rank);
    if(response == false) {
        return `Successfully set ${honor} honor. Current honor: ${newhonors}. :white_check_mark:`;
    } else {
        return `Successfully set ${honor} honor. Current honor: ${newhonors}. ${response} :white_check_mark:`;
    }
}
function removeHonor(user,honor) {
    if(isNaN(honor) == true) return "Please enter a number. :x:";
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`;
    let a = db.query(quer);
    let d = 0;
    a.forEach(ind => {
        Object.keys(ind).forEach(key=> {
            if(ind[key] == 0) d = 1;
        }); 
    });
    if(d==1) return `User **${user}** not found. :x:`;
    let [gothonor,marks,rank] = getData(user);
    let sumn = parseInt(honor,10);
    let newhonors = gothonor - sumn;
    if(newhonors<0) newhonors = 0;
    let ab = db.query(`UPDATE users SET honor = ${newhonors} WHERE username = '${user}';`);
    let response = modified(user,newhonors,rank);
    if(response == false) {
        return `Successfully removed ${honor} honor. Current honor: ${newhonors}. :white_check_mark:`;
    } else {
        return `Successfully removed ${honor} honor. Current honor: ${newhonors}. ${response} :white_check_mark:`;
    }
}
function markMember(user) {
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`;
    let a = db.query(quer);
    let d = 0;
    a.forEach(ind => {
        Object.keys(ind).forEach(key=> {
            if(ind[key] == 0) d = 1;
        }); 
    });
    if(d==1) return `User **${user}** not found. :x:`;
    let [honor,marks,rank] = getData(user);
    let newmark = marks + 1;
    let b = db.query(`UPDATE users SET marks = ${newmark} WHERE username = '${user}'`);
    return `Successfully marked **${user}**, :white_check_mark:`;
}
function removeMark(user) {
    const quer = `SELECT EXISTS( SELECT * FROM users WHERE username = '${user}');`;
    let a = db.query(quer);
    let d = 0;
    a.forEach(ind => {
        Object.keys(ind).forEach(key=> {
            if(ind[key] == 0) d = 1;
        }); 
    });
    if(d==1) return `User **${user}** not found. :x:`;
    let [honor,marks,rank] = getData(user);
    let newmark = marks - 1;
    let b = db.query(`UPDATE users SET marks = ${newmark} WHERE username = '${user}'`);
    return `Successfully removed a mark from **${user}**. :white_check_mark:`;
}

bot.on('ready', () => {  
    console.log("Bot online.");
    bot.user.setActivity('RMS', { type: 'WATCHING' });
})

bot.on('message', msg => {
    if(msg.guild === null) return;
    if(msg.content.startsWith('.') === false) {return};
    if(!msg.member.roles.find("name","bot access")) return;

    let msgar = (msg.content).split(" ");
    let cmd = msgar[0];
    let args = msgar.slice(1);

    if(cmd===`${config.prefix}checkstats`) {
        console.log("called checkstats");
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
        let page = 1;
        if(args[0]) {
            page = args[0];
        };
            console.log("called getwholelist");
            const honorembed = new discord.RichEmbed()
            .setColor('#0067c2')
            .setAuthor('RMS Bot', bot.user.displayAvatarURL)
            .setTitle('**Honor list**')
            .setDescription('Entire list for all of the honors.')
            .setTimestamp()
            .setFooter(`Honor list page ${page}`, bot.user.displayAvatarURL)
            .addField("**List of honor**", divideInPages(page));
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
        .addField("**checkstats**", "`Checks honor and marks of a given member\n`.checkhonor [member name]`")
        .addField("**addhonor**", "Adds honor to a given member\n`.addhonor [member name] [amount of honor]`")
        .addField("**removehonor**", "Subtracts given member's honor\n`.removehonor [member name] [amount of honor]`")
        .addField("**mark**", "Marks given member\n`.mark [member name]`")
        .addField("**removemark**", "Removes 1 mark of a given member\n`.removemark [member name]`")
        .addField("**addmember**", "Adds given member to the list (name is case sensitive)\n`.addmember [member name] [honor amount] [marks amount]`")
        .addField("**removemember**", "Removes a member from the honor list\n`.removemember [member name (case sensitive)]`")
        .addField("**link**", "Gives you the links of all the important documents\n`.link`")
        .addField("**getlist**", "Displays whole honor list\n`.getlist [page]`")
        .addField("**bulkaddhonor**", "Adds honor to given members (don't use spaces when entering names)\n`.bulkaddhonor [member name1, member name 2 etc.] [honor amount]`")
        .addField("**ranklist**", "Shows you all possible promotions/demotions\n`.ranklist`")
        .addField("**setchanges**", "Sets all rank changes listed in `ranklist`\n`.setchanges`")
        .addField("**changerank**", "Forcibly changes members rank and sets their honor to the honor required to get given rank\n`.changerank [member name] [rank (case sensitive)]`")
        .addField("**sethonor**", "Sets given members honor to given amount\n`.sethonor [member name] [amount of honor]`")
        .setTimestamp()
        .setFooter('List of commands', bot.user.displayAvatarURL);

        msg.channel.send({embed: helpembed});
    } else if(cmd===`${config.prefix}bulkaddhonor`) {
        const users = args[0].trim();
        const givenHonor = args[1];
        let usrs = users.split(',').forEach(val => {
            addHonor(val, givenHonor);
        })
        msg.channel.send(`Successfully added honor to members: **${users}**. :white_check_mark:`);
    } else if(cmd===`${config.prefix}bulkmark`) {
        const users = args[0].trim();
        let usrs = users.split(',').forEach(val => {
            markMember(val);
        })
        msg.channel.send(`Successfully marked members: **${users}**. :white_check_mark:`);
    } else if(cmd===`${config.prefix}ranklist`) {
        const rankembed = new discord.RichEmbed()
            .setColor('#0067c2')
            .setAuthor('RMS Bot', bot.user.displayAvatarURL)
            .setTitle('**Changes**')
            .setDescription('All possible demotions and promotions.')
            .setTimestamp()
            .setFooter(`Ranklist`, bot.user.displayAvatarURL)
            .addField("**List**", buildUpString());
        msg.channel.send(rankembed);
    } else if(cmd===`${config.prefix}setchanges`) {
        let a = saveChanges();
        msg.channel.send(a);
    } else if(cmd==`${config.prefix}changerank`) {
        console.log(args[0]);
        if(args.length > 2) {
            let holder = "";
            for(let i=0;i<args.length;i++) {
                if(i==0) return;
                if(i==1) holder += val;
                holder += ` ${val}`;
            }
            console.log(holder);
            let mes = changeRank(args[0], holder);
            msg.channel.send(mes);
        }
        console.log(args[1]);
        let mes = changeRank(args[0], args[1]);
        msg.channel.send(mes);
    }
})
bot.login(token);