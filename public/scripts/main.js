/**
 * @author 
 * Brady Veal
 */

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
	constructor(){

		this.velocity = {
			x: 0,
			y: 0
		}

		const image = new Image()
		image.src = './imgs/beer_guy.png'

		image.onload = () => {

			const scale = 0.0625


			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale

			this.position = {
				x: canvas.width / 2 - this.width / 2,
				y: canvas.height - this.height - 20
				// x: 200,
				// y: 200
			}

		
		}
	
	
	}


	draw() {
		// c.fillStyle = "red";
		// c.fillRect(this.position.x, this.position.y, this.width, this.height);
		if(this.image)	{
			c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
		}
	}
}



function animate(){
	requestAnimationFrame(animate)
		c.fillStyle = 'black'
		c.fillRect(0,0, this.width, this.height)
	player.draw()
}

const player = new Player()

animate()
