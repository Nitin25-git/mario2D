
config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.AUTO,
        width: 2000,
        height: 2000,
    },
    physics:{
    default:'arcade',
    arcade:{
        gravity:{
            y:1000,
        }
        
       
    }
        
    },
    backgroundColor: '#00BFFF',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
    
};

let game = new Phaser.Game(config);

let playerconfig={
    playerspeed:500,
    playerjumpspeed:-1200,
}

function preload() {
    this.load.image("ground","topground1.jpg");
//    this.load.image("sky","background.jpg");
    this.load.spritesheet("dude1","dude1.png",{frameWidth:56,frameHeight:85});
    this.load.spritesheet("dude2","dude2.png",{frameWidth:56,frameHeight:85});

    this.load.image("apple","apple.png");
    this.load.spritesheet("sun","sun1.png",{frameWidth:196,frameHeight:196});
}

function create() {
    W=game.config.width;
    H=game.config.height;
    
    
    
   this.sun=this.add.sprite(1000,600,'sun',0);
    
    this.player=this.physics.add.sprite(50,100,'dude1',0);
    this.player.setScale(2);
    
    
    
    this.player.setBounce(0.3);
    
    this.player.setCollideWorldBounds(true);
    
    
    this.anims.create({
        key:'sun',
        frames:this.anims.generateFrameNumbers('sun',{start:0,end:2}),
        frameRate:0.8,
        repeat:-1,
    });
            this.sun.anims.play('sun',true);

    
    
    this.anims.create({
        key:'right',
        frames:this.anims.generateFrameNumbers('dude1',{start:1,end:6}),
        frameRate:0.1,
        repeat:-1,
    });
    this.anims.create({
        key:'center',
        frames:[{key:'dude1',frame:0}],
        frameRate:10,
        
    });
    
     this.anims.create({
        key:'left',
        frames:this.anims.generateFrameNumbers('dude2',{start:1,end:6}),
        frameRate:10,
        repeat:-1,
    });
    
    this.cursors=this.input.keyboard.createCursorKeys();
    
    
    
    let fruits=this.physics.add.group({
        key:"apple",
        repeat: 7, 
        setScale:{x:0.2,y:0.2},
        setXY:{x:200,y:0,stepX:300},
        
    });
    
    fruits.children.iterate(function(f){
     f.setBounce(Phaser.Math.FloatBetween(0.2,0.4));
    })

    
    let ground=this.add.tileSprite(0,H-230,W,230,'ground');
    ground.setOrigin(0,0);
    
   
    
    let platforms=this.physics.add.staticGroup();
    platforms.create(2000,1500,'ground').setScale(0.5,0.4).refreshBody();
    platforms.create(1050,900,'ground').setScale(0.5,0.4).refreshBody();
    platforms.create(400,1600,'ground').setScale(0.5,0.4).refreshBody();
    platforms.add(ground);

    this.physics.add.existing(ground,true);
    
//    ground.body.allowGravity=false;
//    ground.body.immovable=true;

     
    this.physics.add.collider(ground,this.player);
        this.physics.add.collider(platforms,this.player);

    
//    this.physics.add.collider(ground,fruits);
    this.physics.add.collider(platforms,fruits);
    this.physics.add.overlap(this.player,fruits,eatfruit,null,this);
    
    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);
    
    this.cameras.main.startFollow(this.player,true,true);
    this.cameras.main.setZoom(1.2);  
    


     
}

function update() {
    if(this.cursors.left.isDown)
        {
            this.player.setVelocityX(-playerconfig.playerspeed);
                    this.player.anims.play('left',true);

        }
    else if(this.cursors.right.isDown){
        this.player.setVelocityX(playerconfig.playerspeed);
        this.player.anims.play('right',true);
    }
    else{
        this.player.setVelocityX(0);
         this.player.anims.play('center',true);
    }
    
    if(this.cursors.up.isDown && this.player.body.touching.down){
        this.player.setVelocityY(playerconfig.playerjumpspeed);
    }
} 
function eatfruit(player,fruit)
{  fruit.disableBody(true,true);
}
