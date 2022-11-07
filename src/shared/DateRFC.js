const data = new Date()
const oneHour = data.getHours() + 1
data.setHours(oneHour)
const formatData = data.toISOString().split('')
formatData.splice(22, 1)
const dataRFC = formatData.join('')

const oneDay = new Date()
const dia1 = oneDay.getDate() - 1
oneDay.setDate(dia1)
const formatYesterday = oneDay.toISOString().split('')
formatYesterday.splice(22, 1)
const yesterday = formatYesterday.join('')

module.exports = { yesterday, dataRFC }
