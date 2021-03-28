import CONFIGS from '../../config.js';
import assets from '../../assets/index.js';

import room from './room.js';
import inputs from './inputs.js';

window.onload = () => {
  const r = room(CONFIGS)(assets);
  inputs(CONFIGS)(r);
}
