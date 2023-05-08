import { convert } from "./convert.ts";

const inputFileName = prompt("Enpass JSON export", "./data/export.json");
if (!inputFileName) {
  console.error("No Enpass JSON export file name provided");
  Deno.exit(1);
}

const outputFileName = prompt("KeePassXC CSV output", "./data/output.csv");
if (!outputFileName) {
  console.error("No KeePassXC CSV output file name provided");
  Deno.exit(1);
}

await convert(inputFileName, outputFileName);