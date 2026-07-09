/**
 * Evidence-based calming and grounding statements for the Circuit Breaker.
 */

export interface CalmingStatement {
  text: string;
  category: 'reassurance' | 'body' | 'anchor';
}

export const calmingStatements: CalmingStatement[] = [
  // Reassurance
  { text: 'This feeling will pass. It always does.', category: 'reassurance' },
  { text: 'You are safe right now, in this moment.', category: 'reassurance' },
  { text: 'Anxiety is uncomfortable, but it is not dangerous.', category: 'reassurance' },
  { text: 'You have survived every hard moment before this one.', category: 'reassurance' },
  { text: 'This is temporary. Tomorrow is a new day.', category: 'reassurance' },
  { text: 'You don\'t have to solve everything tonight.', category: 'reassurance' },
  { text: 'It\'s okay to not be okay right now.', category: 'reassurance' },
  { text: 'Your thoughts are not facts.', category: 'reassurance' },
  { text: 'You are doing the best you can, and that is enough.', category: 'reassurance' },
  { text: 'Let the worry go. You can pick it up again tomorrow if you still need it.', category: 'reassurance' },

  // Body awareness
  { text: 'Notice your feet on the bed. Feel the weight of your body.', category: 'body' },
  { text: 'Soften your jaw. Unclench your teeth.', category: 'body' },
  { text: 'Drop your shoulders away from your ears.', category: 'body' },
  { text: 'Let your hands go limp. Release the tension.', category: 'body' },
  { text: 'Feel the pillow supporting your head. You can let go.', category: 'body' },
  { text: 'Breathe into your belly. Let it expand slowly.', category: 'body' },
  { text: 'Relax the muscles around your eyes.', category: 'body' },
  { text: 'Notice where your body is holding tension. Breathe into that spot.', category: 'body' },
  { text: 'Feel the warmth of the blanket around you.', category: 'body' },
  { text: 'Your body knows how to sleep. Trust it.', category: 'body' },

  // Reality anchoring
  { text: 'You are here. You are present. This is real.', category: 'anchor' },
  { text: 'Listen to the quietest sound you can hear.', category: 'anchor' },
  { text: 'Name three things you can feel right now.', category: 'anchor' },
  { text: 'The night is peaceful. You are part of that peace.', category: 'anchor' },
  { text: 'Millions of people are falling asleep right now, just like you.', category: 'anchor' },
  { text: 'The world will keep turning while you rest.', category: 'anchor' },
  { text: 'Right now, in this moment, everything is still.', category: 'anchor' },
  { text: 'You are allowed to rest. You deserve rest.', category: 'anchor' },
  { text: 'Close your eyes. The darkness is your friend tonight.', category: 'anchor' },
  { text: 'Sleep is coming. Let it arrive on its own time.', category: 'anchor' },
];
