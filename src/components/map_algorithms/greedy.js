import Timer from "timer-machine";
import TinyQueue from "tinyqueue";
import { getCityData } from "@/constants";
import { hasKey } from "@/utils";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// find shortest path from start to end using greedy algorithm
// cb is called when a new node is visited
const greedy = async (city, start, end, delay, cb) => {
  const nodeData = await getCityData(
    city,
    () => {},
    () => {}
  );

  const getDistance = function (nodeA, nodeB) {
    if (hasKey(nodeData, nodeA) && hasKey(nodeData, nodeB)) {
      const posA = nodeData[nodeA];
      const posB = nodeData[nodeB];

      let d1 = Math.abs(posB.lat - posA.lat);
      let d2 = Math.abs(posB.lon - posA.lon);

      return Math.sqrt(d1 * d1 + d2 * d2);
    }
    return -1;
  };

  let queue = new TinyQueue([], (a, b) => a.distance - b.distance);

  let distances = {};
  let previous = {};
  let path = [];
  let rendered = new Set();

  // render settings
  let total = 0;
  let nextRender = new Set();

  // build min heap
  distances[start] = 0;
  queue.push({ key: "_", distance: 1 });

  Object.keys(nodeData).forEach((node) => {
    if (node !== start) {
      distances[node] = Infinity;
      previous[node] = null;
    }
    queue.push({ key: node, distance: distances[node] });
  });

  const timer = new Timer();
  timer.start();
  while (queue.length > 0) {
    let temp = queue.pop();
    let smallest = temp.key;

    total++;

    if (total % 2 === 0 && !rendered.has(smallest)) {
      nextRender.add(smallest);
      rendered.add(smallest);
    }

    if (nextRender.size % 10 === 0) {
      cb(nextRender);
      timer.stop();
      await sleep(delay);
      timer.start();
      nextRender = new Set();
    }

    if (smallest === end) {
      cb(nextRender);
      while (previous[smallest]) {
        path.push(smallest);
        let prev = previous[smallest];
        if (prev != null) {
          smallest = prev;
        }
      }
      break;
    }

    if (hasKey(nodeData, smallest)) {
      let smallestNode = nodeData[smallest];
      let neighbors = smallestNode.adj;

      neighbors.forEach((neighbor) => {
        let alt = getDistance(end, neighbor);
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = smallest;
          queue.push({ key: neighbor, distance: alt });
        }
      });
    }
  }
  return [path.concat(start).reverse(), timer.time()];
};

export default greedy;
