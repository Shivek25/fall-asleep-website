# 🌙 Fall Asleep: Shutdown Protocol

> Your nightly companion for real rest.

**Fall Asleep** is a privacy-first web app designed for use in the dark, in bed, on your phone or laptop when you can't sleep. It requires zero setup and zero accounts.

## Features

| Feature | Description |
|---------|-------------|
| 🧠 **Cognitive Shuffle** | Visualize random words to quiet racing thoughts |
| 📝 **Brain Dump** | Write anxious thoughts, lock them in the vault |
| 🌊 **Guided Breathing** | 4-7-8, box breathing, or 4-4-6 calming patterns |
| 🧘 **Mindfulness & Body Scan** | Step-by-step physical tension release & anxiety pause |
| 🛡️ **Circuit Breaker** | 5-4-3-2-1 grounding, calming words, guided decision tree |
| 📊 **Sleep Check-in** | Track bedtime, quality, and wake feeling with trends |
| 🎧 **Ambient Bedtime Soundscapes** | Curated copyright-free sleep music & soothing ambient sounds |

## Privacy

🔒 **All data stays on your device.** No accounts. No cloud. No tracking. No analytics. Everything is stored in your browser's `localStorage`.

## Tech Stack

- **[Astro](https://astro.build)**: Static site generation with minimal JavaScript
- **[Preact](https://preactjs.com)**: Lightweight interactive islands (3KB)
- **[Tailwind CSS v4](https://tailwindcss.com)**: Utility-first styling with CSS-first config
- **Web Audio API & HTML5 Audio**: Synthesized cues & background bedtime music
- **localStorage**: All user data, completely private

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

Built for deployment to [Cloudflare Pages](https://pages.cloudflare.com) as a static site.

```bash
npm run build
# Output: dist/
```

## Design Principles

- **Dark-first**: Preserves night vision
- **One-handed**: Usable in bed with thumb reach
- **Minimal**: No cognitive overload
- **Accessible**: WCAG 2.2 AA, keyboard navigation, screen reader support
- **Fast**: Lighthouse ≥ 95 target

## License

MIT
