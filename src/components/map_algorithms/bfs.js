import Deque from "double-ended-queue";
import { getCityData } from "@/constants";
import { hasKey } from "@/utils";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// find shortest path from start to end using BFS
const bfs = async (city, start, end, delay, cb) => {
  const nodeData = await getCityData(
    city,
    () => {},
    () => {}
  );
  let paths = [];

  let queue = new Deque();
  let previous = {};
  let discovered = new Set();
  let rendered = new Set();

  let level = 0;
  let total = 0;
  let nextRender = new Set();

  Object.keys(nodeData).forEach((node) => {
    previous[node] = null;
  });

  queue.push(start);
  queue.push(null);
  const startTime = performance.now();

  while (queue.length > 0) {
    const prev = queue.shift();

    if (prev === null) {
      level++;
      total = 0;
      if (delay > 0) {
        cb(nextRender);
        await sleep(delay);
        nextRender = new Set();
      }
      queue.push(null);
      continue;
    }

    if (!prev) continue;

    let node = prev;
    discovered.add(node);
    total++;

    if (total % (100 / total) === 0 && !rendered.has(node)) {
      nextRender.add(node);
      rendered.add(node);
    }

    if (node === end) {
      let path = [];
      cb(nextRender);
      while (previous[node]) {
        path.push(node);
        const prev = previous[node];
        if (prev !== null) {
          node = prev;
        }
      }
      return [path.reverse(), performance.now() - startTime];
    }

    if (hasKey(nodeData, node)) {
      let neighbors = nodeData[node].adj;

      neighbors.forEach((neighbor) => {
        if (!discovered.has(neighbor)) {
          previous[neighbor] = node;
          queue.push(neighbor);
        }
      });
    }
  }
  return [[], performance.now() - startTime];
};

export default bfs;
