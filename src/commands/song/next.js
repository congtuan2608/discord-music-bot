import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";
import SongButtons from '../button/song.js';
import { getMSG } from "../msg/index.js";

export default async function nextSong(interaction, skipIndex = 0) {
  const { member, guild } = interaction;

  try {
    // Defer the reply if not already deferred or replied
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply();
    }

    // Fetch the server's queue
    let queue = global.queueMap.get(guild.id);

    // Handle empty queue
    if (!queue || queue.length === 0) {
      const message = await interaction.followUp(getMSG('notQueue'));
      if (message) {
        // Lưu message ID vào playerMap
        global.playerMap.set(guild.id, {
          messageId: message.id,
          player: null,
          channelId: null,
        });
      }
      global.queueMap.delete(guild.id);
      global.playerMap.delete(guild.id);
      return;
    }

    // Retrieve or save the voice channel ID
    let voiceChannelId = member.voice.channel?.id || global.playerMap.get(guild.id)?.channelId;

    if (!voiceChannelId) {
      return interaction.followUp({ content: getMSG('notInChannel'), ephemeral: true });
    }

    // Save the voice channel ID to playerMap
    const existingPlayerData = global.playerMap.get(guild.id) || {};
    existingPlayerData.channelId = voiceChannelId;
    global.playerMap.set(guild.id, existingPlayerData);

    // Get the current song and remove it from the queue
    const currentSong = queue.splice(skipIndex, 1)[0];

    // Connect to the voice channel
    const connection = joinVoiceChannel({
      channelId: member.voice.channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    // Create and save an audio player
    const player = createAudioPlayer();
    global.playerMap.set(guild.id, {
      player,
      messageId: null,
    });

    // Create an audio resource from the song's stream
    const resource = createAudioResource(currentSong.stream.stream, { inputType: currentSong.stream.type });
    
    // Subscribe the player to the connection
    connection.subscribe(player);
    player.play(resource);

    // Send the message and save its ID for later updates
    const message = await interaction.followUp({
      content: getMSG('play', currentSong.title),
      components: [SongButtons],
    });

    // Save the message ID in playerMap
    if (message) {
      global.playerMap.get(guild.id).messageId = message.id;
    }


    // Handle when the song ends
    player.on(AudioPlayerStatus.Idle, async () => {
      await nextSong(interaction);
    });

    // Handle player errors
    player.on("error", async (error) => {
      console.error(error);

      // Fetch the message by its ID from playerMap and edit it to show the error
      const playerData = global.playerMap.get(guild.id);
      if (playerData && playerData.messageId) {
        const msgToEdit = await interaction.channel.messages.fetch(playerData.messageId);
        if (msgToEdit) {
          await msgToEdit.edit(getMSG('error', error.message)); // Edit the existing message
        }
      }

      nextSong(interaction);
    });
  } catch (error) {
    console.error("Error in nextSong:", error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply(); // Defer if not already done
    }

    // Send error message initially
    const message = await interaction.followUp(getMSG('error', error.message));

    // Save the message ID in playerMap
    if (message) {
      global.playerMap.set(guild.id, { player: null, messageId: message.id });
    }

    // Fallback to channel message if necessary
    const playerData = global.playerMap.get(guild.id);
    if (playerData && playerData.messageId) {
      const msgToEdit = await interaction.channel.messages.fetch(playerData.messageId);
      if (msgToEdit) {
        await msgToEdit.edit(getMSG('error', error.message)); // Edit the existing message
      }
    }
  }
}
