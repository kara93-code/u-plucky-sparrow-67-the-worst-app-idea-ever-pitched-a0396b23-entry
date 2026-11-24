// QueueBuddy — the worst app idea ever pitched, in one sentence.
// A subscription that holds your place in a queue that no longer exists.
import { mkdir, writeFile, chmod } from "node:fs/promises";
import { join } from "node:path";

const PITCH =
  "QueueBuddy is a $4.99-a-month app that holds your place in line at a bakery that closed in 2019, with live queue updates, VIP fast-pass upgrades, and loyalty points for a line that no longer exists.";

function checkPitch(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 240) {
    throw new Error(`pitch must be 1-240 characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    throw new Error("pitch must not be only whitespace");
  }
  if (text.trim().split(/\s+/).length < 5) {
    throw new Error("pitch looks empty");
  }
  // One clean sentence: exactly one sentence-ending full stop, at the end.
  // Decimal points inside prices (e.g. $4.99) are not sentence ends.
  const stops = text.replace(/\d+\.\d+/g, "").match(/\./g) ?? [];
  if (stops.length !== 1 || !text.trimEnd().endsWith(".")) {
    throw new Error("pitch must be exactly one sentence");
  }
}

async function main(): Promise<void> {
  checkPitch(PITCH);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }
  await mkdir(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  await writeFile(target, PITCH, "utf8");
  await chmod(target, 0o644);
  console.log(`wrote ${target} (${[...PITCH].length} chars)`);
}

await main();
