
const MSG = {
  // error
  error: '❌ Có lỗi xảy ra!',
  // queue
  queue: 'À, kaoo nhớ rồi nè, đây là danh sách bài hát đang chờ',
  notQueue: '❌ Kaoo không nhớ được bài hát nào trong hàng đợi cả',
  // pause
  pause: '⏸️ Kaoo dừng hát rồi đấy~',
  paused: '🛑 Bài hát đã được tạm dừng trước đó',
  notPaused: '❌ Không thể tạm dừng bài hát',
  // stop
  stop: '⏹️ Kaoo đã dừng hát rồi đấy',
  // resume
  resume: '▶️ Đã tiếp tục phát nhạc!',
  statusResume: '▶️ Bài hát đang được phát hoặc chưa tạm dừng!',
  cantResume: '❌ Không thể tiếp tục phát nhạc',
  //play
  play: '🎶🎙️ Kaoo bắt đầu hát đây',
  notPlaying: '❌ Kaoo im lặng nảy giờ mà, có hát gì đâu??',
  // skip
  skip: '⏭️ Đã bỏ qua bài hát',
  notSkip: '❌ Không thể bỏ qua bài hát',
  skipNotInVoice: '❌ Bạn phải ở trong kênh voice để bỏ qua bài hát!',
  skipInvalidIndex: 'Chỉ số bài hát không hợp lệ!',
  // voice
  notInVoice: '❌ Kaoo không ở trong kênh voice nào dừng kiểu lz gì?',
  // query
  noQuery: 'Hãy nhập tên bài hát hoặc link YouTube!',
  notFoundQuery: '❌ Không tìm thấy bài hát này',
  notInChannel: '❌ Mài phải ở trong kênh voice để kaoo hát cho nghe!',
  // say
  say: 'Kaoo nói: ',
  noText: 'Mày không nhập nội dung thì tao nói cái lồn gì?',

  // guess word
  guessWord: '🎮 Game đoán từ',
  requireWord: 'Mày hãy nhập từ vào!',
  requireTwoWords: 'Từ phải có 2 từ chứ thằng lz!',
  notValidWord: 'Từ này đéo không hợp lệ, phải bắt đầu bằng từ cuối cùng của từ trước!',
  guessedWord: 'Từ này đã được sử dụng rồi!',
  notFoundNextWord: 'Không tìm thấy từ tiếp theo! Tao chịu đấy!',

  // xi dach
  xiDach: '🎮 Game xì dách',
  joinSuccess: 'Tham gia game thành công!',
  joinError: 'Có lỗi khi tham gia game!',
  alreadyJoin: 'Mày đã tham gia game rồi!',
  startGame: 'Bắt đầu game!',
  notEnoughPlayers: 'Không đủ người chơi!',
  notInGame: 'Mày không ở trong game!',
  notYourTurn: 'Chưa đến lượt mày!',
  notValidCard: 'Lá bài không hợp lệ!',
  notValidAction: 'Hành động không hợp lệ!',
  getCardSuccess: 'Rút bài thành công!',
  maxLengthCard: 'Mày đã rút đủ số lượng lá bài! (5 lá)',
  skipTurn: 'Bỏ lượt rút bài!',
  gameNotStarted: 'Game chưa bắt đầu!',
  gameStarted: 'Game đã bắt đầu!',
  roomNotCreated: 'Phòng chơi chưa được tạo!',
  noCard: 'Không có lá bài nào!',
  notYourTurn: 'Chưa đến lượt mày!',
  gameStatus: 'Trạng thái game',
  notRoomOwner: 'Mày không phải chủ phòng!',
}

function getMSG(key, msg, options) {
  const defaultOptions = {
    bold: false,
    ...options
  }

  let msgFromObj = MSG[key]

  // make msg bold
  if(defaultOptions?.bold){
    msgFromObj = `**${msgFromObj}**`
  }

  return msgFromObj + (msg ? `: ${msg}` : '');
}

export { MSG, getMSG };