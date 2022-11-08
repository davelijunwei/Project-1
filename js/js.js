const canvas = document.querySelector('canvas')
// initialize canvas context
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

// check if device is mobile
const isMobile = canvas.width <= 768 ? true : false

// get elements references
const scoreEl = document.querySelector('.score-value')
const livesEl = document.querySelector('.lives-value')
const levelUpTextEl = document.querySelector('.level-up-text')
const levelUpEl = document.querySelector('.level-up')
const currentLevelEl = document.querySelector('.current-level')
const currentLevelTextEl = document.querySelector('.current-level-text')
const activeEffectTextEl = document.querySelector('.active-effect-text')
const activeEffectEl = document.querySelector('.active-effect')
const healthBarContainer = document.querySelector('.health-bar-container')
const healthBarEl = document.querySelector('.health-bar')
// main modal
const startGameBtn = document.querySelector('.start-game-btn')
const modalEl = document.querySelector('.modal')
const modalScoreEl = document.querySelector('.modal-score-value')
const highscoreEl = document.querySelector('.modal-highscore-value')
// settings modal
const settingsModalEl = document.querySelector('.settings-modal')
const settingsBtn = document.querySelector('.settings-btn')
const resumeBtn = document.querySelector('.resume-btn')
// rules modal
const rulesModalEl = document.querySelector('.rules-modal')
const rulesBackBtn = document.querySelector('.rules-back-btn')
const rulesBtn = document.querySelector('.rules-btn')
// win modal
const winModalEl = document.querySelector('.win-modal')
const winModalScoreEl = document.querySelector('.win-modal-score')
//define player
class Player {
	constructor(x, y, radius, color) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
	}

	draw() {
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}
}
//define projectile
class Projectile {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}
	draw() {
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}
	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}
//define enemy
class Enemy {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}
	draw() {
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}
	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}
//define bonus
class Bonus {
	constructor(x, y, width, height, color, velocity, name, emoji) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.color = color
		this.velocity = velocity
		this.name = name
		this.emoji = emoji
	}
	draw() {
		// rectangular bonuses
		// c.beginPath()
		// c.rect(this.x, this.y, this.width, this.height)
		// c.lineWidth = '1'
		// c.strokeStyle = this.color
		// c.stroke()
		// emoji based bonuses for better UX
		c.font = '20px serif'
		c.textAlign = 'center'
		c.textBaseline = 'middle'
		c.fillText(this.emoji, this.x, this.y)
	}
	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
	activateEffect() {
		if (this.name === 'nuke') {
			c.fillStyle = 'rgba(0,0,0,0.1)'
			c.fillRect(0, 0, canvas.width, canvas.height)
			player.draw()
			projectiles = []
			enemies = []
			particles = []
			bonuses = []
			score += 1000
		}
		if (this.name === 'explosive-rounds') {
			isExplosiveRoundsActivated = true
			setTimeout(() => {
				isExplosiveRoundsActivated = false
			}, 5000)
		}
		if (this.name === 'sharp-shooter') {
			isSharpShooterActivated = true
			setTimeout(() => {
				isSharpShooterActivated = false
			}, 5000)
		}
		if (this.name === 'slow') {
			isSlowActivated = true
			setTimeout(() => {
				isSlowActivated = false
			}, 5000)
		}
		if (this.name === 'extra-life') {
			lives++
			livesEl.innerHTML = lives
		}
		if (this.name === 'end-game') {
			handleGameOver()
		}
		activeEffectEl.innerHTML = `${this.name.toUpperCase()}!`
		activeEffectTextEl.classList.add('active')
		activeEffectEl.classList.add('active')
		activeEffectTextEl.style.left = `${Math.floor(this.x)}px`
		activeEffectTextEl.style.top = `${Math.floor(this.y) - 100}px`
		setTimeout(() => {
			activeEffectTextEl.classList.remove('active')
			activeEffectEl.classList.remove('active')
			activeEffectEl.innerHTML = ''
		}, 2000)
	}
}

// instantiate friction variable to decrease particle speed
const friction = 1	

