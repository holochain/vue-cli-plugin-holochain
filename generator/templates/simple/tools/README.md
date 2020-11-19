# Rename the DNA
Renaming the DNA renames the files & folders in dna directory as well as the files and folders in the web app src directory. Renamaing then updates the files and replaces the old DNA name with the new one.

```
sh renameDna.sh <current name> <new name>
```
## Example
To rename the "simple" dna to "holodex"
```
sh renameDna.sh simple holodex
```

Remember to update the path in the install.js conductor tool.

# Rename an Entry Type
Renaming an Entry Type renames the files & folders in dna directory as well as the files and folders in the web app src directory. Renamaing then updates the files and replaces the old DNA name with the new one.

```
sh renameEntryType.sh <dna name> <current name> <new name>
```
## Example
To rename the Entry Type "thing" dna to "contact"
```
sh renameEntryType.sh holodex thing contact
```