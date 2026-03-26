// src/utils/generateSitemap.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export const generateSitemap = async () => {
  try {
    const postsSnapshot = await getDocs(collection(db, 'posts'));
    const baseUrl = 'https://andinet-gazette.com';
    
    const pages = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/about', priority: 0.8, changefreq: 'monthly' },
      { url: '/contact', priority: 0.8, changefreq: 'monthly' },
      { url: '/donate', priority: 0.9, changefreq: 'monthly' },
    ];
    
    const posts = postsSnapshot.docs.map(doc => ({
      url: `/post/${doc.id}`,
      priority: 0.7,
      changefreq: 'weekly',
      lastmod: doc.data().updatedAt?.toDate?.() || new Date()
    }));
    
    const allUrls = [...pages, ...posts];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allUrls.map(item => `
        <url>
          <loc>${baseUrl}${item.url}</loc>
          <lastmod>${item.lastmod?.toISOString?.() || new Date().toISOString()}</lastmod>
          <changefreq>${item.changefreq}</changefreq>
          <priority>${item.priority}</priority>
        </url>
      `).join('')}
    </urlset>`;
    
    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return null;
  }
};