class Particle {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.alpha = 1
	}
	draw() {
		c.save()
		c.globalAlpha = this.alpha
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
		c.restore()
	}
	update() {
		this.draw()
		this.velocity.x *= friction
		this.velocity.y *= friction
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
		this.alpha -= 0.01
	}
}
class Boss {
	constructor(x, y, radius, color, health) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.angle = Math.PI / 2
		this.velocity = { x: Math.cos(this.angle), y: Math.sin(this.angle) }
		this.health = health
	}

	draw() {
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}

	update() {
		this.draw()
		if (
			this.x > 0 &&
			this.x < 0.2 * canvas.width &&
			this.y > 0.9 * canvas.height &&
			this.y < canvas.height
		) {
			this.angle = 0
			this.velocity = { x: Math.cos(0), y: Math.sin(0) }
		}
		if (
			this.x > 0.9 * canvas.width &&
			this.x < canvas.width &&
			this.y > 0.9 * canvas.height &&
			this.y < canvas.height
		) {
			this.angle = -(Math.PI / 2)
			this.velocity = {
				x: Math.cos(-(Math.PI / 2)),
				y: Math.sin(-(Math.PI / 2)),
			}
		}
		if (
			this.x > 0.9 * canvas.width &&
			this.x < canvas.width &&
			this.y > 0 &&
			this.y < 0.1 * canvas.height
		) {
			this.angle = Math.PI
			this.velocity = {
				x: Math.cos(Math.PI),
				y: Math.sin(Math.PI),
			}
		}
		if (
			this.x > 0 * canvas.width &&
			this.x < 0.2 * canvas.width &&
			this.y > 0 &&
			this.y < 0.1 * canvas.height
		) {
			this.angle = Math.PI / 2
			this.velocity = {
				x: Math.cos(Math.PI / 2),
				y: Math.sin(Math.PI / 2),
			}
		}
		// update current location
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
		// update current location of health bar
		healthBarContainer.style.top = `${this.y}px`
		healthBarContainer.style.left = `${this.x}px`
	}
}

const x = canvas.width / 2
const y = canvas.height / 2

// initialize global variables to reset to when game restarts
let player = new Player(x, y, 20, 'white')
let projectiles = []
let enemies = []
let particles = []
let bonuses = []
let bosses = []
let lives = 1
let currentLevel = 1
let isExplosiveRoundsActivated = false
let isSlowActivated = false
let isSharpShooterActivated = false
let levelDisplayed = false

// initialization function to be called when game starts/restarts
const init = () => {
	player = new Player(x, y, 20, 'white')
	projectiles = []
	enemies = []
	particles = []
	bonuses = []
	bosses = []
	isExplosiveRoundsActivated = false
	isSlowActivated = false
	isSharpShooterActivated = false
	currentLevel = 1
	currentLevelEl.innerHTML = 1
	score = 0
	scoreEl.innerHTML = score
	modalScoreEl.innerHTML = score
	lives = 1
	livesEl.innerHTML = lives
}

// define enemy interval by level
let enemiesIntervalTime =
	currentLevel === 2
		? 900
		: currentLevel === 3
		? 800
		: currentLevel === 4
		? 700
		: currentLevel === 5
		? 600
		: currentLevel === 6
		? 500
		: currentLevel === 7
		? 400
		: currentLevel === 8
		? 300
		: currentLevel === 9
		? 250
		: currentLevel === 10
		? 200
		: 1000
const spawnEnemiesIntervalFunction = () => {
	// set enemy size randomize between 5-50
	const radius = Math.random() * (40 - 5) + 5
	let x
	let y

	if (Math.random() < 0.5) {
		// spawn enemies from left or right, across the entire screen height
		x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
		y = Math.random() * canvas.height
	} else {
		// spawn enemies from top or bottom, across the entire screen width
		x = Math.random() * canvas.width
		y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
	}
	// randomize enemy color
	const color = `hsl(${Math.random() * 360}, 50%, 50%)`

	const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
	let velocity
	if (isSlowActivated) {
		velocity = {
			x: Math.cos(angle) / 2,
			y: Math.sin(angle) / 2,
		}
	} else {
		// determine enemies velocity according to current level
		velocity = {
			x:
				currentLevel === 2
					? Math.cos(angle) * 1.1
					: currentLevel === 3
					? Math.cos(angle) * 1.2
					: currentLevel === 4
					? Math.cos(angle) * 1.3
					: currentLevel === 5
					? Math.cos(angle) * 1.4
					: currentLevel === 6
					? Math.cos(angle) * 1.5
					: currentLevel === 7
					? Math.cos(angle) * 1.6
					: currentLevel === 8
					? Math.cos(angle) * 1.7
					: currentLevel === 9
					? Math.cos(angle) * 1.8
					: currentLevel === 10
					? Math.cos(angle) * 1.9
					: Math.cos(angle),
			y:
				currentLevel === 2
					? Math.sin(angle) * 1.1
					: currentLevel === 3
					? Math.sin(angle) * 1.2
					: currentLevel === 4
					? Math.sin(angle) * 1.3
					: currentLevel === 5
					? Math.sin(angle) * 1.4
					: currentLevel === 6
					? Math.sin(angle) * 1.5
					: currentLevel === 7
					? Math.sin(angle) * 1.6
					: currentLevel === 8
					? Math.sin(angle) * 1.7
					: currentLevel === 9
					? Math.sin(angle) * 1.8
					: currentLevel === 10
					? Math.sin(angle) * 1.9
					: Math.sin(angle),
		}
	}

	enemies.push(new Enemy(x, y, radius, color, velocity))
}

