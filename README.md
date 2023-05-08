# enpass-to-keepassxc

This tool converts a Enpass JSON export into a CSV file that can be imported in KeePassXC.

Its purpose is to help transfer password entries from Enpass to KeePassXC in order to switch Password Manager.

Despite KeePassXC import being limited to only certain field, apart of attachments, the tool does not loose any Enpass fields.
It achieves this by putting the additional fields into the KeePassXC entry's note field.
This is acceptable as KeePassXC's notes are secure and hidden by default.


## Usage

### 1. Export Enpass data into JSON file

1. Start Enpass
2. In hamburger menu: `File > Export`
3. Select Format of File: `.json`
4. Optional: include Trashed/Archived entries (if included they will be imported as regular entries in KeePassXC)
5. Choose location for export file
6. Export

### 2. Convert Enpass JSON export to KeePassXC CSV import

1. [Install deno](https://deno.com/manual/getting_started/installation)
2. Run the tool with:

```sh
cd enpass-to-keepassxc
deno run --allow-read --allow-write ./src/main.ts
```

3. Provide location of Enpass JSON export
4. Provide location of the file to write the KeePassXC CSV import (overriden if exists)


### 3. Import into KeePassXC

1. Start KeePassXC
2. In menu: `Database > Import > CSV File...`
3. Follow steps (pick CSV file to import, choose DB name, choose master password, choose DB location)
4. On import page, tick **First line has field names**
5. Keep every other options with their default values and import file



## Notes

- The tool **does not migrate attachments**. Those have to be migrated manually after the process is completed.
- KeePassXC only supports importing a defined set of attributes, all **additional attributes** from Enpass entries are added within the notes of the converted KeePassXC entry
- KeePassXC only supports a **single username**. The tool thus first try to pick the Enpass entry's username, if there isn't one, it will take the email address as the username. If neither exists, the username remains empty.
- Enpass allows **multiple fields** to be of type username, password or email. The tool will respectively pick only the firt non empty one to create the KeePassXC entry, but all others will be added to the notes.
- **Tags** are appended to the converted entry note, this is because they are supported by KeePassXC import.
- Enpass **categories** are converted to KeePassXC folders.
- Do not forget to **delete** the Enpass JSON export and the CSV import file created for KeePassXC. Also be careful not to leave them in your recycle bin.
- Once the transfer is done to KeePassXC, you may want to move manually the additional fields from the entry's notes to dedicated additional attributes. Same for tags.
- Only tested from Enpass `6.8.5 (1173)` to KeePassXC `2.7.4`. Other KeePass tools may or may not work.