import { joinVoiceChannel } from "@discordjs/voice";

export default async function join(interaction) {
  const { member, guild } = interaction;

  // Connect to the voice channel
  joinVoiceChannel({
    channelId: member.voice.channel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });
}