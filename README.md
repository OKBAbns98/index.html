# English Arena

A free practice site for IELTS preparation and general English. It runs as a single static page: no build step, no server and no dependencies.

**Live site:** `https://<your-username>.github.io/<repository-name>/` (replace with your own address once GitHub Pages is on)

> English Arena is an independent practice site. It is not affiliated with, or endorsed by, the IELTS partners. IELTS is a registered trademark of its owners. For official test information, visit [ielts.org](https://ielts.org).

## Features

**Scoreboard**
- Set your latest band (0 to 9, half bands) for Listening, Reading, Writing and Speaking.
- The overall band is calculated using IELTS rounding.
- Set a target band and see which skills still need work.

**Practice room**
- **Reading:** two original passages with True/False/Not given and multiple-choice questions, a passage highlighter and a best score for each passage.
- **Listening:** a recording read aloud by the browser, four questions and a show/hide transcript.
- **Vocabulary:** academic word flashcards that remember which words you have learned.
- **Writing (Task 2):** random essay questions, a 40-minute timer and a live word count toward 250.
- **Chart writing (Task 1):** a bar chart question, a 20-minute timer and a word count toward 150.
- **Speaking (Part 2):** cue cards with a one-minute preparation timer and a two-minute speaking timer, plus a box for your transcript.
- **Exam mode:** hides everything except the practice tabs.

**AI evaluation** (see the note on hosting below)
- Writing, chart writing and speaking responses get estimated bands for each criterion, strengths, priority fixes and an improved sentence.
- Reading and listening answers get explanations that point to the evidence in the passage or transcript.
- Speaking can be dictated in supported browsers.

**English practice**
- Four grammar lessons (present perfect and past simple, conditionals, relative clauses, articles) with instant feedback.
- A 12-question level test with an estimated CEFR level and a rough IELTS range.

**Progress by module**
- A summary of reading and listening results, draft lengths and vocabulary learned.

All progress, scores and drafts are saved in the visitor's own browser using `localStorage`. Nothing is sent to a server, and there are no accounts.

## Run it locally

1. Download `index.html`.
2. Open it in a web browser. That's all.

## Deploy with GitHub Pages

1. Create a **public** repository.
2. Upload `index.html` (and this `README.md`) to the repository root.
3. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and the `/ (root)` folder, then click **Save**.
4. Tick **Enforce HTTPS** once it is available.
5. After a minute or two, your site appears at the address shown on that page.

## Important: AI features and hosting

The AI evaluation and the Dictate button depend on a runtime that is only available when the page is hosted on claude.ai. On GitHub Pages or any other host:

- The AI and Dictate buttons stay hidden.
- Everything else works normally.

To offer AI feedback on your own host, you would need a small backend that calls an AI API with your own key, plus sign-in and usage limits. Never put an API key in `index.html`, because anyone can read it.

## Customise the content

Everything lives in `index.html`. The content sits in plain lists inside the `<script>` section:

| What | Name in the script |
| --- | --- |
| Reading passages and questions | `Q` (first passage) and `READ` (all passages) |
| Listening script and questions | `L` |
| Vocabulary words | `V` |
| Writing prompts (Task 2) | `WP` |
| Speaking cue cards | `SC` |
| Grammar lessons | `GR` |
| Level test questions | `LV` |

Grammar and level-test questions use this format, with the correct answer first (the page shuffles the options):

```js
['Question with a ___ gap.', 'correct answer', 'wrong option', 'wrong option', 'Short explanation.']
```

Colours and fonts are set with CSS variables at the top of the file (`:root`), with a separate set for dark mode.

## Notes

- **Browsers:** current versions of Chrome, Edge, Firefox and Safari. Listening playback uses the browser's text-to-speech, so voices vary. Dictation works only in browsers that support it.
- **Fonts:** Bricolage Grotesque and DM Sans load from Google Fonts, with system fonts as a fallback.
- **Content:** all passages, questions and lessons are original. Don't copy official IELTS or other publishers' materials into the site without permission.
- **Estimates only:** bands and levels shown by the site are rough guides, not official scores.

## Ideas for next steps

- More full-length reading and listening tests with real audio recordings
- A mock-test mode that chains all four skills with timing
- Accounts, usage limits and payments for a paid tier
- A teacher dashboard for schools and tutors

## Licence

Add a licence of your choice before sharing the code publicly (for example, MIT). Until you do, all rights are reserved by default.
