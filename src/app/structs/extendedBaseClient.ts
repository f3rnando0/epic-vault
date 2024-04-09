import {
  ApplicationCommandDataResolvable,
  BitFieldResolvable,
  Client,
  ClientEvents,
  Collection,
  GatewayIntentsString,
  IntentsBitField,
  Partials,
} from "discord.js";
import { readdirSync } from "fs";
import path from "path";
import { env } from "../../env";
import {
  CommandType,
  ComponentsButton,
  ComponentsModal,
  ComponentsSelect,
} from "./types/command";
import { EventType } from "./types/event";

const fileCondition = (fileName: string) =>
  fileName.endsWith(".ts") || fileName.endsWith(".js");

export class ExtendedClient extends Client {
  public commands: Collection<string, CommandType> = new Collection();
  public buttons: ComponentsButton = new Collection();
  public selects: ComponentsSelect = new Collection();
  public modals: ComponentsModal = new Collection();

  constructor() {
    super({
      intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<
        GatewayIntentsString,
        number
      >,
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
      ],
    });
  }

  public start() {
    this.registerModules();
    this.registerEvents();
    this.login(env.TOKEN);
  }

  private registerCommand(commands: Array<ApplicationCommandDataResolvable>) {
    this.application?.commands
      .set(commands)
      .then(() => {
        console.log("✅ Slash commands (/) defined.");
      })
      .catch((err) => {
        console.log(
          "❌ An error ocurred while defining a slash command: ",
          err.message
        );
      });
  }

  private registerModules() {
    const slashCommands: Array<ApplicationCommandDataResolvable> = new Array();

    const commandsPath = path.join(__dirname, "../", "commands");
    const fileCondition = (fileName: string) =>
      fileName.endsWith(".ts") || fileName.endsWith(".js");

    readdirSync(commandsPath).map((local) => {
      readdirSync(commandsPath + `/${local}/`).filter(async (fileName) => {
        const command: CommandType = (
          await import(`../commands/${local}/${fileName}`)
        )?.default;
        const { name, buttons, selects, modals } = command;

        if (name) {
          this.commands.set(name, command);
          slashCommands.push(command);
          if (buttons) buttons.map((run, key) => this.buttons.set(key, run));
          if (selects) selects.map((run, key) => this.selects.set(key, run));
          if (modals) modals.map((run, key) => this.modals.set(key, run));
        }
      });
    });

    this.on("ready", () => this.registerCommand(slashCommands));
  }

  private registerEvents() {
    const eventsPath = path.join(__dirname, "..", "events");

    readdirSync(eventsPath).map((local) => {
      readdirSync(`${eventsPath}/${local}`)
        .filter(fileCondition)
        .map(async (fileName) => {
          const { name, once, run }: EventType<keyof ClientEvents> = (
            await import(`../events/${local}/${fileName}`)
          )?.default;

          try {
            if (name) once ? this.once(name, run) : this.once(name, run);
          } catch (error: any) {
            console.log(`An errro ocurred on event: ${name}`, error.message);
          }
        });
    });
  }
}
