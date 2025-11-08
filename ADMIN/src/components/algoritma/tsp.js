function haversineDistance(a, b) {
  const toRad = (x) => (x * Math.PI) / 180;
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

function getTotalDistance(path, nodes) {
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const from = nodes[path[i]];
    const to = nodes[path[i + 1]];
    total += haversineDistance(from, to);
  }
  return total;
}

function permute(arr) {
  if (arr.length <= 1) return [arr];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
    const perms = permute(remaining);
    for (let perm of perms) {
      result.push([current, ...perm]);
    }
  }
  return result;
}

function tsp(nodes, startNode) {
  const keys = Object.keys(nodes).filter((k) => k !== startNode);
  const permutations = permute(keys);
  let bestPath = null;
  let minDist = Infinity;

  for (let perm of permutations) {
    const path = [startNode, ...perm];
    const dist = getTotalDistance(path, nodes);
    if (dist < minDist) {
      minDist = dist;
      bestPath = path;
    }
  }

  return { path: bestPath, cost: minDist };
}

export default tsp;
