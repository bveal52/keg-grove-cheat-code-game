/**
 * @author 
 * Brady Veal
 */


let canvas = document.querySelector("#canvas");
const scoreEl = document.querySelector("#scoreEl");
//const gamepadCanvas = document.querySelector("#gamepad-canvas")
let c = canvas.getContext("2d");
//const gamepadC = canvas.getContext("2d");

// canvas.width = 1024;
// canvas.height = 768;

//upper 2/3's of the screen is the game
canvas.width = window.innerWidth / 1.2;
canvas.height = window.innerHeight - 100;
let gameScreenBuffer = window.innerHeight / 1.2;
console.log(window.innerWidth / 1.5, window.innerHeight);
console.log(canvas.width, canvas.height);


function resize_canvas(){
	canvas = document.getElementById("canvas");
	if (canvas.width < 768 || canvas.height > 1500) {
		canvas.width = window.innerWidth;
		console.log(canvas.width);
	}

	if (canvas.height < 1200 || canvas.height > 1500) {
		canvas.height = window.innerHeight;
		console.log(canvas.height);
	}
}


//bottom 1/3 of the screen is the gamepad
// gamepadCanvas.width = innerWidth / 1.5;
// gamepadCanvas.height = innerHeight / 3;
// console.log(gamepadCanvas.height);
//gamepadC.moveTo(innerWidth / 2, innerHeight / 2);





class Player {
	constructor() {

		this.velocity = {
			x: 0,
			y: 0
		}

		this.rotation = 0
		this.opacity = 1
		

		const image = new Image()
		image.src = './imgs/beer_guy.png'

		image.onload = () => {

			const scale = 0.038


			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale

			this.position = {
				x: canvas.width / 2 - this.width / 2,
				y: gameScreenBuffer - this.height - 20
				// x: 200,
				// y: 200
			}


		}

	}

	draw() {

		c.save()

		c.globalAlpha = this.opacity
		c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)

		c.rotate(this.rotation)

		c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)

		c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)


		c.restore()
	}

	update() {
		if (this.image) {
			this.draw()
			this.position.x += this.velocity.x
		}
	}
}

class Projectile {

	constructor(position, velocity) {
		this.position = position
		this.velocity = velocity

		this.radius = 3
	}

	draw() {
		c.beginPath()
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = "red"
		c.fill()
		c.closePath()
	}

	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}

class Particle {

	constructor({
		position,
		velocity,
		radius,
		color,
		fades
	}) {
		this.position = position
		this.velocity = velocity
		this.radius = radius
		this.color = color
		this.opactiy = 1
		this.fades = fades

	}

	draw() {
		c.save()
		c.globalAlpha = this.opactiy
		c.beginPath()
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
		c.closePath()
		c.restore()
	}

	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if(this.fades) {
		this.opactiy -= 0.01
		}
	}
}

class ScoreImg {

	constructor({
		position,
		velocity,
		fades
	}) {
		this.position = position
		this.velocity = velocity


		const image = new Image()
		image.src = './imgs/points.png'

		image.onload = () => {

			const scale = 1

			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale

			// this.position = {
			// 	x: canvas.width / 2 - this.width / 2,
			// 	y: gameScreenBuffer - this.height - 20
			// 	// x: 200,
			// 	// y: 200
			// }


		}

		this.opactiy = 1
		this.fades = fades

	}

	draw() {
		c.save()
		c.globalAlpha = this.opactiy
		c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
		c.restore()
	}

	update() {

		if (this.image) {
			this.draw()
			this.position.x += this.velocity.x
			this.position.y += this.velocity.y

			if(this.fades) {
			this.opactiy -= 0.01
			}
		}
	}
}

class InvaderProjectile {

	constructor({
		position,
		velocity
	}) {
		this.position = position
		this.velocity = velocity

		this.width = 3
		this.height = 10
	}

	draw() {
		c.fillStyle = "yellow"
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}

	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}

class Invader {
	constructor({
		position
	}) {

		this.velocity = {
			x: 0,
			y: 0
		}

		//this.rotation = 0

		const image = new Image()
		image.src = './imgs/beer_mug.png'

		image.onload = () => {

			const scale = 0.038


			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale

			this.position = {
				x: position.x,
				y: position.y
			}


		}

	}

