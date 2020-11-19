oldDna=$1
newDna=$2
lowercaseOldDna="$(tr '[:upper:]' '[:lower:]' <<< ${oldDna})"
capitalisedOldDna="$(tr '[:lower:]' '[:upper:]' <<< ${oldDna:0:1})${oldDna:1}"
lowercaseDna="$(tr '[:upper:]' '[:lower:]' <<< ${newDna})"
capitalisedDna="$(tr '[:lower:]' '[:upper:]' <<< ${newDna:0:1})${newDna:1}"
mv ../dna/$lowercaseOldDna.dna.workdir ../dna/$lowercaseDna.dna.workdir
mv ../dna/zomes/$lowercaseOldDna ../dna/zomes/$lowercaseDna
mv ../src/store/modules/$lowercaseOldDna.store.js ../src/store/modules/$lowercaseDna.store.js
grep -rl $lowercaseOldDna --exclude-dir={tools,node_modules,target,conductor} ..  | xargs sed -i "" s/$lowercaseOldDna/$lowercaseDna/g
grep -rl $capitalisedOldDna --exclude-dir={tools,node_modules,target,conductor} ..  | xargs sed -i "" s/$capitalisedOldDna/$capitalisedDna/g
