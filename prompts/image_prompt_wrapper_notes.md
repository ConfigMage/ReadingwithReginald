When calling the image generation API, the app should combine:

- The base image prompt from the page:
  {{imagePrompt}}

With additional style and safety details:

- Art style mapping:
- "cute children's book" -> "bright pastels, soft round shapes, simple details, cozy lighting, picture book style"
  - "watercolor" -> "soft watercolor textures, gentle gradients, light strokes, dreamy storybook atmosphere"
  - "cartoon" -> "bold outlines, flat colors, expressive characters, simple backgrounds, clean cartoon style"

- Always mention the key visual traits from the character sheet (hair, clothing, height, etc.) to maintain consistency across pages.

The final combined prompt should be:
"{{imagePrompt}}. In a {{mappedStyle}}. The main child character should match these traits: {{characterVisualTraits}}. Make it bright, gentle, and safe for children aged 3-5."
