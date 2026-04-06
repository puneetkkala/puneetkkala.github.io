---
title: "Beyond Maya's Day: Non-text Content with AI"
subtitle: "Using AI Skills to Detect, Generate, and Audit WCAG 2.2 Success Criterion 1.1.1 at Scale"
description: "Maya's screen reader said \"Image.\" and moved on. That moment — one blind librarian, one missing alt text, one ordinary morning — is a problem that repeats itself millions of times a day across digital products of every kind. This article picks up where Maya's story ends, and asks: what if AI could catch these failures before they reach the user? Written for accessibility specialists who want to leverage AI without losing human oversight, this piece introduces six model-agnostic AI skills — covering alt text generation, alt text evaluation, decorative vs. informative classification, CAPTCHA accessibility, long description assessment, and bulk-scale auditing — each with a full instruction set ready to use with Claude, Gemini, GPT, or any other large language model. No platform lock-in. No magic. Just structured, reviewable AI that turns a month-long audit into a morning's work."
date: "2026-04-04"
author: "Puneet Kala"
tags:
   - WCAG
   - WCAG 2.2
   - Accessibility
   - Digital Accessibility
   - Success Criterion 1.1.1 Non-text Content
   - Alt Text
   - Alt Text Generation
   - AI Accessibility
   - Artificial Intelligence
   - A11y
   - AI Skills
   - LLM
   - Prompt Engineering
   - Accessibility Automation
   - CAPTCHA Accessibility
   - Screen Reader
   - Assistive Technology
   - Inclusive Design
   - Digital Inclusion
   - Accessibility Audit
   - Long Description
   - Image Classification
   - Multimodal AI
   - Accessibility Testing
readTime: 11
---
# Beyond Maya's Day: Non-text Content with AI

## The Problem at Scale

Maya's screen reader said one word: *"Image."*

That single moment — a blind librarian opening a news app and hitting a wall of silence where a description should have been — captures everything that is wrong with how digital accessibility is practised at most organisations today. Not a lack of awareness. Not a lack of guidelines. A lack of capacity.

WCAG 2.2 Success Criterion 1.1.1 is not complicated. If you put non-text content in a digital product, you provide a text alternative that serves the same purpose. The rule has existed since the first version of the guidelines. And yet missing or meaningless alt text remains one of the most common accessibility failures found in audits — year after year, across organisations of every size.

The reason is scale. An organisation publishing hundreds of content pieces a week — articles, product pages, dashboards, app screens, training materials — carries thousands of images, icons, charts, audio clips, and animations across its digital estate. Auditing all of them manually is not a realistic proposition. By the time a human audit cycle completes, the content has changed. New images uploaded. Descriptions overwritten. Charts regenerated without their long descriptions.

This is where artificial intelligence, applied thoughtfully and with human oversight, changes the equation.