let spawnBossEnemiesInterval
const spawnBossEnemies = () => {
	spawnBossEnemiesInterval = setInterval(spawnBossEnemiesIntervalFunction, 900)
}

const spawnBossEnemiesIntervalFunction = () => {
	// randomize between 5-30
	const radius = Math.random() * (30 - 5) + 5
	let x = bosses[0].x
	let y = bosses[0].y

	// randomize boss enemy color
	const color = `hsl(${Math.random() * 360}, 50%, 50%)`

	const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)

	const velocity = {
		x: Math.cos(angle),
		y: Math.sin(angle),
	}

	enemies.push(new Enemy(x, y, radius, color, velocity))
}

let spawnEnemiesInterval
const spawnEnemies = () => {
	spawnEnemiesInterval = setInterval(
		spawnEnemiesIntervalFunction,
		enemiesIntervalTime
	)
}

const spawnBonusesIntervalFunction = () => {
	// declare all bonuses types
	const bonusTypes = [
		{ name: 'slow', color: 'hsl(170, 50%, 50%)', emoji: '❄️' },
		{ name: 'sharp-shooter', color: 'hsl(220, 50%, 50%)', emoji: '⏩' },
		{ name: 'explosive-rounds', color: 'hsl(10, 50%, 50%)', emoji: '💥' },
		{ name: 'extra-life', color: 'hsl(120, 50%, 50%)', emoji: '❤️' },
		{ name: 'nuke', color: 'hsl(60, 50%, 50%)', emoji: '☢️' },
		{ name: 'end-game', color: 'hsl(300, 50%, 50%)', emoji: '☠️' },
	]
	let x
	let y
	let isVertical

	if (Math.random() < 0.5) {
		// spawn bonuses from left or right, at start or end of height
		isVertical = false
		x = Math.random() < 0.5 ? 0 - 10 : canvas.width + 10
		y = Math.random() < 0.5 ? 0.2 * canvas.height : 0.8 * canvas.height
	} else {
		// spawn bonuses from top or bottom, at start of width or end of width
		isVertical = true
		x = Math.random() < 0.5 ? 0.2 * canvas.width : 0.8 * canvas.width
		y = Math.random() < 0.5 ? 0 - 10 : canvas.height + 10
	}

	// choose a bonusType at random
	const randomBonus = bonusTypes[Math.floor(Math.random() * 6)]
	const color = randomBonus.color
	const name = randomBonus.name
	const emoji = randomBonus.emoji

	let angle

	// check if bonus is coming from top/bottom or left/right
	if (isVertical) {
		// if top, go to bottom. if bottom, go to top
		angle = y < 0 ? Math.PI / 2 : -(Math.PI / 2)
	} else {
		// if left, go right. if right, go left
		angle = x < 0 ? 0 : Math.PI
	}

	const velocity = {
		x: Math.cos(angle),
		y: Math.sin(angle),
	}

	bonuses.push(new Bonus(x, y, 15, 15, color, velocity, name, emoji))
}

let spawnBonusesInterval
const spawnBonuses = () => {
	spawnBonusesInterval = setInterval(spawnBonusesIntervalFunction, 10000)
}

