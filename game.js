const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let coins;
let score = 0;
let scoreText;
let financeTips = [
    "Dica: Sempre guarde uma parte do seu salário para emergências.",
    "Dica: Evite dívidas com juros altos, como o cartão de crédito.",
    "Dica: Invista em sua educação para crescer financeiramente.",
    "Dica: Faça um orçamento mensal para controlar suas despesas.",
    "Dica: Diversifique seus investimentos para reduzir riscos.",
    "Dica: Considere criar uma reserva de emergência com 3 a 6 meses de despesas.",
    "Dica: Compre o que é necessário antes de pensar em luxos.",
    "Dica: Planeje sua aposentadoria desde cedo, invista a longo prazo.",
    "Dica: O hábito de economizar é mais importante do que quanto você economiza.",
    "Dica: Evite gastos impulsivos. Dê tempo antes de fazer compras caras."
];

let tipText;

function preload() {
    this.load.image('background', 'https://via.placeholder.com/800x600.png?text=Fundo');  // Imagem de fundo
    this.load.image('ground', 'https://via.placeholder.com/800x100.png?text=Chão');       // Imagem do chão
    this.load.image('coin', 'https://via.placeholder.com/32x32.png?text=Moeda');        // Imagem da moeda
    this.load.spritesheet('shurek', 'https://via.placeholder.com/32x48.png?text=Shurek', {
        frameWidth: 32,
        frameHeight: 48
    });  // Imagem do Shurek
}

function create() {
    this.add.image(400, 300, 'background');

    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 450, 'shurek');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('shurek', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('shurek', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    coins = this.physics.add.group({
        key: 'coin',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    coins.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    
    // Texto das dicas de educação financeira
    tipText = this.add.text(16, 50, '', { fontSize: '24px', fill: '#228B22' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(coins, platforms);

    this.physics.add.overlap(player, coins, collectCoin, null, this);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.stop();
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectCoin(player, coin) {
    coin.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);

    // Exibe uma dica financeira aleatória
    const randomTip = Phaser.Math.Between(0, financeTips.length - 1);
    tipText.setText(financeTips[randomTip]);
}
