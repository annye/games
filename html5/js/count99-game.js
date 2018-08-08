// window/global scope
var bb9 = {};

bb9.Tile = (function(){
  function Tile(number){
    this.initialize();

    this.number = number;

    this.width = this.height = 80;

    var image = new createjs.Bitmap(bb9.graphics.tile.path);
    this.addChild(image);

    var numberText = new createjs.Text(number, "24px pf_tempesta_seven_compresseBd, sans-serif", "#ac1000");
    // center of the  box.
    numberText.x = this.width/2 + 1;
    numberText.y = this.height/2 - 2;

    // align cetner, vertically and horizontally.
    numberText.textAlign = "center";
    numberText.textBaseline = "middle";
    this.addChild(numberText);
  }
  var p = Tile.prototype = new createjs.Container();

  return Tile;
})();

bb9.Preloader = (function(){
  // constructor
  function Preloader(game) {
    this.game = game;
  };

  Preloader.prototype.loadGraphics = function(){
    var imagesList = [
      {name:"tile", path:"images/tile.png"},
      {name:"hud", path:"images/hud.png"},
      {name:"bg", path:"images/bg.png"},
      {name:"gameover", path:"images/gameover.jpg"},
      {name:"restartButton", path:"images/restart-button.png"},
    ]

    bb9.graphics = {};

    var totalFiles = imagesList.length;
    var loadedFiles = 0;
    for (var i=0, len=totalFiles; i<len; i++) {
      imageToLoad = imagesList[i];
      var img = new Image();
    
      img.onload = (function(event) {
        loadedFiles++;
        console.log ('loaded', event, loadedFiles, '/', totalFiles)

        if (loadedFiles >= totalFiles) {
          this.game.initGame();
        }
      }).bind(this);

      console.log ("loading: ", imageToLoad.path);
      img.src = imageToLoad.path;

      bb9.graphics[imageToLoad.name] = imageToLoad;
    };
  }
  return Preloader;
})();

bb9.Game = (function() {
  // constructor
  function Count99Game() {
    console.log("Count99 game starts.");

    this.canvas = document.getElementById('game-canvas');

    // EaselJS Stage
    this.stage = new createjs.Stage(this.canvas);
    createjs.Touch.enable(this.stage);

    // this.initGame();
    var preloader = new bb9.Preloader(this);
    preloader.loadGraphics();

    var restartButton = document.getElementById('restart-button');
    restartButton.onclick = (function(event) {
      var gameoverScene = document.getElementById('gameover');
      gameoverScene.classList.remove('gameover-appear');
      this.initGame();
    }).bind(this);
  }

  var p = Count99Game.prototype;

  p.initGame = function() {
    this.totalTiles = 6;

    // store which number should click on next tile.
    this.nextCount = 1;

   
    this.nextCountLabel = document.getElementById('next-count');
    this.nextCountLabel.innerText = this.nextCount;

  
    var tileOnPress = function(event) {
      if (event.target.number === this.nextCount) {
        this.stage.removeChild(event.target);

      
        this.nextCount++;

        // game over, player wins.
        if (this.nextCount > this.totalTiles) {
          this.gameOver();
        }

        // update the canvas 
        this.stage.update();
        // update the <span id='next-count'> element
        this.nextCountLabel.innerText = this.nextCount;

      }
    }

    for (var i=this.totalTiles; i>0; i--) {
      var tile = new bb9.Tile(i);
      tile.x = Math.random()*(this.canvas.width-tile.width);
      tile.y = Math.random()*(this.canvas.height-tile.height);
      tile.onPress = (tileOnPress).bind(this); 
      this.stage.addChild(tile);
    }

    this.stage.update();
  }

  p.gameOver = function() {
    // force the next count to be the total tiles maximum.
    this.nextCount = this.totalTiles;

    // display the game over scene.
    var gameoverScene = document.getElementById('gameover');
    gameoverScene.classList.add('gameover-appear');
  }

  return Count99Game;
})();

window.onload = function() {
  // entry point
  var game = new bb9.Game();
};