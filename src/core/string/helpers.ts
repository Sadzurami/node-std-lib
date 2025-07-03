/**
 * Converts a string to title case, where the first letter of each word is capitalized.
 *
 * Words with a length of `shortWordLength` or fewer are converted to uppercase.
 */
export function toTitleCase(str: string, shortWordLength = 2): string {
  return str.replace(/\b\w[\w']*\b/g, (word) => {
    const letters = (word.match(/[a-z]/gi) || []).length;

    if (letters <= shortWordLength) return word.toUpperCase();

    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  });
}
