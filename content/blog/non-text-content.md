---
title: "A Day in the Life of Maya: Understanding Non-text Content"
subtitle: "Understanding WCAG 2.2 Success Criterion 1.1.1 — Non-text Content Through Everyday Experience"
description: "Explore WCAG 1.1.1 (Non-text Content) through the experience of a blind user. Understand alt text, exceptions, and why text is a universal format."
date: "2026-03-29"
author: "Puneet Kala"
tags: 
  - WCAG
  - WCAG 2.2
  - Accessibility
  - Web Accessibility
  - Success Criterion 1.1.1
  - Non-text Content
  - Text Alternatives
  - Alt Text
  - Screen Reader
  - Inclusive Design
  - A11y
  - Accessibility for Beginners
  - CAPTCHA Accessibility
  - Digital Inclusion
  - UX
  - Accessibility Story
  - Level A
  - Assistive Technology
  - Braille
  - Blind Users
  - Low Vision
readTime: 10
---


## 🌅 Morning — The Alarm and the App

Maya woke up at 7:04 a.m. to the sound of her phone buzzing on the nightstand. She was forty-three, a librarian by trade, and had been blind since her late twenties — a gradual loss that she had, over the years, quietly folded into the architecture of her daily life.

She reached for her phone and tapped the screen. Her screen reader — a piece of software that converted what was on the display into spoken words — began to narrate the notifications waiting for her. A weather update. An email from her sister. A reminder about a dentist appointment.

Then she opened a news app to catch the morning headlines.

*"Image,"* the screen reader said flatly.

Maya frowned. She tapped the image, hoping for more. *"Image,"* it repeated.

She moved on, but the moment stayed with her — a small, unnecessary wall placed between her and the world. The photograph had been there. She could tell from context it was probably related to the story about the city council elections. But whoever had built that app had not given the image a **text alternative** — a description, even a brief one, that would tell her what she was missing.

This was not a minor inconvenience. This was information, withheld.

## What Is Non-Text Content, Anyway?

Maya had explained this to her nephew Daniel once over dinner. He was a web developer, fresh out of university and full of enthusiasm, but genuinely puzzled by accessibility.

"What do you mean, non-text content?" he'd asked, twirling his pasta.

"Anything that isn't a sequence of characters," she'd said. "A photograph. A chart. A button made of an icon. A video. An audio clip. Even those little faces people send in messages — emoticons — those count too. And ASCII art, where someone draws a cat out of slashes and dashes. Or text that's been deliberately altered to look like something else — people online sometimes write words using characters from other alphabets that look like English letters but aren't. That's called leetspeak or text look-alikes. My screen reader reads what the character *actually is*, not what it *looks like*."

Daniel had nodded slowly. "So the image of a magnifying glass on a search button — "

"Should say 'Search.' Not 'magnifying glass,' not 'image003.png,' not nothing. *Search.* Because that's what it does. That's its purpose."

This, in essence, is the heart of WCAG Success Criterion 1.1.1: **Non-text Content**. It is a Level A requirement — the most basic, foundational level of accessibility — under the Web Content Accessibility Guidelines version 2.2. Its principle is simple: if you put something on a web page that isn't text, you must provide a text alternative that serves the same purpose.

## 📚 Mid-Morning — At the Library

Maya arrived at the library where she worked just before nine. Her colleagues knew her as the person who could locate any book in the stacks by memory alone, who remembered the Dewey Decimal system the way other people remembered old song lyrics.

She settled into her desk and opened her computer. Today she had to update the library's events page — a task she did every week. She used a web-based content management system that her library had adopted two years ago. She'd had to fight for a more accessible version.

The first item on the agenda: a photograph of last month's children's storytelling event.

She typed the description herself, carefully: *"A librarian in a yellow cardigan reads aloud from a large picture book to a group of approximately twenty children sitting cross-legged on a colourful rug in the children's section. The children appear engaged and smiling."*

This was a **long text alternative** — because the image conveyed real information, real warmth, real context that a short label alone couldn't carry.

For the adjacent bar chart showing how borrowing figures had changed over the past year, she wrote a short label — *"Figure 1: Annual borrowing figures, 2021–2024"* — and then, in a linked description below, provided the actual data in a table: the numbers, the trends, the year-on-year comparison. Because a chart is not just a picture. It contains information. And that information had to be available in text form too.

