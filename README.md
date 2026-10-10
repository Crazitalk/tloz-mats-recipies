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
  - net gain (sell price minus the ingredients' raw value)
  - hearts restored
  - effect bonus
  - max duration
- **Effect targeting.** Filter to a single effect and choose between "max power + balanced duration" or "max power + max duration". The effect buttons change with the game:
  - *BotW:* Hearty, Energizing, Enduring, Hasty, Mighty, Tough, Sneaky, Electro, Spicy, Chilly, Fireproof.
  - *TotK:* all of the above, plus Sunny, Bright, Rapid, Sticky, Biting, Scorching, Stormy and Warding.
- **Meals, elixirs, or both.** Toggle which dish types the finder considers.
- **Recipe search.** Type a dish name (e.g. "Steamed Fish") to see its ingredient requirements and narrow the tile grid to matching ingredients.
- **Filters and ownership view.** Filter tiles by category, show owned items only, or set a quantity for every item at once.
- **Save and load.** Your inventory and settings persist in the browser automatically, and can be exported to or imported from a JSON file (`botw-ingredients.json` or `totk-ingredients.json`). A saved file remembers which game it belongs to.
- **Tooltips.** Hovering a tile shows category, effect, effect points, duration, raw hearts and sell price, or official item text if you supply it.
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
| `images.js` | List of ingredient image filenames, used to match images to ingredients. |
| `descriptions.js` | Optional official item text for tooltips (empty by default). |
| `img/` | Ingredient tile images, named `BotW###-ItemName.png` and `TotK###-ItemName.png` (see below), plus the optional heart and stamina icons. |
| `rename-images.sh` | Helper that renames images to the `BotW###-` format. |
| `LICENSE` | CC0 1.0 Universal. |

The heart and stamina icons (`h1`-`h4.webp`, `s05`-`s15.webp`) are optional. If they are missing, the app falls back to text.

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
- **Hearts:** cooking doubles each ingredient's raw hearts, capped at your total. Hearty dishes fully restore and add their points as temporary hearts. Elixirs restore none.
- **Effects:** points add up, and only one effect can be active per pot. If the ingredients carry two or more different effects (Hearty included), they all cancel out and the dish has no effect. Tiers are based on wiki thresholds.
- **Duration:** each ingredient adds its listed time. Extra copies of pantry items and dragon parts add 30 s. Capped at 30:00. Energizing is capped by your stamina.

### Tears of the Kingdom

> **Unverified:** these rules and values come from information found online, not from my own testing in the game.

These rules follow the game's own cooking data as published by the community, rather than wiki approximations.

- **Sell price:** the sum of ingredient sell values multiplied by a factor based on item count (1: 1.2, 2: 1.3, 3: 1.4, 4: 1.6, 5: 1.8), rounded down, with a minimum of 3. There is no rounding up to 10. Dragon parts and Star Fragments count as 1 rupee. Failed dishes, Fairy Tonics and Rock-Hard Food sell for 2.
- **Recipes:** the pot's distinct ingredients are checked against the recipe list in order, and the first match wins. Four copies of one fruit are still Simmered Fruit, because "Copious" dishes need four different kinds.
- **Effects:** each effect ingredient adds hidden potency. Level is total potency times a per-effect rate, rounded down, with a minimum of 1 and a cap per effect. As in BotW, different effects in one pot cancel out, and an elixir with clashing effects fails.
- **Hearts:** twice the ingredients' raw hearts plus the recipe's bonus, capped at your total. A dish worth 30 or more hearts is a full heal. Hearty and Sunny levels are counted in quarter hearts.
- **Duration:** 30 s per item, plus a base time for each effect ingredient, plus the bonus time on seasonings, dragon parts and monster parts. Capped at 30:00.

### Both games

- **Finder:** to stay fast, **Look Up** only combines the best owned candidates (those carrying the chosen effect plus top fillers by price, hearts, and duration). The cap is 30 candidates for BotW and 18 for TotK. It only considers ingredients currently shown, so filters and recipe search apply.

### Known limitations

- The game's possible buy-price cap isn't modeled.
- *TotK* critical cooks (a random bonus to hearts, level or duration) and Monster Extract (which randomizes results) aren't modeled. Results show the base outcome.
- *TotK* values have not been verified in game by the author (see the caveat at the top).
- *TotK* recipe matching follows the order ingredients are added, as the game does, so the order can matter in rare edge cases.

## Roadmap

- [x] *Tears of the Kingdom* support, with a game selector
- [x] Separate data per game (`data-botw.js` and `data-totk.js`) so the shared interface can load either dataset
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
- *Tears of the Kingdom* data:
  - Material values, effect rates and cooking logic come from the datamined tables in [Echocolat/TOTK-Cooking-Calculator](https://github.com/Echocolat/TOTK-Cooking-Calculator). That project credits original code by KingFoo ([Totk-Cooking-Simulator](https://github.com/KingFooZQ/Totk-Cooking-Simulator)) and CookingMgr code retrieved by dt12345.
  - Recipe rules were cross-checked against [Zelda Dungeon's Recipes page](https://www.zeldadungeon.net/wiki/Tears_of_the_Kingdom_Recipes) and [Food page](https://www.zeldadungeon.net/wiki/Tears_of_the_Kingdom_Food).
  - Further references: the [Fextralife recipe book](https://zeldatearsofthekingdom.wiki.fextralife.com/Recipe_Book) and [Game8's recipe list](https://game8.co/games/Zelda-Tears-of-the-Kingdom/archives/411134).

## License

The code and original content in this repository are released under [CC0 1.0 Universal](LICENSE). That does not cover Nintendo's trademarks, game names, data and artwork, or the third-party sources listed above, which remain the property of their respective owners.

## Disclaimer

This is an unofficial fan project and is not affiliated with or endorsed by Nintendo. *The Legend of Zelda*, *Breath of the Wild* and *Tears of the Kingdom* are trademarks of Nintendo. Game names, data, and artwork belong to their respective owners.