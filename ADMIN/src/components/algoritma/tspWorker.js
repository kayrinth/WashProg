function totalDistance(path, dist) {
  let s = 0;
  for (let i = 0; i < path.length - 1; i++) {
    s += dist[path[i]][path[i + 1]];
  }
  return s;
}

function nearestNeighborFromDist(keys, start, dist) {
  const unvisited = new Set(keys.filter((k) => k !== start));
  const path = [start];
  let current = start;
  while (unvisited.size > 0) {
    let best = null,
      bestD = Infinity;
    for (const k of unvisited) {
      const d = dist[current][k];
      if (d < bestD) {
        bestD = d;
        best = k;
      }
    }
    path.push(best);
    unvisited.delete(best);
    current = best;
  }
  return path;
}

function twoOpt(path, dist, postProgress) {
  let improved = true;
  let bestPath = path.slice();
  let bestCost = totalDistance(bestPath, dist);

  const MAX_ITER = 2000;
  let iter = 0;

  while (improved && iter < MAX_ITER) {
    improved = false;
    iter++;

    for (let i = 1; i < bestPath.length - 2; i++) {
      for (let k = i + 1; k < bestPath.length - 1; k++) {
        const newPath = bestPath
          .slice(0, i)
          .concat(bestPath.slice(i, k + 1).reverse())
          .concat(bestPath.slice(k + 1));

        const newCost = totalDistance(newPath, dist);
        if (newCost < bestCost - 1e-9) {
          bestPath = newPath;
          bestCost = newCost;
          improved = true;

          if (postProgress) {
            const pct = Math.min(99, Math.round((iter / MAX_ITER) * 100));
            postProgress(pct);
          }
          break;
        }
      }
      if (improved) break;
    }
  }

  if (postProgress) postProgress(100);
  console.assert(
    bestPath[0] === path[0],
    "Starting node changed during 2-opt!"
  );
  return { path: bestPath, cost: bestCost };
}

function toRad(x) {
  return (x * Math.PI) / 180;
}
function haversine(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const aVal =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
  return R * c;
}

function buildDistFromNodes(nodes, keys) {
  const dist = {};
  for (const a of keys) dist[a] = {};
  for (let i = 0; i < keys.length; i++) {
    for (let j = i; j < keys.length; j++) {
      const ka = keys[i],
        kb = keys[j];
      if (ka === kb) {
        dist[ka][kb] = 0;
      } else {
        const d = haversine(nodes[ka], nodes[kb]);
        dist[ka][kb] = d;
        dist[kb][ka] = d;
      }
    }
  }
  return dist;
}

self.onmessage = (ev) => {
  try {
    const { nodes, startNode = {}, distMatrix } = ev.data;
    if (!nodes || !startNode) {
      self.postMessage({
        type: "error",
        message: "nodes and startNode required",
      });
      return;
    }

    const keys = Object.keys(nodes);
    if (!keys.includes(startNode)) {
      self.postMessage({
        type: "error",
        message: `startNode '${startNode}' not found in nodes`,
      });
      return;
    }

    const dist = distMatrix ? distMatrix : buildDistFromNodes(nodes, keys);

    const initial = nearestNeighborFromDist(keys, startNode, dist);
    const initialCost = totalDistance(initial, dist);

    let result;
    if (initial.length > 3) {
      self.postMessage({
        type: "progress",
        percent: 5,
        info: "initial computed",
      });

      const improved = twoOpt(initial, dist, (p) => {
        self.postMessage({
          type: "progress",
          percent: p,
          info: "2-opt running",
        });
      });

      result = { ...improved, method: "nearest-2opt" };
    } else {
      result = { path: initial, cost: initialCost, method: "nearest" };
    }

    if (result.path[0] !== startNode) {
      self.postMessage({
        type: "error",
        message: `TSP result doesn't start with ${startNode}!`,
      });
      return;
    }

    self.postMessage({ type: "result", result });
  } catch (err) {
    self.postMessage({ type: "error", message: err.message || String(err) });
  }
};
