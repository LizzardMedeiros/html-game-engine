const cssPlayer = '#player';
const cssPlayerSprite = '#player .animated-spritesheet .spritesheet';
const cssRoom = '#room';
const cssCollisionMap = '.block';
let movement = 'idle';

export default (CONFIG) => (mapData) => {

  const playerElement = document.querySelector(cssPlayer);
  const sprite = document.querySelector(cssPlayerSprite);
  const room = document.querySelector(cssRoom);
  const collisionMap = [];
  const gridSize = (mapData.cellSize * CONFIG.zoom);

  const toGrid = (value) => {
    return Math.floor(value / gridSize);
  }

  document.querySelectorAll(cssCollisionMap).forEach((el) => {
    const xx = toGrid(Number(el.style.left.replace('px', '')));
    const yy = toGrid(Number(el.style.top.replace('px', '')));
    collisionMap.push(`${xx};${yy}`);
  });

  const { up, down, left, right } = CONFIG.inputs;

  let [xx, yy] = playerElement
    .getAttribute('data-startat')
    .split(';')
    .map(coord => -(coord * gridSize));
  
  let lastPlayerPosition = [toGrid(-xx), toGrid(-yy)];

  const checkCollision = (direction) => {
    let isBlocked = false;
    let nextCell = `-1;-1`;
    const limit = toGrid(gridSize * Math.sqrt(mapData.brush.length));
    switch(direction){
      case 'up':
        nextCell = `${toGrid(-xx)};${toGrid(-yy)}`;
        isBlocked = collisionMap.includes(nextCell);
        isBlocked = isBlocked || toGrid(yy + gridSize) >= 0;
        break;
      case 'left':
        nextCell = `${toGrid(-xx)};${toGrid(-yy)}`;
        isBlocked = collisionMap.includes(nextCell);
        isBlocked = isBlocked || toGrid(xx + gridSize) >= 0;
        break;
      case 'right':
        nextCell = `${toGrid(-xx + gridSize)};${toGrid(-yy)}`;
        isBlocked = collisionMap.includes(nextCell);
        isBlocked = isBlocked || toGrid(xx) < -limit;
        break; 
      case 'down':
        nextCell = `${toGrid(-xx)};${toGrid(-yy + gridSize)}`;
        isBlocked = collisionMap.includes(nextCell);
        isBlocked = isBlocked || toGrid(yy) < -limit;
        break;
    }
    return isBlocked;    
  }
  
  setInterval(() => {
    room.style.left = `calc(50% + ${xx}px)`;
    room.style.top = `calc(50% + ${yy}px)`;

    // Compute movement
    if(movement !== 'idle') sprite.classList.replace('idle', 'run');
    else {
      sprite.classList.replace('run', 'idle');
      return;
    }
    if (!checkCollision(movement)) {
      const [lx, ly] = lastPlayerPosition;
      const able = lx === toGrid(-xx) && ly === toGrid(-yy);
      switch(movement) {
        case 'down':
          if (able) yy -= CONFIG.walkSpeed;
          else {
            movement = 'idle';
          }
          break;
        case 'up':
          if (able) yy += CONFIG.walkSpeed;
          else {
            movement = 'idle';
          }
          break;
        case 'left':
          if (able) xx += CONFIG.walkSpeed;
          else {
            movement = 'idle';
          }
          break;
        case 'right':
          if (able) xx -= CONFIG.walkSpeed;
          else {
            movement = 'idle';
          }
          break;
      }
    }

  }, 1000 / CONFIG.fps);

  window.onkeydown = (ev) => {
    const { key } = ev;
    lastPlayerPosition = [toGrid(-xx), toGrid(-yy)];
    switch (key) {
      case down:
        movement = 'down';
        sprite.style.top = '0';
        break;
      case right:
        movement = 'right';
        sprite.style.top = `${-sprite.height * .25}px`;
        break;
      case up:
        movement = 'up';
        sprite.style.top = `${-sprite.height * .5}px`;
        break;
      case left:
        movement = 'left';
        sprite.style.top = `${-sprite.height * .75}px`;
        break;
    }
  };
}
