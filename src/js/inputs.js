// Inputs
export default (CONFIG) => (room) => {
  const cssPlayerSprite = '#player .animated-spritesheet .spritesheet';
  const sprite = document.querySelector(cssPlayerSprite);
  const { up, down, left, right } = CONFIG.inputs;

  let xx = 0;
  let yy = 0;

  window.onkeydown = (ev) => {
    const { key } = ev;
    if (player) {
      sprite.classList.replace('idle', 'run');
      switch (key) {
        case down:
          yy -= 4;
          sprite.style.top = '0';
          break;
        case right:
          xx -= 4;
          sprite.style.top = `${-sprite.height * .25}px`;
          break;
        case up:
          yy += 4;
          sprite.style.top = `${-sprite.height * .5}px`;
          break;
        case left:
          xx += 4;
          sprite.style.top = `${-sprite.height * .75}px`;
          break;
      }
      room.style.left = `${xx}px`;
      room.style.top = `${yy}px`;
    }
  };

  window.onkeyup = (ev) => {
    const { key } = ev;
    if ([up, down, left, right].includes(key)) {
      sprite.classList.replace('run', 'idle');
    }
  };

}
