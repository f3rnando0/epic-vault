import {
  ActionRowBuilder,
  ApplicationCommandType,
  Collection,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { Command } from "../../structs/types/command";

export default new Command({
  name: "anunciar",
  description: "Utilize este comando para criar um novo anúncio.",
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    const select = new StringSelectMenuBuilder()
      .setCustomId(`anunciar`)
      .setPlaceholder("Escolha o jogo que aparecerá no anúncio.")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Fortnite")
          .setValue("fortnite")
          .setEmoji({ id: "1227442671765950506" }),
        new StringSelectMenuOptionBuilder()
          .setLabel("Valorant")
          .setValue("valorant")
          .setEmoji({ id: "1227444041843736616" }),
        new StringSelectMenuOptionBuilder()
          .setLabel("Roblox")
          .setValue("roblox")
          .setEmoji({ id: "1227444221712269393" })
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      select
    );

    await interaction.reply({
      components: [row],
      ephemeral: true,
    });
  },
  selects: new Collection([
    [
      "anunciar",
      async (selectInteraction) => {
        switch(selectInteraction.values.at(0)) {
            case "fortnite": {
                
            }
        }
      },    
    ],
  ]),
});
