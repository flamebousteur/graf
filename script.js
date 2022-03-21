var graf = function (element, option) {
	this.canvas = element
	this.color = "#000"
	this.lwidth = 1
	this.pwidth = 2
	this.xaxe = "x"
	this.yaxe = "y"
	this.data = []
	if (option) {
		if (option.table) {
			this.data = option.table
		}
		if (option.x) {
			this.xaxe = option.x
		}
		if (option.y) {
			this.yaxe = option.y
		}
		if (option.width) {
			this.canvas.width = option.width
		}
		if (option.height) {
			this.canvas.height = option.height
		}
		if (option.lwidth) {
			this.lwidth = option.lwidth
		}
		if (option.pwidth) {
			this.pwidth = option.pwidth
		}
		if (option.color) {
			this.color = option.color
		}
	}
}

graf.prototype.getpoint = function(point,data = this.data){
	let result = []
	for (let i = 0; i < data.length; i++) {
		if (data[i+1]) {
			let mn = this.minmax([data[i],data[i+1]])
			if (mn.xmax >= point && mn.xmin <= point) {
				let r = this.thl([data[i],data[i+1]],point)
				result.push([point,r])
				let gmn = this.minmax(data)
				this.setpoint((point-gmn.xmin) * 100 / (gmn.xmax-gmn.xmin),(r-gmn.ymin) * 100 / (gmn.ymax-gmn.ymin))
			}
		}
	}
	return result
}

graf.prototype.thl = function(d,point){
	let mn = this.minmax(d)
	x = mn.xmin - mn.xmax
	y = mn.ymin - mn.ymax
	let result = point * y / x
	return result
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

graf.prototype.minmax = function(data = this.data){
	let result = {ymin:data[0][1], ymax:0, xmin:data[0][1], xmax:0}
	for (let i = 0; i < data.length; i++) {
		if(data[i][1] < result.ymin){
			result.ymin = data[i][1]
		}
		if(data[i][1] > result.ymax){
			result.ymax = data[i][1]
		}
		if(data[i][0] <result. xmin){
			result.xmin = data[i][0]
		}
		if(data[i][0] > result.xmax){
			result.xmax = data[i][0]
		}
	}
	return result
}

// data:
// [[<point 1 x>, <point 1 y>],[<point 2 x>, <point 2 y>]]
// [[     1     ,      5     ],[     2     ,     10     ]]
graf.prototype.ggraf = function (data = this.data){
	let canvas = this.canvas
	if(canvas.getContext){
		let ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		let mn = this.minmax(data)
		let graf = []
		for (let i = 0; i < data.length; i++) {
			graf[i] = []
			graf[i][0] = (data[i][0]-mn.xmin) * 100 / (mn.xmax-mn.xmin)
			graf[i][1] = (data[i][1]-mn.ymin) * 100 / (mn.ymax-mn.ymin)
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
		if (b[0]) {
			result.push([parseInt(b[0]),parseInt(b[1])])
		}
	}
	return result
}

window.onload = function () {
	let d = '1=20, 2=10, 3=40, 4=20, 5=15, 6=40, 7=50, 8=65, 9=70, 10=90, 11=100, 12=125, 13=130, 14=100, 15=15, 20=20,'
	d = aerf(d)
	let datas = {
		table:d,
		x:"time",
		y:"heat",
		with:300,
		height:150,
	}
	let canvas = document.createElement("canvas")
	document.body.appendChild(canvas)
	g = new graf(canvas)
	g.data = datas.table
	g.ggraf()
}