	draw() {

		c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)

	}

	update({
		velocity
	}) {
		if (this.image) {
			this.draw()
			this.position.x += velocity.x
			this.position.y += velocity.y
		}
	}

	shoot(invaderProjectiles) {
		invaderProjectiles.push(new InvaderProjectile({
			position: {
				x: this.position.x + this.width / 2,
				y: this.position.y + this.height
			},
			velocity: {
				x: 0,
				y: 5
			}
		}))
	}
}

class Grid {
	constructor() {
		this.position = {
			x: 0,
			y: 0
		}

		this.velocity = {
			x: 3,
			y: 0
		}

		this.invaders = []

		const columns = Math.floor(Math.random() * 2 + 4)
		const rows = Math.floor(Math.random() * 2 + 2)

		this.width = columns * 30


		for (let i = 0; i < columns; i++) {
			for (let j = 0; j < rows; j++) {
				this.invaders.push(new Invader({
					position: {
						x: i * 30,
						y: j * 30
					}
				}))
				//console.log("here");
			}
		}
		console.log(this.invaders);
	}

	update() {
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		this.velocity.y = 0

		if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
			this.velocity.x = -this.velocity.x
			this.velocity.y = 30
		}
	}
}

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
const scoreImgs = []

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	space: {
		pressed: false
	}

}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500) + 1000
let numEnemies = 0
let game = {
	score: 0,
	lives: 3,
	level: 1,
	over: false,
	active: false
}
let score = 0


//create background particles
for (let i = 0; i < 100; i++) {
	particles.push(new Particle({
		position: {
			x: Math.floor(Math.random() * canvas.width),
			y: Math.floor(Math.random() * canvas.height)
		},
		velocity: {
			x: 0,
			y: 0.5
		},
		radius: Math.random() * 3,
		color: "white"
	}))
}

//create particles for collisions to player or invader
function createParticles({object, color, fades}) {
	for (let i = 0; i < 25; i++) {
		particles.push(new Particle({
			position: {
				x: object.position.x + object.width / 2,
				y: object.position.y + object.height / 2
			},
			velocity: {
				x: (Math.random() - 0.5) * 2,
				y: (Math.random() - 0.5) * 2
			},
			radius: Math.random() * 3,
			color: color || "white",
			fades
		}))
	}

}


//touch button controls : stack overflow
// Button = function(x, y, width, height, color) {

//     this.active = false;
//     this.color = color;
//     this.height = height;
//     this.width = width;
//     this.x = x;
//     this.y = y;

//   }

//   Button.prototype = {

//     // returns true if the specified point lies within the rectangle:
//     containsPoint:function(x, y) {

//       // if the point is outside of the rectangle return false:
//       if (x < this.x || x > this.x + this.width || y < this.y || y > this.y + this.width) {

//         return false;

//       }

//       return true;

//     }

//   };

//   controller = {

//     buttons:[

//       new Button(100, canvas.height / 1.3, 150, 150, "#f09000"),
//       new Button(500, canvas.height / 1.3, 150, 150, "#0090f0"),
//       new Button(700, canvas.height / 1.3, 150, 150, "#0090f0")

//     ],

//     testButtons:function(target_touches) {

//       var button, index0, index1, touch;

//       // loop through all buttons:
//       for (index0 = this.buttons.length - 1; index0 > -1; -- index0) {

//         button = this.buttons[index0];
//         button.active = false;

//         // loop through all touch objects:
//         for (index1 = target_touches.length - 1; index1 > -1; -- index1) {

//           touch = target_touches[index1];

//           // make sure the touch coordinates are adjusted for both the canvas offset and the scale ratio of the buffer and output canvases:
//           if (button.containsPoint((touch.clientX - display.bounding_rectangle.left) * display.buffer_output_ratio, (touch.clientY - display.bounding_rectangle.top) * display.buffer_output_ratio)) {

//             button.active = true;
//             break;// once the button is active, there's no need to check if any other points are inside, so continue

