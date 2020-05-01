const Game = (function () {
  const nextGenerationButton = document.querySelector(".nextGeneration");
  const autoStepGenrationButton = document.querySelector(".autoStep");
  const gridContainer = document.querySelector(".grid");

  let checkboxes = [];

  const generateRandomStartingGrid = function () {
    for (let i = 1; i <= 100; i++) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.class = "hidden-checkbox";
      checkbox.id = `${i}`;
      Math.random() < 0.3
        ? (checkbox.checked = true)
        : (checkbox.checked = false);
      checkboxes.push(checkbox);
    }

    checkboxes.forEach((checkbox) => gridContainer.appendChild(checkbox));
  };

  // assign neighbours to checkboxes
  function assignNeighboursToCheckboxes() {
    for (let i = 0; i < checkboxes.length; i++) {
      const currentCell = checkboxes[i];
      // cell at right edge of grid
      if ((i + 1) % 10 === 0) {
        currentCell.neighbours = [
          checkboxes[i - 1],
          checkboxes[i - 11],
          checkboxes[i + 9],
          checkboxes[i - 10],
          checkboxes[i + 10],
        ];
      } else if ((i + 1) % 10 === 1) {
        // cell at left edge of  grid
        currentCell.neighbours = [
          checkboxes[i + 1],
          checkboxes[i - 9],
          checkboxes[i + 11],
          checkboxes[i - 10],
          checkboxes[i + 10],
        ];
      } else {
        // normal cell not at edge
        currentCell.neighbours = [
          checkboxes[i + 1],
          checkboxes[i - 1],
          checkboxes[i - 9],
          checkboxes[i - 11],
          checkboxes[i + 9],
          checkboxes[i + 11],
          checkboxes[i - 10],
          checkboxes[i + 10],
        ];
      }
    }

    // remove undefined neighbours
    for (let checkbox of checkboxes) {
      checkbox.neighbours = checkbox.neighbours.filter(
        (neighbour) => neighbour !== undefined
      );
    }
  }

  // check and save how many live and dead cells around each cell
  function setLiveAndDeadNeighbourCount() {
    for (let checkbox of checkboxes) {
      let liveNeighbours = 0;
      let deadNeighbours = 0;
      checkbox.neighbours.forEach((neighbour) => {
        neighbour.checked ? (liveNeighbours += 1) : (deadNeighbours += 1);
      });
      checkbox.liveNeighbours = liveNeighbours;
      checkbox.deadNeighbours = deadNeighbours;
    }
  }

  function moveToNextGeneration() {
    let aliveNextGen = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        if (checkbox.liveNeighbours === 2 || checkbox.liveNeighbours === 3) {
          aliveNextGen.push(checkbox);
        }
      } else if (checkbox.liveNeighbours === 3) {
        aliveNextGen.push(checkbox);
      }
    });

    checkboxes.forEach((checkbox) => {
      if (aliveNextGen.includes(checkbox)) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    });
    // reset for next step
    aliveNextGen = [];
    setLiveAndDeadNeighbourCount();
  }

  nextGenerationButton.addEventListener("click", moveToNextGeneration);
  autoStepGenrationButton.addEventListener("click", () => {
    setInterval(moveToNextGeneration, 750);
  });

  generateRandomStartingGrid();
  assignNeighboursToCheckboxes();
  setLiveAndDeadNeighbourCount();
})();
