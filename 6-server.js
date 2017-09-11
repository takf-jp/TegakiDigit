const fs = require('fs')
const path = require('path')

const SVM_MODEL = path.join(__dirname, 'database', 'image-model.svm')
const portNo = process.env.PORT

//launch web server
const express = require('express')
const app = express()
app.listen(portNo, () => {
	console.log('Launched', `http://localhost:${portNo}`)
})

//read SVM model
const svm = require('node-svm')
const modelJSON = fs.readFileSync(SVM_MODEL, 'utf-8')
const model = JSON.parse(modelJSON)
const clf = svm.restore(model)

//API
app.get('/api/predict', (req, res) => {
	const px = req.query.px
	if (!px) {
		res.json({status: false})
		return
	}
	const pxa = px.split('').map(v => parseInt('0x' + v)*16)
	console.log('recieved', pxa.join(':'))
	clf.predict(pxa).then((label) => {
		res.json({status: true, label})
		
	})
})

app.use('/', express.static('./public'))