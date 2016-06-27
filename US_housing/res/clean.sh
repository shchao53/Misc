# sed 's/\"{/{/g' us.json > temp.json
# sed 's/}\"/}/g' temp.json > temp2.json
sed -e 's/\"[/[/g' -e 's/]\"/]/g' us.json > temp.json

sed "s/'/\"/g" temp.json > temp3.json

cp temp3.json us.json
