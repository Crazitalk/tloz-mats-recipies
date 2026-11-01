# Legend of Zelda Cooking Pot

A fast, offline-friendly cooking calculator for *The Legend of Zelda: Breath of the Wild* and *Tears of the Kingdom*. Pick a game, build a pot to see what it makes and what it sells for, enter the ingredients you actually own, and let the finder rank the best pots you can cook right now.

Inspired by [botwcooking.com](https://botwcooking.com), with additional data compiled from a number of fan and wiki sources.

> **Status:** Both games are supported. Switch between them with the buttons under the page title.
>
> **Caveat:** The *Tears of the Kingdom* values (prices, effects, durations and recipes) are based on information found online, and I have not verified them against the game myself, as I haven't played it yet. They may contain errors. If a result doesn't match what you get in game, please open an issue.

## Features

- **Two games, one app.** Toggle between *Breath of the Wild* and *Tears of the Kingdom*. Each game has its own ingredients, recipes, effects, rules and saved quantities.
- **Pot simulator.** Click tiles to add up to five ingredients and instantly see the resulting dish, sell price, net gain, hearts restored, effect and duration. If the ingredients carry conflicting effects, the pot says which ones cancel out.
- **Cook from what I own.** Enter quantities on the ingredient tiles, pick your heart and stamina totals, and click **Look Up** to rank the best pots by:
  - sell price
  - hearts restored
  - effect bonus
  - max duration
- **Effect targeting.** Filter to a single effect, then rank by effect bonus or max duration. For effects with more than one tier, a **Max tier** toggle limits the finder to pots at or below that tier (it is hidden for single-tier effects and for Hearty, Energizing and Enduring, which have no tiers). The effect buttons change with the game:
  - *BotW:* Hearty, Energizing, Enduring, Hasty, Mighty, Tough, Sneaky, Electro, Spicy, Chilly, Fireproof.
  - *TotK:* all of the above, plus Sunny, Bright, Rapid, Sticky, Biting, Scorching, Stormy and Warding.
- **Meals, elixirs, or both.** Toggle which dish types the finder considers.
- **Recipe search.** Type a dish name (e.g. "Steamed Fish") to see its ingredient requirements and narrow the tile grid to matching ingredients.
- **Filters and ownership view.** Filter tiles by category, show owned items only, or set a quantity for every item at once.
- **Save and load.** Your inventory and settings persist in the browser automatically, and can be exported to or imported from a JSON file (`botw-ingredients.json` or `totk-ingredients.json`). A saved file remembers which game it belongs to.
- **Tooltips.** Hovering a tile shows category, effect, effect points, duration, raw hearts and sell price, or official item text if you supply it.
- **Armor & weapons page (`armor.html`).** A second page, linked from the header of each page, lists every armor piece for the selected game with the ingredients needed for each of the four stars. It reads the quantities you saved on the cooking pot page, highlights pieces you can upgrade right now, and totals the ingredients (and, for *TotK*, rupees) still needed for the pieces you own. Mark which pieces you own (including pieces that cannot be upgraded) and their current star level; anything you do not own is faded, and those choices are saved separately in the browser. Tick the **Weapons** filter to show two more groups above the armor sets: **Champion Weapons** (the Champions' weapons and Daybreaker, with the materials a smith needs to remake one, for both games) and **Ancient Weapons** (*BotW* only: how many of Cherry's Ancient weapons your saved materials could buy, with the limiting ingredient highlighted).
- **Heart and stamina icons.** Stamina wheels are drawn in fifths (1 to 3 wheels, built from `s1`-`s5`). Bonus hearts from Hearty dishes and bonus stamina from Enduring dishes are drawn with their own icons after the normal hearts and stamina.
- **Responsive, light/dark aware.** Follows your system color scheme and collapses to a single column on small screens.

## Getting started

There is no build step and no dependencies. It's a static page.

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```
2. Open `index.html` in a browser, or serve the folder locally:
   ```bash
   python3 -m http.server 8000
   ```
   then visit <http://localhost:8000>.

It can also be hosted as-is on GitHub Pages or any static host.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | The whole app: markup, styles, and logic. It contains a separate engine for each game (recipe matching, pricing, effects, duration) and the shared pot finder and interface. |
| `data-botw.js` | *Breath of the Wild* ingredient (`MATS`) and recipe (`RECS`) data. |
| `data-totk.js` | *Tears of the Kingdom* data (`TOTK`): materials, effect rates, price factors and recipes. |
| `armor.html` | The armor and weapons page: markup, styles and logic. Reads your saved ingredient quantities from the browser. |
| `data-armor.js` | Armor upgrade data (`ARMOR`) for both games: sets, pieces, and the ingredients for each star. |
| `data-weapons.js` | Weapon and shield data (`WEAPONS`) for both games: Champion weapon repair materials and *BotW* Ancient weapon prices. |
| `armor-images.js` | Optional list of armor image filenames in `img/armor/`, empty by default. |
| `weapons-images.js` | Optional list of weapon image filenames in `img/weapons/`, empty by default. |
| `images.js` | List of ingredient image filenames, used to match images to ingredients. |
| `descriptions.js` | Optional official item text for tooltips (empty by default). |
| `img/` | Ingredient tile images, named `BotW###-ItemName.png` and `TotK###-ItemName.png` (see below), plus the optional heart and stamina icons. Optional armor images go in `img/armor/` and weapon images in `img/weapons/`. |
| `rename-images.sh` | Helper that renames images to the `BotW###-` format. |
| `LICENSE` | CC0 1.0 Universal. |

The heart and stamina icons are optional, and the app falls back to text if they are missing. They live in `img/`: `h1`-`h4.webp` for hearts, `h+4.webp` for each bonus heart, `s1`-`s5.webp` for stamina and `s+1`-`s+5.webp` for bonus stamina. Stamina is shown in fifths of a wheel: a score of 5 is `s5`, 7 is `s5` plus `s2`, and 15 is three `s5`. Bonus stamina follows the same rule (capped at three wheels), and bonus hearts only appear as whole hearts.

### Data formats

**`data-botw.js`** defines two arrays.

`MATS` has one row per ingredient:

```js
[name, category, sellPrice, effect, effectLabel, imageFile, rawHearts, effectPoints, secondsAdded]
// e.g. ["Mighty Bananas", "Fruit", 5, "Mighty", "Attack Bonus", "", 0.5, 2.0, 50]
```

`RECS` has one row per recipe, with a name, category (meal or elixir), and an ingredient expression such as `Raw Meat + Hylian Rice`. Expressions support alternatives (`or`) and groups like "any mushroom" or "any fish", which the app resolves against `MATS`.

**`data-totk.js`** defines one object, `TOTK`:

```js
TOTK.mats      // one row per material:
               // [name, actor, cookTag, category, sellPrice, hitPointRecover (quarter hearts),
               //  effectType, effectPotency, spiceSeconds, spiceQuarterHearts, countsAs1Rupee]
TOTK.effects   // per effect: label, base time, min and max level, rate, and whether it is timed
TOTK.rates     // price factor by item count
TOTK.singles   // recipes made from one distinct ingredient
TOTK.recipes   // all other recipes, in the order the game checks them
```

Recipe parts use the game's internal actor names or cook tags (for example `CookFruit`), with `or` alternatives, so they are matched the way the game matches them. Most of this file was generated from datamined tables rather than typed by hand, so edit it with care.

**`data-armor.js`** defines one object, `ARMOR`, with a `BotW` and a `TotK` entry:

```js
ARMOR.BotW = { rupees: null, sets: [
  { name: "Hylian Set",
    u: [ [["Bokoblin Horn", 5]], [["Bokoblin Fang", 5], ["Bokoblin Horn", 8]], ... ],   // star 1 to 4: [ingredient, quantity]
    pieces: [ { n: "Hylian Hood", t: "hat" }, { n: "Hylian Tunic", t: "shirt" }, ... ] } ] }
```

`u` is on the set when every piece shares the same ingredients, otherwise on each piece (the Wild set, for example, needs different dragon parts per piece). `u: null` means the piece cannot be upgraded. `rupees` is the per-star fee for the game (`[10, 50, 200, 500]` for *TotK*, `null` for *BotW*), and a set or piece can override it with `r`. `a` marks Amiibo items and `d` DLC items. Ingredient names must match the names in `data-botw.js` and `data-totk.js`, because that is how the armor page finds your saved quantities.

**`data-weapons.js`** defines one object, `WEAPONS`, with a `BotW` and a `TotK` entry, each holding a `champion` list and (*BotW* only) an `ancient` list:

```js
{ n: "Boulder Breaker", t: "two", base: "Cobble Crusher", req: [["Diamond", 1], ["Flint", 5]], who: "Rohan, Goron City" }   // champion
{ n: "Ancient Bow", t: "bow", rupees: 1000, req: [["Ancient Gear", 10], ["Ancient Spring", 15], ["Giant Ancient Core", 1]] }   // ancient
```

`req` is the materials for one repair or one purchase. `base` is the base weapon a smith also needs, which is listed but not checked because it is a weapon rather than an ingredient. Ingredient names must match `data-botw.js` and `data-totk.js`.

### Armor images

Optional. Put images in `img/armor/` named `<Game>-<Name>.png`, for example `BotW-HylianHood.png`, `BotW-HylianSet.png` or `TotK-ZonaiteHelm.png`. A piece image is used when the name matches the piece, otherwise a set image matching the set name is used, otherwise the tile shows initials. Then regenerate `armor-images.js` (the command is in that file).

### Weapon images

Optional, and named the same way but placed in `img/weapons/`, for example `BotW-BoulderBreaker.png` (the three arrows use `BotW-AncientArrow.png`, `BotW-AncientArrowThree.png` and `BotW-AncientArrowFive.png`), `TotK-GreatEagleBow.png` or `BotW-AncientShortSword.png`. Tiles without an image show initials. Then regenerate `weapons-images.js` (the command is in that file).

### Tooltip descriptions

By default, tooltips show a generated summary. To override with your own text for specific items, add entries to `descriptions.js`:

```js
const DESCRIPTIONS = {
  "Apple": "Paste the description here."
};
```

### Ingredient images

Images live in `img/` and are named `<Game><3-digit number>-<ItemName>.png`, for example `BotW003-Apple.png` and `TotK001-Apple.png`. The app only loads images for the game you are viewing. Tiles are matched to ingredients by name, ignoring the number, punctuation and case, and tiles are ordered by the number.

- If you have older files named `01-Apple.png` or `BotW01-Apple.png`, run `./rename-images.sh` from the project folder to convert them to the 3-digit format.
- After adding or renaming images, regenerate `images.js` from the project folder:

  ```bash
  (echo "const IMAGES=["; ls img/*.png | sed 's|.*/||; s/.*/"&",/'; echo "];") > images.js
  ```

Ingredients without a matching image show their initials instead, so the app works without any images at all.

## How results are calculated

The same explanation is available in the app under **How results are worked out**, and it changes with the selected game.

### Breath of the Wild

- **Sell price:** the sum of ingredient sell values multiplied by a factor based on item count (1: 1.5, 2: 1.8, 3: 2.1, 4: 2.4, 5: 2.8), rounded down, then up to the next 10. Failed recipes sell for 2.
- **Hearts:** cooking doubles each ingredient's raw hearts, capped at your total. Hearty dishes fully restore and add their points as temporary hearts, limited so your hearts plus temporary hearts never exceed 30 (with 13 hearts, a Hearty dish adds at most 17). Elixirs restore none.
- **Effects:** points add up, and only one effect can be active per pot. If the ingredients carry two or more different effects (Hearty included), they all cancel out and the dish has no effect. Tiers are based on wiki thresholds.
- **Duration:** each ingredient adds its listed time. Extra copies of pantry items and dragon parts add 30 s. Capped at 30:00. Energizing is capped by your stamina.

### Tears of the Kingdom

> **Unverified:** these rules and values come from information found online, not from my own testing in the game.

These rules follow the game's own cooking data as published by the community, rather than wiki approximations.

- **Sell price:** the sum of ingredient sell values multiplied by a factor based on item count (1: 1.2, 2: 1.3, 3: 1.4, 4: 1.6, 5: 1.8), rounded down, with a minimum of 3. There is no rounding up to 10. Dragon parts and Star Fragments count as 1 rupee. Failed dishes, Fairy Tonics and Rock-Hard Food sell for 2.
- **Recipes:** the pot's distinct ingredients are checked against the recipe list in order, and the first match wins. Four copies of one fruit are still Simmered Fruit, because "Copious" dishes need four different kinds.
- **Effects:** each effect ingredient adds hidden potency. Level is total potency times a per-effect rate, rounded down, with a minimum of 1 and a cap per effect. As in BotW, different effects in one pot cancel out, and an elixir with clashing effects fails.
- **Hearts:** twice the ingredients' raw hearts plus the recipe's bonus, capped at your total. A dish worth 30 or more hearts is a full heal. Hearty and Sunny levels are counted in quarter hearts, and Hearty's temporary hearts are limited so your hearts plus temporary hearts never exceed 30.
- **Duration:** 30 s per item, plus a base time for each effect ingredient, plus the bonus time on seasonings, dragon parts and monster parts. Capped at 30:00.

### Both games

- **Finder:** to stay fast, **Look Up** only combines the best owned candidates (those carrying the chosen effect plus top fillers by price, hearts, and duration). The cap is 30 candidates for BotW and 18 for TotK. It only considers ingredients currently shown, so filters and recipe search apply.

### Armor upgrades

- **Ready** means you own the piece and your saved quantities cover the next star's ingredients. Each piece is checked on its own, so two pieces needing the same ingredient can both read as ready when you only have enough for one.
- *BotW* upgrades cost materials only. *TotK* upgrades also cost rupees (10, 50, 200, 500 for stars 1 to 4; Ancient Hero's Aspect costs 30, 150, 600, 1500). Rupees are shown but not checked, as the app does not track them.
- The star level you can reach depends on how many Great Fairies you have awakened. The page does not track that.
- Pieces with no upgrade list (Phantom set, and in *BotW* the Dark, Gerudo, Tingle, Royal Guard and other fixed-stat sets) are labelled "Cannot be upgraded". You can still mark them as owned.
- Any piece you have not marked as owned is faded, and its star buttons are disabled until you tick "I own this".

### Weapons

- **Champion weapons** show the materials a smith needs to remake the weapon if it breaks. Owned weapons read as repairable when your saved quantities cover them. The base weapon (a Zora Spear, say) is listed but not checked, because the app only tracks ingredients. In *TotK*, the Scimitar of the Seven and Daybreaker are forged together, so each card lists the combined materials.
- **Ancient weapons** (*BotW* only) show how many Cherry could forge: the smallest of (your quantity / quantity needed) across the materials. The limiting ingredient is outlined in gold. Rupees (1,000 each) are shown but not checked, and each weapon is checked on its own, so buying one uses materials the others need. Ancient Arrows are included but also need ordinary Arrows, which are listed and not checked. Ancient armor stays on the armor list.

### Known limitations

- The game's possible buy-price cap isn't modeled.
- *TotK* critical cooks (a random bonus to hearts, level or duration) and Monster Extract (which randomizes results) aren't modeled. Results show the base outcome.
- *TotK* values have not been verified in game by the author (see the caveat at the top).
- *TotK* recipe matching follows the order ingredients are added, as the game does, so the order can matter in rare edge cases.

## Roadmap

- [x] *Tears of the Kingdom* support, with a game selector
- [x] Separate data per game (`data-botw.js` and `data-totk.js`) so the shared interface can load either dataset
- [x] Armor upgrades page for both games
- [x] Weapons and shields (Champion and Ancient)
- [ ] Armor set images
- [ ] Weapon images
- [ ] Fill in official item descriptions
- [ ] Optional critical-cook and Monster Extract ranges for *TotK*

## Credits

- Inspired by [botwcooking.com](https://botwcooking.com).
- *Breath of the Wild* ingredient and recipe data compiled from community fan and wiki sources:
  - [https://www.zeldadungeon.net/wiki/Breath_of_the_Wild_Materials](https://www.zeldadungeon.net/wiki/Breath_of_the_Wild_Materials)
  - [https://www.zeldadungeon.net/wiki/Breath_of_the_Wild_Recipes](https://www.zeldadungeon.net/wiki/Breath_of_the_Wild_Recipes)
  - [https://www.ign.com/wikis/the-legend-of-zelda-breath-of-the-wild/All_Recipes_and_Cookbook](https://www.ign.com/wikis/the-legend-of-zelda-breath-of-the-wild/All_Recipes_and_Cookbook)
  - [https://game8.co/games/Zelda-Breath-of-the-Wild/archives/292496](https://game8.co/games/Zelda-Breath-of-the-Wild/archives/292496)
  - [https://www.reddit.com/r/Breath_of_the_Wild/comments/kq8ccs/all_botw_recipes_in_one_image/](https://www.reddit.com/r/Breath_of_the_Wild/comments/kq8ccs/all_botw_recipes_in_one_image/) (the all-recipes chart by victorv111)
  - [https://old.reddit.com/r/Breath_of_the_Wild/comments/62xurt/full_effects_of_all_cooking_ingredients/](https://old.reddit.com/r/Breath_of_the_Wild/comments/62xurt/full_effects_of_all_cooking_ingredients/) (likely source of the effect points)
- Armor upgrade data:
  - *Breath of the Wild* requirements come from [TheJaredWilcurt/botw-armor-upgrade-tracker](https://github.com/TheJaredWilcurt/botw-armor-upgrade-tracker) (MIT License, see below). Zelda Central's [armor sets and upgrades page](https://zeldacentral.com/games/breath-of-the-wild/armor-sets-upgrades/) was used as a reference and differs from the tracker in places.
  - *Tears of the Kingdom* requirements come from Prima Games' [All Armor Upgrade Materials Listed](https://primagames.com/tips/all-armor-upgrade-materials-listed-for-zelda-tears-of-the-kingdom), with the fee schedule checked against Fextralife's [Upgrades page](https://zeldatearsofthekingdom.wiki.fextralife.com/Upgrades) and the Zelda Dungeon [armor page](https://www.zeldadungeon.net/wiki/Tears_of_the_Kingdom_Armor) as a further reference. Not verified in game.
- Weapon data (`data-weapons.js`), not verified in game:
  - *Breath of the Wild* Champion weapon repairs come from the smiths' in-game dialogue as quoted on [Zelda Wiki](https://zelda.fandom.com/wiki/Buliara), cross-checked against [GameWith's repair guide](https://gamewith.net/zelda-botw/article/show/38828). The Ceremonial Trident figure comes from GameWith and [TheGamer](https://www.thegamer.com/breath-of-the-wild-how-to-repair-weapons/) only.
  - Ancient weapon prices come from Zelda Dungeon's [Cherry page](https://www.zeldadungeon.net/wiki/Cherry). Other wikis disagree about the Ancient Shield, so treat that entry with care.
  - *Tears of the Kingdom* Champion weapons come from Game8's [Champion Weapons page](https://game8.co/games/Zelda-Tears-of-the-Kingdom/archives/413835), with the Scimitar of the Seven and Daybreaker totals cross-checked against GamerGuides.
- *Tears of the Kingdom* data:
  - Material values, effect rates and cooking logic come from the datamined tables in [Echocolat/TOTK-Cooking-Calculator](https://github.com/Echocolat/TOTK-Cooking-Calculator). That project credits original code by KingFoo ([Totk-Cooking-Simulator](https://github.com/KingFooZQ/Totk-Cooking-Simulator)) and CookingMgr code retrieved by dt12345.
  - Recipe rules were cross-checked against [Zelda Dungeon's Recipes page](https://www.zeldadungeon.net/wiki/Tears_of_the_Kingdom_Recipes) and [Food page](https://www.zeldadungeon.net/wiki/Tears_of_the_Kingdom_Food).
  - Further references: the [Fextralife recipe book](https://zeldatearsofthekingdom.wiki.fextralife.com/Recipe_Book) and [Game8's recipe list](https://game8.co/games/Zelda-Tears-of-the-Kingdom/archives/411134).

## Third-party notice

The *Breath of the Wild* data in `data-armor.js` is derived from botw-armor-upgrade-tracker, which is used under the MIT License:

```
MIT License

Copyright (c) 2022 The Jared Wilcurt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## License

The code and original content in this repository are released under [CC0 1.0 Universal](LICENSE). That does not cover Nintendo's trademarks, game names, data and artwork, or the third-party sources listed above, which remain the property of their respective owners.

## Disclaimer

This is an unofficial fan project and is not affiliated with or endorsed by Nintendo. *The Legend of Zelda*, *Breath of the Wild* and *Tears of the Kingdom* are trademarks of Nintendo. Game names, data, and artwork belong to their respective owners.