let isGamePaused = false
let animationId
let score = 0
// render all canvas objects on the screen
const animate = () => {
	if (!isGamePaused) {
		animationId = requestAnimationFrame(animate)
		c.fillStyle = 'rgba(0,0,0,0.1)'
		c.fillRect(0, 0, canvas.width, canvas.height)
		player.draw()

		// loop over particles
		particles.forEach((particle, index) => {
			// if particle should be removed, remove it, else, keep updating it
			if (particle.alpha <= 0) {
				particles.splice(index, 1)
			} else {
				particle.update()
			}
		})

		// loop over projectiles
		projectiles.forEach((projectile, index) => {
			projectile.update()

			// remove projectiles once they pass the edges of the screen
			if (
				projectile.x + projectile.radius < 0 ||
				projectile.x - projectile.radius > canvas.width ||
				projectile.y + projectile.radius < 0 ||
				projectile.y - projectile.radius > canvas.height
			) {
				setTimeout(() => {
					projectiles.splice(index, 1)
				}, 0)
			}
		})

		// loop over enemies
		enemies.forEach((enemy, index) => {
			enemy.update()

			// measure distance between each enemy and the player
			const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)

			// enemy hits player - end game - game over
			if (dist - enemy.radius - player.radius < 1) {
				if (lives === 1) {
					handleGameOver()
				} else {
					// lose one life and continue with the game
					lives -= 1
					livesEl.innerHTML = lives
					// remove enemy so it wont keep killing you
					setTimeout(() => {
						enemies.splice(index, 1)
					}, 0)
				}
			}

			// for each enemy, loop over projectiles
			projectiles.forEach((projectile, projectileIndex) => {
				// measure distance between enemy and all projectiles
				const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

				// projectile hits enemy
				if (dist - enemy.radius - projectile.radius < 1) {
					// add particles effect
					for (let i = 0; i < enemy.radius * 2; i++) {
						particles.push(
							new Particle(
								projectile.x,
								projectile.y,
								Math.random() * 2,
								enemy.color,
								{
									x: (Math.random() - 0.5) * (Math.random() * 6),
									y: Math.random() - 0.5 * (Math.random() * 6),
								}
							)
						)
					}

					// determine if enemy should shrink or be destroyed
					if (!isExplosiveRoundsActivated) {
						if (enemy.radius - 10 > 5) {
							// increase score by 100
							score += 100
							scoreEl.innerHTML = score

							// shrink enemy
							gsap.to(enemy, {
								radius: enemy.radius - 10,
							})
							enemy.radius -= 10
							// remove projectile
							setTimeout(() => {
								projectiles.splice(projectileIndex, 1)
							}, 0)
						} else {
							// increase score by 250
							score += 250
							scoreEl.innerHTML = score

							// remove enemy and projectile
							setTimeout(() => {
								enemies.splice(index, 1)
								projectiles.splice(projectileIndex, 1)
							}, 0)
						}
					} else {
						// increase score by 250
						score += 250
						scoreEl.innerHTML = score

						// remove enemy and projectile
						setTimeout(() => {
							enemies.splice(index, 1)
							projectiles.splice(projectileIndex, 1)
						}, 0)
					}
					// check score value and change currentLevel accordingly
					if (score >= 0 && score < 10000) {
						currentLevel = 1
						currentLevelEl.innerHTML = '1'
						currentLevelEl.style.color = `hsl(120, 50%, 50%)`
					}
					if (score > 10000 && score < 20000) {
						currentLevel = 2
						currentLevelEl.innerHTML = '2'
						currentLevelEl.style.color = `hsl(90, 50%, 50%)`
					}
					if (score > 20000 && score < 30000) {
						currentLevel = 3
						currentLevelEl.innerHTML = '3'
						currentLevelEl.style.color = `hsl(70, 50%, 50%)`
					}
					if (score > 30000 && score < 40000) {
						currentLevel = 4
						currentLevelEl.innerHTML = '4'
						currentLevelEl.style.color = `hsl(60, 50%, 50%)`
					}
					if (score > 40000 && score < 50000) {
						currentLevel = 5
						currentLevelEl.innerHTML = '5'
						currentLevelEl.style.color = `hsl(50, 50%, 50%)`
					}
					if (score > 50000 && score < 60000) {
						currentLevel = 6
						currentLevelEl.innerHTML = '6'
						currentLevelEl.style.color = `hsl(40, 50%, 50%)`
					}
					if (score > 60000 && score < 70000) {
						currentLevel = 7
						currentLevelEl.innerHTML = '7'
						currentLevelEl.style.color = `hsl(30, 50%, 50%)`
					}
					if (score > 70000 && score < 80000) {
						currentLevel = 8
						currentLevelEl.innerHTML = '8'
						currentLevelEl.style.color = `hsl(20, 50%, 50%)`
					}
					if (score > 80000 && score < 90000) {
						currentLevel = 9
						currentLevelEl.innerHTML = '9'
						currentLevelEl.style.color = `hsl(10, 50%, 50%)`
					}
					if (score > 90000) {
						currentLevel = 10
						currentLevelEl.innerHTML = '10'
						currentLevelEl.style.color = `hsl(0, 50%, 50%)`
					}
					if (score === 100000 || score === 100050) {
						clearInterval(spawnEnemiesInterval)
						clearInterval(spawnBonusesInterval)
						spawnBoss()
						spawnBossEnemies()
					}
				}
			})
		})
		// loop over bonuses
		bonuses.forEach((bonus, index) => {
			bonus.update()

			// remove bonuses once they pass the edges of the screen
			if (
				bonus.x + bonus.width < 0 ||
				bonus.x - bonus.width > canvas.width ||
				bonus.y + bonus.width < 0 ||
				bonus.y - bonus.width > canvas.height
			) {
				setTimeout(() => {
					bonuses.splice(index, 1)
				}, 0)
			}

			// for each bonus, loop over projectiles
			projectiles.forEach((projectile, projectileIndex) => {
				// measure distance between bonus and all projectiles
				const dist = Math.hypot(projectile.x - bonus.x, projectile.y - bonus.y)

				// projectile hits bonus
				if (dist - 14 - projectile.radius < 1) {
					// add particles effect
					for (let i = 0; i < 14 * 2; i++) {
						particles.push(
							new Particle(
								projectile.x,
								projectile.y,
								Math.random() * 2,
								bonus.color,
								{
									x: (Math.random() - 0.5) * (Math.random() * 6),
									y: Math.random() - 0.5 * (Math.random() * 6),
								}
							)
						)
					}
					// activate bonus effect
					bonus.activateEffect()

					// remove enemy and projectile
					setTimeout(() => {
						bonuses.splice(index, 1)
						projectiles.splice(projectileIndex, 1)
					}, 0)
				}
			})
		})

		bosses.forEach((boss, index) => {
			boss.update()

			projectiles.forEach((projectile, projectileIndex) => {
				// measure distance between boss and all projectiles
				const dist = Math.hypot(projectile.x - boss.x, projectile.y - boss.y)

				if (dist - boss.radius - projectile.radius < 1) {
					// determine if boss should lose health or be destroyed
					if (boss.health > 1) {
						boss.health -= 1
						healthBarEl.style.width = `${Math.floor(boss.health / 5)}%`
						// increase score by 250
						score += 100
						scoreEl.innerHTML = score

						// remove projectile
						setTimeout(() => {
							projectiles.splice(projectileIndex, 1)
						}, 0)
					} else {
						// increase score by 10000
						score += 10000
						scoreEl.innerHTML = score

						// remove boss and projectile
						setTimeout(() => {
							bosses.splice(index, 1)
							projectiles.splice(projectileIndex, 1)
						}, 0)

						// win game
						handleWinGame()
					}
				}
			})
		})
	}
}

