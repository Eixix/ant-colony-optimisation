let data = { nodes: [], edges: [] };
let ants = [];
let pheromones = [];
let adjacencyMatrix = [];
let running = false;
let phLowerBorder = 1;
let phUpperBorder = 10;
let phDividend = 1;
let circleDividend = 1;
let directed = false;
let hideGrey = false;
let hideRed = false;
let hideCircle = false;

G6.registerEdge(
  "arc-running",
  {
    afterDraw(cfg, group) {
      const shape = group.get("children")[0];
      const startPoint = shape.getPoint(0);

      const circle = group.addShape("circle", {
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fill: "#1890ff",
          r:
            (getAntsOnEdge(parseInt(cfg.source), parseInt(cfg.target)) * 2) /
            circleDividend,
        },
        name: "circle-shape",
      });

      circle.animate(
        (ratio) => {
          const tmpPoint = shape.getPoint(ratio);
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          };
        },
        {
          repeat: true,
          duration: 1000,
        }
      );
    },
  },
  "arc"
);
G6.registerEdge(
  "loop-running",
  {
    afterDraw(cfg, group) {
      const shape = group.get("children")[0];
      const startPoint = shape.getPoint(0);

      const circle = group.addShape("circle", {
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fill: "#1890ff",
          r:
            (getAntsOnEdge(parseInt(cfg.source), parseInt(cfg.target)) * 2) /
            circleDividend,
        },
        name: "circle-shape",
      });

      circle.animate(
        (ratio) => {
          const tmpPoint = shape.getPoint(ratio);
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          };
        },
        {
          repeat: true,
          duration: 1000,
        }
      );
    },
  },
  "loop"
);
G6.registerEdge(
  "line-running",
  {
    afterDraw(cfg, group) {
      const shape = group.get("children")[0];
      const startPoint = shape.getPoint(0);

      const circle = group.addShape("circle", {
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fill: "#1890ff",
          r:
            (getAntsOnEdge(parseInt(cfg.source), parseInt(cfg.target)) * 2) /
            circleDividend,
        },
        name: "circle-shape",
      });

      circle.animate(
        (ratio) => {
          const tmpPoint = shape.getPoint(ratio);
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          };
        },
        {
          repeat: true,
          duration: 1000,
        }
      );
    },
  },
  "line"
);
G6.registerEdge(
  "line-running-both",
  {
    afterDraw(cfg, group) {
      const shape = group.get("children")[0];

      const startPoint = shape.getPoint(0);
      const circle = group.addShape("circle", {
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fill: "#1890ff",
          r:
            (getAntsOnEdge(parseInt(cfg.source), parseInt(cfg.target)) * 2) /
            circleDividend,
        },
        name: "circle-shape",
      });

      circle.animate(
        (ratio) => {
          const tmpPoint = shape.getPoint(ratio);
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          };
        },
        {
          repeat: true,
          duration: 1000,
        }
      );

      const targetPoint = shape.getPoint(1);
      const circleReverse = group.addShape("circle", {
        attrs: {
          x: targetPoint.x,
          y: targetPoint.y,
          fill: "#1890ff",
          r:
            (getAntsOnEdge(parseInt(cfg.target), parseInt(cfg.source)) * 2) /
            circleDividend,
        },
        name: "circle-shape",
      });

      circleReverse.animate(
        (ratio) => {
          const tmpPoint = shape.getPoint(1 - ratio);
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          };
        },
        {
          repeat: true,
          duration: 1000,
        }
      );
    },
  },
  "line"
);
G6.registerEdge(
  "line-running-reverse",
  {
    afterDraw(cfg, group) {
      const shape = group.get("children")[0];

      const targetPoint = shape.getPoint(1);
      const circleReverse = group.addShape("circle", {
        attrs: {
          x: targetPoint.x,
          y: targetPoint.y,
          fill: "#1890ff",
          r:
            (getAntsOnEdge(parseInt(cfg.target), parseInt(cfg.source)) * 2) /
            circleDividend,
        },
        name: "circle-shape",
      });

      circleReverse.animate(
        (ratio) => {
          const tmpPoint = shape.getPoint(1 - ratio);
          return {
            x: tmpPoint.x,
            y: tmpPoint.y,
          };
        },
        {
          repeat: true,
          duration: 1000,
        }
      );
    },
  },
  "line"
);

