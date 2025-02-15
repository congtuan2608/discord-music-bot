import { getMSG } from "../../msg/index.js";
import nextSong from "./next.js";


export default async function skipTo(interaction) {
  try {
    const { options, guild, member } = interaction;
    const skipIndex = Number(options.getString('index'));
    let queue = global.queueMap.get(guild.id);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply(); // Hoãn phản hồi nếu chưa được thực hiện
    }

    // Kiểm tra xem người dùng có ở trong kênh voice không
    if (!member.voice.channel) {
      return interaction.followUp(getMSG('skipNotInVoice'), { ephemeral: true });
    }

    if (typeof skipIndex !== 'number' || isNaN(skipIndex)) {
      return interaction.followUp(getMSG('skipInvalidIndex'), { ephemeral: true });
    }

    // Kiểm tra nếu chỉ số hợp lệ
    if (skipIndex < 0 || skipIndex > queue.length) {
      return interaction.followUp(getMSG('skipInvalidIndex'), { ephemeral: true });
    }

    if (!queue || queue.length === 0) {
      return interaction.followUp(getMSG('notQueue'));
    }

    await nextSong(interaction, skipIndex - 1);

  } catch (error) {
    console.error("Error in skipTo function:", error);
    interaction.followUp(getMSG('error', error.message), { ephemeral: true });
  }
}
