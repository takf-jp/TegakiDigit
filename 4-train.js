const fs = require('fs')
const path = require('path')
const svm = require('node-svm')

//load csv file
const data = loadCSV('image-train.csv')

//leaning data with node-svm
const clf = new svm.CSVC()
clf.train(data)
   .progress(progress => {
   	console.log('learning: %d%', Math.round(progress * 100))
   })
   .spread((model, report) => {
   	 // save result of learning
   	 const json = JSON.stringify(model)
   	 fs.writeFileSync(
   	 	 path.join(__dirname, 'database', 'image-model.svm'), json)
   	 console.log('Complete!')	
   })

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