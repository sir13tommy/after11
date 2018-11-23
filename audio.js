const ffmpeg = require('fluent-ffmpeg')
const glob = require('glob')
const path = require('path')
const mkdirp = require('node-mkdirp')
const fs = require('fs')

const audioPath = `./assets/sounds/`
const distPath = `./assets/sounds/.dist/`

mkdirp(distPath, (err) => {
  if (err) console.log(err)
})

glob(`${audioPath}*.mp3`, (err, files) => {
  if (err) console.log(err)
  files.forEach(filePath => {
    let fileName = path.basename(filePath)
    ffmpeg(filePath)
      .audioBitrate(64)
      .audioFrequency(22050)
      .saveToFile(path.resolve(distPath, fileName))
  })
})