This article is about that application. Not about how to write alt text — if you need that foundation, [A Day in the Life of Maya: Understanding Non-text Content](https://www.happyhub.in/blog/non-text-content) covers it through the lived experience of someone who depends on it every day. This article is about how to build and deploy AI skills that detect WCAG 1.1.1 issues, generate meaningful text alternatives, distinguish decorative content from informative content, evaluate CAPTCHA accessibility, and audit non-text content at a scale no human team can match alone.

Every skill described here is model-agnostic. Whether you work with Claude, Gemini, GPT, Mistral, or any other large language or vision model, the structure applies. The AI is the engine. You are the one who decides where it drives — and when to take the wheel yourself.

## What AI Can and Cannot Do Here

Before the skills, honesty about the boundaries.

Large multimodal models — those that process both images and text — are genuinely capable of several things relevant to WCAG 1.1.1. They can describe the content of an image. They can evaluate whether a given alt text accurately reflects what an image shows. They can assess whether an image appears decorative or informative based on visual and contextual signals. They can scan content exports for missing or placeholder text alternatives at a scale no manual process can match. They can flag CAPTCHA implementations that lack alternative modalities. They can reason about context — asking not just "what is this image?" but "what purpose does this image serve in this product?"

What AI cannot reliably do — not yet, and not without human oversight — is make final accessibility determinations. It does not know your brand voice. It does not know whether an image is legally sensitive. It does not know that the bar chart on your intranet has already been described in the paragraph immediately above it, making a brief alt text a deliberate, correct choice. It can be wrong. It can generate confident but inaccurate descriptions. It can misclassify a complex infographic as decorative.

The right model is AI as a skilled first-pass auditor and a tireless generator — producing output that an accessibility specialist reviews, refines, and approves. Not a replacement for expertise. An amplifier of it.

## Skill 1: Alt Text Generator

### Concept

The most direct application of AI to WCAG 1.1.1 is generating text alternatives for images. This sounds straightforward. In practice it is nuanced — because a good text alternative is not a description of what an image *looks like*. It is a description of what an image *means* in its context.

Maya's library updated its events page with a photograph of a children's storytelling event. The correct alt text was not just "a photograph of children." It was a description that conveyed the warmth, the setting, the action — the information a sighted reader would take in at a glance. The same image on a different page, for a different purpose, might need a completely different description.

Context is everything. A vision model can see the image. A language model can reason about context. Together, with the right instruction set, they can produce alt text that is purposefully appropriate — not just visually accurate.

### Skill

```
---
name: wcag-111-alt-text-generator
description: Generates WCAG 2.2 compliant alt text for non-text content. Use
  when an image, icon, chart, or other non-text asset is provided and a text
  alternative needs to be created. Works best with page context supplied
  alongside the image.
---
Analyse the image and any available context, then do the following:

1. **Identify the image type**: Determine whether the image is informative,
   functional (a link or button), decorative, or contains visible text.

2. **Generate the appropriate alt text**:
   - Informative: describe what the image conveys, not what it looks like.
     Do not begin with "Image of" or "Photo of".
   - Functional: describe the destination or action, not the image appearance.
     A printer icon on a print button should read "Print", not "Printer icon".
   - Contains text: include that text verbatim. Flag if a long description
     is also needed.
   - Decorative: output an empty string and explain your reasoning.
   - Insufficient short description: provide a short alt text, flag that a
     long description is needed, and draft that long description.

3. **State your confidence level** — high, medium, or low — with a brief
   reason for any uncertainty.

4. **If context is insufficient**: list what you need, then provide two
   alternative outputs — one assuming informative, one assuming decorative —
   so a human reviewer can choose.

Always output:
- Alt text: [your alt text, or empty string]
- Type: [informative / functional / decorative / contains-text / needs-long-description]
- Confidence: [high / medium / low]
- Notes: [flags, uncertainties, or escalation recommendations]
```

**What to watch for:** Low-confidence flags are your signal to review manually. Any image marked "needs-long-description" should be escalated to a content author. Images containing text the model cannot read clearly should be flagged for human transcription.

## Skill 2: Alt Text Evaluator

### Concept

Generating alt text for images that have none is only half the problem. The other half — arguably the more dangerous half — is existing alt text that is technically present but functionally useless.

Maya encountered this constantly. The news app that said "Image." The city council form with a CAPTCHA that offered no explanation. But there is a subtler version of the same failure: alt text that exists, passes a basic automated check, and is still wrong. A filename left in place during upload. A description that was accurate when the image was first published but is now stale because the image changed and the alt text did not. A bar chart described as "showing sales data" — with no mention of which bars are red because they indicate underperformance, which is the entire point of the colour coding.

An AI evaluator skill can systematically assess alt text quality against WCAG 1.1.1 criteria — across hundreds of assets, in a fraction of the time a manual audit would take.

### Skill

```
---
name: wcag-111-alt-text-evaluator
description: Evaluates existing alt text against WCAG 2.2 Success Criterion
  1.1.1. Use when an image already has a text alternative and you need to
  assess whether it is accurate, complete, and appropriate. Provide the image
  and its current alt text; page context improves accuracy.
---
Given the image, its existing alt text, and any available page context,
classify the alt text against these failure conditions and produce a verdict:

1. **Classify the failure type** (or confirm a pass):
   - Missing: alt text is absent, null, or empty on an image that requires one
   - Placeholder: a filename, generic label ("image", "photo"), or programmer
     reference ("img001", "picture 1")
   - Inaccurate: does not correctly describe the image content
   - Incomplete: omits important information — colour-coded distinctions, text
     visible in the image, or data in a chart or graph
   - Stale: appears to describe a different version of the image than the one
     currently shown
   - Mismatch: describes appearance rather than function (e.g. "magnifying
     glass" on a search button instead of "Search")
   - Verbose: excessively long for a simple image, or begins with "Image of"
     or "A photo showing"
   - Language mismatch: alt text is in a different language than the page
   - Pass: appropriate, accurate, and sufficient for its context

2. **Pay particular attention to colour**: if the image conveys meaning
   through colour differences and the alt text does not capture that in text
   form, classify as Incomplete regardless of other accuracy.

3. **For each failure found**: explain why it fails and provide a corrected
   alt text.

4. **Assign an overall verdict**: Pass, Fail, or Needs-Review (when context
   is insufficient to be certain).

Always output:
- Verdict: [Pass / Fail / Needs-Review]
- Failure type(s): [list]
- Explanation: [plain language]
- Recommended alt text: [improved version, or "no change needed"]
- Notes: [additional flags]
```

**What to watch for:** Stale flags require content author involvement — the AI can detect inconsistency, but only a human with knowledge of the content history can confirm it. Incomplete flags on charts and data visualisations are especially important and easy to miss in manual audits.

## Skill 3: Decorative vs. Informative Classifier

### Concept

One of the trickier judgement calls in WCAG 1.1.1 is determining whether an image is purely decorative — and therefore should have an empty alt attribute, hidden from assistive technology — or whether it carries information that must be conveyed in text.

When Maya was updating the library's events page, she encountered both in the same session: a rich storytelling photograph that needed a full description, and a decorative swirl in the corner that needed to be silently ignored. She made those calls correctly, one at a time, through experience and judgement.

At scale, that judgement has to be systematised. An AI classifier can make a strong first-pass determination, surface the borderline cases for human review, and ensure that nothing is silently defaulted to decorative when it should not be.

### Skill

```
---
name: wcag-111-decorative-classifier
description: Classifies images as decorative, informative, functional, or
  ambiguous to determine the correct WCAG 1.1.1 treatment. Use before writing
  or applying alt text. Always provide page context alongside the image for
  reliable results.
---
Given the image and any available page context, classify it into one of the
following categories and explain your reasoning:

1. **Decorative**: serves only an aesthetic purpose — no information, no
   function. Removing it causes no loss. Examples: background textures,
   divider lines, abstract flourishes, atmospheric stock photos.
   → Treatment: empty alt attribute, hidden from assistive technology.

2. **Informative**: conveys information not available in surrounding text.
   Removing it would give sighted users information others cannot access.
   Examples: news photographs, process diagrams, data charts, maps.
   → Treatment: meaningful alt text; flag if a long description is also needed.

3. **Functional**: a control or part of a link — purpose defined by what it
   does, not what it shows. Examples: icon-only buttons, linked logos,
   image maps.
   → Treatment: alt text describes the destination or action, not the image.

4. **Contains text**: includes text important to understanding the content.
   Examples: screenshots, infographics, handwritten notes, logos with text.
   → Treatment: include the text verbatim; flag if a long description is needed.

5. **Ambiguous**: role cannot be determined from the information provided.
   → Output: list the specific context needed to make a determination.
     Never default ambiguous images to decorative — always escalate.

Also flag any case where the same image appears to serve different roles in
different contexts. This signals that context-sensitive alt text is needed,
not a single global value.

Always output:
- Classification: [Decorative / Informative / Functional / Contains-text / Ambiguous]
- Reasoning: [plain language]
- Recommended treatment: [what to do next]
- Long description needed: [yes / no / possibly]
- Notes: [flags]
```

**What to watch for:** Images classified as Ambiguous should never be silently defaulted to decorative — that is the more dangerous error. Always escalate ambiguous cases for human review.

## Skill 4: CAPTCHA Accessibility Evaluator

### Concept

Maya spent an afternoon filling out a public consultation form — her name, her address, a carefully written response about changes to public transport. Then she hit the CAPTCHA. Her screen reader said "Image." No label. No audio alternative. No explanation. She closed the tab and called the council on the phone instead.

That is what a CAPTCHA failure looks like in practice: a user who wanted to participate, couldn't, and had no visible path forward.

WCAG 1.1.1 does not ban CAPTCHAs. It requires that if you use one, you provide a text alternative describing its purpose, and offer at least two modalities — so that a user who cannot complete one form of the test has another option available. In practice, CAPTCHA implementations are audited inconsistently. An audio alternative may exist in the code but not be surfaced to keyboard or screen reader users. The text alternative may describe the image but not the task. There may be only one modality despite the requirement for two.

An AI skill can evaluate CAPTCHA implementations against these criteria systematically.

### Skill

```
---
name: wcag-111-captcha-evaluator
description: Evaluates a CAPTCHA implementation against WCAG 2.2 Success
  Criterion 1.1.1. Use when a new CAPTCHA is introduced or an existing one
  is updated. Provide a screenshot or description of the implementation,
  the current text alternative, and details of available modalities.
---
Evaluate the CAPTCHA implementation against the following checklist and
produce a structured verdict:

1. **Text alternative**:
   - Is one present?
   - Does it identify the content as a CAPTCHA?
   - Does it describe what the user must do?
     (e.g. "Type the word shown in the image" / "Type the letters in the audio")
   - If an alternative modality exists, does the text alternative explain
     how to access it?

2. **Modality coverage** (minimum required: 2 distinct modalities):
   - List each modality present: visual image, audio, logic/text puzzle, other.
   - Is there a mechanism to switch between modalities?
   - Is that switching mechanism itself accessible — labelled, keyboard
     operable, reachable by screen reader?

3. **Best practice** (beyond the minimum):
   - Are more than two modalities offered?
   - Is there an option to contact a human representative to bypass the CAPTCHA?
   - Are authenticated or returning users exempt?

For each gap, classify as:
- Fail: directly violates a WCAG 1.1.1 requirement
- Best-practice gap: does not violate the minimum but falls short of
  recommended guidance
- Pass: requirement met

Always output:
- Overall verdict: [Pass / Fail / Partial]
- Text alternative assessment: [Pass / Fail] + explanation
- Modality count: [number]
- Modalities present: [list]
- Specific failures: [list with explanations]
- Best practice gaps: [list]
- Recommendations: [prioritised list]
```

**What to watch for:** An audio alternative that exists in code but is not surfaced to keyboard-only or screen reader users is a common gap this skill may not catch without implementation detail. Always pair CAPTCHA audits with manual assistive technology testing.

## Skill 5: Long Description Assessor

### Concept

Short alt text handles most images. But some non-text content — complex charts, detailed maps, multi-layered infographics, data tables rendered as images — cannot be adequately described in a sentence or two. WCAG 1.1.1 permits a short alt text that points to a long description, provided the long description actually serves the same purpose as the original content.

This last condition is where many implementations fail quietly. The long description exists. It is associated with the image. But it describes the image's general topic rather than its specific data. It omits the fact that the red bars in the chart indicate underperformance. It does not include the actual figures — only a vague summary of the trend. Or it is simply a copy of the visible caption, which was already there.

When Maya wrote alt text for the library's annual borrowing chart, she did not write "a bar chart showing borrowing trends." She wrote a short label — "Figure 1: Annual borrowing figures, 2021–2024" — and then, in a linked description below, provided the actual data: the numbers, the trends, the year-on-year comparison, presented in a table. The short label identifies. The linked description does the real work. That is what a long description is for. An AI skill can evaluate whether existing long descriptions meet that standard, and generate new ones for complex images that currently have none.

### Skill

```
---
name: wcag-111-long-description-assessor
description: Evaluates or generates long descriptions for complex non-text
  content such as charts, graphs, maps, and infographics. Use in evaluate
  mode when an existing long description needs quality review. Use in
  generate mode when a complex image has no long description yet.
---
Operate in one of two modes depending on the input provided:

**Mode A — Evaluate** (existing long description provided):
Assess whether the long description serves the same purpose and presents
the same information as the image.

Check all of the following:
- Does it convey ALL information a sighted user would gain — data points,
  trends, relationships, labels, colour-coded distinctions, and structure?
- Is it in the same language as the surrounding content?
- Does it avoid merely restating caption text already visible on the page?
- For charts: does it include actual data values, not just trend summaries?
- For maps: does it include specific location information, not just general
  descriptions?
- For diagrams: does it convey relationships between elements, not just
  list them?

Verdict options:
- Pass: adequately serves the same purpose as the image
- Fail — Incomplete: omits significant information the image conveys
- Fail — Inaccurate: misrepresents what the image shows
- Fail — Wrong format: prose loses important structure; a table or list
  would better preserve the information
- Needs revision: partially adequate but requires specific additions

For any Fail verdict, provide a revised long description.

**Mode B — Generate** (no long description exists):
1. Identify the content type: chart, graph, map, diagram, infographic,
   table-as-image, or other.
2. Extract all information a sighted user would gain: data values, labels,
   trends, relationships, colour-coded distinctions, structural hierarchy.
3. Choose the most appropriate format — prose, structured list, or table.
   Tables are usually best for data-heavy content.
4. Write the long description so it could fully substitute for the image
   if the image were removed.
5. Provide a short alt text to accompany it.

Always output (Mode A):
- Verdict: [Pass / Fail type / Needs revision]
- Gap analysis: [what is missing or wrong]
- Revised long description: [if needed]

Always output (Mode B):
- Short alt text: [text]
- Long description: [full text]
- Format used: [prose / list / table]
- Notes: [flags or uncertainties]
```

## Skill 6: Non-Text Content Auditor (Bulk Scale)

### Concept

The five skills above operate on individual assets. This skill operates at a different level — across an entire content export, a sitemap, a component library, or a batch of pages — identifying every instance of non-text content and classifying each one's compliance status.

Maya's single day surfaced a news app with no alt text, a bar chart that needed both a short label and a linked long description, a decorative image that needed to be silently hidden, and a CAPTCHA that failed entirely. Multiply that across an organisation's entire digital estate and you have an audit that no team can complete manually in any reasonable timeframe.

This is the skill that makes AI genuinely transformative for accessibility specialists. Rather than reviewing pages one at a time, you run a bulk audit across hundreds of pages, generate a prioritised findings report, and walk into a stakeholder meeting with data rather than anecdotes.

### Skill

```
---
name: wcag-111-non-text-content-auditor
description: Audits non-text content across a batch of pages or a content
  export for WCAG 2.2 Success Criterion 1.1.1 compliance. Use when running
  a scale accessibility audit across a site section, component library, or
  full digital estate. Provide a URL list, HTML export, JSON content export,
  or component inventory as input.
---
For each item in the provided content batch, work through these four steps:

**Step 1 — Inventory**
Identify all instances of non-text content. For each, record:
- Content type: image, icon, chart/graph, audio, video, animation, CAPTCHA,
  ASCII art, emoticon used as content, image of text, or other
- Location: page URL or component name, section, position
- Current alt text or text alternative (if any)

**Step 2 — Classify**
Apply one classification to each item:
- Critical fail: conveys essential information or performs a function, but
  has no text alternative or only a placeholder (filename, "image", "photo",
  empty on informative content). Impact: high.
- Moderate fail: has a text alternative, but it is inaccurate, incomplete,
  stale, in the wrong language, or mismatches the image's function.
  Impact: medium.
- CAPTCHA fail: lacks a descriptive text alternative, offers fewer than two
  modalities, or has an inaccessible modality-switching mechanism. Impact: high.
- Decorative — correctly implemented: purely decorative, correctly hidden
  from assistive technology. No action needed.
- Decorative — incorrectly implemented: appears decorative but not marked up
  to be ignored by assistive technology. Impact: low to medium.
- Needs review: compliance status cannot be determined. Escalate.

**Step 3 — Prioritise**
Rank findings by:
1. Severity: Critical fail and CAPTCHA fail first, then Moderate fail,
   then Decorative — incorrectly implemented
2. Reach: high-traffic or high-visibility pages before low-traffic ones
3. User impact: content that blocks task completion above content that
   degrades experience

**Step 4 — Report**
Produce a structured audit report containing:
- Executive summary: total items scanned, breakdown by classification,
  percentage compliant
- Critical findings: location, description, and recommended fix for each
  Critical fail and CAPTCHA fail item
- Moderate findings: list of Moderate fail items
- Decorative issues: list of Decorative — incorrectly implemented items
- Items requiring human review: list with reason for escalation
- Recommended remediation order: prioritised action list
```

**What to watch for:** Bulk audits are only as good as the input data. If your content export includes image URLs but not the images themselves, the model can flag missing alt text but cannot visually assess image content. For full visual assessment, your pipeline needs to fetch and process each image. Build your input accordingly.

## Bringing the Skills Together

These six skills are not meant to operate in isolation. They are building blocks for an accessibility workflow that can be embedded into content production and quality assurance processes.

**At content creation time**, the Decorative vs. Informative Classifier runs first when an author uploads an image — determining whether any alt text is needed at all. If the image is informative or functional, the Alt Text Generator produces a draft for the author to review and approve.

**At content review time**, the Alt Text Evaluator checks every existing text alternative against the image currently in use — catching staleness, inaccuracy, and placeholder text before content is published. The Long Description Assessor flags complex images that need more than a short label.

**At audit time**, the Non-Text Content Auditor runs across entire sections of the digital estate, producing a prioritised findings report that tells the accessibility team exactly where to focus remediation effort.

**For specific compliance checks**, the CAPTCHA Accessibility Evaluator runs when a new CAPTCHA is introduced or an existing one is updated.

At every stage, the AI produces output. The accessibility specialist reviews, refines, and approves it. The human remains the authority. The AI does the work that would otherwise be impossible at scale.

## A Note on Uncertainty and Human Oversight

Every skill above includes a mechanism for expressing uncertainty — confidence levels, NEEDS-REVIEW classifications, escalation flags. This is not a courtesy. It is a design requirement.

An AI that confidently misclassifies a complex infographic as decorative, or generates plausible but inaccurate alt text without flagging its uncertainty, is more dangerous than no AI at all. Confident errors propagate silently. Flagged uncertainties get reviewed.

When deploying these skills, build your workflow so that low-confidence outputs are automatically escalated for human review. Treat AI-generated alt text the way you would treat a first draft from a junior team member: potentially excellent, always worth reading before it ships.

## What This Changes

Maya's story ends with a thought: a text alternative is a hand extended. It says this thing exists, this is what it is, this is what it does, and it is also for you.

AI does not change what that hand needs to offer. The standard is the same. WCAG 1.1.1 is the same. What changes is how many hands can be extended, and how quickly.

An audit that would take months takes hours. Alt text generation for a product image library becomes a background process rather than a backlog. The accessibility specialist's expertise — which is finite and valuable — gets applied to review, strategy, and the cases that genuinely require human judgement, rather than consumed entirely by the task of writing descriptions for ten thousand images one by one.

These skills are a starting point. They are model-agnostic by design: you bring the AI, you bring the context, the skill structure provides the reasoning framework. Adapt them to your tools, your content types, your organisation's specific failure patterns.

And when you find something the AI cannot handle — an image too culturally specific for a general model to interpret, a CAPTCHA implementation too novel to evaluate from first principles, a long description so technically complex it requires domain expertise — that is where you come in.

That is always where you come in.

---

*This article is a companion to [A Day in the Life of Maya: Understanding Non-text Content](https://www.happyhub.in/blog/non-text-content). Together they cover WCAG 2.2 Success Criterion 1.1.1: Non-text Content (Level A) — first through lived experience, then through AI-assisted practice. All skills described are model-agnostic and intended for use by accessibility specialists as part of a human-reviewed workflow.*

## References 📖

- 🥇 **WCAG 2.2 Success Criterion 1.1.1: Non-text Content** — [W3C](https://www.w3.org/TR/WCAG22/#non-text-content) _License: W3C Document License_
- 🥇 **Understanding SC 1.1.1: Non-text Content** — [W3C WAI](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content) _License: W3C Document License_
- 🥇 **Techniques for SC 1.1.1** — [W3C WAI](https://www.w3.org/WAI/WCAG22/quickref/#non-text-content) _License: W3C Document License_
- 🥈 **A Day in the Life of Maya: Understanding Non-text Content** — [Happy Hub](https://www.happyhub.in/blog/non-text-content) _(companion article covering SC 1.1.1 through lived experience)_
- 🥇 **Images Tutorial** — [W3C WAI Web Accessibility Tutorials](https://www.w3.org/WAI/tutorials/images/) _License: W3C Document License_
- 🥇 **Accessibility of AI-Generated Content** — [W3C WAI](https://www.w3.org/WAI/research-topics/) _License: W3C Document License_
- 🥉 **International Association of Accessibility Professionals (IAAP)** — [accessibilityassociation.org](https://www.accessibilityassociation.org/) _(professional body for CPACC certification)_
- 🥉 **WebAIM: Alternative Text** — [WebAIM](https://webaim.org/techniques/alttext/) _License: Educational Resource_