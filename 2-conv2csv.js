const fs =require('fs')
const path = require('path')

convertToCSV(path.join(__dirname, 'database'))

function convertToCSV (dbdir) {
	//filename
	const imgFile = path.join(dbdir, 'images-idx3')
	const lblFile = path.join(dbdir, 'labels-idx1')
	const csvFile = path.join(dbdir, 'images.csv')
	//open file
	const imgF = fs.openSync(imgFile, 'r')
	const lblF = fs.openSync(lblFile, 'r')
	const outF = fs.openSync(csvFile, 'w+')

	//read header
	const ibuf = Buffer.alloc(16)
	fs.readSync(imgF, ibuf, 0, ibuf.length)
	const magic = ibuf.readUInt32BE(0)
	const numImages = ibuf.readUInt32BE(4)
	const numRows = ibuf.readUInt32BE(8)
	const numCols = ibuf.readUInt32BE(12)
	const numPixels = numRows * numCols
	//check header
	if (magic !== 2051) throw new Error('The file is broken!')
	console.log('images=', numImages, numRows, 'x', numCols)
	
	//read header of label database
	const lbuf = Buffer.alloc(8)
	fs.readSync(lblF, lbuf, 0, lbuf.length)
	const magicl = lbuf.readUInt32BE(0)
	if(magicl !== 2049) throw new Error('The file is broken!')
	
	//pull the images
	const pixels = Buffer.alloc(numPixels)
	const labelb = Buffer.alloc(1)
	
	for(let i = 0; i < numImages; i++){
		//render progress to console
		if (i % 1000 === 0) console.log(i, '/', numImages)
		
		//read images
		fs.readSync(imgF, pixels, 0, numPixels)
		fs.readSync(lblF, labelb, 0, 1)
		const line = new Uint8Array(pixels)
		const label = labelb.readInt8(0)
		//save as .pgm
		if (i < 20){
			let s = 'P2 28 28 255\n'
			for(let j = 0; j < numPixels; j++){
				s += line[j].toString()
				s += (j % 28 === 27) ? '\n' : ' '
			}
			const savefile = path.join(dbdir, label + '_test_' + i + '.pgm')
			fs.writeFileSync(savefile, s, 'utf-8')
		}
		const csvline = label + ',' + line.join(',') + '\n'
		fs.writeSync(outF, csvline, 'utf-8')
	}
	console.log('OK')
}