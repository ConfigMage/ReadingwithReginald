Create a main child protagonist for a bedtime story for a child aged 3-5.

The story configuration is:
- Theme: {{theme}}
- Child's name: {{childName}}
- Three things the child loves: {{favoritesList}}
- Lesson of the day: {{lessonOfTheDay}}
- Tone: {{tone}}
- Preferred art style: {{artStyle}}

The protagonist should be roughly the same age as the child (3-5), and feel relatable and friendly.

Return a JSON object with the following shape:

{
  "name": "string - the character's first name (use the child's name if it makes sense)",
  "description": "short paragraph describing who they are in the story",
  "visual_traits": [
    "bullet point list of key visual traits, like hair color, hairstyle, eye color, clothing, and any distinctive items"
  ],
  "personality": "short description of their personality, focusing on positive, age-appropriate traits",
  "fixed_outfit": "description of a consistent outfit they wear throughout the story",
  "color_palette": [
    "list of main colors to use for clothing and accessories"
  ],
  "notes_for_illustrator": "any extra details that will help keep the character visually consistent across pages"
}

Do not include any extra commentary outside the JSON.
