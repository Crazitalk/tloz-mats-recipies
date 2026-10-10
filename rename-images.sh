#!/bin/bash
# Renames ingredient images in ./img to <Game><3-digit number>-<Item>.png
#   01-HeartyDurian.png       -> BotW001-HeartyDurian.png
#   BotW01-HeartyDurian.png   -> BotW001-HeartyDurian.png
# Files already named BotW###-... or TotK###-... are left alone. Run it from the folder that contains img/.
cd "$(dirname "$0")/img" || exit 1
for f in *.png; do
  case "$f" in
    BotW[0-9][0-9][0-9]-*|TotK[0-9][0-9][0-9]-*) ;;
    BotW[0-9]*-*) n=${f#BotW}; n=${n%%-*}; mv -n "$f" "BotW$(printf %03d $((10#$n)))-${f#*-}" ;;
    [0-9]*-*)     n=${f%%-*};              mv -n "$f" "BotW$(printf %03d $((10#$n)))-${f#*-}" ;;
  esac
done
ls | head -5
