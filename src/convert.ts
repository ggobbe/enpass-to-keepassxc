import { writeCSV } from "https://deno.land/x/csv@v0.8.0/mod.ts";
import { EnpassExport } from "./enpass.ts";
import { buildTagTitle } from "./buildTagTitle.ts";

export async function convert(inputFileName: string, outputFileName: string) {
  const input = await Deno.readTextFile(inputFileName);
  const { folders: tags, items } = JSON.parse(input) as EnpassExport;

  const output = await Deno.open(outputFileName, {
    write: true,
    create: true,
    truncate: true,
  });

  const rows = [KEEPASS_COLUMN_HEADERS];

  for (const item of items) {
    try {
      const fields = (item.fields ?? []).filter((f) => f.value);
      const usernameField =
        fields.find((f) => f.type === "username") ??
        fields.find((f) => f.type === "email");
      const passwordField = fields.find((f) => f.type === "password");
      const urlField = fields.find((f) => f.type === "url");
      const totpField = fields.find((f) => f.type === "totp");
      const notes = item.note ? [item.note] : [];

      const createdAt = new Date(item.createdAt * 1000).toISOString();
      const updatedAt = new Date(item.updated_at * 1000).toISOString();

      const importedFields = [
        usernameField?.uid,
        passwordField?.uid,
        urlField?.uid,
        totpField?.uid,
      ];

      // Other fields are appended to the notes as they cannot be imported into KeePassXC
      const remainingFields = fields.filter(
        (f) => !importedFields.includes(f.uid) && f.value
      );
      if (remainingFields.length > 0) {
        notes.push(
          "[Fields]\n" +
            remainingFields.map((f) => f.label + ": " + f.value).join("\n")
        );
      }

      // Tags are appended to the notes as they cannot be imported into KeePassXC
      const { folders: itemTags = [] } = item;
      const outTags = itemTags.map((uuid) => {
        return buildTagTitle(uuid, tags);
      });
      if (outTags.length > 0) {
        notes.push("[Tags]\n" + outTags.join("\n"));
      }

      const entry = [
        item.category,
        item.title,
        usernameField?.value ?? "",
        passwordField?.value ?? "",
        urlField?.value ?? "",
        notes.join("\n\n"),
        totpField?.value ?? "",
        "", // icon
        updatedAt,
        createdAt,
      ];

      rows.push(entry);
    } catch (e) {
      console.error(`invalid item '${item.title}'`, e);
    }
  }

  await writeCSV(output, rows);
  output.close();

  console.log(`\nWrote ${rows.length} entries to ${outputFileName}`);
}

// Default headers used by KeePassXC import tool
const KEEPASS_COLUMN_HEADERS = [
  "Group",
  "Title",
  "Username",
  "Password",
  "URL",
  "Notes",
  "TOTP",
  "Icon",
  "Last Modified",
  "Created",
];
