export function cn(...classes: (string | boolean | undefined | null | { [key: string]: boolean })[]) {
  return classes
    .filter(Boolean)
    .map((cls) => {
      if (typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return cls;
    })
    .join(' ');
}