There was also a small decorative swirl image in the corner of the page — a piece of visual flair that the library's designer had added. Maya marked it as **purely decorative**, which told assistive technology to ignore it entirely. This mattered. If her screen reader announced every background flourish and spacer image on the page, she'd be drowning in noise. Non-text content that serves no informational purpose — that is only there for aesthetics — should be invisible to assistive technology. Implemented silently. A footnote in the code, not a voice in the ear.

## Why This Matters to So Many People

Maya thought sometimes about how many different people benefited from proper text alternatives — not just people who were blind.

Text alternatives could be read aloud by screen readers for people who were blind or had low vision. They could be displayed as text on screen for people who were deaf or hard of hearing and couldn't access audio content. People who were *deaf-blind* — like her friend Rosario, who used a refreshable braille display — received text alternatives as tactile characters under their fingertips. Even people who were sighted but had cognitive disabilities sometimes found that a clear, written description helped them understand a complex diagram or illustration.

And there were practical benefits too: text alternatives made non-text content searchable. They allowed content to be repurposed and translated. In the future — and researchers were already working on this — they might even allow text to be automatically converted into sign language.

The intent of the criterion wasn't bureaucratic. It was human. It was the recognition that text is the most flexible format for information we have — that it can be rendered in any modality, to any sense, for any person.

## Lunchtime — The Hearing Test

Maya had lunch in the staff room, then spent a few minutes browsing a continuing education portal for a course she was considering. The course was on audio cataloguing — how to properly tag and archive spoken-word recordings.

There was an introductory listening exercise. She was given an audio clip and asked to identify what she heard. The exercise was valid *because* it was audio. If someone had simply written out what the sounds were, the test would be meaningless. That was the point.

The platform had handled this well. It didn't provide a text alternative that gave away the answers — that would defeat the purpose. Instead, the text around the exercise said clearly: *"Listening identification exercise. Play the audio clip and answer the questions below."* A brief, descriptive label. Enough to know what it was and why it was there. Nothing that undermined the test itself.

This is what the guidelines call the **Test** exception. When non-text content is a test or exercise that would be invalid if its answers were given in text, you still need a text alternative — but that alternative only needs to *identify* the content, not replicate it. The same logic applies to a typing test, a visual pattern-recognition exercise, or a musical ear-training quiz.

There was also a short promotional video on the portal's homepage — a preview of the instructor giving a lecture. The page hadn't provided a transcript, but it had given the video a clear label: *"Preview: Introduction to Audio Cataloguing with Professor Chen."* A text alternative that told Maya what it was, even if it couldn't tell her everything that was in it. For live content — a live audio stream, a live traffic camera — this was the standard. You provided a descriptive label, so people knew what they were encountering and could make a choice about what to do next.

## 🤖 Afternoon — The CAPTCHA Problem

At two o'clock, Maya tried to submit a comment on a public consultation forum run by the city council. She filled in her name, her address, her carefully written response about the proposed changes to public transport routes.

Then she hit a wall.

*"Image,"* her screen reader said.

A CAPTCHA. One of those visual puzzles — distorted letters in a fuzzy box — designed to prove that the person completing the form was a human and not an automated script. She knew what it was. She'd run into them hundreds of times. The acronym stood for *Completely Automated Public Turing Test to Tell Computers and Humans Apart* — named, in its roundabout way, after Alan Turing, the mathematician who first asked whether machines could think.

The problem was well known in the accessibility community. CAPTCHAs were, by design, at the edge of human ability — hard enough to trip up bots. And that meant they were often impossible for people with certain disabilities. A visual CAPTCHA was useless to someone who was blind. An audio CAPTCHA was useless to someone who was deaf. There was no version of a traditional CAPTCHA that worked for everyone.

The guidelines acknowledged this tension honestly. They didn't ban CAPTCHAs outright — because if they did, many websites would abandon accessibility compliance altogether rather than give up the anti-spam tool. Instead, the approach was pragmatic: if you use a CAPTCHA, you must provide a text alternative that describes its purpose, and you must offer at least two different versions using different sensory modalities. A visual option *and* an audio option, at minimum.

This particular city council form had provided exactly one. An image with no label, no audio alternative, no explanation.

Maya sighed and closed the tab. She would call them on the phone instead.

Afterwards, she thought about what best practice would look like. More than two modalities. A logic puzzle in plain text — *"What is two plus seven?"* — alongside the image and audio. Access to a human customer service representative who could bypass the CAPTCHA entirely. And for registered users, not requiring it at all. These were not exotic demands. They were suggestions built into the same guidelines, for organisations motivated to go beyond the minimum.

