const cssPlayer = '#player';
const cssPlayerSprite = '#player .animated-spritesheet .spritesheet';
const cssRoom = '#room';
const cssCollisionMap = '.block';

const cssToNumber = (css) => {
  return Number(css.replace('px', ''))
}

const getCoordGrid = (room) => {
  const gridSize = room.getAttribute('grid-size');
  return [
    -cssToNumber(room.style.marginLeft) / gridSize,
    -cssToNumber(room.style.marginTop) / gridSize,
  ];
};

// -------------------------------------------------------------

const movements = {
  speed: 8,
  mapCollision: [],
  up: function(room) {
    const [xx, yy] = getCoordGrid(room);
    if (this.mapCollision.includes(`${xx};${yy - 1}`)) return;
    room.style.marginTop = `${cssToNumber(room.style.marginTop) + this.speed}px`;
  },
  down: function(room) {
    const [xx, yy] = getCoordGrid(room);
    if (this.mapCollision.includes(`${xx};${yy + 1}`)) return;
    room.style.marginTop = `${cssToNumber(room.style.marginTop) - this.speed}px`;
  },
  right: function(room) {
    const [xx, yy] = getCoordGrid(room);
    if (this.mapCollision.includes(`${xx + 1};${yy}`)) return;
    room.style.marginLeft = `${cssToNumber(room.style.marginLeft) - this.speed}px`;
  },
  left: function(room) {
    const [xx, yy] = getCoordGrid(room);
    if (this.mapCollision.includes(`${xx - 1};${yy}`)) return;
    room.style.marginLeft = `${cssToNumber(room.style.marginLeft) + this.speed}px`;
  },
}

const initializeViewPort = ({ room, playerElement }) => {
  const gridSize = room.getAttribute('grid-size');
  const [px, py] = playerElement.getAttribute('data-home').split(';');
  room.style.marginLeft = `-${px * gridSize}px`;
  room.style.marginTop = `-${py * gridSize}px`;
};

const initializeMapCollision = (room) => {
  const gridSize = room.getAttribute('grid-size');
  document
    .querySelectorAll(cssCollisionMap)
    .forEach(element => {
      const xx = cssToNumber(element?.style.left) / gridSize;
      const yy = cssToNumber(element?.style.top) / gridSize;
      movements.mapCollision.push(`${xx};${yy}`);
    });
}

const isOnTheGrid = (room) => {
  const gridSize = room.getAttribute('grid-size');
  const { marginLeft = '0px', marginTop = '0px'} = room.style;
  return !(cssToNumber(marginLeft) % gridSize)
      && !(cssToNumber(marginTop) % gridSize);
}

export default (CONFIG) => (mapData) => {

  const sprite = document.querySelector(cssPlayerSprite);
  const playerElement = document.querySelector(cssPlayer);
  const room = document.querySelector(cssRoom);
  
  const { up, down, left, right } = CONFIG.inputs;

  room.setAttribute('grid-size', mapData.cellSize * CONFIG.zoom);
  if (CONFIG.debugMode) playerElement.style.border = '1px solid yellow';

  initializeViewPort({ room, playerElement });
  initializeMapCollision(room);
  movements.speed = CONFIG.walkSpeed;

  setInterval(() => {
    if (isOnTheGrid(room)) {
      sprite.classList.replace('run', 'idle');
      return;
    }
    switch(cssToNumber(sprite.style.top)) {
      case 0:
        movements.down(room);
        break;
      case (-sprite.height * .25):
        movements.right(room);
        break;
      case (-sprite.height * .5):
        movements.up(room);
        break;
      case (-sprite.height * .75):
        movements.left(room);
        break;
    }
  }, 1000 / CONFIG.fps);

  window.onkeydown = ({ key }) => {
    if (!isOnTheGrid(room)) return;
    sprite.classList.replace('idle', 'run');
    switch (key) {
      case down:
        sprite.style.top = '0px';
        movements.down(room);
        break;
      case right:
        sprite.style.top = `${-sprite.height * .25}px`;
        movements.right(room);
        break;
      case up:
        sprite.style.top = `${-sprite.height * .5}px`;
        movements.up(room);
        break;
      case left:
        sprite.style.top = `${-sprite.height * .75}px`;
        movements.left(room);
        break;
    }
  };
}