//           }

//         }

//       }

// 	}


//   };

// dynamic score functionality?

// function createScoreImg({object, fades}) {
// 	for (let i = 0; i < 1; i++) {
// 		scoreImgs.push(new ScoreImg({
// 			position: {
// 				x: object.position.x + object.width / 2,
// 				y: object.position.y + object.height / 2
// 			},
// 			velocity: {
// 				x: (Math.random() - 0.5) * 2,
// 				y: (Math.random() - 0.5) * 2
// 			},
// 			fades
// 		}))
// 	}

// }


//render touch buttons
// function renderButtons(buttons) {

// 	var button, index;

// 	//c.fillStyle = "#202830";
// 	//c.fillRect(0, 150, canvas.width, canvas.height);

// 	for (index = buttons.length - 1; index > -1; -- index) {

// 	  button = buttons[index];

// 	  c.fillStyle = button.color;
// 	  c.fillRect(button.x, button.y, button.width, button.height);

// 	}

//   }

//animation loop for game
function animate() {
	if(!game.active) {
		//window.location.href = "title-screen.html"
		toggleScreen("title-window",true)
		toggleScreen("game-window", false)
		return
	}

	//create canvas background
	requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height / 1.2)
	c.fillStyle = 'white'
	c.fillRect(0, canvas.height / 1.2, canvas.width, canvas.height - 200)

	//renderButtons(controller.buttons)

	//create canvas buttons

	//create gamepad controls
	// gamepadC.fillStyle = 'white'
	// gamepadC.fillRect(0, 0, gamepadCanvas.width, gamepadCanvas.height)
	// gamepadC.fillStyle = 'black'


	player.update()

	particles.forEach((particle, index) => {

		if(particle.position.y - particle.radius >= gameScreenBuffer){
			particle.position.x = Math.random() * canvas.width
			particle.position.y = -particle.radius
		}
		
		if (particle.opactiy <= 0) {
			setTimeout(() => {
			particles.splice(index, 1)
			}, 0)
		} else {
			particle.update()
		}
	})


	invaderProjectiles.forEach((invaderProjectile, index) => {
		//garbage collection
		if (invaderProjectile.position.y + invaderProjectile.height >= gameScreenBuffer) {
			setTimeout(() => {
				invaderProjectiles.splice(index, 1)
			}, 0)
		} else {
			invaderProjectile.update()
		}

		//projectile hits player
		if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y && invaderProjectile.position.x + invaderProjectile.width >= player.position.x && invaderProjectile.position.x <= player.position.x + player.width) {
			setTimeout(() => {
				invaderProjectiles.splice(index, 1)
				player.opacity = 0
				game.over = true
			}, 0)

			setTimeout(() => {
				game.active = false
			}, 2000)

			console.log("you lose");
			createParticles({object: player, color: "red", fades: true})
			game.over = true;
		}

		//console.log(invaderProjectiles);
	})


	projectiles.forEach((projectile, index) => {
		//garbage collection
		if (projectile.position.y + projectile.radius <= 0) {
			setTimeout(() => {
				projectiles.splice(index, 1)
			}, 0)
		} else {
			projectile.update()
		}
	})

	grids.forEach((grid, gridIndex) => {
		grid.update()

		numEnemies = grid.invaders.length

		 //spawn projectiles
		if (frames % 100 === 0 && grid.invaders.length > 0) {
			const invader = grid.invaders[Math.floor(Math.random() * grid.invaders.length)]
			invader.shoot(invaderProjectiles)
		}

		grid.invaders.forEach((invader, i) => {
			invader.update({
				velocity: grid.velocity
			})

			projectiles.forEach((projectile, j) => {

				//projectile hits invader
				if (projectile.position.y - projectile.radius <= invader.position.y + invader.height && projectile.position.x + projectile.radius >= invader.position.x && projectile.position.x - projectile.radius <= invader.position.x + invader.width && projectile.position.y + projectile.radius >= invader.position.y) {

					setTimeout(() => {
						const invaderFound = grid.invaders.find((invader2) => invader2 === invader)

						const projectileFound = projectiles.find((projectile2) => projectile2 === projectile)


						//remove invader and projectile
						if (invaderFound && projectileFound) {
							score += 100
							scoreEl.innerHTML = score

							createParticles({object: invader, fades: true})
							//createScoreImg({object: invader, fades: true})

							grid.invaders.splice(i, 1)
							projectiles.splice(j, 1)

							if (grid.invaders.length > 0) {
								const firstInvader = grid.invaders[0]
								const lastInvader = grid.invaders[grid.invaders.length - 1]

								grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
								grid.position.x = firstInvader.position.x
							} else {
								grids.splice(gridIndex, 1)
							}
						}
					}, 0)
				}
			})
		})
	})

	if (keys.a.pressed && player.position.x >= 0 || keys.ArrowLeft.pressed && player.position.x >= 0) {
		player.velocity.x = -5
		player.rotation = -0.15
	} else if (keys.d.pressed && player.position.x <= canvas.width - player.width || keys.ArrowRight.pressed && player.position.x <= canvas.width - player.width) {
		player.velocity.x = 5
		player.rotation = 0.15
	} else {
		player.velocity.x = 0
		player.rotation = 0
	}

	//only spawn new ememies if there are no enemies on the screen

	if (frames % randomInterval === 0) {
		grids.push(new Grid())
		frames = 0
		randomInterval = Math.floor(Math.random() * 500) + 1000
		console.log(randomInterval);
	}

	//testing for enemeies only
	// if(numEnemies === 0){
	// 	console.log("test");
	// 	grids.push(new Grid())
	// 	frames = 0
	// }




	frames++


}

