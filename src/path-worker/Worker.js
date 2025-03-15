import astar from "@/components/map_algorithms/astar";
import bfs from "@/components/map_algorithms/bfs";
import dfs from "@/components/map_algorithms/dfs";
import dijkstra from "@/components/map_algorithms/dijkstra";
import greedy from "@/components/map_algorithms/greedy";
import { getCityData } from "@/constants";
import { hasKey } from "@/utils";

/* eslint-disable no-restricted-globals */

const algorithmDict = {
  dijkstras: dijkstra,
  astar: astar,
  greedy: greedy,
  bfs: bfs,
  dfs: dfs,
};

self.onmessage = async (event) => {
  console.log("New message received in Worker!", event.data);
  const { city, algorithm, startNode, endNode, delayInMs } = JSON.parse(
    event.data
  );

  const addNodesHandler = (nodes) => {
    self.postMessage(
      JSON.stringify({ type: "updateNodes", nodes: [...nodes] })
    );
  };
  console.log("UUUUUUU-------", city, algorithm);

  const result = await findPath(
    city,
    algorithm,
    startNode,
    endNode,
    delayInMs,
    addNodesHandler
  );

  if (result) {
    const [path, timeTaken] = result;
    self.postMessage(JSON.stringify({ type: "setPath", path, timeTaken }));
  }
};

const findPath = async (
  city,
  algorithm,
  startNode,
  endNode,
  delayInMs,
  addNodesHandler
) => {
  console.log(`FINDPATH---${city}`);
  const nodeData = await getCityData(
    city,
    () => {},
    () => {}
  );

  if (startNode && endNode && algorithm) {
    if (hasKey(algorithmDict, algorithm)) {
      const selectedAlgorithm = algorithmDict[algorithm];
      const result = await selectedAlgorithm(
        city,
        startNode,
        endNode,
        delayInMs,
        addNodesHandler
      );

      if (!result) return;
      const [shortestPath, timeTaken] = result;

      let path = shortestPath
        .map((nodeId) => nodeData[nodeId])
        .filter(Boolean)
        .map((node) => ({ lat: node.lat, lng: node.lon }));

      return [path, timeTaken];
    }
  }
};
