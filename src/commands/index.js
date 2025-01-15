import playSong from "./play.js";
import skipSong from "./skip.js";
import stopSong from "./stop.js";


const COMMANDS = {
  play: {
    func: playSong,
    description: "Phát bài hát từ youtube",
    options: [
      {
        name: "song",
        description: "Tên bài hát hoặc link youtube",
        type: 3,
        required: true,
      },
    ],
  },
  stop: {
    func: stopSong,
    description: "Dừng bài hát đang phát",
  },
  skip: {
    func: skipSong,
    description: "Chuyển bài hát",
  },
}

export default COMMANDS;