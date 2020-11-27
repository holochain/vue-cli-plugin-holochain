dnaName=$1
oldName=$2
newName=$3
lowercaseDnaName="$(tr '[:upper:]' '[:lower:]' <<< ${dnaName})"
lowercaseOldName="$(tr '[:upper:]' '[:lower:]' <<< ${oldName})"
capitalisedOldName="$(tr '[:lower:]' '[:upper:]' <<< ${oldName:0:1})${oldName:1}"
lowercaseNewName="$(tr '[:upper:]' '[:lower:]' <<< ${newName})"
capitalisedNewName="$(tr '[:lower:]' '[:upper:]' <<< ${newName:0:1})${newName:1}"
mv ../dna/zomes/$lowercaseDnaName/src/entries/$lowercaseOldName ../dna/zomes/$lowercaseDnaName/src/entries/$lowercaseNewName
mv ../dna/tests/src/$lowercaseOldName ../dna/tests/src/$lowercaseNewName
mv ../src/views/"$lowercaseOldName"s ../src/views/"$lowercaseNewName"s
grep -rl $capitalisedOldName .. --exclude-dir={tools,node_modules,target,conductor} | xargs sed -i "" s/$capitalisedOldName/$capitalisedNewName/g
grep -rl $lowercaseOldName .. --exclude-dir={tools,node_modules,target,conductor} | xargs sed -i "" s/$lowercaseOldName/$lowercaseNewName/g
