export function cn(
  ...inputs: Array<string | false | null | undefined | Record<string, boolean>>
): string {
  return inputs
    .flatMap((input) => {
      if (!input) return [];
      if (typeof input === "string") return input;
      return Object.entries(input)
        .filter(([, value]) => value)
        .map(([key]) => key);
    })
    .join(" ");
}


