// Inputs
export default (CONFIGS) => (assets) => {
  const world = document.getElementById('world');
  const mapSource = world.getAttribute('data-source');
  const mapData = assets.maps[mapSource];
  const mapTexture = `./src/img/${mapData.tileset}`;
  const room = document.createElement('div');

  room.id = 'room';
  world.appendChild(room);
  mapData.brush.forEach((c, i) => {
    const cell = document.createElement('div');
    const cellTexture = document.createElement('img');

    // Textures
    cellTexture.src = mapTexture;
    cellTexture.style.position = 'absolute';
    cellTexture.width *= CONFIGS.pixelSize;
    cellTexture.style.top = `-${CONFIGS.pixelSize * mapData.cellSize * c[0]}px`;
    cellTexture.style.left = `-${CONFIGS.pixelSize * mapData.cellSize * c[1]}px`;
    cellTexture.style.zIndex = c[2];
    cell.appendChild(cellTexture);

    // Cells
    cell.className = 'map-cell';
    const xx = i % Math.sqrt(mapData.brush.length);
    const yy = Math.floor(i / Math.sqrt(mapData.brush.length));
    cell.style.left = `${CONFIGS.pixelSize * mapData.cellSize * xx}px`;
    cell.style.top = `${CONFIGS.pixelSize * mapData.cellSize * yy}px`;
    room.appendChild(cell);
  });

  return room;
}