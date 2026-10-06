// Better Off: Open Deals (v8) engine. UMD: window.BO8 in browser, module.exports in node.
// Pure functions over a market (embedded by embed.js) and a game state object.
// No em-dashes, plain words in any student-facing string.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BO8 = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // MARKET_DATA is replaced by embed.js with the contents of market.json.
  // Left null here so the raw engine file can also run in node against a
  // market.json sitting next to it (test/sim use that path).
  var MARKET_DATA = {
  "firms": [
    {
      "id": "G1",
      "name": "Cascade Canopy Co",
      "tier": "grower",
      "plain": "a fresh-frozen grower: whole plants frozen at cut, prized for rosin",
      "art": "mj/postcard_grower_2_0.png"
    },
    {
      "id": "G2",
      "name": "Blue Mountain Buds",
      "tier": "grower",
      "plain": "a living-soil craft grower: small batches, top-shelf buds",
      "art": "mj/postcard_grower_3_0.png"
    },
    {
      "id": "G3",
      "name": "Willamette Grow Works",
      "tier": "grower",
      "plain": "an outdoor grower: cheapest biomass, the most volume",
      "art": "mj/postcard_grower_4_0.png"
    },
    {
      "id": "G4",
      "name": "High Desert Harvest",
      "tier": "grower",
      "plain": "a rare-genetics grower: strains nobody else has",
      "art": "mj/postcard_grower_5_0.png"
    },
    {
      "id": "G5",
      "name": "Sasquatch Seedlings",
      "tier": "grower",
      "plain": "a certified organic grower: clean and green",
      "art": "mj/postcard_grower_6_0.png"
    },
    {
      "id": "G6",
      "name": "Evergreen Acres",
      "tier": "grower",
      "plain": "a year-round greenhouse grower: steady, uniform flower",
      "art": "mj/postcard_grower_7_0.png"
    },
    {
      "id": "P1",
      "name": "Pine Ridge Processing",
      "tier": "processor",
      "plain": "a co-packer: makes products under other companies' brands",
      "art": "mj/postcard_processor_2_0.png"
    },
    {
      "id": "P2",
      "name": "Cedar Creek Extracts",
      "tier": "processor",
      "plain": "a distillate and vape cartridge maker",
      "art": "mj/postcard_processor_3_0.png"
    },
    {
      "id": "P3",
      "name": "North Coast Concentrates",
      "tier": "processor",
      "plain": "a solventless rosin press, no chemicals used",
      "art": "mj/postcard_processor_4_0.png"
    },
    {
      "id": "P4",
      "name": "Timberline Terpenes",
      "tier": "processor",
      "plain": "a licensed edibles kitchen",
      "art": "mj/postcard_processor_5_0.png"
    },
    {
      "id": "P5",
      "name": "Columbia Gorge Processing",
      "tier": "processor",
      "plain": "an automated pre-roll line",
      "art": "mj/postcard_processor_2_1.png"
    },
    {
      "id": "R1",
      "name": "The Green Door",
      "tier": "retailer",
      "plain": "a downtown flagship shop: premium shelf, big spenders",
      "art": "mj/postcard_retail_2_0.png"
    },
    {
      "id": "R2",
      "name": "Canopy Corner",
      "tier": "retailer",
      "plain": "a shop with a loyalty program that knows what its shoppers rebuy",
      "art": "mj/postcard_retail_3_0.png"
    },
    {
      "id": "R3",
      "name": "High Note Dispensary",
      "tier": "retailer",
      "plain": "a wellness-focused shop",
      "art": "mj/postcard_retail_4_0.png"
    },
    {
      "id": "R4",
      "name": "Trailhead Cannabis",
      "tier": "retailer",
      "plain": "a highway shop on the tourist corridor: volume traffic",
      "art": "mj/postcard_retail_5_0.png"
    },
    {
      "id": "R5",
      "name": "Basecamp Buds",
      "tier": "retailer",
      "plain": "a delivery-only shop",
      "art": "mj/postcard_retail_6_0.png"
    },
    {
      "id": "R6",
      "name": "Firelight Dispensary",
      "tier": "retailer",
      "plain": "a shop with a loyal medical patient base",
      "art": "mj/postcard_retail_7_0.png"
    }
  ],
  "fitGP": {
    "G1": {
      "P1": 100,
      "P2": 0,
      "P3": 200,
      "P4": 0,
      "P5": 0
    },
    "G2": {
      "P1": 100,
      "P2": 0,
      "P3": 0,
      "P4": 200,
      "P5": 0
    },
    "G3": {
      "P1": 0,
      "P2": 200,
      "P3": 0,
      "P4": 0,
      "P5": 100
    },
    "G4": {
      "P1": 0,
      "P2": 100,
      "P3": 0,
      "P4": 0,
      "P5": 200
    },
    "G5": {
      "P1": 200,
      "P2": 0,
      "P3": 100,
      "P4": 0,
      "P5": 0
    },
    "G6": {
      "P1": 200,
      "P2": 0,
      "P3": 0,
      "P4": 100,
      "P5": 0
    }
  },
  "fitPR": {
    "P1": {
      "R1": 200,
      "R2": 0,
      "R3": 0,
      "R4": 0,
      "R5": 100,
      "R6": 0
    },
    "P2": {
      "R1": 0,
      "R2": 0,
      "R3": 0,
      "R4": 200,
      "R5": 0,
      "R6": 0
    },
    "P3": {
      "R1": 0,
      "R2": 0,
      "R3": 200,
      "R4": 0,
      "R5": 200,
      "R6": 0
    },
    "P4": {
      "R1": 0,
      "R2": 0,
      "R3": 0,
      "R4": 0,
      "R5": 0,
      "R6": 200
    },
    "P5": {
      "R1": 0,
      "R2": 200,
      "R3": 0,
      "R4": 0,
      "R5": 0,
      "R6": 0
    }
  },
  "recipes": [
    {
      "id": "RECIPE_A",
      "label": "Downtown flagship line",
      "grower": "G1",
      "processor": "P1",
      "retailer": "R1",
      "pay": {
        "G1": 100,
        "P1": 100,
        "R1": 100
      }
    },
    {
      "id": "RECIPE_B",
      "label": "Live rosin wellness",
      "grower": "G1",
      "processor": "P3",
      "retailer": "R1",
      "pay": {
        "G1": 100,
        "P3": 100,
        "R1": 100
      }
    },
    {
      "id": "RECIPE_C",
      "label": "Craft carts, loyalty program",
      "grower": "G2",
      "processor": "P1",
      "retailer": "R5",
      "pay": {
        "G2": 100,
        "P1": 100,
        "R5": 100
      }
    },
    {
      "id": "RECIPE_D",
      "label": "Edibles on the tourist corridor",
      "grower": "G2",
      "processor": "P4",
      "retailer": "R3",
      "pay": {
        "G2": 100,
        "P4": 100,
        "R3": 100
      }
    },
    {
      "id": "RECIPE_E",
      "label": "Highway volume blend",
      "grower": "G3",
      "processor": "P2",
      "retailer": "R4",
      "pay": {
        "G3": 100,
        "P2": 100,
        "R4": 100
      }
    },
    {
      "id": "RECIPE_F",
      "label": "Pre-roll volume run",
      "grower": "G3",
      "processor": "P5",
      "retailer": "R4",
      "pay": {
        "G3": 100,
        "P5": 100,
        "R4": 100
      }
    },
    {
      "id": "RECIPE_G",
      "label": "Rare-genetics pre-rolls",
      "grower": "G4",
      "processor": "P5",
      "retailer": "R5",
      "pay": {
        "G4": 100,
        "P5": 100,
        "R5": 100
      }
    },
    {
      "id": "RECIPE_H",
      "label": "Rare-genetics carts, loyalty program",
      "grower": "G4",
      "processor": "P2",
      "retailer": "R2",
      "pay": {
        "G4": 100,
        "P2": 100,
        "R2": 100
      }
    },
    {
      "id": "RECIPE_I",
      "label": "Greenhouse flagship line",
      "grower": "G5",
      "processor": "P1",
      "retailer": "R6",
      "pay": {
        "G5": 100,
        "P1": 100,
        "R6": 100
      }
    },
    {
      "id": "RECIPE_J",
      "label": "Organic rosin wellness",
      "grower": "G5",
      "processor": "P3",
      "retailer": "R3",
      "pay": {
        "G5": 100,
        "P3": 100,
        "R3": 100
      }
    },
    {
      "id": "RECIPE_K",
      "label": "Signature strain pre-rolls",
      "grower": "G6",
      "processor": "P5",
      "retailer": "R2",
      "pay": {
        "G6": 100,
        "P5": 100,
        "R2": 100
      }
    },
    {
      "id": "RECIPE_L",
      "label": "Greenhouse edibles",
      "grower": "G6",
      "processor": "P4",
      "retailer": "R6",
      "pay": {
        "G6": 100,
        "P4": 100,
        "R6": 100
      }
    }
  ],
  "blends": [
    {
      "id": "BLEND_1",
      "label": "Pine Ridge's house blend",
      "processor": "P1",
      "growers": [
        "G5",
        "G6"
      ],
      "pay": {
        "P1": 120,
        "G5": 40,
        "G6": 40
      }
    },
    {
      "id": "BLEND_2",
      "label": "Cedar Creek's house blend",
      "processor": "P2",
      "growers": [
        "G3",
        "G4"
      ],
      "pay": {
        "P2": 120,
        "G3": 40,
        "G4": 40
      }
    },
    {
      "id": "BLEND_3",
      "label": "North Coast's house blend",
      "processor": "P3",
      "growers": [
        "G1",
        "G5"
      ],
      "pay": {
        "P3": 120,
        "G1": 40,
        "G5": 40
      }
    },
    {
      "id": "BLEND_4",
      "label": "Timberline's house blend",
      "processor": "P4",
      "growers": [
        "G2",
        "G6"
      ],
      "pay": {
        "P4": 120,
        "G2": 40,
        "G6": 40
      }
    },
    {
      "id": "BLEND_5",
      "label": "Columbia Gorge's house blend",
      "processor": "P5",
      "growers": [
        "G3",
        "G4"
      ],
      "pay": {
        "P5": 120,
        "G3": 40,
        "G4": 40
      }
    }
  ],
  "menus": [
    {
      "id": "MENU_1",
      "label": "The Green Door's full menu",
      "retailer": "R1",
      "processors": [
        "P1",
        "P3"
      ],
      "pay": {
        "R1": 100,
        "P1": 40,
        "P3": 40
      }
    },
    {
      "id": "MENU_2",
      "label": "Canopy Corner's full menu",
      "retailer": "R2",
      "processors": [
        "P5",
        "P2"
      ],
      "pay": {
        "R2": 100,
        "P5": 40,
        "P2": 40
      }
    },
    {
      "id": "MENU_3",
      "label": "High Note's full menu",
      "retailer": "R3",
      "processors": [
        "P4",
        "P3"
      ],
      "pay": {
        "R3": 100,
        "P4": 40,
        "P3": 40
      }
    },
    {
      "id": "MENU_4",
      "label": "Trailhead's full menu",
      "retailer": "R4",
      "processors": [
        "P2",
        "P5"
      ],
      "pay": {
        "R4": 100,
        "P2": 40,
        "P5": 40
      }
    },
    {
      "id": "MENU_5",
      "label": "Basecamp's full menu",
      "retailer": "R5",
      "processors": [
        "P1",
        "P4"
      ],
      "pay": {
        "R5": 100,
        "P1": 40,
        "P4": 40
      }
    },
    {
      "id": "MENU_6",
      "label": "Firelight's full menu",
      "retailer": "R6",
      "processors": [
        "P4",
        "P1"
      ],
      "pay": {
        "R6": 100,
        "P4": 40,
        "P1": 40
      }
    }
  ],
  "facts": [
    {
      "id": "F01",
      "text": "The Green Door sells out fastest when it is stocked by Pine Ridge Processing.",
      "combo": "RECIPE_A",
      "holders": [
        "G2"
      ]
    },
    {
      "id": "F02",
      "text": "Pine Ridge Processing runs its best batches on Cascade Canopy Co's crop.",
      "combo": "RECIPE_A",
      "holders": [
        "G3"
      ]
    },
    {
      "id": "F03",
      "text": "The Green Door sells out fastest when it is stocked by North Coast Concentrates.",
      "combo": "RECIPE_B",
      "holders": [
        "G4"
      ]
    },
    {
      "id": "F04",
      "text": "North Coast Concentrates runs its best batches on Cascade Canopy Co's crop.",
      "combo": "RECIPE_B",
      "holders": [
        "G5"
      ]
    },
    {
      "id": "F05",
      "text": "Basecamp Buds sells out fastest when it is stocked by Pine Ridge Processing.",
      "combo": "RECIPE_C",
      "holders": [
        "G1"
      ]
    },
    {
      "id": "F06",
      "text": "Pine Ridge Processing runs its best batches on Blue Mountain Buds's crop.",
      "combo": "RECIPE_C",
      "holders": [
        "G6"
      ]
    },
    {
      "id": "F07",
      "text": "High Note Dispensary sells out fastest when it is stocked by Timberline Terpenes.",
      "combo": "RECIPE_D",
      "holders": [
        "P1"
      ]
    },
    {
      "id": "F08",
      "text": "Timberline Terpenes runs its best batches on Blue Mountain Buds's crop.",
      "combo": "RECIPE_D",
      "holders": [
        "P2"
      ]
    },
    {
      "id": "F09",
      "text": "Trailhead Cannabis sells out fastest when it is stocked by Cedar Creek Extracts.",
      "combo": "RECIPE_E",
      "holders": [
        "P3"
      ]
    },
    {
      "id": "F10",
      "text": "Cedar Creek Extracts runs its best batches on Willamette Grow Works's crop.",
      "combo": "RECIPE_E",
      "holders": [
        "P4"
      ]
    },
    {
      "id": "F11",
      "text": "Trailhead Cannabis sells out fastest when it is stocked by Columbia Gorge Processing.",
      "combo": "RECIPE_F",
      "holders": [
        "R1"
      ]
    },
    {
      "id": "F12",
      "text": "Columbia Gorge Processing runs its best batches on Willamette Grow Works's crop.",
      "combo": "RECIPE_F",
      "holders": [
        "R2"
      ]
    },
    {
      "id": "F13",
      "text": "Basecamp Buds sells out fastest when it is stocked by Columbia Gorge Processing.",
      "combo": "RECIPE_G",
      "holders": [
        "R3"
      ]
    },
    {
      "id": "F14",
      "text": "Columbia Gorge Processing runs its best batches on High Desert Harvest's crop.",
      "combo": "RECIPE_G",
      "holders": [
        "R4"
      ]
    },
    {
      "id": "F15",
      "text": "Canopy Corner sells out fastest when it is stocked by Cedar Creek Extracts.",
      "combo": "RECIPE_H",
      "holders": [
        "P5"
      ]
    },
    {
      "id": "F16",
      "text": "Cedar Creek Extracts runs its best batches on High Desert Harvest's crop.",
      "combo": "RECIPE_H",
      "holders": [
        "R5"
      ]
    },
    {
      "id": "F17",
      "text": "Firelight Dispensary sells out fastest when it is stocked by Pine Ridge Processing.",
      "combo": "RECIPE_I",
      "holders": [
        "G1"
      ]
    },
    {
      "id": "F18",
      "text": "Pine Ridge Processing runs its best batches on Sasquatch Seedlings's crop.",
      "combo": "RECIPE_I",
      "holders": [
        "G2"
      ]
    },
    {
      "id": "F19",
      "text": "High Note Dispensary sells out fastest when it is stocked by North Coast Concentrates.",
      "combo": "RECIPE_J",
      "holders": [
        "R6"
      ]
    },
    {
      "id": "F20",
      "text": "North Coast Concentrates runs its best batches on Sasquatch Seedlings's crop.",
      "combo": "RECIPE_J",
      "holders": [
        "G3"
      ]
    },
    {
      "id": "F21",
      "text": "Canopy Corner sells out fastest when it is stocked by Columbia Gorge Processing.",
      "combo": "RECIPE_K",
      "holders": [
        "G4"
      ]
    },
    {
      "id": "F22",
      "text": "Columbia Gorge Processing runs its best batches on Evergreen Acres's crop.",
      "combo": "RECIPE_K",
      "holders": [
        "G5"
      ]
    },
    {
      "id": "F23",
      "text": "Firelight Dispensary sells out fastest when it is stocked by Timberline Terpenes.",
      "combo": "RECIPE_L",
      "holders": [
        "P1"
      ]
    },
    {
      "id": "F24",
      "text": "Timberline Terpenes runs its best batches on Evergreen Acres's crop.",
      "combo": "RECIPE_L",
      "holders": [
        "P2"
      ]
    },
    {
      "id": "F25",
      "text": "Pine Ridge Processing gets a bonus batch when it blends Sasquatch Seedlings's crop with another grower's.",
      "combo": "BLEND_1",
      "holders": [
        "P3"
      ]
    },
    {
      "id": "F26",
      "text": "Pine Ridge Processing gets a bonus batch when it blends Evergreen Acres's crop with another grower's.",
      "combo": "BLEND_1",
      "holders": [
        "P4"
      ]
    },
    {
      "id": "F27",
      "text": "Cedar Creek Extracts gets a bonus batch when it blends Willamette Grow Works's crop with another grower's.",
      "combo": "BLEND_2",
      "holders": [
        "G6"
      ]
    },
    {
      "id": "F28",
      "text": "Cedar Creek Extracts gets a bonus batch when it blends High Desert Harvest's crop with another grower's.",
      "combo": "BLEND_2",
      "holders": [
        "P5"
      ]
    },
    {
      "id": "F29",
      "text": "North Coast Concentrates gets a bonus batch when it blends Cascade Canopy Co's crop with another grower's.",
      "combo": "BLEND_3",
      "holders": [
        "R1"
      ]
    },
    {
      "id": "F30",
      "text": "North Coast Concentrates gets a bonus batch when it blends Sasquatch Seedlings's crop with another grower's.",
      "combo": "BLEND_3",
      "holders": [
        "R2"
      ]
    },
    {
      "id": "F31",
      "text": "Timberline Terpenes gets a bonus batch when it blends Blue Mountain Buds's crop with another grower's.",
      "combo": "BLEND_4",
      "holders": [
        "R3"
      ]
    },
    {
      "id": "F32",
      "text": "Timberline Terpenes gets a bonus batch when it blends Evergreen Acres's crop with another grower's.",
      "combo": "BLEND_4",
      "holders": [
        "R4"
      ]
    },
    {
      "id": "F33",
      "text": "Columbia Gorge Processing gets a bonus batch when it blends Willamette Grow Works's crop with another grower's.",
      "combo": "BLEND_5",
      "holders": [
        "R5"
      ]
    },
    {
      "id": "F34",
      "text": "Columbia Gorge Processing gets a bonus batch when it blends High Desert Harvest's crop with another grower's.",
      "combo": "BLEND_5",
      "holders": [
        "R6"
      ]
    },
    {
      "id": "F35",
      "text": "The Green Door's shoppers buy more when Pine Ridge Processing is on the menu with another processor.",
      "combo": "MENU_1",
      "holders": [
        "G1"
      ]
    },
    {
      "id": "F36",
      "text": "The Green Door's shoppers buy more when North Coast Concentrates is on the menu with another processor.",
      "combo": "MENU_1",
      "holders": [
        "G2"
      ]
    },
    {
      "id": "F37",
      "text": "Canopy Corner's shoppers buy more when Columbia Gorge Processing is on the menu with another processor.",
      "combo": "MENU_2",
      "holders": [
        "G3"
      ]
    },
    {
      "id": "F38",
      "text": "Canopy Corner's shoppers buy more when Cedar Creek Extracts is on the menu with another processor.",
      "combo": "MENU_2",
      "holders": [
        "G4"
      ]
    },
    {
      "id": "F39",
      "text": "High Note Dispensary's shoppers buy more when Timberline Terpenes is on the menu with another processor.",
      "combo": "MENU_3",
      "holders": [
        "G5"
      ]
    },
    {
      "id": "F40",
      "text": "High Note Dispensary's shoppers buy more when North Coast Concentrates is on the menu with another processor.",
      "combo": "MENU_3",
      "holders": [
        "G6"
      ]
    },
    {
      "id": "F41",
      "text": "Trailhead Cannabis's shoppers buy more when Cedar Creek Extracts is on the menu with another processor.",
      "combo": "MENU_4",
      "holders": [
        "P1"
      ]
    },
    {
      "id": "F42",
      "text": "Trailhead Cannabis's shoppers buy more when Columbia Gorge Processing is on the menu with another processor.",
      "combo": "MENU_4",
      "holders": [
        "P3"
      ]
    },
    {
      "id": "F43",
      "text": "Basecamp Buds's shoppers buy more when Pine Ridge Processing is on the menu with another processor.",
      "combo": "MENU_5",
      "holders": [
        "P2"
      ]
    },
    {
      "id": "F44",
      "text": "Basecamp Buds's shoppers buy more when Timberline Terpenes is on the menu with another processor.",
      "combo": "MENU_5",
      "holders": [
        "P5"
      ]
    },
    {
      "id": "F45",
      "text": "Firelight Dispensary's shoppers buy more when Timberline Terpenes is on the menu with another processor.",
      "combo": "MENU_6",
      "holders": [
        "R1"
      ]
    },
    {
      "id": "F46",
      "text": "Firelight Dispensary's shoppers buy more when Pine Ridge Processing is on the menu with another processor.",
      "combo": "MENU_6",
      "holders": [
        "R2"
      ]
    }
  ],
  "ownFragments": {
    "G1": {
      "combo": "BLEND_3",
      "text": "North Coast Concentrates gets a bonus batch when it blends Cascade Canopy Co's crop with another grower's."
    },
    "G2": {
      "combo": "BLEND_4",
      "text": "Timberline Terpenes gets a bonus batch when it blends Blue Mountain Buds's crop with another grower's."
    },
    "G3": {
      "combo": "BLEND_2",
      "text": "Cedar Creek Extracts gets a bonus batch when it blends Willamette Grow Works's crop with another grower's."
    },
    "G4": {
      "combo": "BLEND_2",
      "text": "Cedar Creek Extracts gets a bonus batch when it blends Willamette Grow Works's crop with another grower's."
    },
    "G5": {
      "combo": "BLEND_1",
      "text": "Pine Ridge Processing gets a bonus batch when it blends Sasquatch Seedlings's crop with another grower's."
    },
    "G6": {
      "combo": "BLEND_1",
      "text": "Pine Ridge Processing gets a bonus batch when it blends Sasquatch Seedlings's crop with another grower's."
    },
    "P1": {
      "combo": "BLEND_1",
      "text": "Pine Ridge Processing gets a bonus batch when it blends Sasquatch Seedlings's crop with another grower's."
    },
    "P2": {
      "combo": "BLEND_2",
      "text": "Cedar Creek Extracts gets a bonus batch when it blends Willamette Grow Works's crop with another grower's."
    },
    "P3": {
      "combo": "BLEND_3",
      "text": "North Coast Concentrates gets a bonus batch when it blends Cascade Canopy Co's crop with another grower's."
    },
    "P4": {
      "combo": "BLEND_4",
      "text": "Timberline Terpenes gets a bonus batch when it blends Blue Mountain Buds's crop with another grower's."
    },
    "P5": {
      "combo": "BLEND_5",
      "text": "Columbia Gorge Processing gets a bonus batch when it blends Willamette Grow Works's crop with another grower's."
    },
    "R1": {
      "combo": "MENU_1",
      "text": "The Green Door's shoppers buy more when Pine Ridge Processing is on the menu with another processor."
    },
    "R2": {
      "combo": "MENU_2",
      "text": "Canopy Corner's shoppers buy more when Columbia Gorge Processing is on the menu with another processor."
    },
    "R3": {
      "combo": "MENU_3",
      "text": "High Note Dispensary's shoppers buy more when Timberline Terpenes is on the menu with another processor."
    },
    "R4": {
      "combo": "MENU_4",
      "text": "Trailhead Cannabis's shoppers buy more when Cedar Creek Extracts is on the menu with another processor."
    },
    "R5": {
      "combo": "MENU_5",
      "text": "Basecamp Buds's shoppers buy more when Pine Ridge Processing is on the menu with another processor."
    },
    "R6": {
      "combo": "MENU_6",
      "text": "Firelight Dispensary's shoppers buy more when Timberline Terpenes is on the menu with another processor."
    }
  },
  "const": {
    "AI_CROP_BID_START": 400,
    "AI_CROP_ASK": 550,
    "AI_PRODUCT_BID": 1000,
    "AI_PRODUCT_ASK": 1250,
    "RETAIL_PRICE": 1550,
    "PROCESSING_COST": 150,
    "GROWER_CAPACITY": 2,
    "PROCESSOR_CAPACITY": 2,
    "RETAILER_CAPACITY": 2,
    "STANDALONE_GROWER": 800,
    "STANDALONE_PROCESSOR": 600,
    "STANDALONE_RETAILER": 600,
    "CROP_LINK_BASE": 150,
    "PRODUCT_LINK_BASE": 250,
    "RECIPE_BONUS_EACH": 100,
    "BLEND_PROCESSOR_BONUS": 120,
    "BLEND_GROWER_BONUS": 40,
    "MENU_RETAILER_BONUS": 100,
    "MENU_PROCESSOR_BONUS": 40,
    "STARTING_CASH": 600,
    "MAX_PAY": 1500,
    "DECAY_HOLD_SECONDS": 480,
    "DECAY_STEP_SECONDS": 180,
    "DECAY_STEP_AMOUNT": 15,
    "DECAY_FLOOR": 300,
    "ROOM_GOAL_PCT": 40,
    "ROOM_GOAL_DEFAULT": 65,
    "SLIDERS": {
      "crop": {
        "price": [
          350,
          650,
          25,
          475
        ]
      },
      "product": {
        "price": [
          950,
          1300,
          25,
          1125
        ]
      },
      "qty": [
        1,
        2
      ],
      "penalty": [
        0,
        300,
        25,
        0
      ]
    },
    "TEMPLATES": {
      "sell": {
        "label": "Sell",
        "help": "Sell your crop to a processor, or your product to a retailer, at a price you both see.",
        "fields": {
          "qty": [
            1,
            2
          ],
          "penalty": [
            0,
            300,
            25,
            0
          ]
        }
      },
      "chain": {
        "label": "Chain deal",
        "help": "Lock in a whole grower -> processor -> retailer chain in one deal, so the recipe bonus can fire.",
        "fields": {
          "cropPrice": [
            350,
            650,
            25,
            475
          ],
          "productPrice": [
            950,
            1300,
            25,
            1125
          ],
          "penalty": [
            0,
            300,
            25,
            0
          ]
        }
      },
      "fact": {
        "label": "Sell a fact",
        "help": "Sell something you know about a combo to another firm for a price, paid now.",
        "fields": {
          "price": [
            0,
            300,
            25,
            50
          ]
        }
      },
      "pool": {
        "label": "Profit pool (merger)",
        "help": "Agree to add your final gains together and split them by a fixed share. Binding: cannot be broken.",
        "fields": {
          "myShare": [
            10,
            90,
            10,
            50
          ]
        }
      }
    }
  },
  "maxTotalGain": 10900,
  "perFirmMaxGain": {
    "G1": 840,
    "G2": 840,
    "G3": 880,
    "G4": 880,
    "G5": 880,
    "G6": 780,
    "P1": 1500,
    "P2": 1500,
    "P3": 1500,
    "P4": 1500,
    "P5": 1460,
    "R1": 1000,
    "R2": 1000,
    "R3": 1000,
    "R4": 1000,
    "R5": 900,
    "R6": 1000
  }
};

  function loadMarket() {
    if (MARKET_DATA) return MARKET_DATA;
    if (typeof require === 'function') {
      try {
        return require('./market.json');
      } catch (e) {
        throw new Error('BO8: no embedded market and no market.json found next to the engine');
      }
    }
    throw new Error('BO8: no market data embedded');
  }

  var MARKET = loadMarket();
  var CONST = MARKET.const;

  var FIRM_BY_ID = {};
  MARKET.firms.forEach(function (f) { FIRM_BY_ID[f.id] = f; });

  var FACT_BY_ID = {};
  MARKET.facts.forEach(function (f) { FACT_BY_ID[f.id] = f; });

  var RECIPES_BY_GPR = {}; // "g|p|r" -> recipe
  MARKET.recipes.forEach(function (r) { RECIPES_BY_GPR[r.grower + '|' + r.processor + '|' + r.retailer] = r; });

  function firmTier(id) {
    var f = FIRM_BY_ID[id];
    return f ? f.tier : null;
  }

  // Student-facing name and money formatting, used in every ledger label and
  // orderOptions consequence string: firm names (never raw ids), and
  // thousands-comma money ("$1,125k", "-$150k").
  function nameOf(id) {
    var f = FIRM_BY_ID[id];
    return f ? f.name : id;
  }

  function fmtMoney(n) {
    var sign = n < 0 ? '-' : '';
    var abs = Math.abs(Math.round(n));
    return sign + '$' + abs.toLocaleString('en-US') + 'k';
  }

  function fitWords(n) {
    if (n >= 200) return 'a lot';
    if (n >= 100) return 'some';
    return null;
  }

  // ------------------------------------------------------------------
  // Cards
  // ------------------------------------------------------------------
  function cardFor(firmId, extraFactIds) {
    var firm = FIRM_BY_ID[firmId];
    if (!firm) throw new Error('BO8.cardFor: unknown firm ' + firmId);
    var fits = [];
    if (firm.tier === 'grower') {
      Object.keys(MARKET.fitGP[firmId] || {}).forEach(function (p) {
        var v = MARKET.fitGP[firmId][p];
        var w = fitWords(v);
        if (w) fits.push({ firmId: p, name: FIRM_BY_ID[p].name, words: w });
      });
    } else if (firm.tier === 'processor') {
      Object.keys(MARKET.fitPR[firmId] || {}).forEach(function (r) {
        var v = MARKET.fitPR[firmId][r];
        var w = fitWords(v);
        if (w) fits.push({ firmId: r, name: FIRM_BY_ID[r].name, words: w });
      });
    }
    var factIds = {};
    MARKET.facts.forEach(function (f) {
      if (f.holders.indexOf(firmId) !== -1) factIds[f.id] = true;
    });
    (extraFactIds || []).forEach(function (id) { factIds[id] = true; });
    var facts = Object.keys(factIds).map(function (id) {
      var f = FACT_BY_ID[id];
      return { id: f.id, text: f.text };
    });

    var fallback = [];
    if (firm.tier === 'grower') {
      fallback.push("You have two crops. Sell one to the AI for the current bid (starts at $" + CONST.AI_CROP_BID_START + "k, falls over time).");
    } else if (firm.tier === 'processor') {
      fallback.push('Buy crop from the AI for $' + CONST.AI_CROP_ASK + 'k, pay $' + CONST.PROCESSING_COST
        + 'k to process it, and sell the product to the AI for $' + CONST.AI_PRODUCT_BID + 'k: each slot nets $'
        + (CONST.AI_PRODUCT_BID - CONST.AI_CROP_ASK - CONST.PROCESSING_COST) + 'k on its own.');
    } else if (firm.tier === 'retailer') {
      fallback.push('Buy product from the AI for $' + CONST.AI_PRODUCT_ASK + 'k and sell it to shoppers for $' + CONST.RETAIL_PRICE + 'k.');
    }

    var ownFrag = MARKET.ownFragments && MARKET.ownFragments[firmId];

    return {
      id: firm.id,
      name: firm.name,
      tier: firm.tier,
      plain: firm.plain,
      art: firm.art,
      fallback: fallback,
      fits: fits,
      facts: facts,
      ownFragment: ownFrag ? { combo: ownFrag.combo, text: ownFrag.text } : null
    };
  }

  // ------------------------------------------------------------------
  // AI crop bid decay (perishable crop)
  // ------------------------------------------------------------------
  function aiCropBid(elapsedSec) {
    var start = CONST.AI_CROP_BID_START;
    var floor = CONST.DECAY_FLOOR;
    if (elapsedSec <= CONST.DECAY_HOLD_SECONDS) return start;
    var stepsElapsed = Math.floor((elapsedSec - CONST.DECAY_HOLD_SECONDS) / CONST.DECAY_STEP_SECONDS);
    var bid = start - stepsElapsed * CONST.DECAY_STEP_AMOUNT;
    return Math.max(floor, bid);
  }

  // ------------------------------------------------------------------
  // Reading validation
  // ------------------------------------------------------------------
  var VALID_CLAUSE_TYPES = { deliver: true, pay: true, share_fact: true, pool: true };

  function normId(id) {
    return (id || '').toString().trim().toUpperCase();
  }

  function validateReading(reading, ctx) {
    var errors = [];
    ctx = ctx || {};
    var parties = (ctx.parties || []).map(normId);
    var confirmedClauseIds = ctx.confirmedClauseIds || []; // "dealId:clauseId"
    var factsHeld = ctx.factsHeld || {}; // firmId -> [factIds]
    var cash = ctx.cash || {};
    var firmsInPool = (ctx.firmsInPool || []).map(normId); // firm ids already in another CONFIRMED pool

    if (!reading || typeof reading !== 'object') {
      return { ok: false, errors: ['The reading is not a valid object.'] };
    }
    if (!Array.isArray(reading.clauses)) {
      return { ok: false, errors: ['The reading has no clause list.'] };
    }

    var seenIds = {};
    var nowSpend = {}; // firmId -> total cash owed right now

    reading.clauses.forEach(function (c, idx) {
      var tag = 'Clause ' + (idx + 1) + ' (' + (c && c.id ? c.id : 'no id') + '): ';
      if (!c || typeof c !== 'object') {
        errors.push(tag + 'is not a valid clause.');
        return;
      }
      if (!c.id) {
        errors.push(tag + 'is missing an id.');
      } else if (seenIds[c.id]) {
        errors.push(tag + 'reuses clause id "' + c.id + '".');
      } else {
        seenIds[c.id] = true;
      }
      if (!VALID_CLAUSE_TYPES[c.type]) {
        errors.push(tag + 'has an unknown clause type "' + c.type + '".');
        return;
      }

      if (c.type === 'deliver') {
        var from = normId(c.from), to = normId(c.to);
        if (!FIRM_BY_ID[from]) errors.push(tag + 'the seller "' + c.from + '" is not a real firm.');
        if (!FIRM_BY_ID[to]) errors.push(tag + 'the buyer "' + c.to + '" is not a real firm.');
        if (parties.indexOf(from) === -1) errors.push(tag + from + ' is not a party to this deal.');
        if (parties.indexOf(to) === -1) errors.push(tag + to + ' is not a party to this deal.');
        if (c.good !== 'crop' && c.good !== 'product') {
          errors.push(tag + 'good must be "crop" or "product".');
        } else if (c.good === 'crop') {
          if (firmTier(from) !== 'grower' || firmTier(to) !== 'processor') {
            errors.push(tag + 'a crop can only move from a grower to a processor.');
          }
          if (!(c.qty === 1 || c.qty === 2)) errors.push(tag + 'a crop delivery must be quantity 1 or 2 (a grower has two crops).');
        } else if (c.good === 'product') {
          if (firmTier(from) !== 'processor' || firmTier(to) !== 'retailer') {
            errors.push(tag + 'a product can only move from a processor to a retailer.');
          }
          if (!(c.qty === 1 || c.qty === 2)) errors.push(tag + 'a product delivery must be quantity 1 or 2.');
          if (c.source) {
            var src = normId(c.source);
            if (!FIRM_BY_ID[src] || firmTier(src) !== 'grower') {
              errors.push(tag + 'source "' + c.source + '" is not a real grower.');
            }
          }
        }
        if (typeof c.price !== 'number' || c.price < 0) errors.push(tag + 'price must be a non-negative number.');
        if (c.penalty != null && (typeof c.penalty !== 'number' || c.penalty < 0)) errors.push(tag + 'penalty must be a non-negative number.');
      }

      if (c.type === 'pay') {
        var pfrom = normId(c.from), pto = normId(c.to);
        if (!FIRM_BY_ID[pfrom]) errors.push(tag + 'the payer "' + c.from + '" is not a real firm.');
        if (!FIRM_BY_ID[pto]) errors.push(tag + 'the payee "' + c.to + '" is not a real firm.');
        if (parties.indexOf(pfrom) === -1) errors.push(tag + pfrom + ' is not a party to this deal.');
        if (parties.indexOf(pto) === -1) errors.push(tag + pto + ' is not a party to this deal.');
        if (typeof c.amount !== 'number' || c.amount < 0) {
          errors.push(tag + 'amount must be a non-negative number.');
        } else if (c.amount > CONST.MAX_PAY) {
          errors.push(tag + 'amount cannot exceed $' + CONST.MAX_PAY + 'k (too large to be a real side payment).');
        }
        if (c.when !== 'now' && c.when !== 'on_condition') {
          errors.push(tag + 'when must be "now" or "on_condition".');
        }
        if (c.when === 'on_condition') {
          if (!c.condition || !c.condition.delivered) {
            errors.push(tag + 'an on_condition payment needs a condition.delivered clause id.');
          } else {
            var ref = c.condition.delivered;
            var inThisDeal = seenIdsHasOrWillHave(reading.clauses, ref);
            var inOtherDeal = confirmedClauseIds.indexOf(ref) !== -1;
            if (!inThisDeal && !inOtherDeal) {
              errors.push(tag + 'condition references unknown clause "' + ref + '".');
            }
          }
        }
        if (c.when === 'now') {
          nowSpend[pfrom] = (nowSpend[pfrom] || 0) + (typeof c.amount === 'number' ? c.amount : 0);
        }
      }

      if (c.type === 'share_fact') {
        var sfrom = normId(c.from), sto = normId(c.to);
        if (!FIRM_BY_ID[sfrom]) errors.push(tag + 'the giver "' + c.from + '" is not a real firm.');
        if (!FIRM_BY_ID[sto]) errors.push(tag + 'the receiver "' + c.to + '" is not a real firm.');
        if (parties.indexOf(sfrom) === -1) errors.push(tag + sfrom + ' is not a party to this deal.');
        if (parties.indexOf(sto) === -1) errors.push(tag + sto + ' is not a party to this deal.');
        if (!c.fact || !FACT_BY_ID[c.fact]) {
          errors.push(tag + 'fact "' + c.fact + '" does not exist.');
        } else {
          var held = factsHeld[sfrom] || [];
          if (held.indexOf(c.fact) === -1) {
            errors.push(tag + sfrom + ' does not hold fact ' + c.fact + ' and cannot share it.');
          }
        }
      }

      if (c.type === 'pool') {
        var pfirms = (c.firms || []).map(normId);
        if (pfirms.length !== 2) {
          errors.push(tag + 'a profit pool is between exactly two firms.');
        } else {
          var pa = pfirms[0], pb = pfirms[1];
          if (!FIRM_BY_ID[pa]) errors.push(tag + '"' + c.firms[0] + '" is not a real firm.');
          if (!FIRM_BY_ID[pb]) errors.push(tag + '"' + c.firms[1] + '" is not a real firm.');
          if (pa === pb) errors.push(tag + 'a firm cannot pool profits with itself.');
          if (parties.indexOf(pa) === -1) errors.push(tag + pa + ' is not a party to this deal.');
          if (parties.indexOf(pb) === -1) errors.push(tag + pb + ' is not a party to this deal.');
          if (firmsInPool.indexOf(pa) !== -1) errors.push(tag + pa + ' is already in another profit pool (one confirmed pool per firm max).');
          if (firmsInPool.indexOf(pb) !== -1) errors.push(tag + pb + ' is already in another profit pool (one confirmed pool per firm max).');
          var split = c.split || {};
          var shareA = split[pa], shareB = split[pb];
          if (typeof shareA !== 'number' || typeof shareB !== 'number') {
            errors.push(tag + 'split must give both firms a numeric share.');
          } else {
            if (shareA % 10 !== 0 || shareA < 10 || shareA > 90) errors.push(tag + 'a pool share must be 10-90 in steps of 10.');
            if (shareA + shareB !== 100) errors.push(tag + 'the two pool shares must add up to 100.');
          }
        }
      }
    });

    // cash check for "now" payments against current cash on hand
    Object.keys(nowSpend).forEach(function (fid) {
      var have = cash[fid];
      if (typeof have === 'number' && nowSpend[fid] > have) {
        errors.push(fid + ' does not have enough cash on hand ($' + have + 'k) for its "now" payments ($' + nowSpend[fid] + 'k).');
      }
    });

    // grower capacity check within this single reading (two crops total)
    var cropSellers = {};
    reading.clauses.forEach(function (c) {
      if (c.type === 'deliver' && c.good === 'crop') {
        var f = normId(c.from);
        cropSellers[f] = (cropSellers[f] || 0) + (c.qty || 1);
      }
    });
    Object.keys(cropSellers).forEach(function (f) {
      if (cropSellers[f] > CONST.GROWER_CAPACITY) {
        errors.push(f + ' is promising more crops in this deal than it has (' + CONST.GROWER_CAPACITY + ').');
      }
    });

    if (reading.deal_condition && reading.deal_condition.delivered) {
      var dref = reading.deal_condition.delivered;
      var inThisDeal2 = seenIdsHasOrWillHave(reading.clauses, dref);
      var inOtherDeal2 = confirmedClauseIds.indexOf(dref) !== -1;
      if (!inThisDeal2 && !inOtherDeal2) {
        errors.push('deal_condition references unknown clause "' + dref + '".');
      }
    }

    // The writer must actually be a party to at least one clause. A reading
    // that only moves money/goods between OTHER firms, with the writer as a
    // bystander, is not a deal the writer can confirm.
    if (ctx.writer) {
      var writer = normId(ctx.writer);
      var involvesWriter = reading.clauses.some(function (c) {
        if (!c || typeof c !== 'object') return false;
        if (c.type === 'pool') return (c.firms || []).map(normId).indexOf(writer) !== -1;
        return normId(c.from) === writer || normId(c.to) === writer;
      });
      if (!involvesWriter) {
        errors.push('This deal does not involve ' + writer + ', who is writing it.');
      }
    }

    return { ok: errors.length === 0, errors: errors };
  }

  function seenIdsHasOrWillHave(clauses, id) {
    return clauses.some(function (c) { return c && c.id === id; });
  }

  // ------------------------------------------------------------------
  // Resolution helpers
  // ------------------------------------------------------------------
  function emptyFirmLedger() {
    var out = {};
    MARKET.firms.forEach(function (f) {
      out[f.id] = { money: 0, gain: 0, standalone: standaloneFor(f.id), ledger: [] };
    });
    return out;
  }

  function standaloneFor(firmId) {
    var tier = firmTier(firmId);
    if (tier === 'grower') return CONST.STANDALONE_GROWER;
    if (tier === 'processor') return CONST.STANDALONE_PROCESSOR;
    if (tier === 'retailer') return CONST.STANDALONE_RETAILER;
    return 0;
  }

  function addLedger(firms, firmId, label, amount, kind) {
    firms[firmId].money += amount;
    firms[firmId].ledger.push({ label: label, amount: amount, kind: kind });
  }

  // Gather, for a confirmed deal, the set of clauses this engine must act on
  // (deliver/pay/share_fact), tagged with the deal id so ledger entries and
  // combo checks can reference "dealId:clauseId".
  function flattenClauses(deals) {
    var out = [];
    (deals || []).forEach(function (deal) {
      if (deal.status !== 'confirmed') return;
      var reading = deal.reading || {};
      (reading.clauses || []).forEach(function (c) {
        out.push({ deal: deal, clause: c, key: deal.id + ':' + c.id, seq: out.length });
      });
    });
    return out;
  }

  function isUnplayed(state, firmId) {
    var covered = (state && state.aiCovered) || [];
    var unplayed = (state && state.unplayed) || [];
    return covered.indexOf(firmId) !== -1 || unplayed.indexOf(firmId) !== -1;
  }

  function dealConditionSatisfied(deal, honoredKeys) {
    var reading = deal.reading || {};
    if (!reading.deal_condition || !reading.deal_condition.delivered) return true;
    var ref = reading.deal_condition.delivered;
    // ref may be a bare clause id (same deal) or "dealId:clauseId"
    if (ref.indexOf(':') === -1) ref = deal.id + ':' + ref;
    return !!honoredKeys[ref];
  }

  /**
   * Shared resolver. projectMode=true assumes every confirmed clause is
   * honored (no orders needed). projectMode=false uses state.orders to
   * decide honor/break per clause, defaulting to honor-everything-feasible.
   */
  function runResolution(state, projectMode) {
    var firms = emptyFirmLedger();
    var deliveries = [];
    var combosHit = [];
    var breaks = [];

    var flat = flattenClauses(state.deals);
    var deliverClauses = flat.filter(function (x) { return x.clause.type === 'deliver'; });
    var payClauses = flat.filter(function (x) { return x.clause.type === 'pay'; });

    var orders = state.orders || {};

    function wantsHonor(firmId, key) {
      if (projectMode) return true;
      var o = orders[firmId];
      if (!o || !o.choices || !(key in o.choices)) return true; // default: honor everything feasible
      return o.choices[key] === 'honor';
    }

    // ---- Step 1: growers' crop deliveries (up to GROWER_CAPACITY=2 crops each) ----
    var growerCropDeliveries = {}; // growerId -> array of chosen delivery entries (0-2)
    MARKET.firms.filter(function (f) { return f.tier === 'grower'; }).forEach(function (g) {
      growerCropDeliveries[g.id] = [];
    });

    var cropClausesByGrower = {};
    deliverClauses.filter(function (x) { return x.clause.good === 'crop'; }).forEach(function (x) {
      var g = normId(x.clause.from);
      (cropClausesByGrower[g] = cropClausesByGrower[g] || []).push(x);
    });

    Object.keys(cropClausesByGrower).forEach(function (g) {
      var candidates = cropClausesByGrower[g];
      var rankFor = (orders[g] && orders[g].rank) || [];
      candidates.sort(function (a, b) {
        var ia = rankFor.indexOf(a.key), ib = rankFor.indexOf(b.key);
        if (ia === -1) ia = 999;
        if (ib === -1) ib = 999;
        return ia - ib;
      });
      var lockedCount = ((state.aiCropLocks && state.aiCropLocks[g]) || []).length;
      var available = CONST.GROWER_CAPACITY - lockedCount;
      var used = 0;
      var chosen = [];
      candidates.forEach(function (cand) {
        var qty = cand.clause.qty || 1;
        if (!wantsHonor(g, cand.key)) {
          breaks.push({ key: cand.key, from: g, reason: 'grower honored a different crop delivery (or none)' });
          applyPenalty(firms, cand.clause, g, breaks);
          return;
        }
        if (used + qty > available) {
          breaks.push({ key: cand.key, from: g, reason: 'grower does not have enough crops left to honor this (capacity or already sold to the AI)' });
          applyPenalty(firms, cand.clause, g, breaks);
          return;
        }
        chosen.push(cand);
        used += qty;
      });
      growerCropDeliveries[g] = chosen;
    });

    // processor crop-receiving capacity: a processor has only PROCESSOR_CAPACITY
    // slots, even if growers independently chose to honor more deliveries to it
    // than it can take (growers negotiate separately and can over-commit a
    // popular processor).
    var byProcessorCrop = {};
    Object.keys(growerCropDeliveries).forEach(function (g) {
      growerCropDeliveries[g].forEach(function (cand) {
        var p = normId(cand.clause.to);
        (byProcessorCrop[p] = byProcessorCrop[p] || []).push({ g: g, cand: cand });
      });
    });
    Object.keys(byProcessorCrop).forEach(function (p) {
      var items = byProcessorCrop[p];
      var totalQty = items.reduce(function (s, it) { return s + (it.cand.clause.qty || 1); }, 0);
      if (totalQty <= CONST.PROCESSOR_CAPACITY) return;
      var rankFor = (orders[p] && orders[p].rank) || [];
      items.sort(function (a, b) {
        var ia = rankFor.indexOf(a.cand.key), ib = rankFor.indexOf(b.cand.key);
        if (ia === -1 && ib === -1) return a.cand.seq - b.cand.seq; // default: deal order, not grower id order
        if (ia === -1) ia = 999;
        if (ib === -1) ib = 999;
        return ia - ib;
      });
      var used = 0;
      items.forEach(function (it) {
        var qty = it.cand.clause.qty || 1;
        if (used + qty > CONST.PROCESSOR_CAPACITY) {
          breaks.push({ key: it.cand.key, from: p, reason: 'processor is out of crop-receiving slots (2 max)' });
          applyPenalty(firms, it.cand.clause, p, breaks);
          var idx = growerCropDeliveries[it.g].indexOf(it.cand);
          if (idx !== -1) growerCropDeliveries[it.g].splice(idx, 1);
        } else {
          used += qty;
        }
      });
    });

    Object.keys(growerCropDeliveries).forEach(function (g) {
      var chosenList = growerCropDeliveries[g];
      var deliveredQty = 0;
      chosenList.forEach(function (chosen) {
        var p = normId(chosen.clause.to);
        var qty = chosen.clause.qty || 1;
        var fit = ((MARKET.fitGP[g] && MARKET.fitGP[g][p]) || 0) * qty;
        var price = chosen.clause.price || 0;
        addLedger(firms, g, nameOf(g) + ' delivers ' + qty + ' crop(s) to ' + nameOf(p) + ' for ' + fmtMoney(price), price, 'deliver');
        addLedger(firms, p, nameOf(p) + ' pays ' + nameOf(g) + ' ' + fmtMoney(price) + ' for its crop(s)', -price, 'deliver');
        addLedger(firms, p, nameOf(p) + ' gets ' + fmtMoney(fit) + ' extra value from the fit of this crop', fit, 'fit');
        for (var i = 0; i < qty; i++) {
          deliveries.push({ from: g, to: p, good: 'crop', source: g, dealId: chosen.deal.id, clauseId: chosen.clause.id });
        }
        deliveredQty += qty;
      });

      var lockedBids = (state.aiCropLocks && state.aiCropLocks[g]) || [];
      lockedBids.forEach(function (bid) {
        addLedger(firms, g, nameOf(g) + ' locks in a sale of one crop to the AI for ' + fmtMoney(bid), bid, 'ai-lock');
      });

      var leftover = CONST.GROWER_CAPACITY - deliveredQty - lockedBids.length;
      var perCropStandalone = CONST.STANDALONE_GROWER / CONST.GROWER_CAPACITY;
      for (var j = 0; j < leftover; j++) {
        if (isUnplayed(state, g)) {
          // No human player at this seat: no deals were made on its behalf, so
          // it never faced the decay clock. It runs exactly standalone, not
          // the decay floor (a grower nobody is playing should not drag the
          // room score negative).
          addLedger(firms, g, nameOf(g) + ' has no player this round and sells a crop to the AI at the standalone price, ' + fmtMoney(perCropStandalone), perCropStandalone, 'standalone');
        } else if (projectMode) {
          // Projection: this crop hasn't actually been sold yet, so value it
          // at the bid for the CURRENT elapsed time (drifting down with the
          // decay clock). An idle grower at minute 0 should project $0, not
          // a loss.
          var liveBid = aiCropBid(state.elapsedSec || 0);
          addLedger(firms, g, nameOf(g) + ' would sell an unsold crop to the AI for ' + fmtMoney(liveBid) + ' if the clock ended now', liveBid, 'ai-fallback');
        } else {
          // Resolve: the AI bid freezes the moment deals closed (no further
          // trading happens during the silent orders phase), so a truly
          // unsold, unlocked crop sells at THAT bid, not whatever the floor
          // would be by the time the professor hits Reveal. Using the same
          // aiCropBid() curve as project() keeps the header projection, the
          // orders-phase consequence preview, and the final result in exact
          // agreement when everyone honors what they signed.
          var closeSec = (state.dealsClosedSec != null) ? state.dealsClosedSec : (state.elapsedSec || 0);
          var closeBid = aiCropBid(closeSec);
          addLedger(firms, g, nameOf(g) + ' sells an unsold crop to the AI for ' + fmtMoney(closeBid), closeBid, 'ai-fallback');
        }
      }
    });

    // ---- Step 2: processors' production (crops received, plus optional AI buy) ----
    var processorCrops = {}; // processorId -> array of source grower ids actually received
    MARKET.firms.filter(function (f) { return f.tier === 'processor'; }).forEach(function (p) {
      processorCrops[p.id] = [];
    });
    deliveries.forEach(function (d) {
      if (d.good === 'crop') processorCrops[d.to].push(d.source);
    });

    // ---- Step 3: processors' product deliveries, by rank, by what they have ----
    var productClausesByProcessor = {};
    deliverClauses.filter(function (x) { return x.clause.good === 'product'; }).forEach(function (x) {
      var p = normId(x.clause.from);
      (productClausesByProcessor[p] = productClausesByProcessor[p] || []).push(x);
    });

    var processorAvailable = {}; // processorId -> remaining units it can still promise (received crops count)
    Object.keys(processorCrops).forEach(function (p) { processorAvailable[p] = processorCrops[p].length; });

    var productDeliveries = []; // {processor, clauseEntry}
    var refusedProducts = []; // {processor, clauseEntry}

    Object.keys(productClausesByProcessor).forEach(function (p) {
      var candidates = productClausesByProcessor[p];
      var rankFor = (orders[p] && orders[p].rank) || [];
      candidates.sort(function (a, b) {
        var ia = rankFor.indexOf(a.key), ib = rankFor.indexOf(b.key);
        if (ia === -1) ia = 999;
        if (ib === -1) ib = 999;
        return ia - ib;
      });
      var buyAiIfShort = !orders[p] || orders[p].buyAiIfShort !== false; // default yes
      var remainingCrops = processorCrops[p].slice();
      var capacityLeft = CONST.PROCESSOR_CAPACITY; // hard cap: only this many processing slots, owned or AI-bought crop alike
      var honoredQty = 0;
      candidates.forEach(function (cand) {
        var qty = cand.clause.qty || 1;
        var wants = wantsHonor(p, cand.key);
        if (!wants) {
          breaks.push({ key: cand.key, from: p, reason: 'processor broke this product delivery' });
          applyPenalty(firms, cand.clause, p, breaks);
          return;
        }
        if (qty > capacityLeft) {
          breaks.push({ key: cand.key, from: p, reason: 'processor is out of processing slots (2 max, owned or AI-bought crop alike)' });
          applyPenalty(firms, cand.clause, p, breaks);
          return;
        }
        var haveCrop = remainingCrops.length >= qty;
        var sourceOk = true;
        if (cand.clause.source) {
          sourceOk = remainingCrops.indexOf(normId(cand.clause.source)) !== -1;
        }
        if (haveCrop && sourceOk) {
          var used = [];
          for (var i = 0; i < qty; i++) {
            var idx = cand.clause.source ? remainingCrops.indexOf(normId(cand.clause.source)) : 0;
            used.push(remainingCrops.splice(idx, 1)[0]);
          }
          productDeliveries.push({ entry: cand, sourceGrowers: used });
          honoredQty += qty;
          capacityLeft -= qty;
        } else if (buyAiIfShort) {
          var buyQty = qty - remainingCrops.length;
          if (buyQty < 0) buyQty = qty;
          for (var k = 0; k < Math.min(qty, remainingCrops.length); k++) remainingCrops.shift();
          var aiCropCost = buyQty * CONST.AI_CROP_ASK;
          var aiProcessCost = buyQty * CONST.PROCESSING_COST;
          var aiCost = aiCropCost + aiProcessCost;
          addLedger(firms, p, nameOf(p) + ' buys ' + buyQty + ' crop(s) from the AI (' + fmtMoney(aiCropCost)
            + ') and pays ' + fmtMoney(aiProcessCost) + ' to process them to cover a product deal, ' + fmtMoney(aiCost) + ' total', -aiCost, 'ai-buy');
          productDeliveries.push({ entry: cand, sourceGrowers: ['AI'] });
          honoredQty += qty;
          capacityLeft -= qty;
        } else {
          breaks.push({ key: cand.key, from: p, reason: 'processor was short and chose not to buy from the AI' });
          applyPenalty(firms, cand.clause, p, breaks);
        }
      });
    });

    // retailer shelf capacity: a retailer can only stock RETAILER_CAPACITY
    // units total, even if every processor involved is willing and able.
    // Pick which candidates it keeps by its rank order (default: deal order).
    var overCapacityKeys = {};
    var byRetailer = {};
    productDeliveries.forEach(function (pd) {
      var r = normId(pd.entry.clause.to);
      (byRetailer[r] = byRetailer[r] || []).push(pd);
    });
    Object.keys(byRetailer).forEach(function (r) {
      var cands = byRetailer[r];
      var rankFor = (orders[r] && orders[r].rank) || [];
      cands.sort(function (a, b) {
        var ia = rankFor.indexOf(a.entry.key), ib = rankFor.indexOf(b.entry.key);
        if (ia === -1 && ib === -1) return a.entry.seq - b.entry.seq; // default: deal order, not processor id order
        if (ia === -1) ia = 999;
        if (ib === -1) ib = 999;
        return ia - ib;
      });
      var used = 0;
      cands.forEach(function (pd) {
        var qty = pd.entry.clause.qty || 1;
        if (used + qty > CONST.RETAILER_CAPACITY) {
          overCapacityKeys[pd.entry.key] = true;
        } else {
          used += qty;
        }
      });
    });

    productDeliveries.forEach(function (pd) {
      var c = pd.entry.clause;
      var p = normId(c.from), r = normId(c.to);
      var price = c.price || 0;
      var fit = (MARKET.fitPR[p] && MARKET.fitPR[p][r]) || 0;
      // retailer may still refuse at this point, or be over its shelf capacity
      var refuse = !wantsHonor(r, pd.entry.key) || overCapacityKeys[pd.entry.key];
      if (refuse) {
        refusedProducts.push(pd);
        var reason = overCapacityKeys[pd.entry.key] ? 'retailer had no shelf space left for this product' : 'retailer refused this product';
        breaks.push({ key: pd.entry.key, from: r, reason: reason });
        applyPenalty(firms, c, r, breaks);
        var aiSale = (c.qty || 1) * CONST.AI_PRODUCT_BID;
        addLedger(firms, p, nameOf(p) + ' sells the refused product to the AI for ' + fmtMoney(aiSale), aiSale, 'ai-fallback');
        return;
      }
      addLedger(firms, p, nameOf(p) + ' delivers product to ' + nameOf(r) + ' for ' + fmtMoney(price), price, 'deliver');
      addLedger(firms, r, nameOf(r) + ' pays ' + nameOf(p) + ' ' + fmtMoney(price) + ' for product', -price, 'deliver');
      addLedger(firms, r, nameOf(r) + ' gets ' + fmtMoney(fit) + ' extra value from the fit of this product', fit, 'fit');
      var qtySold = c.qty || 1;
      var shopperRevenue = qtySold * CONST.RETAIL_PRICE;
      addLedger(firms, r, nameOf(r) + ' sells ' + qtySold + ' unit(s) to shoppers for ' + fmtMoney(shopperRevenue), shopperRevenue, 'shopper-sale');
      pd.sourceGrowers.forEach(function (g) {
        deliveries.push({ from: p, to: r, good: 'product', source: g, dealId: pd.entry.deal.id, clauseId: c.id });
      });
    });

    // ---- Step 4: idle processor slots and idle retailer slots run standalone ----
    MARKET.firms.filter(function (f) { return f.tier === 'processor'; }).forEach(function (p) {
      var usedAsSource = deliveries.filter(function (d) { return d.good === 'crop' && d.to === p.id; }).length;
      // Split product-delivery crop sourcing into "from a crop it actually
      // received" vs "AI-bought" - each AI-bought unit already occupies one
      // of the 2 processing slots (ledgered above in the ai-buy line), so it
      // must count against capacity here too, or the slot math double-books
      // (reported bug: a broken crop deal + 1 AI-covered product deal showed
      // 3 production lines on a 2-slot processor).
      var ownCropUsedCount = 0;
      var aiCropUsedCount = 0;
      productDeliveries.filter(function (pd) { return normId(pd.entry.clause.from) === p.id; }).forEach(function (pd) {
        pd.sourceGrowers.forEach(function (sg) {
          if (sg === 'AI') aiCropUsedCount++;
          else ownCropUsedCount++;
        });
      });
      var idleCrops = Math.max(0, usedAsSource - ownCropUsedCount);
      // Leftover received crop not promised to anyone: this crop is already
      // owned (its price was paid on the deliver clause above), so turning
      // it into product only costs processing, not the AI crop ask again.
      for (var i = 0; i < idleCrops; i++) {
        var gain = CONST.AI_PRODUCT_BID - CONST.PROCESSING_COST;
        addLedger(firms, p.id, nameOf(p.id) + ' runs a leftover crop through standalone (already paid for, sells to the AI minus processing), ' + fmtMoney(gain), gain, 'standalone');
      }
      // A truly idle slot has no crop at all: buy AND sell through the AI.
      var idleSlots = Math.max(0, CONST.PROCESSOR_CAPACITY - usedAsSource - aiCropUsedCount);
      for (var j = 0; j < idleSlots; j++) {
        var g2 = CONST.AI_PRODUCT_BID - CONST.AI_CROP_ASK - CONST.PROCESSING_COST;
        addLedger(firms, p.id, nameOf(p.id) + ' buys and sells a unit with the AI on an idle slot, ' + fmtMoney(g2), g2, 'standalone');
      }
    });

    MARKET.firms.filter(function (f) { return f.tier === 'retailer'; }).forEach(function (r) {
      var stocked = deliveries.filter(function (d) { return d.good === 'product' && d.to === r.id; }).length;
      var idleSlots = CONST.RETAILER_CAPACITY - stocked;
      for (var i = 0; i < idleSlots; i++) {
        var gain = CONST.RETAIL_PRICE - CONST.AI_PRODUCT_ASK;
        addLedger(firms, r.id, nameOf(r.id) + ' stocks an AI-bought product on an idle shelf, ' + fmtMoney(gain), gain, 'standalone');
      }
    });

    // ---- Step 5: combos on actual deliveries ----
    var deliveredCropLinks = {}; // "g|p" -> true
    var deliveredProductLinks = {}; // "g|p|r" -> true, and "p|r" -> true
    deliveries.forEach(function (d) {
      if (d.good === 'crop') deliveredCropLinks[d.from + '|' + d.to] = true;
      if (d.good === 'product') {
        deliveredProductLinks[(d.source || '') + '|' + d.from + '|' + d.to] = true;
        deliveredProductLinks[d.from + '|' + d.to] = true;
      }
    });

    // Every combo pays every member (COMBOS-v8.md round 2): each combo
    // carries its own pay map {firmId: amount} in market.json, so paying
    // out is generic regardless of how the per-member amounts are tuned.
    function payCombo(combo, kind, label) {
      Object.keys(combo.pay || {}).forEach(function (fid) {
        addLedger(firms, fid, label + ', ' + fmtMoney(combo.pay[fid]), combo.pay[fid], 'combo');
      });
      combosHit.push({ type: kind, id: combo.id, label: combo.label, firms: Object.keys(combo.pay || {}) });
    }

    MARKET.recipes.forEach(function (rc) {
      var key = rc.grower + '|' + rc.processor + '|' + rc.retailer;
      if (deliveredProductLinks[key] && deliveredCropLinks[rc.grower + '|' + rc.processor]) {
        var label = projectMode ? 'Something about this chain pays extra' : 'Recipe bonus: ' + rc.label;
        payCombo(rc, 'recipe', label);
      }
    });

    MARKET.blends.forEach(function (bl) {
      var all = bl.growers.every(function (g) { return deliveredCropLinks[g + '|' + bl.processor]; });
      if (all) {
        var label = projectMode ? 'Something about this chain pays extra' : 'Blend bonus: ' + bl.label;
        payCombo(bl, 'blend', label);
      }
    });

    MARKET.menus.forEach(function (mn) {
      var all = mn.processors.every(function (p) { return deliveredProductLinks[p + '|' + mn.retailer]; });
      if (all) {
        var label = projectMode ? 'Something about this chain pays extra' : 'Menu bonus: ' + mn.label;
        payCombo(mn, 'menu', label);
      }
    });

    // ---- Step 6: conditional payments + "now" payments + penalties already applied ----
    var honoredKeys = {};
    flat.forEach(function (x) {
      if (x.clause.type === 'deliver') {
        var isDelivered = deliveries.some(function (d) { return d.dealId === x.deal.id && d.clauseId === x.clause.id; });
        if (isDelivered) honoredKeys[x.key] = true;
      }
    });

    payClauses.forEach(function (x) {
      var c = x.clause;
      var from = normId(c.from), to = normId(c.to);
      if (c.when === 'now') {
        addLedger(firms, from, nameOf(from) + ' pays ' + nameOf(to) + ' ' + fmtMoney(c.amount) + ' now', -c.amount, 'pay-now');
        addLedger(firms, to, nameOf(to) + ' is paid ' + fmtMoney(c.amount) + ' by ' + nameOf(from) + ' now', c.amount, 'pay-now');
        return;
      }
      // on_condition
      if (!dealConditionSatisfied(x.deal, honoredKeys)) return; // whole deal void
      var ref = c.condition && c.condition.delivered;
      if (!ref) return;
      if (ref.indexOf(':') === -1) ref = x.deal.id + ':' + ref;
      if (honoredKeys[ref] || projectMode) {
        if (!projectMode && !honoredKeys[ref]) return;
        addLedger(firms, from, nameOf(from) + ' pays ' + nameOf(to) + ' ' + fmtMoney(c.amount) + ' (condition met)', -c.amount, 'pay-condition');
        addLedger(firms, to, nameOf(to) + ' is paid ' + fmtMoney(c.amount) + ' by ' + nameOf(from) + ' (condition met)', c.amount, 'pay-condition');
      }
    });

    // ---- gains ----
    MARKET.firms.forEach(function (f) {
      firms[f.id].gain = firms[f.id].money - firms[f.id].standalone;
    });

    // ---- profit pools (ROUND2-CONTRACT.md section D), resolved LAST: the
    // two firms' gains (after everything above, including penalties) are
    // summed and re-split by the agreed share. Binding (never in orders,
    // cannot be broken). A firm may be in at most one confirmed pool; if
    // the room somehow has two, only the first one seen applies (should
    // never happen - validateReading rejects a second pool at confirm time).
    var pooled = {};
    flat.filter(function (x) { return x.clause.type === 'pool'; }).forEach(function (x) {
      var c = x.clause;
      var ids = (c.firms || []).map(normId);
      if (ids.length !== 2 || !firms[ids[0]] || !firms[ids[1]]) return;
      var a = ids[0], b = ids[1];
      if (pooled[a] || pooled[b]) return;
      var split = c.split || {};
      var shareA = split[a], shareB = split[b];
      if (typeof shareA !== 'number' || typeof shareB !== 'number') return;
      pooled[a] = true;
      pooled[b] = true;
      var combined = firms[a].gain + firms[b].gain;
      var newA = Math.round(combined * shareA / 100);
      var newB = combined - newA; // exact conservation despite rounding
      var oldA = firms[a].gain, oldB = firms[b].gain;
      firms[a].gain = newA;
      firms[b].gain = newB;
      firms[a].ledger.push({
        label: nameOf(a) + ' pools profits with ' + nameOf(b) + ': combined gain ' + fmtMoney(combined)
          + ' split ' + shareA + '/' + shareB + ', your share ' + fmtMoney(newA),
        amount: newA - oldA, kind: 'pool'
      });
      firms[b].ledger.push({
        label: nameOf(b) + ' pools profits with ' + nameOf(a) + ': combined gain ' + fmtMoney(combined)
          + ' split ' + shareB + '/' + shareA + ', your share ' + fmtMoney(newB),
        amount: newB - oldB, kind: 'pool'
      });
    });

    var roomGain = MARKET.firms.reduce(function (s, f) { return s + firms[f.id].gain; }, 0);
    var roomPct = Math.round((roomGain / MARKET.maxTotalGain) * 1000) / 10;

    return {
      firms: firms,
      roomGain: roomGain,
      roomPct: roomPct,
      deliveries: deliveries,
      combosHit: combosHit,
      breaks: breaks
    };
  }

  function applyPenalty(firms, clause, breakerId, breaksList) {
    var penalty = clause.penalty || 0;
    if (!penalty) return;
    var other = normId(breakerId) === normId(clause.from) ? normId(clause.to) : normId(clause.from);
    addLedger(firms, breakerId, nameOf(breakerId) + ' pays a ' + fmtMoney(penalty) + ' penalty for breaking a deal', -penalty, 'penalty');
    addLedger(firms, other, nameOf(other) + ' is paid a ' + fmtMoney(penalty) + ' penalty', penalty, 'penalty');
  }

  function project(state) {
    return runResolution(state, true);
  }

  function resolve(state) {
    return runResolution(state, false);
  }

  // ------------------------------------------------------------------
  // orderOptions: for a firm, list its clauses to perform with honor/break
  // consequences in plain words and $, computed by running resolve variants.
  // ------------------------------------------------------------------
  function orderOptions(state, firmId) {
    var flat = flattenClauses(state.deals);
    var mine = flat.filter(function (x) {
      return x.clause.type === 'deliver' && (normId(x.clause.from) === firmId || normId(x.clause.to) === firmId) && firmTier(normId(x.clause.from)) !== null && normId(x.clause.from) === firmId;
    });
    // also include deliveries where firmId is the retailer deciding refuse/accept
    var incoming = flat.filter(function (x) {
      return x.clause.type === 'deliver' && x.clause.good === 'product' && normId(x.clause.to) === firmId;
    });
    var relevant = mine.concat(incoming.filter(function (x) { return mine.indexOf(x) === -1; }));

    var baseline = resolve(state);
    var options = relevant.map(function (x) {
      var honorState = cloneWithChoice(state, firmId, x.key, 'honor');
      var breakState = cloneWithChoice(state, firmId, x.key, 'break');
      var honorResult = resolve(honorState);
      var breakResult = resolve(breakState);
      return {
        dealId: x.deal.id,
        clauseId: x.clause.id,
        key: x.key,
        summary: clauseSummary(x.clause),
        // moneyChange reports the firm's final GAIN under that choice (post
        // combo bonuses AND post profit-pool re-split), matching what
        // project()/the header shows - not raw .money, which pools never
        // touch. A pooled firm's honor/break numbers must agree with its
        // header projection, or the orders screen contradicts itself.
        honor: { moneyChange: honorResult.firms[firmId].gain, plain: 'Honor: ' + clauseSummary(x.clause) },
        breakOption: {
          moneyChange: breakResult.firms[firmId].gain,
          plain: 'Break: skip this clause' + (x.clause.penalty ? ', pay a ' + fmtMoney(x.clause.penalty) + ' penalty' : ', no penalty named')
        }
      };
    });

    var constraints = [];
    if (firmTier(firmId) === 'grower') constraints.push('A grower can honor at most two crop deliveries total (it has two crops).');

    return { options: options, constraints: constraints };
  }

  function clauseSummary(c) {
    if (c.type === 'deliver' && c.good === 'crop') {
      return nameOf(c.from) + ' delivers its crop to ' + nameOf(c.to) + ' for ' + fmtMoney(c.price) + '.';
    }
    if (c.type === 'deliver' && c.good === 'product') {
      return nameOf(c.from) + ' delivers product to ' + nameOf(c.to) + ' for ' + fmtMoney(c.price) + '.';
    }
    return c.type + ' clause';
  }

  function cloneWithChoice(state, firmId, key, choice) {
    var next = JSON.parse(JSON.stringify(state));
    next.orders = next.orders || {};
    next.orders[firmId] = next.orders[firmId] || { choices: {}, rank: [], buyAiIfShort: true };
    next.orders[firmId].choices = next.orders[firmId].choices || {};
    next.orders[firmId].choices[key] = choice;
    return next;
  }

  // ------------------------------------------------------------------
  // Sliders + extras deal (ROUND2-CONTRACT.md section A). sliders:
  // {partner, qty, price, penalty}. Direction is implied by tier pairing,
  // not by who writes: crop always grower->processor, product always
  // processor->retailer, regardless of whether the writer is the grower
  // or the processor (etc).
  // ------------------------------------------------------------------
  function sliderClause(writer, sliders) {
    var w = FIRM_BY_ID[normId(writer)];
    var partner = FIRM_BY_ID[normId(sliders && sliders.partner)];
    if (!w) throw new Error('BO8.sliderClause: unknown writer ' + writer);
    if (!partner) throw new Error('BO8.sliderClause: unknown partner ' + (sliders && sliders.partner));
    var good, from, to;
    if ((w.tier === 'grower' && partner.tier === 'processor') || (w.tier === 'processor' && partner.tier === 'grower')) {
      good = 'crop';
      from = w.tier === 'grower' ? w.id : partner.id;
      to = w.tier === 'processor' ? w.id : partner.id;
    } else if ((w.tier === 'processor' && partner.tier === 'retailer') || (w.tier === 'retailer' && partner.tier === 'processor')) {
      good = 'product';
      from = w.tier === 'processor' ? w.id : partner.id;
      to = w.tier === 'retailer' ? w.id : partner.id;
    } else {
      throw new Error('BO8.sliderClause: partner must be in the adjacent tier (grower<->processor or processor<->retailer)');
    }
    return {
      type: 'deliver',
      id: 's1',
      from: from,
      to: to,
      good: good,
      qty: (sliders && sliders.qty) || 1,
      price: sliders && sliders.price,
      penalty: (sliders && sliders.penalty) || 0
    };
  }

  function readingFromSliders(writer, sliders) {
    var c = sliderClause(writer, sliders);
    var verb = c.good === 'crop' ? 'its crop' : 'product';
    var summary = nameOf(c.from) + ' delivers ' + verb + ' to ' + nameOf(c.to) + ' for ' + fmtMoney(c.price)
      + (c.penalty ? ', with a ' + fmtMoney(c.penalty) + ' penalty for breaking it.' : '.');
    return { summary: summary, clauses: [c], deal_condition: null, promises: [], not_counted: [], question: null };
  }

  function checkSliderIntact(reading, writer, sliders) {
    var expected = sliderClause(writer, sliders);
    var s1 = ((reading && reading.clauses) || []).filter(function (c) { return c && c.id === 's1'; })[0];
    if (!s1) return { ok: false, error: 'The reading is missing the s1 slider clause.' };
    var fields = ['type', 'from', 'to', 'good', 'qty', 'price', 'penalty'];
    for (var i = 0; i < fields.length; i++) {
      var k = fields[i];
      var ev = expected[k], sv = s1[k];
      if (k === 'from' || k === 'to') { ev = normId(ev); sv = normId(sv); }
      if (ev !== sv) {
        return { ok: false, error: 'The s1 clause no longer matches the sliders (' + k + ' changed).' };
      }
    }
    return { ok: true, error: null };
  }

  // ------------------------------------------------------------------
  // Deal templates (ROUND2-CONTRACT.md section D): sell (= the section A
  // sliders, kept for back-compat), chain, fact, pool (merger). Each
  // produces fixed clauses s1..sn that the reader/web must not alter.
  // ------------------------------------------------------------------
  function normalizeTemplate(input) {
    if (input && input.type && input.fields) return input;
    return { type: 'sell', fields: input }; // legacy: a raw sliders object
  }

  function templatePartners(writer, type) {
    var w = FIRM_BY_ID[normId(writer)];
    if (!w) throw new Error('BO8.templatePartners: unknown writer ' + writer);
    var out = { grower: [], processor: [], retailer: [] };
    function addAllExcept(tier) {
      MARKET.firms.filter(function (f) { return f.tier === tier && f.id !== w.id; })
        .forEach(function (f) { out[tier].push(f.id); });
    }
    if (type === 'sell') {
      if (w.tier === 'grower') addAllExcept('processor');
      else if (w.tier === 'processor') { addAllExcept('grower'); addAllExcept('retailer'); }
      else if (w.tier === 'retailer') addAllExcept('processor');
      return out;
    }
    if (type === 'fact' || type === 'pool') {
      addAllExcept('grower'); addAllExcept('processor'); addAllExcept('retailer');
      return out;
    }
    if (type === 'chain') return out; // chain names grower/processor/retailer directly in fields, not a single "partner"
    throw new Error('BO8.templatePartners: unknown template type ' + type);
  }

  function templateClauses(writer, template) {
    var tmpl = normalizeTemplate(template);
    var w = FIRM_BY_ID[normId(writer)];
    if (!w) throw new Error('BO8.templateClauses: unknown writer ' + writer);
    var f = tmpl.fields || {};

    if (tmpl.type === 'sell') {
      return [sliderClause(writer, f)];
    }

    if (tmpl.type === 'chain') {
      var g = normId(f.grower), p = normId(f.processor), r = normId(f.retailer);
      if ([g, p, r].indexOf(normId(writer)) === -1) {
        throw new Error('BO8.templateClauses: the writer must be one of the chain\'s grower, processor, or retailer');
      }
      var penalty = f.penalty || 0;
      return [
        { type: 'deliver', id: 's1', from: g, to: p, good: 'crop', qty: 1, price: f.cropPrice, penalty: penalty },
        { type: 'deliver', id: 's2', from: p, to: r, good: 'product', qty: 1, price: f.productPrice, penalty: penalty, source: g }
      ];
    }

    if (tmpl.type === 'fact') {
      var partner = normId(f.partner);
      if (!FIRM_BY_ID[partner]) throw new Error('BO8.templateClauses: unknown fact partner ' + f.partner);
      return [
        { type: 'share_fact', id: 's1', from: w.id, to: partner, fact: f.fact },
        { type: 'pay', id: 's2', from: partner, to: w.id, amount: f.price, when: 'now' }
      ];
    }

    if (tmpl.type === 'pool') {
      var poolPartner = normId(f.partner);
      if (!FIRM_BY_ID[poolPartner]) throw new Error('BO8.templateClauses: unknown pool partner ' + f.partner);
      var myShare = f.myShare;
      var split = {};
      split[w.id] = myShare;
      split[poolPartner] = 100 - myShare;
      return [{ type: 'pool', id: 's1', firms: [w.id, poolPartner], split: split }];
    }

    throw new Error('BO8.templateClauses: unknown template type ' + tmpl.type);
  }

  function clausesEqual(a, b) {
    if (!a || !b || a.type !== b.type) return false;
    if (a.type === 'deliver') {
      if (normId(a.from) !== normId(b.from) || normId(a.to) !== normId(b.to)) return false;
      if (a.good !== b.good) return false;
      if ((a.qty || 1) !== (b.qty || 1)) return false;
      if (a.price !== b.price) return false;
      if ((a.penalty || 0) !== (b.penalty || 0)) return false;
      if (normId(a.source) !== normId(b.source)) return false; // '' === '' when neither has a source
      return true;
    }
    if (a.type === 'pay') {
      if (normId(a.from) !== normId(b.from) || normId(a.to) !== normId(b.to)) return false;
      if (a.amount !== b.amount || a.when !== b.when) return false;
      if (a.when === 'on_condition') {
        var ac = (a.condition && a.condition.delivered) || null;
        var bc = (b.condition && b.condition.delivered) || null;
        if (ac !== bc) return false;
      }
      return true;
    }
    if (a.type === 'share_fact') {
      return normId(a.from) === normId(b.from) && normId(a.to) === normId(b.to) && a.fact === b.fact;
    }
    if (a.type === 'pool') {
      var af = (a.firms || []).map(normId).sort();
      var bf = (b.firms || []).map(normId).sort();
      if (af.join(',') !== bf.join(',')) return false;
      return af.every(function (fid) {
        var av = (a.split || {})[fid], bv = (b.split || {})[fid];
        return av === bv;
      });
    }
    return false;
  }

  function readingFromTemplate(writer, template) {
    var tmpl = normalizeTemplate(template);
    var clauses = templateClauses(writer, tmpl);
    var summary;
    if (tmpl.type === 'sell') {
      return readingFromSliders(writer, tmpl.fields);
    } else if (tmpl.type === 'chain') {
      var s1 = clauses[0], s2 = clauses[1];
      summary = nameOf(s1.from) + ' delivers its crop to ' + nameOf(s1.to) + ' for ' + fmtMoney(s1.price)
        + ', which ' + nameOf(s2.from) + ' turns into product for ' + nameOf(s2.to) + ' for ' + fmtMoney(s2.price) + '.';
    } else if (tmpl.type === 'fact') {
      var share = clauses[0], pay = clauses[1];
      summary = nameOf(share.from) + ' shares a fact with ' + nameOf(share.to) + ' for ' + fmtMoney(pay.amount) + '.';
    } else if (tmpl.type === 'pool') {
      var pool = clauses[0];
      var ids = pool.firms;
      summary = nameOf(ids[0]) + ' and ' + nameOf(ids[1]) + ' pool their final profits and split them '
        + pool.split[ids[0]] + '/' + pool.split[ids[1]] + '. This is binding and cannot be broken.';
    } else {
      summary = '';
    }
    return { summary: summary, clauses: clauses, deal_condition: null, promises: [], not_counted: [], question: null };
  }

  function checkTemplateIntact(reading, writer, template) {
    var tmpl = normalizeTemplate(template);
    var expected = templateClauses(writer, tmpl);
    for (var i = 0; i < expected.length; i++) {
      var exp = expected[i];
      var act = ((reading && reading.clauses) || []).filter(function (c) { return c && c.id === exp.id; })[0];
      if (!act) return { ok: false, error: 'The reading is missing the ' + exp.id + ' clause.' };
      if (!clausesEqual(exp, act)) return { ok: false, error: 'The ' + exp.id + ' clause no longer matches the template (' + exp.id + ' changed).' };
    }
    return { ok: true, error: null };
  }

  function mergeExtras(writer, templateOrSliders, aiReading) {
    var tmpl = normalizeTemplate(templateOrSliders);
    var forced = templateClauses(writer, tmpl);
    var forcedIds = {};
    forced.forEach(function (c) { forcedIds[c.id] = true; });
    var extras = ((aiReading && aiReading.clauses) || []).filter(function (c) { return c && !forcedIds[c.id]; });
    var xi = 1;
    var relabeled = extras.map(function (c) {
      var copy = JSON.parse(JSON.stringify(c));
      copy.id = 'x' + (xi++);
      return copy;
    });
    var merged = JSON.parse(JSON.stringify(aiReading || {}));
    merged.clauses = forced.concat(relabeled);
    return merged;
  }

  // routesFor: combos that pay this firm (used by tests and the build report)
  function routesFor(firmId) {
    var fid = normId(firmId);
    var out = [];
    MARKET.recipes.forEach(function (rc) { if (rc.pay && rc.pay[fid] != null) out.push(rc.id); });
    MARKET.blends.forEach(function (bl) { if (bl.pay && bl.pay[fid] != null) out.push(bl.id); });
    MARKET.menus.forEach(function (mn) { if (mn.pay && mn.pay[fid] != null) out.push(mn.id); });
    return out;
  }

  // ------------------------------------------------------------------
  // readerContext: compact JSON for the AI reader's prompt
  // ------------------------------------------------------------------
  function readerContext(partyIds, state) {
    var parties = (partyIds || []).map(normId);
    var firms = parties.map(function (id) {
      var f = FIRM_BY_ID[id];
      var cap = f.tier === 'grower' ? CONST.GROWER_CAPACITY : (f.tier === 'processor' ? CONST.PROCESSOR_CAPACITY : CONST.RETAILER_CAPACITY);
      return { id: f.id, name: f.name, tier: f.tier, plain: f.plain, capacity: cap };
    });
    var factsHeld = {};
    parties.forEach(function (id) {
      factsHeld[id] = MARKET.facts.filter(function (f) { return f.holders.indexOf(id) !== -1; })
        .map(function (f) { return { id: f.id, text: f.text }; });
    });
    var confirmed = [];
    (state && state.deals || []).forEach(function (deal) {
      if (deal.status !== 'confirmed') return;
      (deal.reading && deal.reading.clauses || []).forEach(function (c) {
        confirmed.push({ key: deal.id + ':' + c.id, summary: clauseSummary(c) });
      });
    });

    return {
      firms: firms,
      factsHeld: factsHeld,
      confirmedClauses: confirmed,
      schema: {
        summary: 'string',
        clauses: '[{type: deliver|pay|share_fact, id, ...}]',
        deal_condition: '{delivered: clauseId} or null',
        promises: '[string]',
        not_counted: '[string]',
        question: 'string or null'
      },
      rules: [
        'deliver crop only grower to processor, qty 1 or 2 (a grower has two crops)',
        'deliver product only processor to retailer, qty 1 or 2',
        'price is paid by buyer to seller on delivery',
        'penalty is paid by the side that breaks, to the other side, default 0',
        'pay now is immediate and binding; pay on_condition is paid at resolve if the named delivery happened',
        'share_fact only for facts the giver holds',
        'the AI never computes money values'
      ]
    };
  }

  // ------------------------------------------------------------------
  // bots.randomReading: a plausible valid reading, for sims/e2e
  // ------------------------------------------------------------------
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeRng(seed) {
    if (typeof seed === 'function') return seed;
    if (typeof seed === 'number') return mulberry32(seed);
    return Math.random;
  }

  function weightedChoice(items, weights, rng) {
    var total = weights.reduce(function (s, w) { return s + w; }, 0);
    var r = rng() * total;
    for (var i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  // "sensible" random play per DESIGN section 9: a writer leans toward its
  // best-fit partner (not uniform-random blind) and prices like a seller or
  // buyer with normal self-interest, not a coin-flip midpoint.
  function randomReading(state, writerId, rng) {
    rng = makeRng(rng);
    var writer = FIRM_BY_ID[normId(writerId)];
    if (!writer) throw new Error('BO8.bots.randomReading: unknown firm ' + writerId);
    var clauses = [];
    var cid = 1;
    function nextId() { return 'c' + (cid++); }
    function lerp(a, b, t) { return a + (b - a) * t; }

    if (writer.tier === 'grower') {
      var processors = MARKET.firms.filter(function (f) { return f.tier === 'processor'; });
      var pWeights = processors.map(function (p) { return ((MARKET.fitGP[writer.id] && MARKET.fitGP[writer.id][p.id]) || 0) + 50; });
      var p = weightedChoice(processors, pWeights, rng);
      var basePrice = lerp(CONST.AI_CROP_BID_START, CONST.AI_CROP_ASK, 0.75); // a seller prices toward its own favor
      var price = Math.round(basePrice + (rng() * 40 - 20));
      clauses.push({ type: 'deliver', id: nextId(), from: writer.id, to: p.id, good: 'crop', qty: 1, price: price, penalty: Math.round(rng() * 50) });
      return { reading: { summary: writer.name + ' sells its crop to ' + p.name + ' for $' + price + 'k.', clauses: clauses, deal_condition: null, promises: [], not_counted: [], question: null }, parties: [writer.id, p.id] };
    }
    if (writer.tier === 'processor') {
      var retailers = MARKET.firms.filter(function (f) { return f.tier === 'retailer'; });
      var rWeights = retailers.map(function (rt) { return ((MARKET.fitPR[writer.id] && MARKET.fitPR[writer.id][rt.id]) || 0) + 50; });
      var r = weightedChoice(retailers, rWeights, rng);
      var qty = rng() < 0.5 ? 1 : 2;
      var pbase = lerp(CONST.AI_PRODUCT_BID, CONST.AI_PRODUCT_ASK, 0.75); // a seller prices toward its own favor
      var pprice = Math.round(pbase * qty + (rng() * 60 - 30));
      clauses.push({ type: 'deliver', id: nextId(), from: writer.id, to: r.id, good: 'product', qty: qty, price: pprice, penalty: Math.round(rng() * 80) });
      return { reading: { summary: writer.name + ' sells ' + qty + ' product(s) to ' + r.name + ' for $' + pprice + 'k.', clauses: clauses, deal_condition: null, promises: [], not_counted: [], question: null }, parties: [writer.id, r.id] };
    }
    // retailer writes to a processor, asking it to sell (a buyer initiating)
    var procs = MARKET.firms.filter(function (f) { return f.tier === 'processor'; });
    var ppWeights = procs.map(function (pc) { return ((MARKET.fitPR[pc.id] && MARKET.fitPR[pc.id][writer.id]) || 0) + 50; });
    var pp = weightedChoice(procs, ppWeights, rng);
    var q2 = rng() < 0.5 ? 1 : 2;
    var basePrice2 = lerp(CONST.AI_PRODUCT_BID, CONST.AI_PRODUCT_ASK, 0.25); // a buyer prices toward its own favor
    var price2 = Math.round(basePrice2 * q2 + (rng() * 60 - 30));
    clauses.push({ type: 'deliver', id: nextId(), from: pp.id, to: writer.id, good: 'product', qty: q2, price: price2, penalty: Math.round(rng() * 80) });
    return { reading: { summary: pp.name + ' sells ' + q2 + ' product(s) to ' + writer.name + ' for $' + price2 + 'k.', clauses: clauses, deal_condition: null, promises: [], not_counted: [], question: null }, parties: [pp.id, writer.id] };
  }

  return {
    MARKET: MARKET,
    CONST: CONST,
    cardFor: cardFor,
    aiCropBid: aiCropBid,
    validateReading: validateReading,
    project: project,
    resolve: resolve,
    orderOptions: orderOptions,
    readerContext: readerContext,
    sliderClause: sliderClause,
    templateClauses: templateClauses,
    readingFromTemplate: readingFromTemplate,
    checkTemplateIntact: checkTemplateIntact,
    templatePartners: templatePartners,
    readingFromSliders: readingFromSliders,
    checkSliderIntact: checkSliderIntact,
    mergeExtras: mergeExtras,
    routesFor: routesFor,
    bots: { randomReading: randomReading },
    _normId: normId
  };
}));
