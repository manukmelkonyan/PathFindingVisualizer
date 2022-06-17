import gridOptions from "../gridOptions";

const animateCell = (state, i, j, time = gridOptions.delay) => {
  return new Promise((resolve) => {
    if (state === "wall" && (gridOptions.isSource(i, j) || gridOptions.isDestination(i, j))) {
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

export async function runMazeAlgorithm(name) {
  if (!(name in mazeAlgorithms)) {
    throw new ReferenceError(`Algorithm with name '${name}' is not defined`);
  }
  gridOptions.clearBoard();
  gridOptions.disableUserInteraction();
  gridOptions.animationLaunched = true;
  await mazeAlgorithms[name]();
  gridOptions.animationLaunched = false;
  gridOptions.enableUserInteraction();
}

export const mazeAlgorithmsFullNames = {
  recursiveDivision: "Recursive Division",
  randomizedDFS: "Randomized DFS",
  binaryTree: "Binary Tree",
  primsRandomized: "Prim's randomized",
  kruskalsRandomized: "Kruskal's randomized",
};

const mazeAlgorithms = {
  recursiveDivision: async () => {
    const randInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const chooseOrientation = (height, width) => {
      let orientation = "";
      if (height > width) {
        orientation = "Horizontal";
      } else if (height < width) {
        orientation = "Vertical";
      } else {
        orientation = Math.random() <= 0.5 ? "Horizontal" : "Vertical";
      }
      return orientation;
    };
    const randWallIndex = (from, to) => {
      let wallIndex = -1;
      const indicies = [];
      for (let idx = from; idx <= to; ++idx) {
        if (idx % 2 !== 0) indicies.push(idx);
      }
      if (indicies.length > 0) {
        let randIndex = randInt(0, indicies.length - 1);
        wallIndex = indicies[randIndex];
        // wallIndex = indicies[Math.floor(indicies.length / 2)];
      }

      return wallIndex;
    };

    const randHoleIndex = (from, to) => {
      let holeIndex = -1;

      const indicies = [];

      for (let col = from; col <= to; ++col) {
        if (col % 2 === 0) indicies.push(col);
      }
      if (indicies.length > 0) {
        let randIndex = randInt(0, indicies.length - 1);
        holeIndex = indicies[randIndex];
        // holeIndex = indicies[Math.floor(indicies.length / 2)];
      }

      return holeIndex;
    };

    const divide = async (i, height, j, width) => {
      if (width <= 2 || height <= 2) {
        return;
      }

      const orientation = chooseOrientation(height, width);

      if (orientation === "Horizontal") {
        const wallIndex = randWallIndex(i + 1, i + height - 2);
        if (wallIndex === -1) return;

        const holeIndex = randHoleIndex(j, j + width - 1);
        if (holeIndex === -1) return;

        for (let col = j; col < j + width; ++col) {
          if (col !== holeIndex) {
            await animateCell("wall", wallIndex, col);
          }
        }

        await divide(i, wallIndex - i, j, width);
        await divide(wallIndex + 1, i + height - wallIndex - 1, j, width);
      } else if (orientation === "Vertical") {
        let wallIndex = randWallIndex(j + 1, j + width - 2);
        if (wallIndex === -1) return;

        const holeIndex = randHoleIndex(i, i + height - 1);
        if (holeIndex === -1) return;
        for (let row = i; row < i + height; ++row) {
          if (row !== holeIndex) {
            await animateCell("wall", row, wallIndex);
          }
        }
        await divide(i, height, j, wallIndex - j);
        await divide(i, height, wallIndex + 1, j + width - wallIndex - 1);
      }
    };
    const [n, m] = gridOptions.getSize();
    await divide(0, n, 0, m);

    // check if source or destination are disconnected from the grid (are surrounded by walls),
    //    if so, randomly remove one of the walls

    const src = gridOptions.source;
    const sourceNeighbors = [
      [src[0] + 1, src[1]],
      [src[0] - 1, src[1]],
      [src[0], src[1] + 1],
      [src[0], src[1] - 1],
    ].filter(([i, j]) => i >= 0 && j >= 0 && i < n && j < m);

    if (sourceNeighbors.every(([i, j]) => gridOptions.isWall(i, j))) {
      const randIndex = randInt(0, sourceNeighbors.length - 1);
      await animateCell("unvisited", ...sourceNeighbors[randIndex]);
    }

    const dst = gridOptions.destination;
    const destinationNeighbors = [
      [dst[0] + 1, dst[1]],
      [dst[0] - 1, dst[1]],
      [dst[0], dst[1] + 1],
      [dst[0], dst[1] - 1],
    ].filter(([i, j]) => i >= 0 && j >= 0 && i < n && j < m);

    if (destinationNeighbors.every(([i, j]) => gridOptions.isWall(i, j))) {
      const randIndex = randInt(0, destinationNeighbors.length - 1);
      await animateCell("unvisited", ...destinationNeighbors[randIndex]);
    }
  },
  randomizedDFS: async () => {
    const [n, m] = gridOptions.getSize();
    let visited = new Set();

    const stringify = ([x, y]) => x + "," + y;
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const isVisited = ([x, y]) => {
      return visited.has(x + "," + y);
    };

    const getNeigborsWithDistance = (x, y, distance) => {
      const neighbors = [];
      let addends = [
        [0, distance],
        [distance, 0],
        [0, -distance],
        [-distance, 0],
      ];

      for (let [i, j] of addends) {
        let newX = x + i;
        let newY = y + j;
        if (newX >= 0 && newX < n && newY >= 0 && newY < m) {
          neighbors.push([newX, newY]);
        }
      }
      // randomly shuffle with Fisher–Yates algorithm
      const shuffled = [];
      while (neighbors.length > 0) {
        const l = neighbors.length - 1;
        let randIndex = randInt(0, l);
        shuffled.push(neighbors[randIndex]);

        const temp = neighbors[randIndex];
        neighbors[randIndex] = neighbors[l];
        neighbors[l] = temp;

        neighbors.pop();
      }

      return shuffled;
    };

    const getNeigbors = (x, y) => {
      return getNeigborsWithDistance(x, y, 2);
    };

    const getHoleNeighbors = (x, y) => {
      return getNeigborsWithDistance(x, y, 1);
    };

    const dfs = async (vertex) => {
      const [i, j] = vertex;
      if (isVisited(vertex)) return;

      visited.add(stringify(vertex));

      const neighbors = getNeigbors(i, j);
      for (let neighbor of neighbors) {
        if (!isVisited(neighbor)) {
          const wallI = (i + neighbor[0]) / 2;
          const wallJ = (j + neighbor[1]) / 2;
          if (!gridOptions.isWall(wallI, wallJ)) await animateCell("wall", wallI, wallJ);
          if (i === wallI) {
            wallI - 1 >= 0 && !gridOptions.isWall(wallI - 1, wallJ) && (await animateCell("wall", wallI - 1, wallJ));
            wallI + 1 < n && !gridOptions.isWall(wallI + 1, wallJ) && (await animateCell("wall", wallI + 1, wallJ));
          } else if (j === wallJ) {
            wallJ - 1 >= 0 && !gridOptions.isWall(wallI, wallJ - 1) && (await animateCell("wall", wallI, wallJ - 1));
            wallJ + 1 < m && !gridOptions.isWall(wallI, wallJ + 1) && (await animateCell("wall", wallI, wallJ + 1));
          }
        }
      }
      for (let neighbor of neighbors) {
        if (!isVisited(neighbor)) {
          const holeI = (i + neighbor[0]) / 2;
          const holeJ = (j + neighbor[1]) / 2;

          const holeNeighbors = getHoleNeighbors(holeI, holeJ);
          for (let holeNeighbor of holeNeighbors) {
            if (
              !gridOptions.isWall(holeNeighbor[0], holeNeighbor[1]) &&
              !isVisited(holeNeighbor) &&
              (neighbor[0] !== holeNeighbor[0] || neighbor[1] !== holeNeighbor[1])
            ) {
              await animateCell("wall", holeNeighbor[0], holeNeighbor[1]);
            }
          }
          await animateCell("unvisited", holeI, holeJ, 0);
          visited.add(stringify([holeI, holeJ]));
          await dfs(neighbor);
        }
      }
    };

    await dfs([0, 0]);

    // adding walls to unreachable cells (which are considered to be walls)
    // for (let i = 1; i < n; i += 2) {
    //   for (let j = 1; j < m; j += 2) {
    //     if (
    //       gridOptions.isUnvisited(i, j) &&
    //       getHoleNeighbors(i, j).every(([row, col]) => {
    //         return gridOptions.isWall(row, col);
    //       })
    //     ) {
    //       await animateCell("wall", i, j);
    //     }
    //   }
    // }
  },

  binaryTree: async () => {
    const [n, m] = gridOptions.getSize();
    for (let i = 2; i < n; i += 2) {
      for (let j = 2; j < m; j += 2) {
        await animateCell("unvisited", i, j);
        // randomly chooze connection direciton either north or west
        if (Math.random() <= 0.5) {
          const passageI = i - 1;
          const passageJ = j;
          if (passageI < n && passageJ < m) {
            await animateCell("wall", i, passageJ - 1);
            await animateCell("wall", passageI, passageJ - 1);
          }
        } else {
          const passageI = i;
          const passageJ = j - 1;
          if (passageI >= 1 && passageI < n && passageJ >= 0 && passageJ < m) {
            await animateCell("wall", passageI - 1, j);
            await animateCell("wall", passageI - 1, passageJ);
          }
        }
      }
    }
  },
  primsRandomized: async () => {
    const [n, m] = gridOptions.getSize();
    const visited = new Set();
    const unvisited = new Set();
    const middleRow = Math.floor(n / 2) - (Math.floor(n / 2) % 2);
    const middleCol = Math.floor(m / 2) - (Math.floor(m / 2) % 2);
    unvisited.add(`${middleRow},${middleCol}`);

    const randInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const isVisited = (i, j) => visited.has(i + "," + j);

    const extractRandomVertexFromUnvisitedSet = () => {
      const randIndex = randInt(0, unvisited.size - 1);
      const randVertex = Array.from(unvisited.keys())[randIndex];
      unvisited.delete(randVertex);
      return randVertex;
    };
    const getVisitedNeigbors = (i, j) => {
      const neighbors = [
        [i, j + 2],
        [i + 2, j],
        [i, j - 2],
        [i - 2, j],
      ];
      return neighbors.filter(([r, c]) => r >= 0 && c >= 0 && r < n && c < m && isVisited(r, c));
    };
    const getWallNeighbors = (i, j) => {
      const neighbors = [
        [i, j + 1],
        [i + 1, j],
        [i, j - 1],
        [i - 1, j],
        [i + 1, j + 1],
        [i + 1, j - 1],
        [i - 1, j - 1],
        [i - 1, j + 1],
      ];
      return neighbors.filter(([r, c]) => r >= 0 && c >= 0 && r < n && c < m && !isVisited(r, c));
    };

    const getUnvisitedNeigbors = (i, j) => {
      const neighbors = [
        [i, j + 2],
        [i + 2, j],
        [i, j - 2],
        [i - 2, j],
      ];
      return neighbors.filter(([r, c]) => r >= 0 && c >= 0 && r < n && c < m && !isVisited(r, c));
    };
    while (unvisited.size > 0) {
      const vertex = extractRandomVertexFromUnvisitedSet();
      const [vi, vj] = vertex.split(",").map((e) => Number(e));
      animateCell("unvisited", vi, vj, 0);
      for (let [i, j] of getWallNeighbors(vi, vj)) {
        if (!gridOptions.isWall(i, j)) await animateCell("wall", i, j);
      }
      visited.add(vertex);
      const visitedNeigbors = getVisitedNeigbors(vi, vj);
      if (visitedNeigbors.length > 0) {
        const randIndex = randInt(0, visitedNeigbors.length - 1);
        const randVertex = visitedNeigbors[randIndex];
        animateCell("unvisited", randVertex[0], randVertex[1], 0);
        animateCell("unvisited", (randVertex[0] + vi) / 2, (randVertex[1] + vj) / 2, 0);
      }

      const unvisitedNeigbors = getUnvisitedNeigbors(vi, vj);
      unvisitedNeigbors.forEach(([i, j]) => {
        unvisited.add(i + "," + j);
      });
    }
  },
  kruskalsRandomized: async () => {
    const [n, m] = gridOptions.getSize();

    const isValidVertex = (i, j) => i >= 0 && i < n && j >= 0 && j < m;

    const getAllPossibleNeighbors = (i, j) => {
      const neighbors = [
        [i, j + 2],
        [i + 2, j],
        [i, j - 2],
        [i - 2, j],
      ];
      return neighbors.filter(([x, y]) => isValidVertex(x, y));
    };
    const visitedVertices = new Set();
    const unvisitedEdges = new Set();
    for (let i = 0; i < n; i += 2) {
      for (let j = 0; j < m; j += 2) {
        const possibleNeigbors = getAllPossibleNeighbors(i, j);
        for (let [x, y] of possibleNeigbors) {
          const edge = `${Math.min(i, x)},${Math.min(j, y)}-${Math.max(i, x)},${Math.max(j, y)}`; // sorted
          unvisitedEdges.add(edge);
        }
      }
    }
    const randInt = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const extractRandomEdgeFromUnvisitedEdgesSet = () => {
      const randIndex = randInt(0, unvisitedEdges.size - 1);
      const randVertex = Array.from(unvisitedEdges.keys())[randIndex];
      unvisitedEdges.delete(randVertex);
      return randVertex;
    };

    const addSurroundingWallsToEdge = async (edge) => {
      const [v1, v2] = edge.split("-");
      const [i1, j1] = v1.split(",").map((e) => Number(e));
      const [i2, j2] = v2.split(",").map((e) => Number(e));

      const vm = `${(i1 + i2) / 2},${(j1 + j2) / 2}`; // the vertex between v1 and v2

      for (let i = i1 - 1; i <= i2 + 1; i++) {
        for (let j = j1 - 1; j <= j2 + 1; j++) {
          if (!isValidVertex(i, j)) {
            continue;
          }
          const wall = `${i},${j}`;
          if (![v1, v2, vm].includes(wall) && !visitedVertices.has(wall) && !gridOptions.isWall(i, j)) {
            await animateCell("wall", i, j);
          } else if (![v1, v2, vm].includes(wall) && visitedVertices.has(wall)) {
            debugger;
          }
        }
      }
    };

    const adj = {};

    const areConnected = (v1, v2) => {
      let curr = null;
      let stack = [v1];
      const visited = new Set();
      while (stack.length) {
        curr = stack.pop();
        visited.add(curr);
        if (curr === v2) return true;
        for (let neighbor of adj[curr] || []) {
          if (!visited.has(neighbor)) {
            stack.push(neighbor);
          }
        }
      }
    };

    while (unvisitedEdges.size > 0) {
      const edge = extractRandomEdgeFromUnvisitedEdgesSet();

      await addSurroundingWallsToEdge(edge);

      const [v1, v2] = edge.split("-");
      const [i1, j1] = v1.split(",").map((e) => Number(e));
      const [i2, j2] = v2.split(",").map((e) => Number(e));

      const vm = `${(i1 + i2) / 2},${(j1 + j2) / 2}`; // the vertex between v1 and v2
      const [im, jm] = vm.split(",").map((e) => Number(e));
      if (!areConnected(v1, v2)) {
        animateCell("unvisited", i1, j1, 0);
        animateCell("unvisited", i2, j2, 0);
        animateCell("unvisited", im, jm, 0);
        visitedVertices.add(v1);
        visitedVertices.add(v2);
        visitedVertices.add(vm);
      }

      if (!adj[v1]) adj[v1] = [];
      if (!adj[v2]) adj[v2] = [];
      adj[v1].push(v2);
      adj[v2].push(v1);
    }
  },
};
