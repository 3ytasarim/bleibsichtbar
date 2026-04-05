/**
     author: @manufosela
     copyleft 2013-2023
     
     Created: 2013/08/27    
     Updated to ES6: 2023/12/03

     ShootingStar class Main Methods:
       launch: launch shooting stars every N seconds received by              param. 10 seconds by default.
       launchStar: launch a shooting star. Received options                  object by param with:
               - dir (direction between 0 and 1)
               - life (between 100 and 400)
               - beamSize (between 400 and 700)
               - velocity (between 2 and 10)
               
    Before It was necessary to use jQuery (this code is before ES6)
    Not After 2023 December.
    
  **/

const starsNum = 2000;
document.addEventListener('DOMContentLoaded', () => {
  const starfield = new Starfield('starCanvas');
  
  /* Three stars with 5, 6 and 7 seconds interval */
  // STAR 1, 5 seconds interval
  const shootingStarObj = new ShootingStar('body');
  shootingStarObj.launch(5);
  // STAR 2, 6 seconds interval
  const shootingStarObj2 = new ShootingStar('body');
  shootingStarObj2.launch(6);
  // STAR 3, 7 seconds interval
  const shootingStarObj3 = new ShootingStar('body');
  shootingStarObj3.launch(7);
});



class ShootingStar {
  constructor(id) {
    this.n = 0;
    this.m = 0;
    this.defaultOptions = {
      velocity: 8,
      starSize: 10,
      life: 300,
      beamSize: 400,
      dir: -1
    };
    this.options = {};
    this.capa = document.querySelector(id) || document.body;
    this.wW = this.capa.clientWidth;
    this.hW = this.capa.clientHeight;
  }

  addBeamPart(x, y) {
    this.n++;
    const name = this.getRandom(100, 1);
    const oldStar = document.getElementById(`star${name}`);
    if (oldStar) {
      oldStar.remove();
    }
    const starDiv = document.createElement("div");
    starDiv.id = `star${name}`;
    this.capa.appendChild(starDiv);

    const hazDiv = document.createElement("div");
    hazDiv.id = `haz${this.n}`;
    hazDiv.className = 'haz';
    hazDiv.style = `position:absolute; color:#FF0; width:10px; height:10px; font-weight:bold; font-size:${this.options.starSize}px`;
    hazDiv.textContent = '·';
    starDiv.appendChild(hazDiv);

    if (this.n > 1) {
      const prevHaz = document.getElementById(`haz${this.n - 1}`);
      if (prevHaz) {
        prevHaz.style.color = 'rgba(255,255,255,0.5)';
      }
    }

    hazDiv.style.top = `${y + this.n}px`;
    hazDiv.style.left = `${x + (this.n * this.options.dir)}px`;
  }

  delTrozoHaz() {
    this.m++;
    const haz = document.getElementById(`haz${this.m}`);
    if (haz) {
      haz.style.opacity = '0';
    }
    if (this.m >= this.options.beamSize) {
      const paramsDiv = document.getElementById("ShootingStarParams");
      if (paramsDiv) {
        paramsDiv.style.display = 'none';
      }
    }
  }

  getRandom(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  launchStar(options) {
    if (typeof options !== "object") {
      options = {};
    }
    this.options = Object.assign({}, this.defaultOptions, options);
    this.n = 0;
    this.m = 0;
    const x = this.getRandom(this.wW - this.options.beamSize - 100, 100);
    const y = this.getRandom(this.hW - this.options.beamSize - 100, 100);

    for (let i = 0; i < this.options.beamSize; i++) {
      setTimeout(() => {
        this.addBeamPart(x, y);
      }, this.options.life + (i * this.options.velocity));
    }
    for (let i = 0; i < this.options.beamSize; i++) {
      setTimeout(() => {
        this.delTrozoHaz();
      }, this.options.beamSize + (i * this.options.velocity));
    }

    const paramsDiv = document.getElementById("ShootingStarParams");
    if (paramsDiv) {
      paramsDiv.innerHTML = `Launching shooting star. PARAMS: wW: ${this.wW} - hW: ${this.hW} - life: ${this.options.life} - beamSize: ${this.options.beamSize} - velocity: ${this.options.velocity}`;
      paramsDiv.style.display = 'block';
    }
  }

  launch(everyTime) {
    if (typeof everyTime !== "number") {
      everyTime = 10;
    }
    everyTime = everyTime * 1000;
    this.launchStar();
    setInterval(() => {
      const options = {
        dir: this.getRandom(1, 0) ? 1 : -1,
        life: this.getRandom(400, 100),
        beamSize: this.getRandom(700, 400),
        velocity: this.getRandom(10, 4)
      };
      this.launchStar(options);
    }, everyTime);
  }
}

class Starfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = document.documentElement.clientWidth;
    this.canvas.height = document.documentElement.clientHeight;
    this.drawStars();
  }

  drawStars() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    for (let i = 0; i < starsNum; i++) {
      this.drawStar(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height,
        Math.random() * 1.5, // Tamaño de la estrella
        'white',
        Math.random() > 0.5 // Para difuminar algunas estrellas
      );
    }
  }

  drawBackground() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, 'black');
    // Franja central simulando la Vía Láctea
    gradient.addColorStop(0.5, 'rgba(0, 0, 50, 0.7)');
    gradient.addColorStop(1, 'black');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawStar(x, y, radius, color, isBlur) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = color;
    if (isBlur) {
      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = radius * 5;
    }
    this.ctx.fill();
    this.ctx.restore();
  }
}




