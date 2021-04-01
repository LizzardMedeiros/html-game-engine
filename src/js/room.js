// Inputs
export default (CONFIGS) => (assets) => {
  const world = document.getElementById('world');
  const mapSource = world.getAttribute('data-source');
  const mapData = assets.maps[mapSource];
  const mapTexture = `./src/img/${mapData.tileset}`;
  const room = document.createElement('div');
  const gridSize = CONFIGS.zoom * mapData.cellSize;

  room.id = 'room';
  world.appendChild(room);
  mapData.brush.forEach((c, i) => {
    const cell = document.createElement('div');
    const cellTexture = document.createElement('img');

    // Textures
    cellTexture.src = mapTexture;
    cellTexture.style.position = 'absolute';
    cellTexture.width *= CONFIGS.zoom;
    cellTexture.style.left = `-${gridSize * c[0]}px`;
    cellTexture.style.top = `-${gridSize * c[1]}px`;
    cellTexture.style.zIndex = c[2];
    cell.appendChild(cellTexture);

    // Cells
    cell.classList.add('map-cell');
    if (CONFIGS.debugMode) cell.style.border = '1px solid gray';
    if (c[3] === CONFIGS.tilesetEventCode.collision) cell.classList.add('block');
    const xx = i % Math.sqrt(mapData.brush.length);
    const yy = Math.floor(i / Math.sqrt(mapData.brush.length));
    cell.style.left = `${gridSize * xx}px`;
    cell.style.top = `${gridSize * yy}px`;
    room.appendChild(cell);
  });

  return mapData;
}