export type ClassValue =
  | string
  | number
  | null
  | undefined
  | boolean
  | ClassValue[]
  | Record<string, boolean | string | number | null | undefined>;

const pushClass = (value: ClassValue, classes: string[]) => {
  if (!value) {
    return;
  }

  if (typeof value === "string" || typeof value === "number") {
    classes.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      pushClass(entry, classes);
    }
    return;
  }

  if (typeof value === "object") {
    for (const [key, condition] of Object.entries(value)) {
      if (condition) {
        classes.push(key);
      }
    }
  }
};

export function cn(...inputs: ClassValue[]) {
  const classes: string[] = [];
  for (const input of inputs) {
    pushClass(input, classes);
  }

  return classes.join(" ");
}
