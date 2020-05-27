//This Script DevelopeD By HiDDN

const Discord = require('discord.js')
const client = new Discord.Client();

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

const prefix = "Prefix Here";
const token = "Token Here";
const embedColor = 0xE52B50;

client.on("ready", () => {
  client.user.setGame(prefix + `new`);
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  if (message.content.toLowerCase().startsWith(prefix + `help`)) {
    const embed = new Discord.RichEmbed()
    .setTitle(`Ticket Bot Help`)
    .setColor(embedColor)
    .setDescription(`Hello! I'm Ticket Manager, the Discord bot for super cool support ticket stuff! Here are my commands:`)
    .addField(`Tickets`, `[${prefix}new]() > Opens up a new ticket and tags the Support Team\n[${prefix}close]() > Closes a ticket that has been resolved or been opened by accident\n[${prefix}add]() > Adds a member to a ticket\n[${prefix}remove]() > Removes a member from a ticket`)
    message.channel.send({ embed: embed });
  }


  if (message.content.toLowerCase().startsWith(prefix + `new`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (!message.guild.roles.exists("name", "Support")) {
    const embed0 = new Discord.RichEmbed()
    .setColor(embedColor)
    .addField(`Ticket Bot`, `This server doesn't have a \`Support\` role made, so the ticket won't be opened.\nIf you are an administrator, make one with that name exactly and give it to users that should be able to see tickets.`)
    message.channel.send({ embed: embed0 });
    return
    }
    if (message.guild.channels.exists("name", "ticket-" + message.author.username)) {
    const embed1 = new Discord.RichEmbed()
    .setColor(embedColor)
    .addField(`Ticket Bot`, `You already have a ticket open.`)
    message.channel.send({ embed: embed1 });
    return
    }
    message.guild.createChannel(`ticket-${message.author.username}`, "text").then(c => {
        let role = message.guild.roles.find("name", "Support");
        let role2 = message.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        const embed2 = new Discord.RichEmbed()
        .setColor(embedColor)
        .addField(`Ticket Bot`, `Your ticket has been created in ` + c.toString())
        .setTimestamp();
        message.channel.send({ embed: embed2 });

        const embed3 = new Discord.RichEmbed()
        .setColor(embedColor)
        .addField(`Hey ${message.author.username}!`, `Our **Support Team** will be with you shortly. Please explain your reason for opening the ticket in as much detail as possible.`)
        .setTimestamp();
        c.send({ embed: embed3 });
    }).catch(console.error);
  }

  if (message.content.toLowerCase().startsWith(prefix + `add`)) {
    if (!message.channel.name.startsWith(`ticket-`)) {
    const embed4 = new Discord.RichEmbed()
    .setColor(embedColor)
    .addField(`Ticket Bot`, `You can't use the this outside of a ticket channel.`)
    message.channel.send({ embed: embed4 });
    return
    }
    addedmember = message.mentions.members.first();
    message.channel.overwritePermissions(addedmember, { SEND_MESSAGES : true, VIEW_CHANNEL : true});
    const embed5 = new Discord.RichEmbed()
    .setColor(embedColor)
    .addField(`Ticket Bot`, '**' + addedmember + `** has been added to the ticket. Remove with [${prefix}remove]().`)
    message.channel.send({ embed: embed5 });

  }

  if (message.content.toLowerCase().startsWith(prefix + `remove`)) {
    if (!message.channel.name.startsWith(`ticket-`)) {
    const embed6 = new Discord.RichEmbed()
    .setColor(embedColor)
    .addField(`Ticket Bot`, `You can't use the this outside of a ticket channel.`)
    message.channel.send({ embed: embed6 });
    return
    }
    removedmember = message.mentions.members.first();
    message.channel.overwritePermissions(removedmember, { SEND_MESSAGES : false, VIEW_CHANNEL : false});
    const embed7 = new Discord.RichEmbed()
    .setColor(embedColor)
    .addField(`Ticket Bot`, '**' + removedmember + '** has been removed from the ticket.')
    message.channel.send({ embed: embed7 });
  }

  if (message.content.toLowerCase().startsWith(prefix + `close`)) {
    if (!message.channel.name.startsWith(`ticket-`)) {
    const embed8 = new Discord.RichEmbed()
    .setColor(embedColor)
    .addField(`Ticket Bot`, `You can't use the this outside of a ticket channel.`)
    message.channel.send({ embed: embed8 });
    return
    }   

    const embed9 = new Discord.RichEmbed()
    .setColor(embedColor)
    .addField(`Ticket Bot`, 'Are you sure? Once confirmed, you cannot reverse this action!\nTo confirm, type \`-confirm\`. This will time out in 10 seconds and be cancelled.')
    message.channel.send({ embed: embed9 })
    .then((m) => {
      message.channel.awaitMessages(response => response.content === '-confirm', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.delete();
        })
        .catch(() => {
          m.edit('Ticket close timed out, the ticket was not closed.').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
  }

});

function response(c) {
  while (true) {
    client.on("message", (message) => {
      if(message.channel == c) {
        return message.content;
      }
    });
  }
};

client.login(token)
