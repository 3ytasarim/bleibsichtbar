/**
   author: @manufosela
   copyleft 2013-2023
   Updated to ES6: 2023/12/03
**/

const starsNum = 2000;

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
    hazDiv.style.cssText = `position:absolute; color:#FF0; width:10px; height:10px; font-weight:bold; font-size:${this.options.starSize}px; pointer-events:none; z-index:3;`;
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
        Math.random() * 1.5,
        'white',
        Math.random() > 0.5
      );
    }
  }

  drawBackground() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, 'black');
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

window.ShootingStar = ShootingStar;
window.Starfield = Starfield;
