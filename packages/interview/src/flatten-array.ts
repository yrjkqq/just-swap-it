function flattenArray(a: any[]): any[] {
  return a.reduce((prev, current) => {
    if (Array.isArray(current)) {
      return [...prev, ...flattenArray(current)];
    }
    return [...prev, current];
  }, []);
}
