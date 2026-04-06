export interface GlossaryItem {
    id: string
    term: string
    definition: string
    relatedLinks?: { label: string; url: string }[]
}

export const glossaryData: GlossaryItem[] = [
    {
        id: 'wcag',
        term: 'Web Content Accessibility Guidelines (WCAG)',
        definition: 'A set of internationally recognized guidelines developed by the W3C Web Accessibility Initiative (WAI) explaining how to make web content more accessible to people with disabilities. The standard is currently at version 2.2.',
        relatedLinks: [
            { label: 'W3C WCAG 2.2', url: 'https://www.w3.org/TR/WCAG22/' }
        ]
    },
    {
        id: 'pour',
        term: 'POUR Principles',
        definition: 'The four foundational principles of WCAG: Perceivable, Operable, Understandable, and Robust. All WCAG success criteria are organized under these four principles.',
        relatedLinks: [
            { label: 'The POUR Principles', url: '/blog/pour-principles' }
        ]
    },
    {
        id: 'perceivable',
        term: 'Perceivable',
        definition: 'The first POUR principle. It states that information and user interface components must be presentable to users in ways they can perceive, ensuring content is not invisible to all of their senses (sight, hearing, touch).',
    },
    {
        id: 'operable',
        term: 'Operable',
        definition: 'The second POUR principle. It states that user interface components and navigation must be operable, ensuring the interface does not require an interaction that a user cannot perform (e.g., providing keyboard alternatives for mouse-only actions).'
    },
    {
        id: 'understandable',
        term: 'Understandable',
        definition: 'The third POUR principle. It states that information and the operation of user interfaces must be understandable and predictable for users.'
    },
    {
        id: 'robust',
        term: 'Robust',
        definition: 'The fourth POUR principle. It states that content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies, even as technology evolves.'
    },
    {
        id: 'social-model',
        term: 'Social Model of Disability',
        definition: 'A framework asserting that people are disabled not by their physical or cognitive differences, but by barriers in society (e.g., inaccessible buildings, unlabelled digital images). It is the philosophical foundation of digital accessibility.',
        relatedLinks: [
            { label: 'The Social Model of Disability', url: '/blog/social-model' }
        ]
    },
    {
        id: 'medical-model',
        term: 'Medical Model of Disability',
        definition: 'A traditional framework that views disability as a personal medical condition or deficit to be cured, treated, or managed, placing the "problem" within the individual rather than the environment.',
        relatedLinks: [
            { label: 'The Medical Model of Disability', url: '/blog/medical-model' }
        ]
    },
    {
        id: 'curb-cut-effect',
        term: 'Curb-Cut Effect',
        definition: 'The phenomenon where accommodations designed specifically for people with disabilities end up benefiting everyone. Named after sidewalk curb cuts originally made for wheelchairs that also benefit strollers and luggage.'
    },
    {
        id: 'alt-text',
        term: 'Alternative Text (Alt Text)',
        definition: 'A textual description of an image provided via the HTML `alt` attribute. It is read aloud by screen readers and displayed if the image fails to load, conveying the image\'s purpose or emotional intent.',
        relatedLinks: [
            { label: 'Non-text Content with AI', url: '/blog/non-text-context-with-ai' }
        ]
    },
    {
        id: 'decorative-image',
        term: 'Decorative Image',
        definition: 'An image that serves solely visual formatting purposes and adds no information to the page. Decorative images should be hidden from assistive technologies, typically by using an empty alt attribute (`alt=""`).'
    },
    {
        id: 'screen-reader',
        term: 'Screen Reader',
        definition: 'A form of assistive technology that renders text and image content as speech or braille output. Examples include JAWS, NVDA, and VoiceOver.'
    },
    {
        id: 'assistive-technology',
        term: 'Assistive Technology (AT)',
        definition: 'Any piece of equipment, software program, or product system that is used to increase, maintain, or improve the functional capabilities of persons with disabilities.'
    },
    {
        id: 'aria',
        term: 'WAI-ARIA',
        definition: 'Web Accessibility Initiative – Accessible Rich Internet Applications. A technical specification that provides a framework for adding attributes to identify features for user interaction, making complex web applications accessible to assistive technologies.'
    },
    {
        id: 'cpacc',
        term: 'CPACC',
        definition: 'Certified Professional in Accessibility Core Competencies. A credential offered by the IAAP representing foundational knowledge of disabilities, accessibility, and universal design.'
    },
    {
        id: 'iaap',
        term: 'IAAP',
        definition: 'International Association of Accessibility Professionals. A professional organization that provides training, networking, and certification for accessibility professionals.'
    },
    {
        id: 'captcha',
        term: 'CAPTCHA',
        definition: 'Completely Automated Public Turing test to tell Computers and Humans Apart. Traditional CAPTCHAs are inherently visual and pose major accessibility barriers unless alternative non-visual modalities (like audio) are provided.'
    },
    {
        id: 'success-criterion',
        term: 'Success Criterion',
        definition: 'A specific, testable statement in the WCAG guidelines that must be met to ensure content is accessible. Success criteria are assigned conformance levels (A, AA, AAA).'
    },
    {
        id: 'level-a',
        term: 'Conformance Level A',
        definition: 'The minimum level of accessibility conformance in WCAG. Failing Level A criteria means significant barriers exist that completely prevent some users from accessing the content.'
    },
    {
        id: 'level-aa',
        term: 'Conformance Level AA',
        definition: 'The mid-range and most commonly targeted level of WCAG conformance. It deals with the biggest and most common barriers for disabled users, and is the standard required by most international accessibility laws.'
    },
    {
        id: 'level-aaa',
        term: 'Conformance Level AAA',
        definition: 'The highest and most complex level of WCAG conformance. W3C does not recommend requiring Level AAA for entire sites because it is not always possible to satisfy for all types of content.'
    },
    {
        id: 'cognitive-disability',
        term: 'Cognitive Disability',
        definition: 'A broad category of disabilities affecting mental tasks like learning, memory, problem-solving, and attention. Accessibility for cognitive disabilities focuses on clear language, predictable navigation, and reducing cognitive load.'
    },
    {
        id: 'braille-display',
        term: 'Refreshable Braille Display',
        definition: 'An electro-mechanical device for displaying braille characters, typically by raising dots through holes in a flat surface. Blind users read the output generated by a screen reader dynamically on this display.'
    },
    {
        id: 'a11y',
        term: 'A11y',
        definition: 'A numeronym for "accessibility," derived by keeping the first ("a") and last ("y") letters and replacing the 11 letters in between with the number 11.'
    },
    {
        id: 'semantic-html',
        term: 'Semantic HTML',
        definition: 'The use of HTML markup to reinforce the semantics, or meaning, of the information in webpages (e.g., using `<nav>` instead of `<div>` for navigation). Semantic HTML is the foundation of web accessibility.'
    },
    {
        id: 'generative-ai',
        term: 'Generative AI',
        definition: 'A type of artificial intelligence capable of generating text, images, or other media in response to prompts. It is increasingly used to automate alt-text generation and evaluate accessibility compliance.'
    },
    {
        id: 'llm',
        term: 'Large Language Model (LLM)',
        definition: 'A highly advanced AI model trained on vast amounts of text data, designed to understand and generate human-like language. Examples include ChatGPT, Claude, and Gemini.'
    },
    {
        id: 'prompt-engineering',
        term: 'Prompt Engineering',
        definition: 'The practice of designing and refining the specific text instructions given to an AI model to produce highly accurate, reliable, and standardized outputs.'
    },
    {
        id: 'multimodal-ai',
        term: 'Multimodal AI',
        definition: 'An AI model capable of processing multiple types of data simultaneously, such as reading text while looking at an image, making it highly effective for auditing non-text content.'
    },
    {
        id: 'metadata',
        term: 'Metadata',
        definition: 'Structured data that describes other data. In web development, metadata provides search engines and AI crawlers with context about the page\'s content, author, and structure (e.g., JSON-LD Schema).'
    },
    {
        id: 'frontmatter',
        term: 'Frontmatter',
        definition: 'A block of YAML-formatted metadata placed at the very top of a Markdown document used to define variables like title, tags, and descriptions before the actual content begins.'
    },
    {
        id: 'markdown',
        term: 'Markdown',
        definition: 'A lightweight markup language with plain-text formatting syntax, widely used for writing documentation, blog posts, and text-heavy web content.'
    },
    {
        id: 'unicode',
        term: 'Unicode',
        definition: 'An information technology standard for the consistent encoding, representation, and handling of text expressed in most of the world\'s writing systems. Using unusual Unicode characters to simulate fonts (e.g. bold text on Twitter) catastrophically breaks screen readers.'
    },
    {
        id: 'ascii-art',
        term: 'ASCII Art',
        definition: 'A graphic design technique that uses computers for presentation and consists of pictures pieced together from the 95 printable characters defined by the ASCII Standard. It must be hidden from screen readers to prevent them from reading individual punctuation marks.'
    },
    {
        id: 'react',
        term: 'React',
        definition: 'A highly popular, open-source JavaScript library developed by Meta for building dynamic user interfaces based on reusable components.'
    },
    {
        id: 'nextjs',
        term: 'Next.js',
        definition: 'A powerful React framework used to build fast, statically generated, and server-side rendered web applications.'
    }
]
