import BinaryHeap from "@/structures/BinaryHeap";
import { getCityData } from "@/constants";
import { hasKey } from "@/utils";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class Node {
  constructor(nodeId, neighbors) {
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.visited = false;
    this.closed = false;
    this.ref = nodeId;
    this.neighbors = neighbors;
    this.parent = null;
  }
}

const graph = {};

function pathTo(node) {
  let curr = node;
  let path = [];
  while (curr.parent) {
    path.unshift(curr.ref);
    curr = curr.parent;
  }
  return path;
}

function getHeap() {
  return new BinaryHeap((node) => node.f);
}

const astar = async (city, start, end, delay, cb) => {
  const nodeData = await getCityData(
    city,
    () => {},
    () => {}
  );

  const getDistance = (nodeA, nodeB) => {
    if (hasKey(nodeData, nodeA) && hasKey(nodeData, nodeB)) {
      const posA = nodeData[nodeA];
      const posB = nodeData[nodeB];

      let d1 = Math.abs(posB.lat - posA.lat);
      let d2 = Math.abs(posB.lon - posA.lon);

      return Math.sqrt(d1 * d1 + d2 * d2);
    }
    return -1;
  };

  let openHeap = getHeap();
  let total = 0;
  let nextRender = new Set();
  let rendered = new Set();

  Object.keys(nodeData).forEach((key) => {
    if (hasKey(nodeData, key)) {
      graph[key] = new Node(key, nodeData[key].adj);
    }
  });

  if (!hasKey(graph, start) || !hasKey(graph, end)) {
    return;
  }

  const startNode = graph[start];
  openHeap.push(startNode);
  const startTime = performance.now();

  while (openHeap.size() > 0) {
    const currentNode = openHeap.pop();
    const currentNodeId = currentNode.ref;

    if (currentNodeId === end) {
      return [pathTo(currentNode), performance.now() - startTime];
    }

    if (total % 2 === 0 && !rendered.has(currentNodeId)) {
      nextRender.add(currentNodeId);
      rendered.add(currentNodeId);
    }

    if (nextRender.size % 10 === 0) {
      cb(nextRender);
      await sleep(delay);
      nextRender = new Set();
    }

    currentNode.closed = true;

    if (hasKey(graph, currentNodeId)) {
      const node = graph[currentNodeId];
      const neighbors = node.neighbors;

      neighbors.forEach((neighbor) => {
        const neighborNode = graph[neighbor];
        if (neighborNode.closed) return;

        const gScore = currentNode.g + getDistance(currentNodeId, neighbor);
        const visited = neighborNode.visited;

        if (!visited || gScore < neighborNode.g) {
          neighborNode.visited = true;
          neighborNode.parent = currentNode;
          neighborNode.h = neighborNode.h || getDistance(neighbor, end);
          neighborNode.g = gScore;
          neighborNode.f = neighborNode.h + neighborNode.g;

          if (!visited) {
            openHeap.push(neighborNode);
          } else {
            openHeap.rescoreElement(neighborNode);
          }
        }
      });
    }
  }
  return [[], performance.now() - startTime];
};

export default astar;
