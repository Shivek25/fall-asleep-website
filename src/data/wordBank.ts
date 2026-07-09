/**
 * Word bank of concrete, visualizable nouns for the Cognitive Shuffle.
 * These are objects you can picture in your mind's eye.
 */
export const wordBank: string[] = [
  // Nature
  'Mountain', 'River', 'Sunset', 'Forest', 'Meadow', 'Waterfall', 'Ocean', 'Cloud',
  'Rainbow', 'Moonlight', 'Snowflake', 'Pebble', 'Feather', 'Leaf', 'Flower', 'Coral',
  'Driftwood', 'Starlight', 'Glacier', 'Lagoon', 'Moss', 'Fern', 'Acorn', 'Seashell',

  // Animals
  'Butterfly', 'Dolphin', 'Owl', 'Turtle', 'Rabbit', 'Hummingbird', 'Fox', 'Whale',
  'Penguin', 'Firefly', 'Seahorse', 'Koala', 'Panda', 'Deer', 'Swan', 'Kitten',

  // Objects
  'Lantern', 'Compass', 'Hourglass', 'Telescope', 'Candle', 'Hammock', 'Umbrella',
  'Lighthouse', 'Windmill', 'Sailboat', 'Bicycle', 'Kite', 'Balloon', 'Piano',
  'Teapot', 'Blanket', 'Pillow', 'Cradle', 'Swing', 'Quilt', 'Rocking Chair',

  // Food
  'Apple', 'Peach', 'Honeycomb', 'Cinnamon', 'Lavender', 'Vanilla', 'Chocolate',
  'Marshmallow', 'Blueberry', 'Cherry', 'Mango', 'Coconut', 'Peppermint', 'Ginger',

  // Places
  'Cottage', 'Garden', 'Library', 'Treehouse', 'Chapel', 'Cabin', 'Gazebo',
  'Vineyard', 'Orchard', 'Harbor', 'Bridge', 'Balcony', 'Terrace', 'Courtyard',

  // Cozy items
  'Fireplace', 'Bookshelf', 'Window Seat', 'Music Box', 'Snow Globe', 'Dream Catcher',
  'Wind Chime', 'Journal', 'Inkwell', 'Fountain', 'Chandelier', 'Tapestry',
  'Stained Glass', 'Velvet', 'Silk', 'Ceramic', 'Crystal', 'Amber', 'Jade',

  // Sky & Space
  'Aurora', 'Nebula', 'Comet', 'Constellation', 'Eclipse', 'Crescent', 'Horizon',
  'Twilight', 'Dawn', 'Dusk', 'Mist', 'Fog', 'Dewdrop', 'Icicle', 'Prism',

  // Misc calm imagery
  'Origami', 'Parchment', 'Mosaic', 'Cobblestone', 'Willow', 'Bamboo', 'Lotus',
  'Bonsai', 'Pagoda', 'Zen Garden', 'Stepping Stone', 'Paper Crane', 'Lily Pad',
  'Tide Pool', 'Sand Dune', 'Cliff', 'Cove', 'Grotto', 'Canopy', 'Meadowlark',
];

/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
