import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'
import styles from './styles'

const numRows = 28
const numCols = 28
const numPixels = numRows * numCols
const sizeRow = 10
const sizeCol = 10

//Client:Main component
class TegakiApp extends React.Component{
	constructor(props){
		super(props)
		this.canvas = this.ctx = null
		this.state = {
			isDown: false, //mouse motion
			pixels: null,
			label: '?'
		}
	}
	componentDidMount(){
		this.clearPixels()
	}
	//clear image data
	clearPixels(){
		const p = []
		for (let i = 0; i < numPixels; i++) p.push(0)
		this.setState({
			pixels: p,
			label: '?'
		})
	}
	componentDidUpdate(){
		this.drawCanvas()
	}
	//drawing
	drawCanvas(){
		if (!this.canvas) return
		if (!this.ctx) this.ctx = this.canvas.getContext('2d')
		this.ctx.clearRect(0, 0, 280, 280)
		//render additional lines to canvas
		this.ctx.strokeStyle = 'silver'
		this.ctx.moveTo(140,0)
		this.ctx.lineTo(140,280)
		this.ctx.moveTo(0,140)
		this.ctx.lineTo(280,140)
		this.ctx.stroke()
	  //render dots to canvas
	  this.ctx.fillStyle = 'blue'
	  for (let y = 0; y < 28; y++) {
	    for(let x = 0; x < 28; x++){
	    	const p = this.state.pixels[y * numRows + x]
	    	  if (p === 0) continue
	    	    const xx = x*sizeCol
	    	    const yy = y*sizeRow
	    	    this.ctx.fillRect(xx, yy, sizeCol, sizeRow)
	    }	
	  }	
	}
	//mouse motion
	doMouseDown(e){
		e.preventDefault()
		this.setState({isDown:true})
	}
	doMouseUp(e){
		e.preventDefault()
		this.setState({isDown:false})
    this.predictLabel()
	}
	doMouseMove(e){
		e.preventDefault()
		if(!this.state.isDown) return
		  const eve = e.nativeEvent
		  const b = e.target.getBoundingClientRect()
		  const rx = eve.clientX - b.left
		  const ry = eve.clientY - b.top
		  const x = Math.floor(rx/sizeCol)
		  const y = Math.floor(ry/sizeRow)
		  const pixels = this.state.pixels
		  pixels[y*numRows+x] = 0xF
		  this.setState({pixels})
	}
	predictLabel(){
		const px = this.state.pixels.map(
			v => v.toString(16)).join('')
		request.get('/api/predict')
		.query({px})
		.end((err, res) => {
			if(err) return
			if(res.body.status){
				this.setState({label:res.body.label})
			}
		})
	}
	render(){
		return(
			<div style = {styles.app}>
			  <canvas ref={(e) => {this.canvas = e }}
			    width={280} height={280} style={styles.canvas}
			    onMouseDown={e => this.doMouseDown(e)}
			    onMouseMove={e => this.doMouseMove(e)}
			    onMouseUp={e => this.doMouseUp(e)}
			    onMouseOut={e => this.doMouseUp(e)} />
			  <p style={styles.predict}>文字認識結果:{this.state.label}></p>
			  <button onClick={e=>this.clearPixels()}>Clear</button>
			</div>
			)
	}
}

ReactDOM.render(
	<TegakiApp />,
	document.getElementById('root'))