/$(function() {
  'use strict';

  var canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d'),
    color = '#000000',
    count = 400,
    flakes = [];

  canvas.width = window.innerWidth / 2;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  context.fillStyle = color;
  context.lineWidth = 0.1;
  context.strokeStyle = color;

  for (var i = 0; i < count; i++) {
    flakes.push(new Flake());
  }

  setInterval(animate, 1);

  function animate () {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var flake of flakes) {
      flake.draw();

      if (flake.y < 0 || flake.y > canvas.height) {
        flake.vx = flake.vx;
        flake.vy = -flake.vy;
      }
      else if (flake.x < 0 || flake.x > canvas.width) {
        flake.vx = -flake.vx;
        flake.vy = flake.vy;
      }
      flake.x += flake.vx;
      flake.y += flake.vy;
    }
  }

  function Flake () {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = -.5 + Math.random();
    this.vy = -.5 + Math.random();
    this.radius = Math.random();

    this.draw = function draw () {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      context.fill();
    }
  }
});
/* creat by yose */
/*
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback,element){
            window.setTimeout(callback, 10 / 10);
          };
})();

function random(n) {
    return Math.floor(Math.random()*n)+1;
}

function Canvas(elm) {
    this.elm = elm;
    this.canvasCtx = this.elm.getContext('2d');
    this.width = this.elm.width;
    this.height = this.elm.height;
    this.children = new Array();

    this.init();
}
Canvas.prototype = {
    resize: function(booleam){
        this.width = this.elm.width = booleam ? this.elm.parentNode.clientWidth * 2 : window.innerWidth * 2;
        this.height = this.elm.height = booleam ? this.elm.parentNode.clientHeight * 2 : window.innerHeight * 2;
    },
    clear: function(){
        this.canvasCtx.clearRect(0,0,this.width,this.height);
    },
    addChild: function(child){
        this.children.push(child);
    },
    removeChild: function(num){
        this.children.splice(num, 1);
    },
    rendering: function(){
        this.clear();

        var limit = this.children.length;
        for(var i = limit-1 ; i >= 0 ; i--){
            var child = this.children[i];
            if(child.draw(this.canvasCtx)){
                this.removeChild(i);
            }
        }
    },
    createSakura: function(num,x1,y1,x2,y2){
        for(var i = 0 ; i < num ; i++){
            var x_pos = Math.floor(Math.random()*(x2-x1)) + x1;
            var y_pos = Math.floor(Math.random()*(y2-y1)) + y1;
            this.addChild(new Sakura(
                this,
                x_pos,
                y_pos,
                Math.random()+0.5,
                {x:random(360), y:random(360), z:random(360)},
                {x:random(10), y:random(10), z:random(10)},
                random(5)
            ));
        }
    },
    animate: function(){
        var _this = this;

        if(Math.random() > 0.15 && this.children.length < 30){
            this.createSakura(1, 1, 1, this.width, 0);
        }

        this.rendering();

        window.requestAnimationFrame(function(){
            _this.animate();
        });
    },
    init: function(){
        this.resize(true);
        this.animate();
    }
}

function Sakura(parent, x, y, scale, direction, rotate, wind) {
    this.parent = parent;
    this.x_pos     = x;
    this.y_pos     = y;
    this.scale     = scale;
    this.direction = direction;
    this.rotate    = rotate;
    this.wind      = wind;
    this.gr        = 5;
    this.phase     = 0;
}
Sakura.prototype = {
    draw: function(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x_pos, this.y_pos);

        ctx.rotate(this.direction.y / 100 * Math.PI);
        ctx.scale(this.scale, this.scale);

        var grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 10);
            grad.addColorStop(0, '#fbe0ef');
            grad.addColorStop(0.1, '#f8c1d5');
            grad.addColorStop(1, '#f3d3e2');
        ctx.fillStyle = grad;

        var x_rad = Math.cos(this.direction.x*Math.PI/100);
        var z_rad = Math.cos(this.direction.z*Math.PI/100);
        ctx.moveTo(-6*z_rad,-10*x_rad);
        ctx.bezierCurveTo( -10*z_rad,    0*x_rad,  -5*z_rad,   10*x_rad,   0*z_rad,   10*x_rad );
        ctx.bezierCurveTo(   5*z_rad,   10*x_rad,  10*z_rad,    0*x_rad,   6*z_rad,  -10*x_rad );
        ctx.bezierCurveTo(   0*z_rad,  -10*x_rad,   0*z_rad,   -7*x_rad,   0*z_rad,   -5*x_rad );
        ctx.bezierCurveTo(   0*z_rad,   -7*x_rad,   0*z_rad,  -10*x_rad,  -6*z_rad,  -10*x_rad );
        ctx.fill();
        ctx.restore();

        return this.moveSakura();
    },
    moveSakura: function(){
        var move_y;
        if(this.phase === 0){
            var ground = 1 + (this.scale/10);
            if(this.y_pos > this.parent.height * ground){
                this.gr = 0;
                this.wind = 0;
                this.rotate.x = 0;
                this.rotate.y = 0;
                this.rotate.z = 0;
                this.phase = 1;
                this.parent.fallenSakura++;
            }
        }else if(this.phase === 2){
            if(this.gr > -3 ) this.gr += this.gr/10;
            move_y = (this.gr*this.scale);
        }

        this.y_pos = this.y_pos + (this.gr*this.scale)/2;
        this.x_pos = this.x_pos + this.wind/2;
        this.direction.x += this.rotate.x/2;
        this.direction.y += this.rotate.y/2;
        this.direction.z += this.rotate.z/2;

        if(this.x_pos > this.parent.width) return true;
        return this.y_pos > this.parent.height ? true : false;
    }
}

var canvas = document.getElementById("sakura");
var SakuraCanvas = new Canvas(canvas);

*/
