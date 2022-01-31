export type Actions<T> = {
    [Key in keyof T]: {
      type: Key;
      payload: T[Key];
    }
  }[keyof T];