const graph = new G6.Graph({
  container: "graphContainer",
  width: document.getElementById("graphContainer").offsetWidth,
  height: document.getElementById("graphContainer").offsetHeight,
  defaultNode: {
    type: "circle",
    size: [40],
    color: "#000",
    style: {
      fill: "#fff",
      lineWidth: 3,
    },
    labelCfg: {
      style: {
        fill: "#000",
        fontSize: 15,
      },
    },
    defaultEdge: {
      type: "arc",
      style: {
        stroke: "silver",
      },
      labelCfg: {
        autoRotate: true,
        style: {
          opacity: 0,
        },
      },
      lineAppendWidth: 30,
    },
  },
  defaultEdge: {
    type: "arc",
    style: {
      stroke: "silver",
    },
    labelCfg: {
      autoRotate: true,
      style: {
        opacity: 0,
      },
    },
    lineAppendWidth: 30,
  },
  nodeStateStyles: {},
  edgeStateStyles: {
    hover: {
      stroke: "mintcream",
    },
  },
  layout: {
    type: "force",
    preventOverlap: true,
    linkDistance: 500,
  },
  modes: {
    default: ["drag-canvas", "zoom-canvas", "drag-node"],
  },
});

graph.on("edge:mouseenter", (e) => {
  const item = e.item;
  graph.updateItem(item, {
    labelCfg: {
      style: {
        opacity: 1,
      },
    },
  });
  graph.setItemState(item, "hover", true);
});

graph.on("edge:mouseleave", (e) => {
  const item = e.item;
  graph.updateItem(item, {
    labelCfg: {
      style: {
        opacity: 0,
      },
    },
  });
  graph.setItemState(item, "hover", false);
});

function transformIntoG6Data(resData) {
  data = { nodes: [], edges: [] };
  ants = resData.ants;
  pheromones = resData.pheromones;
  adjacencyMatrix = resData.edges;

  for (let i = 0; i < adjacencyMatrix.length; i++) {
    data.nodes.push({
      id: "" + i,
      label: "" + i,
    });
    for (let j = 0; j < adjacencyMatrix[i].length; j++) {
      renderEdge(i, j);
    }
  }

  updateInfoBoxAnts();
  document.getElementById("stepCounter").innerHTML = resData.step;
  if (resData.step > 1) {
    document.getElementById("fstart").setAttribute("disabled", "");
    document.getElementById("ffood").setAttribute("disabled", "");
    document.getElementById("famount").setAttribute("disabled", "");
    document.getElementById("fgroups").setAttribute("disabled", "");
    document.getElementById("fphconstant").setAttribute("disabled", "");
    document.getElementById("fphticking").setAttribute("disabled", "");
    document.getElementById("fphbase").setAttribute("disabled", "");
    document.getElementById("ftspfix").setAttribute("disabled", "");
    document.getElementById("fdirected").setAttribute("disabled", "");
    document.getElementById("updateButton").setAttribute("disabled", "");
    document.getElementById("falpha").setAttribute("disabled", "");
    document.getElementById("fbeta").setAttribute("disabled", "");
  }

  let rootEl = document.getElementById("pheromoneContainer");
  while (rootEl.firstChild) {
    rootEl.removeChild(rootEl.firstChild);
  }
  rootEl.appendChild(transformMatrixIntoHTML(pheromones));
  rootEl = document.getElementById("adjacencyContainer");
  while (rootEl.firstChild) {
    rootEl.removeChild(rootEl.firstChild);
  }
  rootEl.appendChild(transformMatrixIntoHTML(adjacencyMatrix));

  console.log(data);
}

