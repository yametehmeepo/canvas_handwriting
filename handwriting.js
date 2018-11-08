var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var canvasWidth = 800;
var canvasHeight = canvasWidth;
var isMouseDown = false;
var lastLoc = { x: 0, y: 0 };
var lastTime = 0;
var lastLineWidth = -1
var strokeColor = 'black';

window.onload = function(){
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	drawGrid();
	canvas.onmousedown = function(e){
		e.preventDefault();
		isMouseDown = true;
		lastLoc = windowToCanvas(e.clientX, e.clientY);
		lastTime = new Date().getTime();
	}
	canvas.onmouseup = function(e){
		e.preventDefault();
		isMouseDown = false;
		lastLineWidth = -1;
	}
	canvas.onmouseout = function(e){
		e.preventDefault();
		isMouseDown = false;
		lastLineWidth = -1;
	}
	canvas.onmousemove = function(e){
		e.preventDefault();
		if(isMouseDown){
			var curLoc = windowToCanvas(e.clientX, e.clientY);
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
	}
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


var minV = 0.1
var maxV = 10
var maxLineWidth = 30
var minLineWidth = 5

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


