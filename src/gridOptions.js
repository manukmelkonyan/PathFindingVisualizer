const gridOptions = {
  disableUserInteraction: function () {
    document
      .querySelectorAll('#controlPanel button')
      .forEach((elem) => (elem.disabled = true));
  },
  enableUserInteraction: function () {
    document
      .querySelectorAll('#controlPanel button')
      .forEach((elem) => (elem.disabled = false));
  },
  animationLaunched: false,
  instantAnimationOn: true,
  isAnimated: true,
  source: [],
  destination: [],
  isSourceDragged: false,
  isDestinationDragged: false,
  chozenAlgorithmCallback: async () => {},
  matrix: null,
  delay: 0,
  clicked: false,
  wpressed: false,
  sourceDragged: false,
  destinationDragged: false,
  getSize: function () {
    return [this.matrix.length, this.matrix[0].length];
  },
  isSource: function (i, j) {
    return this.matrix[i][j].isSource;
  },
  isDestination: function (i, j) {
    return this.matrix[i][j].isDestination;
  },
  isUnvisited: function (i, j) {
    return ['unvisited', 'unvisited-animated'].includes(
      this.matrix[i][j].class
    );
  },

  isWall: function (i, j) {
    return ['wall', 'wall-animated'].includes(this.matrix[i][j].class);
  },
  isWeighted: function (i, j) {
    return this.matrix[i][j].weighted;
  },
  isVisited: function (i, j) {
    return ['visited', 'visited-animated'].includes(this.matrix[i][j].class);
  },
  isPath: function (i, j) {
    return ['path', 'path-animated'].includes(this.matrix[i][j].class);
  },
  clearPath: function () {
    for (let row of this.matrix) {
      for (let cell of row) {
        if (
          ['path', 'path-animated', 'visited', 'visited-animated'].includes(
            cell.class
          )
        ) {
          cell.update({
            ...cell,
            class: 'unvisited',
          });
        }
      }
    }
  },

  clearBoard: function () {
    for (let row of this.matrix) {
      for (let cell of row) {
        cell.update({
          ...cell,
          class: 'unvisited',
          weighted: false,
        });
      }
    }
  },
};

export default gridOptions;
