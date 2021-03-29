import CONFIGS from '../../config.js';
import assets from '../../assets/index.js';

import room from './room.js';
import game from './game.js';

window.onload = () => {
  const r = room(CONFIGS)(assets);
  game(CONFIGS)(r);
}
