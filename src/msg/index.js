
const MSG = {
  // error
  error: '❌ Cứu kaoo, hết hát được rồi',
  // queue
  queue: 'À, kaoo nhớ rồi nè, đây là danh sách bài hát đang chờ',
  notQueue: '❌ Kaoo không nhớ được bài hát nào trong hàng đợi cả',
  // pause
  pause: '⏸️ Kaoo dừng hát rồi đấy~',
  paused: '⏸️ Bài hát đã được tạm dừng trước đó',
  // stop
  stop: '⏹️ Kaoo đã dừng hát rồi đấy',
  // resume
  resume: '▶️ Bài hát đang được phát hoặc chưa tạm dừng',
  //play
  play: '🎶 Kaoo bắt đầu hát đây',
  notPlaying: '❌ Kaoo im lặng nảy giờ mà, có hát gì đâu??',
  // voice
  notInVoice: '❌ Kaoo không ở trong kênh voice nào dừng kiểu lz gì?',
}

function getMSG(key, msg, options) {
  let msgFromObj = MSG[key]

  // make msg bold
  if(options?.bold){
    msgFromObj = `**${msg}**`
  }

  return msgFromObj + (msg ? `: ${msg}` : '');
}

export { MSG, getMSG };