const spawnBoss = () => {
	const radius = 60

	let x = 0.1 * canvas.width
	let y = 0 - radius

	const color = `hsl(0, 50%, 50%)`

	const health = 500

	bosses.push(new Boss(x, y, radius, color, health))
}

// spawn projectiles function to be used in event listener
const spawnProjectiles = e => {
	// get angle between click position and player to calculate velocity
	const angle = Math.atan2(
		e.clientY - canvas.height / 2,
		e.clientX - canvas.width / 2
	)
	let velocity
	if (isSharpShooterActivated) {
		velocity = {
			x: Math.cos(angle) * 7,
			y: Math.sin(angle) * 7,
		}
	} else {
		velocity = {
			x: Math.cos(angle) * 5,
			y: Math.sin(angle) * 5,
		}
	}
	// instantiate a new projectile by adding it to the projectiles array
	projectiles.push(
		new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity)
	)
}

// when restart/start btn is clicked, start game
const handleStartGameBtnClick = () => {
	init()
	animate()
	spawnEnemies()
	spawnBonuses()
	window.addEventListener('click', spawnProjectiles)
	window.addEventListener('touchstart', spawnProjectiles)
	modalEl.style.display = 'none'
	settingsModalEl.style.display = 'none'
	settingsBtn.removeAttribute('disabled')
}

