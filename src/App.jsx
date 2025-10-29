import React, { useState, useEffect, useCallback } from 'react';
import { Newspaper, Loader2, RefreshCw, Sun, Moon } from 'lucide-react';

const CATEGORIES = ['world', 'business', 'technology', 'health', 'science', 'sports', 'entertainment', 'lifestyle'];

const CategorySelector = ({ selectedCategory, onSelect }) => {
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

const NewsCard = ({ article }) => {
  const imageUrl = article.image_url || `https://placehold.co/600x400/6b7280/ffffff?text=Image+Unavailable`;
  const publishedDate = new Date(article.pubDate).toLocaleDateString();

  return (
    <div className="news-card">
      <img
        src={imageUrl}
        alt={article.title}
        className="news-card-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://placehold.co/600x400/6b7280/ffffff?text=Image+Unavailable`;
        }}
      />
      <div className="news-card-content">
        <h3 className="news-card-title">
          {article.title}
        </h3>
        <p className="news-card-description">
          {article.description || "No description available."}
        </p>
        <div className="news-card-meta">
          <span className="news-card-source">{article.source_id || article.creator || 'Unknown Source'}</span>
          <span className="news-card-date">{publishedDate}</span>
        </div>
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="news-card-link"
        >
          Read Full Article
        </a>
      </div>
    </div>
  );
};

const App = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('technology');
  const [theme, setTheme] = useState('light');

  const NEWSDATA_API_KEY = "pub_aca3a21bab5d4fd3bdcaa75eaa923a95";

  const fetchNews = useCallback(async (selectedCategory) => {
    setLoading(true);
    setError(null);
    setArticles([]);

    const API_URL = `https://newsdata.io/api/1/news?apikey=${NEWSDATA_API_KEY}&country=us&category=${selectedCategory}`;

    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        let errorMsg = `HTTP error! Status: ${response.status}.`;
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      if (data.status === 'success' && data.results) {
        setArticles(data.results.filter(a => a.title && a.link));
      } else {
        const errorMessage = data.message || "Failed to fetch articles from Newsdata.io.";
        throw new Error(errorMessage);
      }

    } catch (err) {
      console.error("Fetching error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [NEWSDATA_API_KEY]);

  const handleCategoryChange = useCallback((newCategory) => {
    setCategory(newCategory);
    fetchNews(newCategory);
  }, [fetchNews]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    fetchNews(category);
  }, [fetchNews, category]);

  return (
    <div className={`app-theme-${theme}`}>
      <div className="news-app-container">
        
        <header className="app-header">
          <h1 className="app-title">
            <Newspaper className="app-icon" />
            slowpoke
          </h1>
          <div className="header-controls">
            <button
              onClick={toggleTheme}
              className="theme-toggle-button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
            </button>
            <button
              onClick={() => fetchNews(category)}
              disabled={loading}
              className={`refresh-button ${loading ? 'refresh-button-loading' : ''}`}
            >
              {loading ? (
                <Loader2 className="loading-spinner" />
              ) : (
                <RefreshCw className="refresh-icon" />
              )}
            </button>
          </div>
        </header>
        
        <CategorySelector 
          selectedCategory={category} 
          onSelect={handleCategoryChange} 
        />

        <main className="main-content">
          
          {loading && (
            <div className="loading-indicator">
              <Loader2 className="loading-spinner-large" />
              <p className="loading-message">Fetching...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <h2 className="error-title">Error</h2>
              <p className='error-details'>{error}</p>
              <p className="error-note">
                There's Some Error fetching the news.
              </p>
            </div>
          )}

          {!loading && !error && articles.length > 0 && (
            <div className="articles-grid">
              {articles.map((article, index) => (
                <NewsCard key={index} article={article} />
              ))}
            </div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="no-results">
              <h2 className="no-results-title">No Articles Found</h2>
              <p className="no-results-message">Try refreshing...</p>
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