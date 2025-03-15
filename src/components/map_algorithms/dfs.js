import { getCityData } from "@/constants";
import { hasKey } from "@/utils";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// find shortest path from start to end using DFS
const dfs = async (city, start, end, delay, cb) => {
  const nodeData = await getCityData(
    city,
    () => {},
    () => {}
  );
  let stack = [];
  let visitedNodes = new Set();
  let path = [];
  let total = 0;
  let nextRender = new Set();

  stack.push([start, [start]]);
  const startTime = performance.now();

  while (stack.length > 0) {
    const popped = stack.pop();
    if (!popped) return;
    let node = popped[0];
    path = popped[1];

    if (total % 50 === 0) {
      nextRender.add(node);
    }
    total++;
    const nodesPerRender = 0.0001 * total;

    if (total % nodesPerRender === 0) {
      if (delay > 0) {
        cb(nextRender);
        await sleep(delay);
      }
      nextRender = new Set();
    }

    if (node === end) {
      break;
    }
    if (!visitedNodes.has(node)) {
      visitedNodes.add(node);
      if (hasKey(nodeData, node)) {
        let neighbors = nodeData[node].adj;

        neighbors.forEach((neighbor) => {
          stack.push([neighbor, [neighbor, ...path]]);
        });
      }
    }
  }
  return [path.reverse(), performance.now() - startTime];
};

export default dfs;
