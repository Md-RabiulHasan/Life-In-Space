let gameScene = new Phaser.Scene('Game');


gameScene.init = function(){
	this.playerSpeed = 5;

	this.enemyMinSpeed = 2;
	this.enemyMaxSpeed = 4;




	this.enemyMinY = 25;
	this.enemyMaxY = 350;

	this.isTerminating = false;
}




gameScene.preload = function () {
	this.load.image('background','assets/background.png');
	this.load.image('enemy','assets/enemy.png');
	this.load.image('player','assets/player.png');
	this.load.image('goal','assets/goal.png');
	this.load.image('winScreen','assets/winscreen.png');
	//console.log('preload')
};

gameScene.create = function(){
	this.gameW = this.sys.game.config.width;
	this.gameH = this.sys.game.config.height;

	this.levelNum = 0;

	let bg = this.add.sprite(this.gameW/2, this.gameH/2, 'background');
	//bg.setPosition(320,180)
	//bg.setOrigin(0,0)

	var showLevel = this.levelNum+1;

	this.levelText = this.add.text(25,30,'Level '+showLevel).setScrollFactor(0);
	this.levelText.depth=10;


	this.player = this.add.sprite(this.gameW-50, this.gameH-25,'player');

	this.player.setScale(0.5);

	this.goal = this.add.sprite(this.gameW/2, 0,'goal');
	this.goal.setScale(0.6)



	

	this.levelData = [
	{
		repeat:2,
		x:100,
		y:100,
		stepX:5,
		stepY:100
	},

	{
		repeat:3,
		x:30,
		y:150,
		stepX:5,
		stepY:80
	},

	{
		repeat:4,
		x:80,
		y:150,
		stepX:5,
		stepY:60
	},

	]

	this.lastLevel=this.levelData.length;



	this.input.on('pointerup', function(pointer){
	if (this.levelNum==this.lastLevel){
    	this.scene.restart();
	}
    
	},   this);



	/*this.enemy = this.add.sprite(120, gameH/2, "enemy")
	this.enemy.flipX = true;
	this.enemy.setScale(0.6);

	this.enemies.add(this.enemy);*/


	this.cameras.main.startFollow(this.player,true,1,0.1,0,250);

	this.cameras.main.setBounds (0,-120,400,1000)
	
	
	this.createEnemies();



    ///////////not working??
	//this.goal = this.add.sprite(this.sys.game.config.width-80,gameH/2'goal')

	

	//this.enemy1 = this.add.sprite(250, 180,'enemy');
	//enemy1.angle=45;
	//enemy1.setAngle(45);

	//this.enemy1.rotation = Math.PI / 4;
	//this.enemy1.setRotation(Math.PI / 4);



	//let enemy2 = this.add.sprite(350, 180,'enemy');

	//enemy1.flipX = true;
	//enemy2.flipX = true;

	


};

gameScene.update = function(){

	if(this.isTerminating) return;



	if(this.input.activePointer.isDown){
		this.player.y -= this.playerSpeed;
	}else{
		
		if (this.player.y<500){
		this.player.y += this.playerSpeed/2;
	}else{

		this.player.y = 500
	}
	
	}

	let playerRect = this.player.getBounds();
	let spaceRect = this.goal.getBounds();

	if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, spaceRect)){
		console.log('reached goal!')
			this.nextLevel();
			return;

			if (nextLevel == levelData){
				//console.log('reached goal!')
				endGameLogic('reached goal!')
			}
	}




	let enemies = this.enemies.getChildren();
	let numEnemies = enemies.length;
	

	for(let i = 0; i< numEnemies; i++){
		enemies[i].x += enemies[i].speed;
		//console.log(playerRect);

		let conditionUp = enemies[i].speed < 0 && enemies[i].x <= this.enemyMinY;
		let conditionDown = enemies[i].speed > 0 &&enemies[i].x >= this.enemyMaxY;


		if(conditionUp){
			enemies[i].speed *= -1;
			enemies[i].flipX = true;
		}else if(conditionDown){
			enemies[i].speed *= -1;
			enemies[i].flipX = false;

		}

		
		let enemyRect = enemies[i].getBounds();
		
		if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)){
			console.log('Game Over!')
			this.gameOver();
			return;
			}

	}

	


	/*if(this.enemySpeed < 0 && this.enemy.y <= this.enemyMinY){
		this.enemySpeed *= -1;
	}


	if(this.enemySpeed > 0 &&this.enemy.y >= this.enemyMaxY){
		this.enemySpeed *= -1;
	}*/




//this.enemy1.angle +=1;
/*	if (this.enemy1.scale >=Math.round(2.0)){
		this.enemy1.scale =2.0
	}else{
		this.enemy1.scale +=0.001;
	}*/


	/*if (this.player.scale<2){
		this.player.scale +=0.010;

	}

	console.log(this.player.scale)*/

};

gameScene.gameOver = function(){

	this.isTerminating = true;

	this.cameras.main.shake(500)


	this.cameras.main.once('camerashakecomplete', function(camera, effect){
	
	this.player.x = this.gameW/2;
	this.player.y = this.gameH-50;

	this.isTerminating = false;


	//this.cameras.main.fade(500);
		

	},   this);

	this.cameras.main.once('camerafadeoutcomplete', function(camera, effect){

		//this.scene.restart()

	},   this);

	
	

}



gameScene.createEnemies = function(){

	console.log ('make enemies '+this.levelData[this.levelNum].repeat);

	this.enemies = this.add.group({
		key: 'enemy',
		repeat: this.levelData[this.levelNum].repeat,
		setXY: {
			x: this.levelData[this.levelNum].x,
			y: this.levelData[this.levelNum].y,
			stepX: this.levelData[this.levelNum].stepX,
			stepY: this.levelData[this.levelNum].stepY
		}
	});

			let enemies = this.enemies.getChildren();

		console.log (enemies.length);


	Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);

	Phaser.Actions.Call(this.enemies.getChildren(), function(enemy){
		//enemy.flipX = true;

	let dir = Math.random() < 0.5 ? 1 : -1;
	let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
	enemy.speed = dir * speed;


	}, this);

	this.player.x = this.gameW/2;
	this.player.y = this.gameH-50;

	this.isTerminating = false;


}

gameScene.nextLevel = function(){

	this.isTerminating = true;

	this.cameras.main.shake(500)


	this.cameras.main.once('camerashakecomplete', function(camera, effect){

		console.log('next level shake');

	this.enemies.clear(true);

	this.levelNum ++;

	if (this.levelNum == this.lastLevel){
		this.winScreen = this.add.sprite(this.gameW/2, this.gameH/2,'winScreen');
		this.player.alpha=0;
	}else{

	let showLevel = this.levelNum+1;

	this.levelText.text='Level '+showLevel;

	this.createEnemies();
	}

	//this.cameras.main.fade(500);
		

	},   this);

	this.cameras.main.once('camerafadeoutcomplete', function(camera, effect){

		//this.scene.restart();
		//this.enemies.clear();
		this.createEnemies();

	},   this);

		//this.scene.restart();
	

}

 
let config = {
	type: Phaser.AUTO,
	scale:{
		parent: 'phaser-app',
		mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		width: 400,
		height: 590
	},
/*	width: 400,
	height: 600,*/
	scene: gameScene
};

let game = new Phaser.Game(config);




