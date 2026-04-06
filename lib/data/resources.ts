export interface ResourceItem {
    id: string
    title: string
    description: string
    url: string
}

export interface ResourceCategory {
    id: string
    title: string
    description: string
    items: ResourceItem[]
}

export const resourceData: ResourceCategory[] = [
    {
        id: "academic-literature",
        title: "Academic & Sociological Literature",
        description: "Foundational texts on the models and theories of disability cited throughout the site.",
        items: [
            {
                id: "scoping-models",
                title: "Scoping Models and Theories of Disability",
                description: "NCBI Bookshelf text reviewing global frameworks for understanding disability.",
                url: "https://www.ncbi.nlm.nih.gov/books/NBK378951/"
            },
            {
                id: "social-medical-pubmed",
                title: "Social and Medical Models of Disability and Mental Health",
                description: "A comprehensive PubMed Central article analyzing the tension between models.",
                url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6312522/"
            },
            {
                id: "social-medical-openlearn",
                title: "The Social and Medical Model of Disability",
                description: "An educational resource from The Open University exploring the social model's impact.",
                url: "https://www.open.edu/openlearn/education-development/education-careers/accessibility-elearning/content-section-1.2.1"
            },
            {
                id: "who-needs-social",
                title: "Who Needs the Social Model of Disability?",
                description: "ResearchGate paper discussing the practical applications of the social model.",
                url: "https://www.researchgate.net/publication/376271617_Who_needs_the_social_model_of_disability"
            },
            {
                id: "rethinking-disability",
                title: "Rethinking Disability",
                description: "PubMed Central literature on applying the social model to chronic diseases.",
                url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4596173/"
            },
            {
                id: "wiki-medical-model",
                title: "Medical Model of Disability",
                description: "Wikipedia's extensive entry on the history and criticisms of the medical model.",
                url: "https://en.wikipedia.org/wiki/Medical_model_of_disability"
            },
            {
                id: "wiki-social-model",
                title: "Social Model of Disability",
                description: "Wikipedia's foundational overview of the social model framework.",
                url: "https://en.wikipedia.org/wiki/Social_model_of_disability"
            },
            {
                id: "wiki-sense",
                title: "Sense",
                description: "Wikipedia detail on absolute human physical thresholds referenced in perceptual modeling.",
                url: "https://en.wikipedia.org/wiki/Sense"
            }
        ]
    },
    {
        id: "web-standards",
        title: "Official Web Standards",
        description: "The foundational guidelines and specifications governing digital accessibility.",
        items: [
            {
                id: "wcag-22",
                title: "WCAG 2.2 Specification",
                description: "The official Web Content Accessibility Guidelines version 2.2 by W3C.",
                url: "https://www.w3.org/TR/WCAG22/"
            },
            {
                id: "understanding-1-1-1",
                title: "Understanding SC 1.1.1 (Non-text Content)",
                description: "The official W3C explainer for treating non-text content like images and CAPTCHAs.",
                url: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content"
            },
            {
                id: "how-to-meet-1-1-1",
                title: "How to Meet SC 1.1.1 (Quick Reference)",
                description: "The official W3C WAI quick reference checklist for non-text content.",
                url: "https://www.w3.org/WAI/WCAG22/quickref/#non-text-content"
            },
            {
                id: "understanding-wcag-21",
                title: "Introduction to Understanding WCAG 2.1",
                description: "W3C foundational document on how to interpret WCAG compliance models.",
                url: "https://www.w3.org/WAI/WCAG21/Understanding/intro"
            },
            {
                id: "aria-12",
                title: "WAI-ARIA 1.2",
                description: "The specification for Accessible Rich Internet Applications.",
                url: "https://www.w3.org/TR/wai-aria-1.2/"
            },
            {
                id: "wai-tutorials",
                title: "WAI Web Accessibility Tutorials",
                description: "Official tutorials from the W3C on accessible structures like forms, tables, and menus.",
                url: "https://www.w3.org/WAI/tutorials/"
            }
        ]
    },
    {
        id: "mobile-accessibility",
        title: "Mobile & Hybrid Accessibility",
        description: "Guidelines and documentation for making mobile applications universally accessible.",
        items: [
            {
                id: "android-a11y",
                title: "Android Accessibility Documentation",
                description: "Official developer guide for building accessible Android applications.",
                url: "https://developer.android.com/guide/topics/ui/accessibility"
            },
            {
                id: "apple-a11y",
                title: "Apple Human Interface Guidelines",
                description: "Design and implementation guidelines for accessibility on iOS and macOS.",
                url: "https://developer.apple.com/design/human-interface-guidelines/accessibility"
            },
            {
                id: "flutter-a11y",
                title: "Flutter Accessibility Guidelines",
                description: "The official guide for implementing semantics and accessibility features in Flutter.",
                url: "https://docs.flutter.dev/ui/accessibility-and-localization/accessibility"
            },
            {
                id: "react-native-a11y",
                title: "React Native Accessibility APIs",
                description: "Documentation on React Native accessibility props and best practices.",
                url: "https://reactnative.dev/docs/accessibility"
            }
        ]
    },
    {
        id: "tools",
        title: "Testing & Evaluation Tools",
        description: "Essential software for auditing and evaluating accessibility compliance.",
        items: [
            {
                id: "axe-core",
                title: "axe-core",
                description: "The industry standard accessibility testing engine for web.",
                url: "https://github.com/dequelabs/axe-core"
            },
            {
                id: "wave",
                title: "WAVE Configuration Tool",
                description: "A popular suite of evaluation tools by WebAIM.",
                url: "https://wave.webaim.org/"
            },
            {
                id: "webaim-alt-text",
                title: "Alternative Text (WebAIM)",
                description: "The canonical guide by WebAIM on how to write effective, semantic alt text.",
                url: "https://webaim.org/techniques/alttext/"
            },
            {
                id: "accessibility-scanner",
                title: "Google Accessibility Scanner",
                description: "An Android app that suggests accessibility improvements for Android apps.",
                url: "https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.auditor"
            }
        ]
    },
    {
        id: "communities",
        title: "Communities & Certifications",
        description: "Professional organizations and credentialing bodies for accessibility experts.",
        items: [
            {
                id: "iaap",
                title: "IAAP (Accessibility Association)",
                description: "The International Association of Accessibility Professionals.",
                url: "https://www.accessibilityassociation.org/"
            },
            {
                id: "cpacc",
                title: "CPACC Certification",
                description: "Certified Professional in Accessibility Core Competencies overview.",
                url: "https://www.accessibilityassociation.org/s/certified-professional"
            },
            {
                id: "a11y-project",
                title: "The A11Y Project",
                description: "A community-driven effort to make digital accessibility easier.",
                url: "https://www.a11yproject.com/"
            }
        ]
    }
]
