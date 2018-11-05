const {Client, DefaultMediaReceiver} = require('castv2-client')
const googletts = require('google-tts-api')

const onDeviceUp = (host, url) => new Promise((resolve, reject) => {
  const client = new Client()
  client.connect(host, () => {
    client.launch(DefaultMediaReceiver, (err, player) => {
      var media = {
        contentId: url,
        contentType: 'audio/mp3',
        streamType: 'BUFFERED'
      }
      player.load(media, { autoplay: true }, (err, status) => {
        client.close()
        resolve('Device notified')
      })
    })
  })
  client.on('error', err => {
    console.log('Error: %s', err.message)
    client.close()
    reject(err)
  })
})

const getSpeechUrl = async (ip, message) => {
  const url = await googletts(message, 'ja', 1, 1000, 'ja-JP')
  const res = await onDeviceUp(ip, url)
  return res
}

exports.notify = async (ip, message) => {
  try {
    const res = await getSpeechUrl(ip, message)
    return res
  } catch (err) {
    console.error(err)
  }
}
