// Weapon and shield data for armor.html (the "Armor & Weapons" page).
//
// Shape: WEAPONS[game] = { champion: [ weapon ], ancient: [ weapon ] }   (TotK has no ancient list)
//   n      item name. Also the key the page uses to remember "I own this".
//   t      one (one-handed) | two (two-handed) | spear | bow | shield
//   req    materials for ONE repair (champion) or ONE purchase (ancient): [ingredient, quantity].
//          Ingredient names match data-botw.js and data-totk.js, so the page can look up the quantities you
//          saved on the cooking pot page.
//   base   champion only: the base weapon the smith also needs. It is a weapon, not an ingredient, so it is
//          listed but not checked against your saved quantities.
//   who    champion only: who remakes it, and where.
//   note   optional extra line shown on the card.
//   rupees ancient only: the price per item. Shown but never checked (the app does not track rupees).
//
// Groups
//   champion  The four Champions' weapons plus Urbosa's Daybreaker (and, in BotW, the Ceremonial Trident). If one
//             breaks, the blacksmith remakes it for the materials listed.
//   ancient   Ancient Soldier Gear forged by Cherry at the Akkala Ancient Tech Lab (Breath of the Wild only).
//             Cherry also forges the Ancient armor set, which lives on the armor list. The three arrow recipes are
//             included; they also need ordinary Arrows, which the app does not track, so those are listed in `extra`
//             and not checked.
//   extra     optional untracked items a recipe also needs: [name, quantity]. Shown on the card, never checked.
//   img       optional image name override (letters only are compared), so the three arrows can have distinct files:
//             BotW-AncientArrow.png, BotW-AncientArrowThree.png and BotW-AncientArrowFive.png.
//
// Sources (not verified in game by the author)
//   BotW champion: the smiths' in-game dialogue as quoted on Zelda Wiki (the Buliara, Daybreaker, Flint and Diamond
//                  pages), cross-checked against GameWith's "How To Repair Weapons" guide. The Ceremonial Trident
//                  (Zora Spear and 5 Flint, no Diamond) comes from GameWith and TheGamer only.
//   BotW ancient:  Zelda Dungeon's Cherry page (https://www.zeldadungeon.net/wiki/Cherry). Other wikis disagree on the
//                  Ancient Shield (one lists 10 Gears, 5 Springs and 3 Cores); Zelda Dungeon's figures are used.
//   TotK champion: Game8's "How to Get All Champion Weapons" page, cross-checked against GamerGuides for the
//                  Scimitar of the Seven and Daybreaker. Isha forges those two together, so the 10 Flint and 4 Diamonds
//                  cover both and are listed on each card.
const WEAPONS = {
  "BotW": {
    "champion": [
      { "n": "Lightscale Trident", "t": "spear", "base": "Zora Spear", "req": [["Diamond", 1], ["Flint", 5]], "who": "Dento, Zora's Domain" },
      { "n": "Ceremonial Trident", "t": "spear", "base": "Zora Spear", "req": [["Flint", 5]], "who": "Dento, Zora's Domain" },
      { "n": "Boulder Breaker", "t": "two", "base": "Cobble Crusher", "req": [["Diamond", 1], ["Flint", 5]], "who": "Rohan, Goron City" },
      { "n": "Great Eagle Bow", "t": "bow", "base": "Swallow Bow", "req": [["Diamond", 1], ["Wood", 5]], "who": "Harth, Rito Village" },
      { "n": "Scimitar of the Seven", "t": "one", "base": "Gerudo Scimitar", "req": [["Diamond", 1], ["Flint", 5]], "who": "Buliara, Royal Palace in Gerudo Town" },
      { "n": "Daybreaker", "t": "shield", "base": "Gerudo Shield", "req": [["Diamond", 1], ["Flint", 5]], "who": "Buliara, Royal Palace in Gerudo Town" }
    ],
    "ancient": [
      { "n": "Ancient Arrow", "t": "arrow", "rupees": 90, "req": [["Ancient Screw", 2], ["Ancient Shaft", 1]], "extra": [["Arrow", 1]], "img": "Ancient Arrow" },
      { "n": "Ancient Arrow \u00d73", "t": "arrow", "rupees": 250, "req": [["Ancient Screw", 6], ["Ancient Shaft", 3]], "extra": [["Arrow", 3]], "img": "Ancient Arrow Three" },
      { "n": "Ancient Arrow \u00d75", "t": "arrow", "rupees": 400, "req": [["Ancient Spring", 5], ["Ancient Shaft", 5]], "extra": [["Arrow", 5]], "img": "Ancient Arrow Five" },
      { "n": "Ancient Short Sword", "t": "one", "rupees": 1000, "req": [["Ancient Spring", 15], ["Ancient Shaft", 5], ["Ancient Core", 2]] },
      { "n": "Ancient Bladesaw", "t": "two", "rupees": 1000, "req": [["Ancient Screw", 15], ["Ancient Shaft", 5], ["Ancient Core", 2]] },
      { "n": "Ancient Spear", "t": "spear", "rupees": 1000, "req": [["Ancient Gear", 15], ["Ancient Shaft", 5], ["Ancient Core", 2]] },
      { "n": "Ancient Bow", "t": "bow", "rupees": 1000, "req": [["Ancient Gear", 10], ["Ancient Spring", 15], ["Giant Ancient Core", 1]] },
      { "n": "Ancient Shield", "t": "shield", "rupees": 1000, "req": [["Ancient Gear", 10], ["Ancient Spring", 15], ["Giant Ancient Core", 1]] }
    ]
  },
  "TotK": {
    "champion": [
      { "n": "Lightscale Trident", "t": "spear", "base": "Zora Spear", "req": [["Diamond", 3], ["Flint", 5]], "who": "Dento, Zora's Domain" },
      { "n": "Boulder Breaker", "t": "two", "base": "Cobble Crusher", "req": [["Diamond", 3], ["Flint", 5]], "who": "Fugo, Rohan's Forge in Goron City" },
      { "n": "Great Eagle Bow", "t": "bow", "base": "Swallow Bow", "req": [["Diamond", 3], ["Wood", 5]], "who": "Teba, Rito Village" },
      { "n": "Scimitar of the Seven", "t": "one", "base": "Gerudo Scimitar", "req": [["Diamond", 4], ["Flint", 10]], "who": "Isha, Gerudo Town", "base2": "Gerudo Shield", "note": "Isha forges this and the Daybreaker together, so these materials (and both base weapons) cover both." },
      { "n": "Daybreaker", "t": "shield", "base": "Gerudo Shield", "req": [["Diamond", 4], ["Flint", 10]], "who": "Isha, Gerudo Town", "base2": "Gerudo Scimitar", "note": "Isha forges this and the Scimitar of the Seven together, so these materials (and both base weapons) cover both." }
    ]
  }
};
