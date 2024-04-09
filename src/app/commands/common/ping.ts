import { ApplicationCommandType } from "discord.js";
import { Command } from "../../structs/types/command";

export default new Command({
  name: "ping",
  description: "Reply with pong",
  type: ApplicationCommandType.ChatInput,
  run({ interaction }) {
    interaction.reply({ content: "pong", ephemeral: true });
  },
});
