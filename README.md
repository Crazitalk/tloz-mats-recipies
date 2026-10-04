# Legend of Zelda Cooking Pot

A fast, offline-friendly cooking calculator for *The Legend of Zelda: Breath of the Wild*. Build a pot to see what it makes and what it sells for, enter the ingredients you actually own, and let the finder rank the best pots you can cook right now.

Inspired by [botwcooking.com](https://botwcooking.com), with additional data compiled from a number of fan and wiki sources.

> **Status:** Breath of the Wild only. *Tears of the Kingdom* support is planned (see [Roadmap](#roadmap)).

## Features

- **Pot simulator.** Click tiles to add up to five ingredients and instantly see the resulting dish, sell price, net gain, hearts restored, effect tier and duration.
- **Cook from what I own.** Enter quantities on the ingredient tiles, pick your heart and stamina totals, and click **Look Up** to rank the best pots by:
  - sell price
  - net gain (sell price minus the ingredients' raw value)
  - hearts restored
  - effect bonus
  - max duration
- **Effect targeting.** Filter to a single effect (Hearty, Energizing, Enduring, Hasty, Mighty, Tough, Sneaky, Electro, Spicy, Chilly, Fireproof) and choose between "max power + balanced duration" or "max power + max duration".
- **Meals, elixirs, or both.** Toggle which dish types the finder considers.
- **Recipe search.** Type a dish name (e.g. "Steamed Fish") to see its ingredient requirements and narrow the tile grid to matching ingredients.
- **Filters and ownership view.** Filter tiles by category, show owned items only, or set a quantity for every item at once.
- **Save and load.** Your inventory and settings persist in the browser automatically, and can be exported to or imported from a JSON file (`botw-ingredients.json`).
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
| `index.html` | The whole app: markup, styles, and logic (recipe matching, pricing, effect and duration calculation, pot finder). |
| `data.js` | Ingredient (`MATS`) and recipe (`RECS`) data. |
| `images.js` | List of ingredient image filenames, used to match images to ingredients. |
| `descriptions.js` | Optional official item text for tooltips (empty by default). |
| `*.png` | Ingredient tile images, named `NN-ItemName.png` (see below). |
| `h1`-`h4.webp`, `s05`-`s15.webp` | Optional heart and stamina icons. If missing, the app falls back to text. |

### Data format

`data.js` defines two arrays.

**`MATS`**: one row per ingredient:

```js
[name, category, sellPrice, effect, effectLabel, imageFile, rawHearts, effectPoints, secondsAdded]
// e.g. ["Mighty Bananas", "Fruit", 5, "Mighty", "Attack Bonus", "", 0.5, 2.0, 50]
```

**`RECS`**: one row per recipe, with a name, category (meal or elixir), and an ingredient expression such as `Raw Meat + Hylian Rice`. Expressions support alternatives (`or`) and groups like "any mushroom" or "any fish", which the app resolves against `MATS`.

### Tooltip descriptions

By default, tooltips show a generated summary. To override with your own text for specific items, add entries to `descriptions.js`:

```js
const DESCRIPTIONS = {
  "Apple": "Paste the description here."
};
```

### Ingredient images

Tile images are matched to ingredients by name, ignoring the numeric prefix, punctuation, and case. For example, `03-Apple.png` matches "Apple". After adding or renaming images, regenerate `images.js` from the project folder:

```bash
(echo "const IMAGES=["; ls *.png | sed 's/.*/"&",/'; echo "];") > images.js
```

Ingredients without a matching image show their initials instead, so the app works without any images at all.

## How results are calculated

- **Sell price:** the sum of ingredient sell values multiplied by a factor based on item count (1: 1.5, 2: 1.8, 3: 2.1, 4: 2.4, 5: 2.8), rounded down, then up to the next 10. Failed recipes sell for 2.
- **Hearts:** cooking doubles each ingredient's raw hearts, capped at your total. Hearty dishes fully restore and add their points as temporary hearts. Elixirs restore none.
- **Effects:** points add up, one effect per pot (mixed effects cancel out), with tiers based on wiki thresholds.
- **Duration:** each ingredient adds its listed time. Extra copies of pantry items and dragon parts add 30 s. Capped at 30:00. Energizing is capped by your stamina.
- **Finder:** to stay fast, **Look Up** only combines the best owned candidates (those carrying the chosen effect plus top fillers by price, hearts, and duration). It only considers ingredients currently shown, so filters and recipe search apply.

Known limitation: the game's possible buy-price cap isn't modeled. The same explanation is available in the app under **How results are worked out**.

## Roadmap

- [ ] *Tears of the Kingdom* support, with a game selector
- [ ] Separate data per game (for example `data/botw/` and `data/totk/`) so the shared logic can load either dataset
- [ ] Fill in official item descriptions

## Credits

- Inspired by [botwcooking.com](https://botwcooking.com).
- Ingredient and recipe data compiled from community fan and wiki sources.
  - [https://www.zeldadungeon.net/wiki/Breath_of_the_Wild_Materials](https://www.zeldadungeon.net/wiki/Breath_of_the_Wild_Materials)
  - [https://game8.co/games/Zelda-Breath-of-the-Wild/archives/292496](https://game8.co/games/Zelda-Breath-of-the-Wild/archives/292496)
  - [https://www.reddit.com/r/Breath_of_the_Wild/comments/kq8ccs/all_botw_recipes_in_one_image/](https://www.reddit.com/r/Breath_of_the_Wild/comments/kq8ccs/all_botw_recipes_in_one_image/)
  - [https://www.zeldadungeon.net/wiki/Breath_of_the_Wild_Recipes](https://www.zeldadungeon.net/wiki/Breath_of_the_Wild_Recipes)

## Disclaimer

This is an unofficial fan project and is not affiliated with or endorsed by Nintendo. *The Legend of Zelda* and *Breath of the Wild* are trademarks of Nintendo. Game names, data, and artwork belong to their respective owners.
