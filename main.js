/**
 * @author Josh Gibbs (uPaymeiFixit@gmail.com)
 */

const progress_speed = 0.005;
let ring_width = 10;
let ring_spacing = 10;
const themes = [
	['#FF0000','#FF9900','#FFFF00','#00FF00','#00FFEE','#0000FF','#FF00CC','#FFFFFF'],
	['#00FFEE','#00CCFF','#00FFAA'],
	['#FF0000','#990000','#FFFF00'],
	['#00FFEE','#FF9900'],
	['#4444FF','#FF00FF'],
	['#FFFFFF','#333333','#777777','#CCCCCC','#111111','#EEEEEE','#555555','#DDDDDD','#111111','#AAAAAA','#000000','#BBBBBB','#444444']
];

let theme_index = Math.floor(Math.random() * themes.length);
let ring_start_position = [];
let ring_end_position = [];
let counterclockwise = [];
let linear_progress = [];
let scroll_speed = 0;
let ctx;
let ring_count;

// Init function
window.onload = () => {
	ctx = document.getElementsByTagName('canvas')[0].getContext('2d');

	window.onresize = resize;
	window.ondblclick = ctx.canvas.webkitRequestFullScreen;
	window.onmousewheel = scroll;
	window.onclick = changeTheme;

	resize();
	getRingCount();

	for (let i = 0; i < ring_count; i++) {
		linear_progress[i] = Math.random() * Math.PI;
		counterclockwise[i] = Math.random() < 0.5 ? false : true;
	}

	window.requestAnimationFrame(animate);
}

// Calculate the number of rings to generate
function getRingCount () {
	const maximum_radius = Math.sqrt(Math.pow(ctx.canvas.width, 2) + Math.pow(ctx.canvas.height, 2)) / 2;
	const effective_width = ring_width + ring_spacing;
	ring_count = Math.ceil(maximum_radius / effective_width);
	if (ring_count > 500) {
		ring_count = 500;
	}
}

function resize () {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx.lineWidth = ring_width;
}

// Iterates through the color schemes
function changeTheme () {
	theme_index = (theme_index + 1) % themes.length;
}

// Changes iteration frequency on scroll
function scroll () {
	ring_spacing -= Math.ceil(window.event.wheelDelta / 240);
	if (ring_spacing < 0) {
		ring_spacing = 0;
	}

	ring_width -= Math.ceil(window.event.wheelDelta / 240);
	if (ring_width < 1) {
		ring_width = 1;
	}

	const old_ring_count = ring_count;

	resize();
	getRingCount();

	for (let i = old_ring_count; i < ring_count; i++) {
		linear_progress[i] = Math.random() * Math.PI;
		counterclockwise[i] = Math.random() < 0.5 ? false : true;
	}
}

// Calculate ring positions
function animate () {
	window.requestAnimationFrame(animate);

	for (let i = 0; i < ring_count; i++) {
		// Increase the linear position
		linear_progress[i] += progress_speed;
		if (linear_progress[i] > Math.PI) {
			linear_progress[i] = 0;
		}

		// Calculate the starting and stopping points of the ring using sine and cosine for a cool effect
		ring_start_position[i] = Math.sin(linear_progress[i]);
		ring_end_position[i] = Math.cos(Math.sin(linear_progress[i]));

		// If the ends meet each other, swap the direction. Do not calculate exactly to achieve flashes
		if (ring_start_position[i].toFixed(1) === ring_end_position[i].toFixed(1)) {
			counterclockwise[i] = !counterclockwise[i];
		}
	}

	draw();
}

//Draws the arcs
function draw () {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	for (let i = 0; i < ring_count; i++) {
		ctx.strokeStyle = themes[theme_index][i % themes[theme_index].length];
		ctx.beginPath();
		ctx.arc(
			ctx.canvas.width / 2, 
			ctx.canvas.height / 2, 
			ring_spacing + (ring_width + ring_spacing) * i,
			Math.PI * 2 * ring_start_position[i],
			Math.PI * 2 * ring_end_position[i],
			counterclockwise[i]
		);
		ctx.stroke();
	}
}