const handleSettingsBtnClick = () => {
	settingsModalEl.style.display = 'flex'
	isGamePaused = true
	window.removeEventListener('click', spawnProjectiles)
	window.removeEventListener('touchstart', spawnProjectiles)
	clearInterval(spawnEnemiesInterval)
	clearInterval(spawnBonusesInterval)
	clearInterval(spawnBossEnemiesInterval)
}

const handleResumeBtnClick = () => {
	settingsModalEl.style.display = 'none'
	isGamePaused = false
	window.addEventListener('click', spawnProjectiles)
	window.addEventListener('touchstart', spawnProjectiles)
	animate()
	if (score > 100000) {
		spawnBossEnemies()
	} else {
		spawnEnemies()
		spawnBonuses()
	}
}

const handleRulesBtnClick = () => {
	rulesModalEl.style.display = 'flex'
}

const handleRulesBackBtnClick = () => {
	rulesModalEl.style.display = 'none'
}



const handleGameOver = () => {
	// cancel all animations
	cancelAnimationFrame(animationId)
	// remove event listener from window object
	window.removeEventListener('click', spawnProjectiles)
	window.removeEventListener('touchstart', spawnProjectiles)
	// show modal and update score on UI
	modalEl.style.display = 'flex'
	modalScoreEl.innerHTML = score
	// make sure settings button is disabled to prevent massive enemy spawn
	settingsBtn.setAttribute('disabled', 'true')
	// clear intervals for enemies and bonuses
	clearInterval(spawnEnemiesInterval)
	clearInterval(spawnBonusesInterval)
	clearInterval(spawnBossEnemiesInterval)
	// get currentHighScore from localStorage
	const currentHighScore = localStorage.getItem('currentHighScore')
	// if it exits:
	if (currentHighScore !== null) {
		// if score > currentHighScore:
		if (score > parseInt(currentHighScore)) {
			// replace currentHighScore in localStorage with score
			localStorage.setItem('currentHighScore', score)
			// update highscore in UI
			highscoreEl.innerHTML = score
		} else {
			// else - don't do anything
			highscoreEl.innerHTML = currentHighScore
		}
	} else {
		// else - just save score to localStorage W/O check
		localStorage.setItem('currentHighScore', score)
		highscoreEl.innerHTML = score
	}
}

const handleWinGame = () => {
	// cancel all animations
	cancelAnimationFrame(animationId)
	// remove event listener from window object
	window.removeEventListener('click', spawnProjectiles)
	window.removeEventListener('touchstart', spawnProjectiles)
	// show modal and update score on UI
	winModalEl.style.display = 'flex'
	winModalScoreEl.innerHTML = score
	// make sure settings button is disabled to prevent massive enemy spawn
	settingsBtn.setAttribute('disabled', 'true')
	// clear intervals for enemies and bonuses
	clearInterval(spawnEnemiesInterval)
	clearInterval(spawnBonusesInterval)
	clearInterval(spawnBossEnemiesInterval)
	// get currentHighScore from localStorage
	const currentHighScore = localStorage.getItem('currentHighScore')
	// if it exists:
	if (currentHighScore !== null) {
		// if score > currentHighScore:
		if (score > parseInt(currentHighScore)) {
			// replace currentHighScore in localStorage with score
			localStorage.setItem('currentHighScore', score)
			// update highscore in UI
			highscoreEl.innerHTML = score
		} else {
			// else - don't do anything
			highscoreEl.innerHTML = currentHighScore
		}
	} else {
		// else - just save score to localStorage W/O check
		localStorage.setItem('currentHighScore', score)
		highscoreEl.innerHTML = score
	}
}

window.onload = () => {
	if (localStorage.getItem('currentHighScore') !== null) {
		highscoreEl.innerHTML = localStorage.getItem('currentHighScore')
	}
}
