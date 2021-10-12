#!/bin/zsh
index=0
rm -f pics/*
echo "Deleted old pics..."
head -1000 output.txt > output_small.txt
while read -r line;
do
  echo "$line" | dot -Tpng > pics/"$index".png
  index=$((index+1))
  echo "Image $index rendered."
done < "output_small.txt"
echo "Finished generating images..."
#cd pics
#convert -delay 1 -loop 0 `ls -v` timelapse.gif
echo "Finished, thanks for the fish."
