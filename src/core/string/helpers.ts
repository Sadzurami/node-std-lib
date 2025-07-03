export function toTitleCase(str: string, shortWordLength = 2): string {
  return str.replace(/\b\w[\w']*\b/g, (word) => {
    const letters = (word.match(/[a-z]/gi) || []).length;

    if (letters <= shortWordLength) return word.toUpperCase();

    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  });
}
