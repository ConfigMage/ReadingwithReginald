You are planning a complete bedtime story for a child aged 3-5.

Use this character sheet:
{{characterSheet}}

Story configuration:
- Theme: {{theme}}
- Child's name: {{childName}}
- Three things the child loves: {{favoritesList}}
- Lesson of the day: {{lessonOfTheDay}}
- Tone: {{tone}}
- Total pages: {{totalPages}} (between 6 and 12)

1. First, invent a warm and cozy bedtime story that fits this configuration and age group.
2. Then, create:
   - A story title.
   - A page-by-page outline that divides the story into {{totalPages}} parts.
   - Each page's summary should describe the main event(s) for that page in 1-3 sentences.

Return a JSON object with this shape:

{
  "title": "string - a charming, age-appropriate book title",
  "pages": [
    {
      "pageNumber": 1,
      "summary": "1-3 sentences summarizing what happens on page 1"
    },
    {
      "pageNumber": 2,
      "summary": "..."
    }
    // Continue up to page {{totalPages}}
  ]
}

Do not include any extra commentary outside the JSON.
