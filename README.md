# slowpoke

A cozy, minimalist news aggregator inspired by the relaxed vibe of Slowpoke. 
No clutter, no noise—just the news you actually want to read, at your own pace.

### What it does

* **Browse by Category:** Toggle between Tech, Business, Science, and more.
* **Save for Later:** Bookmark articles you aren't ready to read yet (saved to your browser).
* **Smart Meta:** See reading time estimates and source details at a glance.
* **Theme Toggle:** Switch between a soft pink light mode and a deep "blackberry" dark mode.
* **Real-time Refresh:** Pull the latest headlines whenever you're ready.

### Features

* **Reading Time:** Automatic estimation (e.g., "3 min read") based on content length.
* **Persistence:** Remembers your bookmarks and theme preference even after a refresh.
* **Modern UI:** Glassmorphism bookmark buttons and smooth "springy" hover animations.
* **Responsive:** Works just as well on your phone as it does on a desktop.
* **Error Handling:** Graceful "oops" states when the API is acting up.

### Tech stack

* **Frontend:** React (Hooks + Functional Components)
* **Icons:** Lucide-React
* **API:** NewsData.io (REST)
* **Storage:** LocalStorage API for your bookmarks and settings.

### How to run locally

1. **Clone & Install**
   ```bash
   npm install
   ```
2. **API Key**
   Grab a free key from NewsData.io and swap it into the NEWSDATA_API_KEY variable in App.jsx
3. **Start**
   ```bash
   npm start
   ```
   Open http://localhost:3000, pick a category, and start browsing.

### Planned next steps:
1. Search Bar: Actually search for specific keywords instead of just categories.
2. Database Sync: Move bookmarks from LocalStorage to a real DB (Supabase or Firebase).
3. Share Sheets: Quick-share buttons for WhatsApp, Twitter, and LinkedIn.
4. Lazy Loading: Infinite scroll so you never have to hit "Refresh."
5. Skeleton Screens: Shimmering placeholders while the news is loading.

## Created by Rounak.
