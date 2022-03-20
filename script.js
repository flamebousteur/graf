var graf = function (element, option) {
	this.canvas = element
	this.color = "#000"
	this.lwidth = 1
	this.pwidth = 2
	this.xaxe = "x"
	this.yaxe = "y"
	this.data = []
	if (option) {
		if (option.content) {
			this.data = option
		}
		if (option.x) {
			this.xaxe = option.x
		}
		if (option.y) {
			this.yaxe = option.y
		}
	}
}

// x and y in %
graf.prototype.setpoint = function (x, y){
	let canvas = this.canvas
	if(canvas.getContext){
		let ctx = canvas.getContext('2d');
		x = x * canvas.width / 100
		y = (100-y) * canvas.height / 100
		ctx.beginPath()
		ctx.arc(x,y, this.pwidth, 0, 2 * Math.PI)
		ctx.fillStyle = this.color
		ctx.fill()
		return true
	} else {
		return false
	}
}

// x1, y1, x2 and y2 in %
graf.prototype.setline = function (x1, y1, x2, y2){
	let canvas = this.canvas
	if(canvas.getContext){
		let ctx = canvas.getContext('2d');
		x1 = x1 * canvas.width / 100
		y1 = (100-y1) * canvas.height / 100
		x2 = x2 * canvas.width / 100
		y2 = (100-y2) * canvas.height / 100
		ctx.beginPath()
		ctx.lineWidth = this.lwidth
		ctx.moveTo(x1, y1)
		ctx.lineTo(x2, y2)
		ctx.strokeStyle = this.color
		ctx.stroke()
		return true
	} else {
		return false
	}
}

graf.prototype.init = function(d){
	let data;
	if (d) {
		data = d
	} else {
		data = this.data
	}
	for (let i = 0; i < data.length; i++) {
		if(data[i][1] < ymin){
			ymin = data[i][1]
		}
		if(data[i][1] > ymax){
			ymax = data[i][1]
		}
		if(data[i][0] < xmin){
			xmin = data[i][0]
		}
		if(data[i][0] > xmax){
			xmax = data[i][0]
		}
	}
	if (b) {
		
	}
	return [ymin, ymax, xmin, xmax]
}

// data:
// [[<point 1 x>, <point 1 y>],[<point 2 x>, <point 2 y>]]
// [[     1     ,      5     ],[     2     ,     10     ]]
graf.prototype.ggraf = function (data){
	let canvas = this.canvas
	if(canvas.getContext){
		let ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		let ymin = data[0][1]
		let ymax = 0
		let xmin = data[0][0]
		let xmax = 0
		for (let i = 0; i < data.length; i++) {
			if(data[i][1] < ymin){
				ymin = data[i][1]
			}
			if(data[i][1] > ymax){
				ymax = data[i][1]
			}
			if(data[i][0] < xmin){
				xmin = data[i][0]
			}
			if(data[i][0] > xmax){
				xmax = data[i][0]
			}
		}
		let graf = []
		for (let i = 0; i < data.length; i++) {
			graf[i] = []
			graf[i][0] = (data[i][0]-xmin) * 100 / (xmax-xmin)
			graf[i][1] = (data[i][1]-ymin) * 100 / (ymax-ymin)
			this.setpoint(graf[i][0],graf[i][1])
			if (graf[i-1]) {
				this.setline(graf[i-1][0],graf[i-1][1],graf[i][0],graf[i][1])
			}
		}
		return true
	}else{
		return false
	}
}

function aerf(data){
	let result = []
	data = data.split(',')
	for (let i = 0; i < data.length; i++) {
		let b = data[i].split("=")
		result.push([parseInt(b[0]),parseInt(b[1])])
	}
	return result
}

window.onload = function () {
	let d = '1=20, 2=10, 3=40, 4=20, 5=15, 6=40, 7=50, 8=65, 9=70, 10=90, 11=100, 12=125, 13=130, 14=100, 15=15, 20=20,'
	d = aerf(d)
	data = {content:d}
	let canvas = document.createElement("canvas")
	document.body.appendChild(canvas)
	g = new graf(canvas)
	let b = document.createElement("button")
	document.body.appendChild(b)
	b.innerHTML = 'start'
	b.onclick = function () {
		g.ggraf(data.content)
	}
}