// import storage from 'electron-json-storage'

// const options = {
//   timeMoment: 'LTS'
// }

// function updateOptions(callback) {
//   storage.set('options', options, callback)
// }
// function getOptions(callback) {
//   storage.get('options', (err, data) => {
//     if (err) return console.error(err)
//     if (data) options = data
//     else updateOptions()
//       callback()
//   })
// }
// getOptions(() => {
//   console.log('init Options')
// })

// export default {
//   get (key, callback) {
//     getOptions(() => {
//       callback(options[key])
//     })
//   },
//   set (key, value, callback) {
//     options[key] = value
//     updateOptions(callback)
//   }
// }
