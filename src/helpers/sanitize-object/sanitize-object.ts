/**
 * Sanitizes an object by removing any null, undefined, or empty string values.
 *
 * @param {Object} inputObj - The input object to be sanitized
 * @return {Object} The sanitized object
 */
export function sanitizeObject(inputObj: { [key: string]: any }) {
  const obj = inputObj;
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
      delete obj[key];
    }
  });
  return obj;
}
