You are writing a single page of a children's bedtime story for ages 3-5.

Use this character sheet:
{{characterSheet}}

Use this full story outline:
{{outlineJson}}

You are now writing page {{pageNumber}} of {{totalPages}}.

The summary for this page is:
{{pageSummary}}

Story configuration:
- Theme: {{theme}}
- Child's name: {{childName}}
- Three things the child loves: {{favoritesList}}
- Lesson of the day: {{lessonOfTheDay}}
- Tone: {{tone}}
- Preferred art style: {{artStyle}}

Tasks:

1. Write the full text for this page, as 3-5 short, simple sentences that can be read aloud to a 3-5 year old at bedtime.
2. Write a detailed description of the illustration for this page that:
   - Clearly describes the main character using the same visual traits and outfit as in the character sheet.
   - Matches the events of this page.
   - Uses a gentle, cozy, age-appropriate scene.
   - Adapts to the requested art style.

Return a JSON object:

{
  "pageNumber": {{pageNumber}},
  "text": "3-5 sentences of story text for this page.",
  "imagePrompt": "A detailed description of the illustration to generate for this page, including character appearance and a simple background."
}

Do not include any extra commentary outside the JSON.
