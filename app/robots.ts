import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/settings/', '/login', '/signup'],
            },
        ],
        sitemap: 'https://happyhub.in/sitemap.xml',
    }
}
