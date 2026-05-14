function deepClone(target, map = new WeakMap()) {
  if (target === null || typeof target !== "object") {
    return target;
  }

  if (map.has(target)) {
    return map.get(target);
  }

  const cloneTarget = Array.isArray(target) ? [] : {};

  map.set(target, cloneTarget);

  for (const key in target) {
    if (Object.hasOwnProperty.call(target, key)) {
      cloneTarget[key] = deepClone(target[key], map);
    }
  }

  return cloneTarget;
}
