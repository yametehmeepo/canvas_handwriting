var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var canvasWidth = Math.min(800, $(window).width() - 20);
var canvasHeight = canvasWidth;
var isMouseDown = false;
var lastLoc = { x: 0, y: 0 };
var lastTime = 0;
var lastLineWidth = -1
var strokeColor = 'black';

var minV = 0.1
var maxV = 10
var maxLineWidth = 3 * canvasWidth/80
var minLineWidth = maxLineWidth/6

window.onload = function(){
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	$('.btngroup').css('width', canvasWidth + 'px')
	drawGrid();
	canvas.onmousedown = function(e){
		e.preventDefault();
		begin({x: e.clientX, y: e.clientY})
	}
	canvas.onmouseup = function(e){
		e.preventDefault();
		end()
	}
	canvas.onmouseout = function(e){
		e.preventDefault();
		end()
	}
	canvas.onmousemove = function(e){
		e.preventDefault();
		if(isMouseDown){
			move({x: e.clientX, y: e.clientY})
		}
	}
	canvas.addEventListener('touchstart', function(e){
		e.preventDefault()
		var touch = e.touches[0]
		begin({x: touch.pageX, y: touch.pageY})
	})
	canvas.addEventListener('touchmove', function(e){
		e.preventDefault()
		var touch = e.touches[0]
		if(isMouseDown){
			move({x: touch.pageX, y: touch.pageY})
		}
	})
	canvas.addEventListener('touchend', function(e){
		e.preventDefault()
		end()
	})

	$('#clearbtn').click(function(){
		context.clearRect(0, 0, canvas.width, canvas.height)
		drawGrid()
	})
	$('.colorbtn').click(function(){
		$('.colorbtn').removeClass('on')
		$(this).addClass('on')
		strokeColor = $(this).css('background-color')
	})
}

function begin(point){
	isMouseDown = true;
	lastLoc = windowToCanvas(point.x, point.y);
	lastTime = new Date().getTime();
}

function move(point){
	var curLoc = windowToCanvas(point.x, point.y);
	var curTime = new Date().getTime();
	var s = calcDistance(curLoc, lastLoc);
	var t = curTime - lastTime;
	var lineWidth = calcLineWidth(s, t);

	context.beginPath();
	context.moveTo(lastLoc.x, lastLoc.y);
	context.lineTo(curLoc.x, curLoc.y);
	context.strokeStyle = strokeColor;
	context.lineWidth = lineWidth;
	context.lineCap = 'round';
	context.lineJoin = 'round';
	context.stroke();

	lastLoc = curLoc;
	lastTime = curTime;
	lastLineWidth = lineWidth
}


function end(){
	isMouseDown = false;
	lastLineWidth = -1;
}

function drawGrid(){
	context.save();
	context.strokeStyle = 'rgb(230, 11, 9)';
	context.beginPath();
	context.lineWidth = 6;
	context.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
	context.beginPath();
	context.setLineDash([5, 10, 15])
	context.moveTo(0, 0);
	context.lineTo(canvas.width, canvas.height);
	context.moveTo(canvas.width, 0);
	context.lineTo(0, canvas.height);
	context.moveTo(0, canvas.height/2);
	context.lineTo(canvas.width, canvas.height/2);
	context.moveTo(canvas.width/2, 0);
	context.lineTo(canvas.width/2, canvas.height);
	context.lineWidth = 1;
	context.stroke();
	context.restore();
}

function windowToCanvas(clientX, clientY){
	var BoundingClientRect = canvas.getBoundingClientRect();
	return { 
		x: Math.round(clientX - BoundingClientRect.left),
		y: Math.round(clientY - BoundingClientRect.top)
	}
}

function calcDistance(curLoc, lastLoc){
	return Math.sqrt((curLoc.x - lastLoc.x) * (curLoc.x - lastLoc.x) + (curLoc.y - lastLoc.y) * (curLoc.y - lastLoc.y))
}

function calcLineWidth(s, t){
	var v = s/t
	var reslineWidth
	if(v < minV){
		reslineWidth = maxLineWidth
	}else if(v > maxV){
		reslineWidth = minLineWidth 
	}else{
		reslineWidth = maxLineWidth - (v - minV)/(maxV - minV) * (maxLineWidth - minLineWidth)
	}

	if(lastLineWidth == -1){
		return reslineWidth
	}
	return Math.sqrt(lastLineWidth*lastLineWidth*2/3 + reslineWidth*reslineWidth*1/3)
}


