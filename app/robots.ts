import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/settings/'],
            },
        ],
        sitemap: 'https://happyhub.in/sitemap.xml',
    }
}