animate()


// function waitForStart() {

// 	if(game.active === false){
// 		window.location.href = "title-screen.html"

// 		document.querySelector("#start-button").addEventListener("click", () => {
// 			game.active = true
// 			animate()
// 		}) //end of start button listener
// 	} else {
// 		animate()
// 	}
// }


// function main(){

// 	let infinite = true;

// 	if(game.active === false){
// 		window.location.href = "title-screen.html"
// 		console.log("test");

// 		document.querySelector("#start-button").addEventListener("click", () => {
// 			game.active = true
// 			// infinite = false
// 			window.location.href = "game.html"
// 			animate()
// 		}) //end of start button listener
// 	} else {
// 		animate()
// 	}
// }


// console.log("Main called");
// main()

addEventListener('keydown', ({
	key
}) => {
	console.log(key)
	if (game.over) return
	switch (key) {
		case 'a':
			//console.log("left")
			keys.a.pressed = true
			break;
		case 'd':
			//console.log("right")
			keys.d.pressed = true
			break;
		case 'ArrowLeft':
			//console.log("arrowleft")
			keys.ArrowLeft.pressed = true
			break;
		case 'ArrowRight':
			//console.log("arrowright")
			keys.ArrowRight.pressed = true
			break;
		case ' ':
			//console.log("space")

			// if(key.keyCode === 32 && game.active === true){
			// 	preventDefault()
			// }

			//possibly add a timer to prevent spamming
			//possibly auto shoot in future?

			projectiles.push(new Projectile({
				x: player.position.x + player.width / 2,
				y: player.position.y
			}, {
				x: 0,
				y: -15
			}))
			console.log(projectiles)
			break;
	}
})

addEventListener('keyup', ({
	key
}) => {
	switch (key) {
		case 'a':
			//console.log("leftoff")
			keys.a.pressed = false
			break;
		case 'd':
			//console.log("rightoff")
			keys.d.pressed = false
			break;
		case 'ArrowLeft':
			//console.log("arrowleftoff")
			keys.ArrowLeft.pressed = false
			break;
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break;
		case ' ':
			//console.log("spaceoff")
			break;
	}
})


function startGame() {
	console.log("start game");
	resize_canvas()
	start()
}

function toggleScreen(id, toggle) {
	let screen = document.getElementById(id)
	let display = ( toggle ) ? "block" : "none"
	screen.style.display = display
}

function start() {
	toggleScreen("title-window", false)
	toggleScreen("game-window", true)
	game.active = true
	animate()
} 