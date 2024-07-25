import fs from "fs";
import { join } from "path";

import { locales } from "./src/i18n";

const flattenObject = (obj: Record<string, any>, prefix = "") =>
  Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + "_" : ""; // Construct the prefix for the current key
    if (typeof obj[k] === "object")
      // If the current value is an object, recursively call 'flattenObject' and merge the result into the accumulator
      Object.assign(acc, flattenObject(obj[k], pre + k));
    else acc[pre + k] = { message: obj[k] }; // Otherwise, assign the current value to the accumulator with the constructed key
    return acc; // Return the accumulator
  }, {});

function loadLanguage(langId: string, tree: unknown) {
  const targetDir = join(__dirname, "dist", "_locales", langId);

  fs.mkdirSync(targetDir, { recursive: true });

  fs.writeFileSync(
    join(targetDir, "messages.json"),
    JSON.stringify(flattenObject(tree))
  );
}

for (const [langId, tree] of Object.entries(locales)) {
  loadLanguage(langId, tree);
}
