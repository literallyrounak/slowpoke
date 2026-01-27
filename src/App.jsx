import React, { useState, useEffect, useCallback } from 'react';
import { Newspaper, Loader2, RefreshCw, Sun, Moon, Bookmark, BookmarkCheck, Clock } from 'lucide-react';

const CATEGORIES = ['world', 'business', 'technology', 'health', 'science', 'sports', 'entertainment', 'lifestyle'];

const CategorySelector = ({ selectedCategory, onSelect, isBookmarksView }) => {
    if (isBookmarksView) return null;
    return (
        <div className="category-selector">
            {CATEGORIES.map(category => (
                <button
                    key={category}
                    className={`category-button ${selectedCategory === category ? 'category-button-active' : ''}`}
                    onClick={() => onSelect(category)}
                >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
            ))}
        </div>
    );
};

const NewsCard = ({ article, onBookmark, isBookmarked }) => {
    const imageUrl = article.image_url || `https://placehold.co/600x400/6b7280/ffffff?text=Image+Unavailable`;
    const publishedDate = new Date(article.pubDate).toLocaleDateString();
    
    const wordCount = article.description ? article.description.split(/\s+/).length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="news-card">
            <div className="news-card-image-container" style={{ position: 'relative' }}>
                <img
                    src={imageUrl}
                    alt={article.title}
                    className="news-card-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/600x400/6b7280/ffffff?text=Image+Unavailable`;
                    }}
                />
                <button 
                    className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        onBookmark(article);
                    }}
                    aria-label="Bookmark article"
                >
                    {isBookmarked ? <BookmarkCheck size={18} fill="currentColor" /> : <Bookmark size={18} />}
                </button>
            </div>
            
            <div className="news-card-content">
                <div className="news-card-meta">
                    <span className="news-card-source">{article.source_id || 'News'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {readTime} min
                    </span>
                </div>
                
                <h3 className="news-card-title">{article.title}</h3>
                
                <p className="news-card-description">
                    {article.description || "No description available."}
                </p>

                <div className="news-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span className="news-card-date" style={{ fontSize: '0.75rem', opacity: 0.6 }}>{publishedDate}</span>
                    <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="news-card-link"
                    >
                        Read Full
                    </a>
                </div>
            </div>
        </div>
    );
};

const App = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('technology');
    const [theme, setTheme] = useState(() => localStorage.getItem('slowpoke-theme') || 'light');
    const [showBookmarks, setShowBookmarks] = useState(false);
    
    const [bookmarks, setBookmarks] = useState(() => {
        const saved = localStorage.getItem('slowpoke-bookmarks');
        return saved ? JSON.parse(saved) : [];
    });

    const NEWSDATA_API_KEY = "pub_aca3a21bab5d4fd3bdcaa75eaa923a95";

    useEffect(() => {
        localStorage.setItem('slowpoke-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('slowpoke-bookmarks', JSON.stringify(bookmarks));
    }, [bookmarks]);

    const fetchNews = useCallback(async (selectedCategory) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&country=us&category=${selectedCategory}`);
            const data = await response.json();
            if (data.status === 'success') {
                setArticles(data.results.filter(a => a.title && a.link));
            } else {
                throw new Error(data.message || "API Error");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [NEWSDATA_API_KEY]);

    useEffect(() => {
        if (!showBookmarks) fetchNews(category);
    }, [fetchNews, category, showBookmarks]);

    const toggleBookmark = (article) => {
        setBookmarks(prev => {
            const exists = prev.find(b => b.link === article.link);
            if (exists) return prev.filter(b => b.link !== article.link);
            return [...prev, article];
        });
    };

    const displayedArticles = showBookmarks ? bookmarks : articles;

    return (
        <div className={`app-theme-${theme}`}>
            <div className="news-app-container">
                <header className="app-header">
                    <h1 className="app-title" onClick={() => setShowBookmarks(false)}>
                        <Newspaper className="app-icon" />
                        slowpoke
                    </h1>
                    <div className="header-controls">
                        <button 
                            className={`theme-toggle-button ${showBookmarks ? 'category-button-active' : ''}`}
                            onClick={() => setShowBookmarks(!showBookmarks)}
                            title="Bookmarks"
                        >
                            <Bookmark size={20} fill={showBookmarks ? "currentColor" : "none"} />
                        </button>
                        <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} className="theme-toggle-button">
                            {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
                        </button>
                        {!showBookmarks && (
                            <button onClick={() => fetchNews(category)} disabled={loading} className="refresh-button">
                                <RefreshCw size={20} className={loading ? 'loading-spinner' : ''} />
                            </button>
                        )}
                    </div>
                </header>
                
                <CategorySelector 
                    selectedCategory={category} 
                    onSelect={setCategory} 
                    isBookmarksView={showBookmarks}
                />

                <main className="main-content">
                    {showBookmarks && (
                        <h2 style={{ marginBottom: '24px', fontSize: '1.2rem', opacity: 0.8 }}>
                            Saved Articles ({bookmarks.length})
                        </h2>
                    )}

                    {loading && !showBookmarks ? (
                        <div className="loading-indicator">
                            <Loader2 className="loading-spinner-large" />
                            <p>Taking it slow...</p>
                        </div>
                    ) : error && !showBookmarks ? (
                        <div className="error-message">
                            <h2 className="error-title">Oops!</h2>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="articles-grid">
                            {displayedArticles.map((article, idx) => (
                                <NewsCard 
                                    key={article.link + idx} 
                                    article={article} 
                                    onBookmark={toggleBookmark}
                                    isBookmarked={bookmarks.some(b => b.link === article.link)}
                                />
                            ))}
                        </div>
                    )}

                    {!loading && displayedArticles.length === 0 && (
                        <div className="no-results">
                            <p>No articles found here. {showBookmarks ? "Try saving some first!" : "Try refreshing."}</p>
                        </div>
                    )}
                </main>

                <footer className="app-footer">
                    Created by Rounak.
                </footer>
            </div>
        </div>
    );
};

export default App;