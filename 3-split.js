const fs = require('fs')
const path = require('path')
//open csv file
const csv = fs.readFileSync(
	path.join(__dirname, 'database', 'images.csv'), 'utf-8')
//split by \n
const a = csv.split('\n')
const shuffle = () => Math.random() - 0.5
const b = a.sort(shuffle)

const c1 = b.slice(0, 2000)
const c2 = b.slice(0, 2500)

//save file
fs.writeFileSync('image-train.csv', c1.join('\n'))
fs.writeFileSync('image-test.csv', c2.join('\n'))
console.log('ok')