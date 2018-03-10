const {Client, DefaultMediaReceiver} = require('castv2-client')
const mdns = require('mdns')
const googletts = require('google-tts-api')
const browser = mdns.createBrowser(mdns.tcp('googlecast'))
let deviceAddress

exports.ip = ip => {
  deviceAddress = ip
}

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

const getSpeechUrl = async (text, host, callback) => {
  const url = await googletts(text, 'ja', 1, 1000, 'ja-JP')
  const res = await onDeviceUp(host, url)
  return res
}

exports.notify = async (message, callback) => {
  try {
    const res = await getSpeechUrl(message, deviceAddress)
    return res
  } catch (err) {
    console.error(err)
  }
}
