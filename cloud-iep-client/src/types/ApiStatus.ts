const ApiStatus = {
  Loading: 'loading',
  Loaded: 'loaded',
  Error: 'error',
} as const;

type ApiStatus = typeof ApiStatus[keyof typeof ApiStatus];

export { ApiStatus };
