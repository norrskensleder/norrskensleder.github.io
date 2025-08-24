# Norrskensleder

An experience blog!

## Architecture

```txt
                ┌───────────────────────────────┐
                │          Firebase             │
                │  (Realtime DB / Firestore)    │
                │  Comments + Likes (Dynamic)   │
                └───────────────────────────────┘
                           ▲
                           │ (direct HTTPS requests from browser)
                           │
+───────────────+    Static│assets (HTML, JS, CSS, images)   +────────────────+
|   User        │◀────────▶│  Cloudflare CDN                 │   GitHub Pages |
|   Browser     │          │   (DNS                          │                |
|               │          │    + Custom Cache               │                |
|               │          │    + DDoS/bot )                 │ (Static site   |
|               │          │                                 │ from Markdown) |
+───────────────+          +─────────────────────────────────+────────────────+
```
