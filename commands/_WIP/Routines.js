const Command = require('../../core/Command')

class Routines extends Command {
  constructor(client) {
    super(client, {
      name: 'routine',
      category: 'Smart Home',
      description: 'Routines like good morning or goodnight',
      usage: `routine morning | routine sleep`,
      aliases: ['r'],
      ownerOnly: true,
      args: true
    })
  }

  async run(client, msg, args) {
    // * ------------------ Setup --------------------

    const { Utils, generalConfig } = client
    const { validOptions, warningMessage, standardMessage } = Utils

    // * ------------------ Config --------------------

    const config = await generalConfig.findOne({
      where: { id: msg.author.id }
    })
    const routines = JSON.parse(config.dataValues.routines)

    // * ------------------ Logic --------------------
    // * ------------------ Usage Logic --------------------

    // command setup
    const caseOptions = ['add', 'remove', 'run']
    switch (args[0]) {
      case 'list': {
        if (!routines.length) return warningMessage(msg, `There are no routines!`)

        let todoList = ''
        routines.forEach((i) => {
          todoList += `**${i.name} - ${i.command} ${i.arg.join(' ')}**\n`
        })
        return msg.reply(
          Utils.embed(msg, 'green')
            .setTitle('Routines')
            .setDescription(todoList)
        )
      }
      case 'add': {
        const name = args[1]
        const command = args[2]
        const index = routines.findIndex((i) => i.name === name)

        if (index > -1) return warningMessage(msg, `Routine [ ${name} ] already exists`)

        args.splice(0, 3)
        const arg = args.join(' ')
        routines.push({ name, command, arg: arg.split(' ') })
        await config.update({ routines: JSON.stringify(routines) })
        return standardMessage(msg, `${name}\n\nAdded to routine list`)
      }
      case 'remove': {
        const name = args[1]
        const index = routines.findIndex((d) => d.name === name)
        if (index === -1) return warningMessage(msg, `Routine does not exist`)

        routines.splice(index, 1)
        await config.update({ routines: JSON.stringify(routines) })
        if (name) return standardMessage(msg, `${name}\n\nRemoved from routine list`)

        break
      }
      default:
        return validOptions(msg, caseOptions)
    }
  }
}
module.exports = Routines