## Late Afternoon — Daniel Calls

Her nephew rang at four.

"I've been thinking about what you said at dinner," he said. "About the search button. So the text alternative should describe what it *does*, not what it *looks like*?"

"Exactly," Maya said. "Think about it this way: if someone removed the image entirely and put the text alternative in its place, the page should still work. The user should still understand the purpose. So a magnifying glass icon on a search button should say 'Search' — because that's what happens when you click it. The shape of the icon is irrelevant to the function."

"What about an image on a news article? Like a photograph?"

"That's different. The photograph isn't a button. It's information. It should describe what's in the photograph — who's in it, what's happening, what the context is. But the level of detail depends on context. The same photograph of two world leaders shaking hands might need a simple caption on a general news page — *'President X shakes hands with Prime Minister Y'* — but a much richer, more detailed description on a page specifically analysing the diplomatic relationship between those two countries. The text alternative serves the *purpose* of the image in that *context*."

Daniel was quiet for a moment. "So there's no one-size-fits-all answer."

"There never is. But there are wrong answers. Leaving it blank is wrong. Writing 'image001.jpg' is wrong. Writing 'photo' or 'picture' or leaving a placeholder spacer — all wrong. Those aren't text alternatives. They're noise, or silence. Neither helps."

She heard him typing.

"And if the chart is complex?" he asked.

"Short description *and* long description. The short one tells you what it is — *'October sales chart.'* The long one provides the actual data — the numbers, the trends, what it means. And if you update the chart, you update the description at the same time. A text alternative that describes September's data on a page showing October's results is a failure. Not just technically — it's actively misleading."

## 🎶 Evening — The Concert Programme

Maya spent her evening getting ready for a concert — a chamber music performance at the local arts centre. Before she left, she visited the arts centre's website to read about the programme.

There was a painting on the homepage. A reproduction of a piece by a local artist — abstract, full of colour, a swirl of blues and reds that she knew from memory because she had once attended the exhibition. The website had described it: *"Abstract painting in blues and reds by local artist Priya Rao, displayed in the arts centre foyer."* Not a full critical analysis. Not an attempt to translate colour into emotion. Just a descriptive label, enough to know what it was and where it was. This was the **Sensory** exception in the guidelines — content that primarily existed to create a sensory experience, like a symphony performance or a work of visual art. You couldn't fully replace that experience in text. But you could name it. You could point to it. You could let someone know it existed and what it was.

That was the text alternative's job here. Not to substitute for the art. To introduce it.

At the concert, Maya sat in the third row, her white cane folded on her lap, and listened to a Schubert string quartet. She didn't need a text alternative for this. The music reached her entirely on its own terms. But she thought, as she often did, about the thousands of small moments in a day when that wasn't true — when the world offered an image, a button, a chart, a CAPTCHA, a video — and either extended a hand or didn't.

A text alternative was a hand extended. 🤲

It said: *this thing exists, this is what it is, this is what it does, and it is also for you.*

## A Note on Language

Before she fell asleep that night, Maya thought about one more thing Daniel had asked: what language should the text alternatives be in?

The answer was straightforward: the same language as the rest of the content. If the page was in German, the description should be in German. If it was in English, English. Accessibility-supported means nothing if the alternative is in a language the user doesn't read. The guidelines were clear: text alternatives should provide the same information in the same human language as the surrounding content.

And they should be genuine alternatives. Not look-alikes. Maya had once encountered a website where someone had written words using characters from other Unicode alphabets — characters that *looked* like the Latin letters for "cook" but were actually Greek and Cyrillic. Her screen reader had read them as the gibberish they technically were. It looked right to a sighted user. It was meaningless to her. The lesson: using visually similar characters from other writing systems as a substitute for real text is a failure. Appearance is not meaning. Representation in code is what matters.

## WCAG 1.1.1 Exceptions Quick Reference

Not all non-text content needs a full description. The guidelines outline specific exceptions where a descriptive label or different handling is required:

