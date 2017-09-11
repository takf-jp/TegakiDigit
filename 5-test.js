const fs = require('fs')
const path = require('path')
const svm = require('node-svm')

// read result of leaning
const json = fs.readFileSync(
	path.join(__dirname, 'database', 'image-model.svm'), 'utf-8')
const model = JSON.parse(json)
const clf = svm.restore(model)

//read test data
const testData = loadCSV('image-test.csv')

let count = 0
let NG = 0
testData.forEach(ex => {
	const x = ex[0]
	const label = ex[1]
	const pre = clf.predictSync(x)
	if (label !== pre){
		NG++
		console.log('NG=',label,pre)
	}
	count++
})
console.log('Error rate=', (NG /count) * 100)

//load CSV and format to node-svm
function loadCSV (fname){
	const csv = fs.readFileSync(fname, 'utf-8')
	const lines = csv.split('\n')
	const data = lines.map(line => {
		const cells = line.split(',')
		const x = cells.map(v => parseInt(v))
    const label = x.shift()
    return [x, label]
	})
	return data
}