function renderEdge(i, j) {
  if (adjacencyMatrix[i][j] !== 0 && (directed || i <= j)) {
    let antsOnEdge = getAntsOnEdge(i, j);
    let antsOnReverseEdge = getAntsOnEdge(j, i);
    let running = "";
    let pheromoneStyles = {
      lineWidth:
        (pheromones[i][j] > phUpperBorder ? phUpperBorder : pheromones[i][j]) /
        phDividend,
      stroke: pheromones[i][j] > phUpperBorder ? "limegreen" : "lightsalmon",
    };
    let directedStyles = {
      endArrow: {
        path: "M 0,0 L 8,4 L 8,-4 Z",
        fill: "silver",
      },
    };
    let completeStyles = {};
    let antsOnEdgeString = directed
      ? antsOnEdge
      : `(>: ${antsOnEdge} <: ${antsOnReverseEdge})`;

    if (!hideCircle) {
      if (antsOnEdge !== 0) {
        running = "-running";
        if (!directed && i !== j && antsOnReverseEdge !== 0) {
          running += "-both";
        }
      } else if (!directed && antsOnReverseEdge !== 0) {
        running = "-running-reverse";
      }
    }

    if (pheromones[i][j] > phLowerBorder) {
      Object.assign(completeStyles, pheromoneStyles);
    }

    if (directed) {
      Object.assign(completeStyles, directedStyles);
    }

    if (
      (!hideGrey && pheromones[i][j] == phLowerBorder) ||
      (!hideRed && completeStyles.stroke == "lightsalmon") ||
      completeStyles.stroke == "limegreen"
    ) {
      if (i === j) {
        data.edges.push({
          type: "loop" + running,
          source: "" + i,
          target: "" + j,
          label: `P: ${pheromones[i][j]} A: ${antsOnEdgeString} M: ${adjacencyMatrix[i][j]}`,
          style: completeStyles,
        });
      } else {
        data.edges.push({
          type: (directed ? "arc" : "line") + running,
          source: "" + i,
          target: "" + j,
          label: `P: ${pheromones[i][j]} A: ${antsOnEdgeString} M: ${adjacencyMatrix[i][j]}`,
          style: completeStyles,
        });
      }
    }
  }
}

function updateAnimationProperties() {
  data.edges = [];

  for (let i = 0; i < adjacencyMatrix.length; i++) {
    for (let j = 0; j < adjacencyMatrix[i].length; j++) {
      renderEdge(i, j);
    }
  }
}

function getAntsOnEdge(from, to) {
  let sum = 0;
  ants.forEach((ant) => {
    if (ant.position === to && ant.lastPosition === from) sum++;
  });
  return sum;
}

function updateGraph() {
  if (!running) {
    fetch("http://localhost:3000/step")
      .then((response) => response.json())
      .then((resData) => {
        transformIntoG6Data(resData);
        graph.changeData(data);
      });
  }
}

function toggleSim() {
  running = !running;

  if (running) runSim();
}

