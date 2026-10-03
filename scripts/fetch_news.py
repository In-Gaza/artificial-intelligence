import os
import json
import re
import hashlib
import feedparser
import requests
from datetime import datetime
from pathlib import Path
import google.generativeai as genai

# ===== الإعدادات =====
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
ARTICLES_PER_RUN = 3
ROOT = Path(__file__).parent.parent

# ===== مصادر أخبار AI =====
RSS_FEEDS = [
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    "https://venturebeat.com/category/ai/feed/",
    "https://www.wired.com/feed/tag/ai/latest/rss",
    "https://feeds.arstechnica.com/arstechnica/technology-lab",
]

# ===== Gemini =====
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# ===== HTML Template =====
ARTICLE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - AI Revolution</title>
    <meta name="description" content="{excerpt}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../main.css">
</head>
<body>
    <header class="main-header">
        <div class="container">
            <div class="logo">
                <a href="../index.html" class="logo-link">
                    <h1><span class="ai-text">AI</span> Revolution</h1>
                    <p>Exploring the Future of Intelligence</p>
                </a>
            </div>
            <nav class="main-nav">
                <ul>
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../articles.html" class="active">Articles</a></li>
                    <li><a href="../videos.html">Videos</a></li>
                    <li><a href="../news.html">News</a></li>
                    <li><a href="../about.html">About</a></li>
                    <li><a href="../contact.html">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section class="content-hero">
        <div class="container">
            <h1>{title}</h1>
            <p><i class="far fa-calendar-alt"></i> {date} &nbsp; | &nbsp; <i class="far fa-user"></i> AI Revolution Team</p>
        </div>
    </section>

    <main class="content-container">
        <div class="container">
            <article class="article-full">
                <img src="{image}" alt="{title}" class="article-hero-image">
                <div class="article-body">
                    {content}
                </div>
                <a href="../articles.html" class="btn btn-primary"><i class="fas fa-arrow-left"></i> Back to Articles</a>
            </article>
        </div>
    </main>

    <footer class="main-footer">
        <div class="container">
            <div class="footer-bottom">
                <p>&copy; 2026 AI Revolution. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>"""


def slugify(text):
    """يحوّل العنوان إلى اسم ملف"""
    text = re.sub(r"[^\w\s-]", "", text.lower())
    text = re.sub(r"[\s_-]+", "-", text).strip("-")
    return text[:60]


def fetch_news():
    """يجيب أخبار جديدة من RSS"""
    news_items = []
    for feed_url in RSS_FEEDS:
        try:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries[:5]:
                title = entry.get("title", "")
                link = entry.get("link", "")
                summary = entry.get("summary", "")
                image = ""

                # نحاول نجيب صورة من المحتوى
                if "media_content" in entry:
                    image = entry.media_content[0].get("url", "")
                elif "media_thumbnail" in entry:
                    image = entry.media_thumbnail[0].get("url", "")
                elif "links" in entry:
                    for l in entry.links:
                        if l.get("type", "").startswith("image"):
                            image = l.get("href", "")
                            break

                if title and summary:
                    news_items.append({
                        "title": title,
                        "link": link,
                        "summary": summary[:1500],
                        "image": image or "../ai.jpeg",
                    })
        except Exception as e:
            print(f"Feed error {feed_url}: {e}")

    return news_items


def generate_article(news_item):
    """يستخدم Gemini لكتابة مقال كامل"""
    prompt = f"""Write a comprehensive, professional article in English about this AI news.

Title: {news_item['title']}
Summary: {news_item['summary']}
Source: {news_item['link']}

Requirements:
- 600-900 words
- Professional journalistic tone
- Include <h2> subheadings
- Include <p> paragraphs
- End with a conclusion
- Do NOT include the title in the body
- Return ONLY HTML content (no markdown, no code blocks)
- Use <h2>, <p>, <ul>, <li> tags
"""
    response = model.generate_content(prompt)
    return response.text.strip()


def save_article(news_item, content):
    """يحفظ المقال كملف HTML"""
    slug = slugify(news_item["title"])
    date_str = datetime.now().strftime("%Y-%m-%d")
    filename = f"{date_str}-{slug}.html"

    articles_dir = ROOT / "articles"
    articles_dir.mkdir(exist_ok=True)

    excerpt = re.sub(r"<[^>]+>", "", news_item["summary"])[:155] + "..."

    html = ARTICLE_TEMPLATE.format(
        title=news_item["title"],
        excerpt=excerpt,
        date=datetime.now().strftime("%B %d, %Y"),
        image=news_item["image"],
        content=content,
    )

    filepath = articles_dir / filename
    filepath.write_text(html, encoding="utf-8")
    print(f"Saved: {filepath}")

    return {
        "title": news_item["title"],
        "filename": filename,
        "excerpt": excerpt,
        "date": datetime.now().strftime("%B %d, %Y"),
        "image": news_item["image"],
    }


def update_articles_index(new_articles):
    """يحدّث ملف articles.json"""
    data_file = ROOT / "articles.json"
    existing = []
    if data_file.exists():
        try:
            existing = json.loads(data_file.read_text(encoding="utf-8"))
        except Exception:
            existing = []

    # نمنع التكرار
    existing_titles = {a["title"] for a in existing}
    for a in new_articles:
        if a["title"] not in existing_titles:
            existing.insert(0, a)

    # نحفظ آخر 50 مقال
    existing = existing[:50]
    data_file.write_text(json.dumps(existing, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Updated articles.json ({len(existing)} articles)")


def update_sitemap():
    """يحدّث sitemap.xml"""
    sitemap_file = ROOT / "sitemap.xml"
    base = "https://in-gaza.github.io/artificial-intelligence"

    articles_dir = ROOT / "articles"
    article_urls = []
    if articles_dir.exists():
        for f in sorted(articles_dir.glob("*.html"), reverse=True)[:50]:
            article_urls.append(f"""    <url>
        <loc>{base}/articles/{f.name}</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>""")

    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>{base}/</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>{base}/articles.html</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>{base}/news.html</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>{base}/videos.html</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>{base}/about.html</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>{base}/contact.html</loc>
        <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
{chr(10).join(article_urls)}
</urlset>"""

    sitemap_file.write_text(sitemap, encoding="utf-8")
    print("Updated sitemap.xml")


def main():
    print("Fetching news...")
    news = fetch_news()
    print(f"Found {len(news)} news items")

    # ناخذ 3 فقط
    news = news[:ARTICLES_PER_RUN]
    new_articles = []

    for item in news:
        try:
            print(f"Generating: {item['title']}")
            content = generate_article(item)
            meta = save_article(item, content)
            new_articles.append(meta)
        except Exception as e:
            print(f"Error generating article: {e}")

    if new_articles:
        update_articles_index(new_articles)
        update_sitemap()
        print(f"Done! {len(new_articles)} new articles added.")
    else:
        print("No new articles.")


if __name__ == "__main__":
    main()
