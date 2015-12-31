var Keys = {
      KEY_A: 65,
      KEY_B: 66,
      KEY_C: 67,
      KEY_D: 68,
      KEY_E: 69,
      KEY_F: 70,
      KEY_G: 71,
      KEY_H: 72,
      KEY_I: 73,
      KEY_J: 74,
      KEY_K: 75,
      KEY_L: 76,
      KEY_M: 77,
      KEY_N: 78,
      KEY_O: 79,
      KEY_P: 80,
      KEY_Q: 81,
      KEY_R: 82,
      KEY_S: 83,
      KEY_T: 84,
      KEY_U: 85,
      KEY_V: 86,
      KEY_W: 87,
      KEY_X: 88,
      KEY_Y: 89,
      KEY_Z: 90,
    };


    /***************** tank ******************/
    function Tank(mapWidth, mapHeight){
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.radius = 20;
    this.speedX = 0;
    this.speedY = 0;
    this.power = 3;    
    this.cx = mapWidth/2;
    this.cy = mapHeight/2;
    this.angle = 0;
    this.balls = [];
    this.cannonHeight = this.radius/2; 
    this.cannonWidth = this.cannonHeight*3;    
}
Tank.prototype.draw = function(context){    
    context.beginPath();
    context.fillStyle = "green";
    context.arc(this.cx,this.cy,this.radius,0,Math.PI*2,true);
    context.closePath();
    context.fill();

    // cannon
    context.save();
    context.translate(this.cx,this.cy);
    context.rotate(this.angle);
    context.beginPath();
    context.fillStyle = "red";
    context.rect(0,-this.cannonHeight/2,this.cannonWidth,this.cannonHeight);
    context.closePath();
    context.fill();
    context.restore();
    
    // yellow circle    
    context.beginPath();
    context.fillStyle = "yellow";
    context.arc(this.cx,this.cy,this.radius/2,0,Math.PI*2,true);
    context.closePath();
    context.fill();
    
    for(var i=0;i<this.balls.length;i++)
    {
        this.balls[i].draw(context);
    }

}

Tank.prototype.update = function(){

    for(var i=0;i<this.balls.length;i++)
    {
        var item = this.balls[i];
        item.update();
        if(item.update())
        {
            this.balls.splice(i,1);
        }
    }
}

Tank.prototype.fire = function(){        
    if(this.balls.length > 4)
        return;
    var directionX = Math.cos(this.angle);
    var directionY = Math.sin(this.angle);
    
    var startX = this.cx + this.cannonWidth * directionX;
    var startY = this.cy + this.cannonWidth * directionY;

    var ball = new Ball(this.mapWidth,this.mapHeight,startX,startY,directionX,directionY);
    this.balls.push(ball);
}
Tank.prototype.rotateCannon = function(targetX, targetY){
    var dx = targetX - this.cx;
    var dy = targetY - this.cy;
    this.angle = Math.atan2(dy,dx);
}
Tank.prototype.move = function(){
    this.cx += this.speedX;
    this.cy += this.speedY;

    this.left = this.cx - this.radius;
    this.top = this.cy - this.radius;
    this.right = this.cx + this.radius;
    this.bottom = this.cy + this.radius;
}
Tank.prototype.resetSpeed = function(){
    this.speedX = 0;
    this.speedY = 0;
}
Tank.prototype.moveUp = function(){        
    this.speedY = -this.power;        
}
Tank.prototype.moveDown = function(){    
    this.speedY = this.power;        
}
Tank.prototype.moveLeft = function(){    
    this.speedX = -this.power;        
}
Tank.prototype.moveRight = function(){    
    this.speedX = this.power;    
}

/********************* ball ****************/
    function Ball(mapWidth, mapHeight,startX,startY,directionX,directionY){
    this.power = 5;    
    this.radius = 4;
    
    // the "life-space"c
    this.minX = this.radius;
    this.minY = this.radius;
    this.maxX = mapWidth - this.radius;
    this.maxY = mapHeight - this.radius;
    
    this.speedX = directionX * this.power;
    this.speedY = directionY * this.power;

    this.cx = startX;
    this.cy = startY;
}

Ball.prototype.draw = function(context){    
        
    context.fillStyle = "black";
    context.beginPath();    
    context.arc(this.cx,this.cy,this.radius,0,Math.PI*2,true);
    context.closePath();
    context.fill();
}
Ball.prototype.update = function(){
    this.cx += this.speedX;
    this.cy += this.speedY;
    
    if(this.cx < this.minX || this.cx > this.maxX ||
        this.cy < this.minY || this.cy > this.maxY)
        return true;
    return false;
}
       
/************** MAIN *******************/
const AVAILABLE_KEYS = 
    [     Keys.KEY_W,
        Keys.KEY_S,
        Keys.KEY_A,
        Keys.KEY_D
    ];
            
var _canvas;
var _context;
var _tank;
var _keypressed = {};

function clear() {
    _context.clearRect(0, 0, _canvas.width, _canvas.height);
}

function init() {
    _canvas = document.getElementById("canvas");
    _context = _canvas.getContext("2d");
    _tank = new Tank(_canvas.width,_canvas.height);    
    draw();
}
function draw() {
    clear();        
    _tank.draw(_context);
}
function update() {
    _tank.update();
    draw();
}
function canvas_mousemove(e){    

    var x = e.pageX - _canvas.offsetLeft;
    var y = e.pageY - _canvas.offsetTop;
    _tank.rotateCannon(x,y);
}
function canvas_mousedown(e){    
    _tank.fire();
}
function canvas_keyDown(e){    
e.preventDefault();
    if(AVAILABLE_KEYS.indexOf(e.keyCode)!=-1)
    {
        _keypressed[e.keyCode] = true;
        doKeypress();        
    }
}
function canvas_keyUp(e){    
e.preventDefault();
    if(_keypressed[e.keyCode])
    {
        _keypressed[e.keyCode] = false;  
        _tank.resetSpeed();            
    }
}


function doKeypress(){
    if(_keypressed[Keys.KEY_W])
        _tank.moveUp();
    if(_keypressed[Keys.KEY_S])
        _tank.moveDown();
    if(_keypressed[Keys.KEY_A])
        _tank.moveLeft();
    if(_keypressed[Keys.KEY_D])
        _tank.moveRight();
    _tank.move();
    draw();
}
// onload
init();
_canvas.onkeydown = canvas_keyDown;
_canvas.onkeyup = canvas_keyUp;
_canvas.onmousemove = canvas_mousemove;
_canvas.onmousedown = canvas_mousedown;
window.setInterval(update,50);