function skip() {
  let params = new URLSearchParams();
  let stepCounter = document.querySelector("#stepCounter").innerText;
  let skipInputValue = document.querySelector("#skipAmount").value;

  // Only skip if reasonable
  if (skipInputValue && skipInputValue > stepCounter) {
    params.append("amount", skipInputValue);

    Swal.fire({
      icon: "info",
      title: "Skipping is in progress...",
      html: "<div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div>",
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    fetch("http://localhost:3000/skip", {
      method: "POST",
      body: params,
      timeout: 8000,
    })
      .then((response) => response.json())
      .catch(function () {
        Swal.fire({
          icon: "error",
          title: "Connection error",
          text: "Is the backend running?",
        });
      })
      .then((resData) => {
        Swal.close();
        console.log(resData);
        transformIntoG6Data(resData);
        graph.changeData(data);
      });
  } else {
    Swal.fire({
      icon: "error",
      title: "You can only skip forward",
      text: "Enter a number greater than the number you already skipped to!",
    });
  }
}

function reloadSimulation() {
  location.reload();
}

function runSim() {
  fetch("http://localhost:3000/step")
    .then((response) => response.json())
    .catch(function () {
      Swal.fire({
        icon: "error",
        title: "Connection error",
        text: "Is the backend running?",
      });
    })
    .then((resData) => {
      transformIntoG6Data(resData);
      graph.changeData(data);

      if (running) runSim();
    })
    .catch((e) => {
      console.err("Simulation Failed");
      console.err(e);
      running = false;
    });
}

function updateInfoBoxAnts() {
  let nodeList = document.createElement("ul");

  data.nodes.forEach((el) => {
    [sum, antEls] = getAntsOnNode(el.id);

    let nodeEl = document.createElement("li");
    nodeEl.classList.add("accordion");
    nodeEl.appendChild(document.createTextNode(`Node: ${el.label} (${sum})`));
    if (sum > 0) {
      nodeEl.addEventListener("click", (event) => {
        event.target.children[0].classList.toggle("not-visible");
      });
      nodeEl.appendChild(antEls);
    }
    nodeList.appendChild(nodeEl);
  });

  let rootEl = document.getElementById("antContainer");
  while (rootEl.firstChild) {
    rootEl.removeChild(rootEl.firstChild);
  }
  rootEl.appendChild(nodeList);
}

function getAntsOnNode(nodeID) {
  let antList = document.createElement("ul");
  antList.classList.add("not-visible");
  let sum = 0;
  ants.forEach((el) => {
    if (el.position === parseInt(nodeID, 10)) {
      let antItem = document.createElement("li");
      antItem.appendChild(
        document.createTextNode(`Ant ${el.id} (from ${el.lastPosition})`)
      );
      antList.appendChild(antItem);
      sum++;
    }
  });
  return [sum, antList];
}

function transformMatrixIntoHTML(matrix) {
  let table = document.createElement("table");

  matrix.forEach((el, i) => {
    let row = document.createElement("tr");
    el.forEach((entry, j) => {
      let value = directed || i <= j ? Math.round(entry * 10) / 10 : 0;
      let entryEl = document.createElement("td");
      entryEl.appendChild(document.createTextNode(value));
      row.appendChild(entryEl);
    });
    table.appendChild(row);
  });

  return table;
}

function updateParameters(resData) {
  document.getElementById("fstart").value = resData.start;
  document.getElementById("ffood").value = resData.food;
  document.getElementById("famount").value = resData.antAmount;
  document.getElementById("fgroups").value = resData.antGroups;
  document.getElementById("fphconstant").value = resData.pheromoneConstant;
  document.getElementById("fphticking").value = resData.pheromoneTicking;
  document.getElementById("fphbase").value = resData.pheromoneBase;
  document.getElementById("ftspfix").value = resData.tspFix;
  document.getElementById("fdirected").checked = resData.directed;
  document.getElementById("falpha").value = resData.alpha;
  document.getElementById("fbeta").value = resData.beta;

  directed = resData.directed;
}

fetch("http://localhost:3000/getSettings")
  .then((response) => response.json())
  .catch(function () {
    Swal.fire({
      icon: "error",
      title: "Connection error",
      text: "Is the backend running?",
    });
  })
  .then((resData) => {
    updateParameters(resData);

    fetch("http://localhost:3000/init")
      .then((response) => response.json())
      .catch(function () {
        Swal.fire({
          icon: "error",
          title: "Connection error",
          text: "Is the backend running?",
        });
      })
      .then((resData) => {
        transformIntoG6Data(resData);
        graph.data(data);
        graph.render();
      });
  });

let accordionElements = document.getElementsByClassName("accordion");
for (let i = 0; i < accordionElements.length; i++) {
  accordionElements[i].addEventListener("click", () => {
    this.childNodes[0].classList.toggle("not-visible");
  });
}

document.getElementById("paramForm").addEventListener("submit", (e) => {
  e.preventDefault();

  let params = new URLSearchParams();
  params.append("start", e.target.elements.fstart.value);
  params.append("food", e.target.elements.ffood.value);
  params.append("amount", e.target.elements.famount.value);
  params.append("groups", e.target.elements.fgroups.value);
  params.append("phconstant", e.target.elements.fphconstant.value);
  params.append("phticking", e.target.elements.fphticking.value);
  params.append("phbase", e.target.elements.fphbase.value);
  params.append("tspfix", e.target.elements.ftspfix.value);
  params.append("directed", e.target.elements.fdirected.checked);
  params.append("alpha", e.target.elements.falpha.value);
  params.append("beta", e.target.elements.fbeta.value);

  fetch("http://localhost:3000/settings", {
    method: "POST",
    body: params,
  })
    .then((response) => response.json())
    .catch(function () {
      Swal.fire({
        icon: "error",
        title: "Connection error",
        text: "Is the backend running?",
      });
    })
    .then((resData) => {
      updateParameters(resData);

      fetch("http://localhost:3000/init")
        .then((response) => response.json())
        .then((resData) => {
          transformIntoG6Data(resData);
          graph.data(data);
          graph.render();
        });
    });
});

document.getElementById("fphLowerBorder").value = phLowerBorder;
document.getElementById("fphUpperBorder").value = phUpperBorder;
document.getElementById("fphDividend").value = phDividend;
document.getElementById("fcircleDividend").value = circleDividend;
document.getElementById("fhideGrey").checked = hideGrey;
document.getElementById("fhideRed").checked = hideRed;
document.getElementById("fhideCircle").checked = hideCircle;

document.getElementById("animForm").addEventListener("submit", (e) => {
  e.preventDefault();

  phLowerBorder = e.target.elements.fphLowerBorder.value;
  phUpperBorder = e.target.elements.fphUpperBorder.value;
  phDividend = e.target.elements.fphDividend.value;
  circleDividend = e.target.elements.fcircleDividend.value;
  hideGrey = e.target.elements.fhideGrey.checked;
  hideRed = e.target.elements.fhideRed.checked;
  hideCircle = e.target.elements.fhideCircle.checked;

  updateAnimationProperties();
  graph.changeData(data);
});
