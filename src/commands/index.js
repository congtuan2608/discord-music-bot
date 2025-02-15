import sayText from "./say.js";
import SONG_COMMANDS from "./song/index.js";
import NOT_TU_COMMANDS from "./noitu/index.js";
import XI_DACH_COMMANDS from "./xi-dach/index.js";

const COMMANDS = {
  // ========= SONG =========
  ...SONG_COMMANDS,
  // ========= GAME: NỐI TỪ =========
  ...NOT_TU_COMMANDS,
  // ========= GAME: XÌ LÁT =========
  ...XI_DACH_COMMANDS,
  // ========= OTHERS =========
  say: {
    func: sayText,
    description: "Nói gì đó",
    options: [
      {
        name: "content",
        description: "Nội dung cần nói",
        type: 3,
        required: false,
      },
    ],
  },
}

export default COMMANDS;