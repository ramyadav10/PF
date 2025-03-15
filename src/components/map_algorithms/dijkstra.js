import TinyQueue from "tinyqueue";
import { getCityData } from "@/constants";
import { hasKey } from "@/utils";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// find shortest path from start to end using Dijkstra's algorithm
const dijkstra = async (city, start, end, delay, cb) => {
  console.log(city);
  const nodeData = await getCityData(
    city,
    () => {},
    () => {}
  );
  let queue = new TinyQueue([], (a, b) => a.distance - b.distance);

  let distances = {};
  let previous = {};
  let path = [];
  let rendered = new Set();

  // render settings
  let level = 0;
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

  const startTime = performance.now();
  while (queue.length > 0) {
    let temp = queue.pop();
    let smallest = temp.key;

    if (smallest === "_") {
      if (delay > 0 && nextRender.size > 0) {
        cb(nextRender);
        await sleep(delay);
        nextRender.clear();
        rendered.clear();
      }
      continue;
    }

    total++;

    if (total % (level ^ 10) == 0 && !rendered.has(smallest)) {
      nextRender.add(smallest);
      rendered.add(smallest);
    }

    if (smallest === end) {
      console.log(performance.now() - startTime);
      cb(nextRender);
      while (previous[smallest]) {
        path.push(smallest);
        const prev = previous[smallest];
        if (prev != null) {
          smallest = prev;
        }
      }
      break;
    }

    if (hasKey(nodeData, smallest)) {
      let neighbors = nodeData[smallest].adj;

      let maxDist = 0;
      neighbors.forEach((neighbor) => {
        let alt = distances[smallest] + 1; // unweighted
        maxDist = Math.max(maxDist, alt);
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = smallest;
          queue.push({ key: neighbor, distance: alt });
        }
      });
      if (maxDist > level) {
        level = maxDist;
        queue.push({ key: "_", distance: maxDist });
      }
    }
  }
  return [path.concat(start).reverse(), performance.now() - startTime];
};

export default dijkstra;