| Exception | Applies when... | Alt text requirement |
|---|---|---|
| **Controls / Input** | The image is a button or form element (like a search icon) | Name the **purpose** or action (e.g., "Search"), not the image appearance |
| **Time-Based Media** | The non-text content is audio or video | Provide a brief descriptive label (e.g., "Audio: Lecture on Cataloguing") |
| **Test** | Describing the item would give away the answer to the test | Provide a brief descriptive label (e.g., "Audio identification exercise") |
| **Sensory** | The content primarily creates a specific sensory experience (like art or a symphony) | Provide a brief descriptive label (e.g., "Painting: Water Lilies by Monet") |
| **CAPTCHA** | The image is used to distinguish humans from computers | Describe the purpose (e.g., "Security check") **and** provide an alternative modality (e.g., audio CAPTCHA) |
| **Decoration / Formatting** | The image serves no informational purpose and is purely aesthetic | Implement silently so assistive technology ignores it (e.g., empty `alt=""`) |

## 🤝 What We Carry Forward

WCAG Success Criterion 1.1.1 is, at its core, a statement about inclusion. It asks: if your content cannot be seen, or heard, or perceived in the way you've presented it — is there another way in?

For most non-text content, the answer is a text alternative: a description, a label, a piece of text that serves the same purpose. For controls, the alternative names the function. For time-based media, it identifies the content. For tests, it explains the purpose without spoiling it. For sensory experiences, it introduces without replacing. For CAPTCHAs, it describes the task and offers another way. For decoration, it steps aside entirely.

The failures are just as instructive as the successes: missing descriptions, outdated ones, placeholder filenames, colour information omitted from bar charts, text look-alikes, ASCII art with no label, long descriptions that tell a different story than the image they're supposed to represent.

None of this is technically complicated. Most of it takes seconds to implement well.

What it requires is simply the decision to think about who else might be arriving at your page, and what they will need when they get there.

Maya made that decision every day.

## Key Takeaways

- **Purpose over appearance:** Alt text should describe what the image *does* or the information it *conveys*, not what it visually looks like.
- **Context matters:** The same image might need different alt text depending on how it's used on the page.
- **Exceptions exist:** Controls, media, tests, sensory experiences, and CAPTCHAs have specific rules. Purely decorative images must be actively hidden from screen readers.
- **Format parity:** Non-text content must have a text alternative that serves the equivalent purpose in the same human language.
- **Never rely on filenames:** Placeholder text or filenames (like "image001.jpg") are active failures that create noise for users.

## Frequently Asked Questions

**What does "Non-text Content" mean in WCAG?**
It refers to anything on a web page that isn't a sequence of characters. This includes photographs, illustrations, charts, graphs, audio, video, CAPTCHAs, and ASCII art.

**Why is text considered the ultimate universal format?**
Text is highly flexible. It can be visually enlarged, read aloud by a screen reader, or translated into braille by a refreshable braille display, making it accessible to users with diverse sensory needs.

**Do all images need alt text?**
No. Images that are purely decorative or used only for visual formatting must be implemented so that assistive technologies ignore them (typically using an empty alt attribute: `alt=""`).

**How do you handle complex charts or graphs?**
A short alt text label should identify the chart (e.g., "Q3 Revenue Graph"), accompanied by a longer description — often a data table or long-form text on the same page — containing the actual data.

**Are CAPTCHAs accessible?**
Traditional visual CAPTCHAs exclude blind users. Under WCAG 1.1.1, if a CAPTCHA is used, you must describe its purpose in text and provide an alternative form of the CAPTCHA using a different sensory modality (like an audio CAPTCHA).

## References 📖

- 🥇 **WCAG 2.2 Success Criterion 1.1.1: Non-text Content** — [W3C](https://www.w3.org/TR/WCAG22/#non-text-content) _License: W3C Document License_
- 🥇 **Understanding SC 1.1.1: Non-text Content** — [W3C WAI](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content) _License: W3C Document License_
- 🥇 **How to Meet SC 1.1.1 (Quick Reference)** — [W3C WAI](https://www.w3.org/WAI/WCAG22/quickref/#non-text-content) _License: W3C Document License_
- 🥈 **Alternative Text** — [WebAIM](https://webaim.org/techniques/alttext/) _License: Educational Resource_
- 🥇 **Images Tutorial** — [W3C WAI Web Accessibility Tutorials](https://www.w3.org/WAI/tutorials/images/) _License: W3C Document License_
- 🥇 **Images Decision Tree** — [W3C WAI](https://www.w3.org/WAI/tutorials/images/decision-tree/) _License: W3C Document License_
- 🥉 **Beyond Maya's Day: Non-text Content with AI** — [Happy Hub](https://www.happyhub.in/blog/non-text-context-with-ai) _(companion article covering AI-assisted auditing of SC 1.1.1)_