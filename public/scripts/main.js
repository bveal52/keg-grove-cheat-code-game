/**
 * @author 
 * Brady Veal
 */


let canvas = document.querySelector("#canvas");
const scoreEl = document.querySelector("#scoreEl");
const livesEl = document.querySelector("#livesEl");
const leftButton = document.querySelector("#left-button")
const rightButton = document.querySelector("#right-button")


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


function resize_canvas() {
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

		if (this.fades) {
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

			if (this.fades) {
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
				//creates grid of invaders
				this.invaders.push(new Invader({
					position: {
						x: (i * 30),
						y: (j * 30) + 35
					}
				}))
				//console.log("here");
			}
		}
		//console.log(this.invaders);
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

//joystick controls

class JoystickController {
	constructor(stickID, maxDistance, deadzone) {
		this.id = stickID;
		let stick = document.getElementById(stickID);
		// location from which drag begins, used to calculate offsets
		this.dragStart = null;
		// track touch identifier in case multiple joysticks present
		this.touchId = null;

		this.active = false;
		this.value = {
			x: 0,
			y: 0
		};
		let self = this;

		function handleDown(event) {
			self.active = true;
			// all drag movements are instantaneous
			stick.style.transition = '0s';
			// touch event fired before mouse event; prevent redundant mouse event from firing
			event.preventDefault();
			if (event.changedTouches)
				self.dragStart = {
					x: event.changedTouches[0].clientX,
					y: event.changedTouches[0].clientY
				};
			else
				self.dragStart = {
					x: event.clientX,
					y: event.clientY
				};
			// if this is a touch event, keep track of which one
			if (event.changedTouches)
				self.touchId = event.changedTouches[0].identifier;
		}

		function handleMove(event) {
			if (!self.active) return;
			// if this is a touch event, make sure it is the right one
			// also handle multiple simultaneous touchmove events
			let touchmoveId = null;
			if (event.changedTouches) {
				for (let i = 0; i < event.changedTouches.length; i++) {
					if (self.touchId == event.changedTouches[i].identifier) {
						touchmoveId = i;
						event.clientX = event.changedTouches[i].clientX;
						event.clientY = event.changedTouches[i].clientY;
					}
				}
				if (touchmoveId == null) return;
			}
			const xDiff = event.clientX - self.dragStart.x;
			const yDiff = event.clientY - self.dragStart.y;
			const angle = Math.atan2(yDiff, xDiff);
			const distance = Math.min(maxDistance, Math.hypot(xDiff, yDiff));
			const xPosition = distance * Math.cos(angle);
			const yPosition = distance * Math.sin(angle);
			// move stick image to new position
			stick.style.transform = `translate3d(${xPosition}px, ${yPosition}px, 0px)`;
			// deadzone adjustment
			const distance2 = (distance < deadzone) ? 0 : maxDistance / (maxDistance - deadzone) * (distance - deadzone);
			const xPosition2 = distance2 * Math.cos(angle);
			const yPosition2 = distance2 * Math.sin(angle);
			const xPercent = parseFloat((xPosition2 / maxDistance).toFixed(4));
			const yPercent = parseFloat((yPosition2 / maxDistance).toFixed(4));

			self.value = {
				x: xPercent,
				y: yPercent
			};
		}

		function handleUp(event) {
			if (!self.active) return;
			// if this is a touch event, make sure it is the right one
			if (event.changedTouches && self.touchId != event.changedTouches[0].identifier) return;
			// transition the joystick position back to center
			stick.style.transition = '.2s';
			stick.style.transform = `translate3d(0px, 0px, 0px)`;
			// reset everything
			self.value = {
				x: 0,
				y: 0
			};
			self.touchId = null;
			self.active = false;
		}
		stick.addEventListener('mousedown', handleDown);
		stick.addEventListener('touchstart', handleDown);
		document.addEventListener('mousemove', handleMove, {
			passive: false
		});
		document.addEventListener('touchmove', handleMove, {
			passive: false
		});
		document.addEventListener('mouseup', handleUp);
		document.addEventListener('touchend', handleUp);
	}
}

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
// const scoreImgs = []
const ongoingTouches = []

let cooldown = false

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
let myStick = new JoystickController("stick", 32, 8);
let myStickButton = new JoystickController("stickButton", 2, 0);

//update joystick
function updateJoystick() {
	
	if (myStick.value.x > 0.1 && player.position.x < canvas.width - player.width) {
		playerRight()
	} else if (myStick.value.x < -0.1 && player.position.x > 0) {
		playerLeft()
	}

	if(myStickButton.value.x >= 0 || myStickButton.value.y >= 0 || myStickButton.value.x <= 0 || myStickButton.value.y <= 0 && player.opacity == 1) {
		playerShoot()
	}

}

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
function createParticles({
	object,
	color,
	fades
}) {
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

if(game.active == true && player.opacity == 1){
	//player auto shoot
	setInterval(() => {
		if (player.opacity == 1) {
			playerShoot()
		}
	}
	,200)
}

//animation loop for game
function animate() {
	if (!game.active) {
		//window.location.href = "title-screen.html"
		toggleScreen("title-window", true)
		toggleScreen("game-window", false)
		toggleScreen("game-over-window", false)
		return
	}

	if (game.over) {
		setTimeout(() => {
			toggleScreen("game-window", false)
			toggleScreen("title-window", false)
			toggleScreen("game-over-window", true)
		}, 2000)
	}

	//create canvas background
	requestAnimationFrame(animate)
	c.fillStyle = "black"
	//fill a slim rectangle at the top of the screen
	c.fillRect(0, 0, canvas.width, canvas.height / 10)
	c.fillStyle = 'black'
	c.fillRect(0, 35, canvas.width, canvas.height)
	c.fillStyle = 'white'
	c.fillRect(0, canvas.height / 1.2, canvas.width, canvas.height - 200)

	updateJoystick()



	//display.renderButtons(controller.buttons)
	//controller.testButtons(ongoingTouches);

	//create canvas buttons

	//create gamepad controls
	// gamepadC.fillStyle = 'white'
	// gamepadC.fillRect(0, 0, gamepadCanvas.width, gamepadCanvas.height)
	// gamepadC.fillStyle = 'black'


	player.update()

	particles.forEach((particle, index) => {

		if (particle.position.y - particle.radius >= gameScreenBuffer) {
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
				createParticles({
					object: player,
					color: "red",
					fades: true
				})
				game.lives--
				livesEl.innerHTML = game.lives
				if (game.lives > 0) {
					setTimeout(() => {
						player.opacity = 1
					},1000)
					
				} else if (game.lives === 0) {
					setTimeout(() => {
						game.active = false
					}, 2000)

					console.log("you lose");
					game.over = true;
					document.getElementById("finalscoreEl").innerHTML = score

				}
			}, 0)

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

							createParticles({
								object: invader,
								fades: true
							})
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
		playerLeft()
	} else if (keys.d.pressed && player.position.x <= canvas.width - player.width || keys.ArrowRight.pressed && player.position.x <= canvas.width - player.width) {
		playerRight()
	} else {
		playerStop()
	}

	//only spawn new ememies if there are no enemies on the screen

	if (frames % randomInterval === 0) {
		grids.push(new Grid())
		frames = 0
		randomInterval = Math.floor(Math.random() * 500) + 800
		console.log(randomInterval);
	}

	frames++


}

animate()


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
	}
})


//helper functions for player movement
function playerLeft() {
	player.velocity.x = -5
	player.rotation = -0.15
}

function playerRight() {
	player.velocity.x = 5
	player.rotation = 0.15
}

function playerStop() {
	player.velocity.x = 0
	player.rotation = 0
}

function playerShoot() {
	if (cooldown === false && projectiles.length < 10) {
		projectiles.push(new Projectile({
			x: player.position.x + player.width / 2,
			y: player.position.y
		}, {
			x: 0,
			y: -15
		}))
		console.log(projectiles)
		cooldown = true
		setTimeout(() => cooldown = false, 200);
	}
}

//sleep function
function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}



function startGame() {
	console.log("start game");
	resize_canvas()
	start()
}

function toggleScreen(id, toggle) {
	let screen = document.getElementById(id)
	let display = (toggle) ? "block" : "none"
	screen.style.display = display
}

function start() {
	if (game.over != true) {
		toggleScreen("title-window", false)
		toggleScreen("game-window", true)
		game.active = true
		animate()
	} else {
		toggleScreen("game-over-window", true)
		toggleScreen("game-window", false)
		toggleScreen("title-window", false)
	}
}