import gridOptions from "../gridOptions";

export async function runAlgorithm(name) {
  if (!(name in searchingAlgorithms)) {
    throw new ReferenceError(`Algorithm with name '${name}' is not defined`);
  }
  gridOptions.disableUserInteraction();
  gridOptions.animationLaunched = true;
  await searchingAlgorithms[name]();
  gridOptions.animationLaunched = false;
  gridOptions.enableUserInteraction();
}

const animateCell = (state, i, j, time = gridOptions.delay) => {
  return new Promise((resolve) => {
    if (gridOptions.isSourceDragged || gridOptions.isDestinationDragged) {
      // when dragging either source or destination,update current cell immediately WITHOUT animation
      gridOptions.matrix[i][j].update({
        isSource: gridOptions.isSource(i, j),
        isDestination: gridOptions.isDestination(i, j),
        class: state,
        weighted: gridOptions.isWeighted(i, j),
      });
      resolve();
    } else {
      setTimeout(() => {
        gridOptions.matrix[i][j].update({
          isSource: gridOptions.isSource(i, j),
          isDestination: gridOptions.isDestination(i, j),
          class: state,
          weighted: gridOptions.isWeighted(i, j),
        });
        resolve();
      }, time);
    }
  });
};

export const searchingAlgorithms = {
  bfs: async () => {
    const src = gridOptions.source;
    const dst = gridOptions.destination;
    gridOptions.clearPath();
    const mat = gridOptions.matrix;
    const n = mat.length;
    const m = mat[0].length;
    const visited = new Array(n).fill().map((e) => new Array(m).fill(false));
    const isValid = (i, j) => i >= 0 && i < n && j >= 0 && j < m;
    visited[src[0]][src[1]] = true;
    const queue = [{ position: [...src], distance: 0, path: [] }];
    const addends = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    while (queue.length > 0) {
      const current = queue.shift();

      const { position, distance, path } = current;
      const [x, y] = position;
      path.push([x, y]);

      await animateCell("visited", x, y);
      visited[x][y] = true;

      if (x === dst[0] && y === dst[1]) {
        for (let [i, j] of path) {
          await animateCell("path", i, j);
        }
        break;
      }
      for (let [i, j] of addends) {
        let newX = x + i;
        let newY = y + j;
        if (isValid(newX, newY)) {
          if (
            !visited[newX][newY] &&
            !gridOptions.isWall(newX, newY)
            // gridOptions.matrix[newX][newY].class !== 'wall'
          ) {
            visited[newX][newY] = true;
            queue.push({
              position: [newX, newY],
              distance: distance + 1,
              path: [...path, [newX, newY]],
            });
          }
        }
      }
    }
  },

  dfs: async () => {
    const src = gridOptions.source;
    const dst = gridOptions.destination;

    gridOptions.clearPath();
    await animateCell("unvisited", src[0], src[1]);
    await animateCell("unvisited", src[0], src[1]);
    const visited = new Set();
    let foundPath = [];
    async function search(current, path) {
      const [x, y] = current;
      if (gridOptions.isWall(x, y) || visited.has(x + "," + y)) return false;
      path.push([x, y]);
      await animateCell("visited", x, y);
      visited.add(x + "," + y);
      // if ()) return false;
      if (x === dst[0] && y === dst[1]) {
        foundPath = path;
        return true;
      }
      const addends = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1],
      ];
      const n = gridOptions.matrix.length;
      const m = gridOptions.matrix[0].length;
      const isValid = (i, j) => i >= 0 && i < n && j >= 0 && j < m;
      for (let [i, j] of addends) {
        let newX = x + i;
        let newY = y + j;
        if (isValid(newX, newY)) {
          let found = await search([newX, newY], [...path]);
          if (found) {
            return true;
          }
        }
      }
      return false;
    }

    await search(src, []);
    for (let [i, j] of foundPath) {
      await animateCell("path", i, j);
    }
  },
  dijkstra: async () => {
    const src = gridOptions.source;
    const dst = gridOptions.destination;
    gridOptions.clearPath();
    const matrix = gridOptions.matrix;
    const n = matrix.length;
    const m = matrix[0].length;
    const unvisited = new Set();
    const prev = new Array(n);
    const distances = new Array(n);

    for (let i = 0; i < n; ++i) {
      prev[i] = new Array(m).fill(null);
      distances[i] = new Array(m).fill(Infinity);
      for (let j = 0; j < m; ++j) {
        unvisited.add(i + "," + j);
      }
    }

    const stringify = (i, j) => i + "," + j;
    const indexify = (vertex) => (vertex ? vertex.split(",").map((idx) => Number(idx)) : [-1, -1]);

    const extractMin = () => {
      // finds the vertex with minimum distance, removes it from the "unvisited" set and returns it
      let minDistance = Infinity;
      let minDistanceVertex = null;
      const verticies = unvisited.keys();
      for (let v of verticies) {
        const [i, j] = indexify(v);
        if (distances[i][j] < minDistance) {
          minDistance = distances[i][j];
          minDistanceVertex = v;
        }
      }
      if (!minDistanceVertex) {
        minDistanceVertex = verticies[0];
      }

      unvisited.delete(minDistanceVertex);
      return indexify(minDistanceVertex);
    };
    const getNeighbors = (v) => {
      const neighbors = [];
      let [x, y] = v;

      const addends = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];

      for (let [i, j] of addends) {
        let newX = x + i;
        let newY = y + j;
        if (newX >= 0 && newX < n && newY >= 0 && newY < m && !gridOptions.isWall(newX, newY)) {
          neighbors.push([newX, newY]);
        }
      }

      return neighbors;
    };

    distances[src[0]][src[1]] = 0;

    while (unvisited.size > 0) {
      const [x, y] = extractMin();
      if (x === -1 || y === -1) {
        // there is no path
        break;
      }
      await animateCell("visited", x, y);
      if (x === dst[0] && y === dst[1]) {
        // found the shortest path
        break;
      }
      const neighbors = getNeighbors([x, y]);

      for (let neighbor of neighbors) {
        let [i, j] = neighbor;

        let v = stringify(i, j);
        if (unvisited.has(v)) {
          const alt = distances[x][y] + (matrix[i][j].weighted ? 5 : 1);

          if (alt < distances[i][j]) {
            distances[i][j] = alt;
            prev[i][j] = [x, y];
          }
        }
      }
    }

    let shortestPath = [];
    if (prev[dst[0]][dst[1]]) {
      let current = dst;
      while (current) {
        shortestPath.push(current);
        current = prev[current[0]][current[1]];
      }
    }

    shortestPath.reverse();
    for (let [i, j] of shortestPath) {
      await animateCell("path", i, j);
    }
  },

  astar: async () => {
    const src = gridOptions.source;
    const dst = gridOptions.destination;
    gridOptions.disableUserInteraction();
    gridOptions.clearPath();
    const matrix = gridOptions.matrix;
    const n = matrix.length;
    const m = matrix[0].length;

    const openSet = new Set();
    const prev = new Array(n);
    const gScore = new Array(n);
    const fScore = new Array(n);

    const getHeruistic = (i, j) => {
      return Math.abs(i - dst[0]) + Math.abs(j - dst[1]);
    };

    for (let i = 0; i < n; ++i) {
      gScore[i] = new Array(m).fill(Infinity);
      fScore[i] = new Array(m).fill(Infinity);
      prev[i] = new Array(m);
      for (let j = 0; j < m; ++j) {
        prev[i][j] = null;
      }
    }

    fScore[src[0]][src[1]] = getHeruistic(src[0], src[1]);
    openSet.add(src[0] + "," + src[1]);
    gScore[src[0]][src[1]] = 0;

    const stringify = (i, j) => i + "," + j; // returns hash value for two indicies of the vertex
    const indexify = (vertex) => vertex.split(",").map((idx) => Number(idx)); // returns two indicies from hash value of the vertex

    const extractMin = () => {
      // finds the vertex with minimum distance, removes it from the "openSet" and returns it
      let minFScore = Infinity;
      let minFScoreVertex = null;
      const verticies = openSet.keys();

      // find the vertex in openSet with minimum fScore
      for (let v of verticies) {
        const [i, j] = indexify(v);

        if (fScore[i][j] < minFScore) {
          minFScore = fScore[i][j];
          minFScoreVertex = v;
        } else if (fScore[i][j] === minFScore) {
          // if fscores are equal, choose a vertex with lower herustic score
          let [x, y] = indexify(minFScoreVertex);
          if (getHeruistic(i, j) < getHeruistic(x, y)) {
            minFScore = fScore[i][j];
            minFScoreVertex = v;
          }
        }
      }

      openSet.delete(minFScoreVertex);
      return indexify(minFScoreVertex);
    };

    const getNeighbors = (v) => {
      const neighbors = [];
      let [x, y] = v;

      // addendsd for possible directions we can move from v
      const addends = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];
      for (let [i, j] of addends) {
        let newX = x + i;
        let newY = y + j;

        // validating possible neighbor coordinates
        if (newX >= 0 && newX < n && newY >= 0 && newY < m && matrix[newX][newY].class !== "wall") {
          neighbors.push([newX, newY]);
        }
      }
      return neighbors;
    };

    while (openSet.size > 0) {
      const [x, y] = extractMin(); // extract the node with minimal fScore in openSet and remove it from the set

      await animateCell("visited", x, y);

      if (x === dst[0] && y === dst[1]) {
        // prev[x][y].push([x, y]);
        break;
      }
      const neighbors = getNeighbors([x, y]);

      for (let neighbor of neighbors) {
        let [i, j] = neighbor;
        const tentative_gScore = gScore[x][y] + (matrix[i][j].weighted ? 5 : 1);

        // await sleepPromise('visited', i, j);
        if (tentative_gScore < gScore[i][j]) {
          gScore[i][j] = tentative_gScore;
          prev[i][j] = [x, y];
          fScore[i][j] = tentative_gScore + getHeruistic(i, j);
          openSet.add(stringify(i, j));
        }
      }
    }
    const shortestPath = [];

    if (prev[dst[0]][dst[1]]) {
      // if the path found, than construct the shortestPath via backtracking from the destination node
      let currentNode = dst;
      while (currentNode) {
        shortestPath.push(currentNode);
        currentNode = prev[currentNode[0]][currentNode[1]];
      }
    }

    shortestPath.reverse(); // reversing the path to get it in right order (from source to destination)

    for (let [i, j] of shortestPath) {
      await animateCell("path", i, j);
    }
    gridOptions.enableUserInteraction();
  },
};
