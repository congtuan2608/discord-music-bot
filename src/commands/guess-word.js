import { getMSG } from "../msg/index.js";
import { WORDS } from "../data/words/words.js";

// con chó => chó
// chó chết => chết

function getTheWord(params) {
  let { history = [], oldWord = '', } = params;
  let [_, secondWord] = oldWord.split(' ');

  // Check if the second word is valid
  if (!WORDS[secondWord]) return null

  // Get the list of next words
  let listNextWords = params?.listNextWords || WORDS[secondWord] ;

  // Check if the old word is valid
  if (!oldWord) return null

  // Check if there is no next word
  if (listNextWords.length === 0) {
    return null; // Không có từ tiếp theo hợp lệ
  }

  // get a random word
  const randomWord = listNextWords[Math.floor(Math.random() * listNextWords.length)]
  const newWord = secondWord + " " + randomWord

  // check if the word has been used before
  if (history.includes(newWord)) {
    listNextWords = listNextWords.filter(word => word !== randomWord)
    return getTheWord({ history, oldWord, listNextWords })
  }

  return newWord
}


export default async function guessTheWord(interaction) {
  try {
    const { options, member, guild } = interaction;
    let oldWord = options.getString("word").trim().toLowerCase();
    let restart = options.getString("restart");

    if (restart) {
      global.guessWordMap.delete(guild.id);
    }

    console.log(`Guess the word - ${member.nickname}:`, oldWord);

    if (!oldWord) {
      return interaction.followUp(getMSG('requireWord'));
    }

    if (oldWord.split(' ').length > 2 || oldWord.split(' ').length <= 1) {
      return interaction.followUp(getMSG('requireTwoWords'));
    }

    // Defer the reply if not already deferred or replied
    if (!interaction.replied && !interaction.deferred) {
      await interaction.deferReply();
    }

    // Check if the existing data exists or create a new one
    let existingGuessWordData = global.guessWordMap.get(guild.id);

    if (!existingGuessWordData) {
      existingGuessWordData = {
        word: oldWord,
        guessed: [oldWord],
        wrong: 0,
        maxWrong: 6,
        message: null,
      };
      global.guessWordMap.set(guild.id, existingGuessWordData);
    } else {
      if (existingGuessWordData?.word.split(' ')[1] !== oldWord.split(' ')[0]) {
        return interaction.followUp(getMSG('notValidWord'));
      }
      if (existingGuessWordData?.guessed.includes(oldWord)) {
        return interaction.followUp(getMSG('guessedWord'));
      }
    }

    const nextWord = getTheWord({
      history: existingGuessWordData.guessed,
      oldWord
    })

    if (!nextWord) {
      global.guessWordMap.delete(guild.id);
      return await interaction.followUp({
        content: `**${member.nickname}:** ${oldWord}\n**Bot:** ${getMSG('notFoundNextWord')}`,
        // components: [SongButtons],
      });
    }

    global.guessWordMap.set(guild.id, {
      ...existingGuessWordData,
      word: nextWord,
      guessed: [...existingGuessWordData.guessed, nextWord]
    })

    // Send the message and save its ID for later updates
    await interaction.followUp({
      content: `**${member.nickname}:** ${oldWord}\n**Bot:** ${nextWord}`,
      // components: [SongButtons],
    });
    console.log(`Guess the word - Bot:`, nextWord);


  } catch (error) {
    console.error(getMSG('error', error.message));
  }
}