/* OLD CODE 2013 

(function() {
  /**
     author: @manufosela
     2013/08/27    copyleft 2013

     ShootingStar class Main Methods:
     launch: launch shooting stars every N seconds received by              param. 10 seconds by default.
      launchStar: launch a shooting star. Received options                  object by param with:
               - dir (direction between 0 and 1)
               - life (between 100 and 400)
               - beamSize (between 400 and 700)
               - velocity (between 2 and 10)
               
    It is necessary to use jQuery (this code is before ES6)
    This code use https://codeorigin.jquery.com/jquery-1.10.2.min.js
  

  ShootingStar = function(id) {
    this.n = 0;
    this.m = 0;
    this.defaultOptions = {
      velocity: 8,
      starSize: 10,
      life: 300,
      beamSize: 400,
      dir: -1
    };
    this.options = {};
    id = (typeof id != "undefined") ? id : "";
    this.capa = ($(id).lenght > 0) ? "body" : id;
    this.wW = $(this.capa).innerWidth();
    this.hW = $(this.capa).innerHeight();
  };

  ShootingStar.prototype.addBeamPart = function(x, y) {
    this.n++;
    var name = this.getRandom(100, 1);
    $("#star" + name).remove();
    $(this.capa).append("<div id='star" + name + "'></div>");
    $("#star" + name).append("<div id='haz" + this.n + "' class='haz' style='position:absolute; color:#FF0; width:10px; height:10px; font-weight:bold; font-size:" + this.options.starSize + "px'>·</div>");
    if (this.n > 1) $("#haz" + (this.n - 1)).css({
      color: "rgba(255,255,255,0.5)"
    });
    $("#haz" + this.n).css({
      top: y + this.n,
      left: x + (this.n * this.options.dir)
    });
  }

  ShootingStar.prototype.delTrozoHaz = function() {
    this.m++;
    $("#haz" + this.m).animate({
      opacity: 0
    }, 75);
    if (this.m >= this.options.beamSize) {
      $("#ShootingStarParams").fadeOut("slow");
    }
  }

  ShootingStar.prototype.getRandom = function(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  ShootingStar.prototype.toType = function(obj) {
    if (typeof obj === "undefined") {
      return "undefined"; // consider: typeof null === object
    }
    if (obj === null) {
      return "null";
    }
    var type = Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1] || '';
    switch (type) {
      case 'Number':
        if (isNaN(obj)) {
          return "nan";
        } else {
          return "number";
        }
      case 'String':
      case 'Boolean':
      case 'Array':
      case 'Date':
      case 'RegExp':
      case 'Function':
        return type.toLowerCase();
    }
    if (typeof obj === "object") {
      return "object";
    }
    return undefined;
  }

  ShootingStar.prototype.launchStar = function(options) {
    if (this.toType(options) != "object") {
      options = {};
    }
    this.options = $.extend({}, this.defaultOptions, options);
    this.n = 0;
    this.m = 0;
    var i = 0,
      l = this.options.beamSize,
      x = this.getRandom(this.wW - this.options.beamSize - 100, 100),
      y = this.getRandom(this.hW - this.options.beamSize - 100, 100),
      self = this;
    for (; i < l; i++) {
      setTimeout(function() {
        self.addBeamPart(x, y);
      }, self.options.life + (i * self.options.velocity));
    }
    for (i = 0; i < l; i++) {
      setTimeout(function() {
        self.delTrozoHaz()
      }, self.options.beamSize + (i * self.options.velocity));
    }
    $("#ShootingStarParams").html("Launching shooting star. PARAMS: wW: " + this.wW + " - hW: " + this.hW + " - life: " + this.options.life + " - beamSize: " + this.options.beamSize + " - velocity: " + this.options.velocity);
    $("#ShootingStarParams").fadeIn("slow");
  }

  ShootingStar.prototype.launch = function(everyTime) {
    if (this.toType(everyTime) != "number") {
      everyTime = 10;
    }
    everyTime = everyTime * 1000;
    this.launchStar();
    var self = this;
    setInterval(function() {
      var options = {
        dir: (self.getRandom(1, 0)) ? 1 : -1,
        life: self.getRandom(400, 100),
        beamSize: self.getRandom(700, 400),
        velocity: self.getRandom(10, 4)
      }
      self.launchStar(options);
    }, everyTime);
  }

})();

$(document).ready(function() {
  var shootingStarObj = new ShootingStar("body");
  shootingStarObj.launch();
});

// OLD CSS
#layout { 
  color:transparent;
  height:600px;
  width:100%;
  height:100%; 
}
.stars {
  z-index: 0;
  position: absolute;
  background-image: url(   https://www.manufosela.es/shooting_stars/hori.png), url( https://www.manufosela.es/shooting_stars/stars_5.png);
  background-repeat: repeat-x, repeat-x repeat-y;
  transform:translate3D(0em, 0em, 0);
  animation: stars 21s ease; 
  transform-style: preserve-3d;
}

*/