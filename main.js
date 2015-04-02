/**
 @author Josh Gibbs (uPaymeiFixit@gmail.com)
*/

//Variables
var ctx,width,height,Tau=Math.PI*2,y1=[],y2=[],counterclockwise=[],x=[],circles,speed=0,timer;
var color = [['F00','F90','FF0','0F0','0FE','00F','F0C','FFF'],
			['0FE','0CF','0FA'],
			['F00','900','FF0'],
			['0FE','F90'],
			['44F','F0F'],
			['FFF','333','777','CCC','111','EEE','555','DDD','111','AAA','000','BBB','444']];
var set = Math.floor(Math.random()*color.length);
var lineWidth = 10; //width of ring
var spacing = 10; //space between rings
var size = 10; //center diameter

//Init function
window.onload = function (){
	ctx = document.getElementById("canvas").getContext("2d");
	setup();
	for(var i=0;i<circles;i++){
		x[i]=Math.random()*Math.PI
		counterclockwise[i] = Math.random() < 0.5 ? false : true;
	};
	setInterval('animate()',1000/30);
};

//Resize function
window.onresize = setup;		

//Iterates through the color schemes
function changeset(){
	set++;
	if (set >= color.length){
		set = 0;
	};
};

//Functions that need done on load and resize
function setup(){
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.lineWidth = lineWidth + 1;
	width = ctx.canvas.width;
	height = ctx.canvas.height;
	circles = Math.ceil((Math.sqrt(Math.pow((width), 2) + Math.pow((height), 2))-size) / (lineWidth + spacing));
};

//Changes iteration frequency on scroll
function scroll(){
	if (speed>=0) {
		speed+=window.event.wheelDelta/240;
		clearInterval(timer);
		if (speed<0) {
			speed=0;
		} else {
			timer = setInterval('changeset()',1000/speed);
		};
	};
};

//Math for angle starts and ends (I suck at math...)
function animate() {
	for(var i=0;i<circles;i++){
		x[i] += 0.01; if(x[i]>Math.PI){x[i] = 0};;

		y1[i] = Math.sin(x[i]);
		y2[i] = Math.cos(Math.sin(x[i]));

		if(y1[i].toFixed(1) === y2[i].toFixed(1)){ /* this does not work correctly, the numbers need not be rounded */
			if (counterclockwise[i]) {
				counterclockwise[i] = false;
			} else {
				counterclockwise[i] = true;
			};
		};
	};
	draw();
};

//Draws the arcs
function draw() {
	ctx.clearRect(0, 0, width, height);

	for(var i=0;i<circles;i++){
		ctx.strokeStyle = color[set][i%color[set].length];
		ctx.beginPath();
		ctx.arc(width/2,height/2,size+(lineWidth + spacing)*i,Tau*y1[i],Tau*y2[i], counterclockwise[i]);
		ctx.stroke();
	};
};