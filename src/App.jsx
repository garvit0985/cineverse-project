import React, { useState } from 'react';
import './App.css';

function App() {
  // 1. Movie Catalogue Matrix State (Multiple Movies Support for Trending Section)
  const [movies, setMovies] = useState([
    {
      id: "m1",
      title: "Inception",
      genre: "Sci-Fi",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      criticScore: 87,
      audienceScore: 91,
      poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500",
      trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
      views: 1240
    },
    {
      id: "m2",
      title: "The Dark Knight",
      genre: "Action",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
      criticScore: 94,
      audienceScore: 94,
      poster: "https://images.unsplash.com/photo-1478720143033-6a972678aa30?q=80&w=500",
      trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
      views: 3150
    }
  ]);

  // Active Selected Movie Instance State
  const [activeMovieId, setActiveMovieId] = useState("m1");
  const currentMovie = movies.find(m => m.id === activeMovieId) || movies[0];

  // 2. Comprehensive Reviews Matrix State
  const [reviews, setReviews] = useState([
    { id: 1, movieId: "m1", name: "Rahul Sharma", rating: 5, comment: "Mind-bending masterpiece! The background score by Hans Zimmer is outstanding.", isSpoiler: false },
    { id: 2, movieId: "m1", name: "Amit Verma", rating: 4, comment: "The top keeps spinning at the end!", isSpoiler: true },
    { id: 3, movieId: "m2", name: "Garvit Gupta", rating: 5, comment: "Heath Ledger's performance as Joker is legendary. Absolute perfection.", isSpoiler: false }
  ]);

  // Form Field Captures
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formSpoiler, setFormSpoiler] = useState(false);

  // App Level Controls
  const [watchlist, setWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [revealedSpoilers, setRevealedSpoilers] = useState({});
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState('5');

  // Handle Dynamic Review Submission & Real-time Score Re-calculation
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    const newReview = {
      id: Date.now(),
      movieId: currentMovie.id,
      name: formName,
      rating: parseInt(formRating),
      comment: formComment,
      isSpoiler: formSpoiler
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Filter reviews specific to the active movie to calculate its real-time average score
    const targetMovieReviews = updatedReviews.filter(r => r.movieId === currentMovie.id);
    const totalRating = targetMovieReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAudienceAvg = Math.round((totalRating / targetMovieReviews.length) * 20); 
    
    setMovies(prevMovies => prevMovies.map(m => {
      if (m.id === currentMovie.id) {
        return { ...m, audienceScore: newAudienceAvg };
      }
      return m;
    }));

    // Reset Form Elements
    setFormName('');
    setFormComment('');
    setFormSpoiler(false);
  };

  // Admin Moderation Engine: Filter out specific reviews by ID
  const handleModerateReview = (reviewId) => {
    if(window.confirm("Admin Notice: Are you sure you want to moderate/delete this review content?")) {
      setReviews(reviews.filter(r => r.id !== reviewId));
    }
  };

  const toggleWatchlist = () => {
    if (watchlist.includes(currentMovie.title)) {
      setWatchlist(watchlist.filter(item => item !== currentMovie.title));
    } else {
      setWatchlist([...watchlist, currentMovie.title]);
    }
  };

  // Filter Catalog Analytics
  const filteredMovies = movies.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || m.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Sort Movies by Views to generate Trending List dynamically
  const trendingMovies = [...movies].sort((a, b) => b.views - a.views);

  return (
    <div className="app-container">
      {/* Header Panel */}
      <header className="navbar">
        <div className="logo"><h1>CineVerse</h1></div>
        <nav>
          <span className="nav-link active">Home</span>
          <span className="nav-link">Movies</span>
          <span className="nav-link">Watchlist <b className="badge">{watchlist.length}</b></span>
          <span className="nav-link premium-tag">Premium ⭐</span>
        </nav>
      </header>

      {/* Hero Search & Dynamic Filter Setup */}
      <section className="hero-section">
        <h2>Discover Your Next Favorite Movie</h2>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search movies by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
            <option value="all">All Genres</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
          </select>
        </div>
      </section>

      {/* Main Grid Interface */}
      <main className="container">
        
        {/* Left Section Grid Column */}
        <section className="main-content">
          {filteredMovies.length > 0 ? (
            <div className="movie-detail-card">
              <div className="movie-header-block">
                <img src={currentMovie.poster} alt={currentMovie.title} className="movie-poster" />
                <div className="movie-info">
                  <h3>{currentMovie.title}</h3>
                  <span className="genre-tag">{currentMovie.genre}</span>
                  <p className="movie-desc">{currentMovie.description}</p>
                  
                  {/* Separate Scores Dashboard */}
                  <div className="scores-container">
                    <div className="score-box">
                      <span>Critic Score</span>
                      <strong>🍅 {currentMovie.criticScore}%</strong>
                    </div>
                    <div className="score-box">
                      <span>Audience Score</span>
                      <strong>🍿 {currentMovie.audienceScore}%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Embedded Trailer Feature Box */}
              <div className="trailer-section">
                <h4>Official Embedded Trailer</h4>
                <div className="video-responsive">
                  <div className="mock-iframe-placeholder">
                    <span>🎬 [Embedded Media Player Integration Grid Ready]</span>
                    <p style={{fontSize: '12px', color: 'var(--text-muted)'}}>Streaming Node: {currentMovie.trailerUrl}</p>
                  </div>
                </div>
              </div>

              {/* Action Trigger Panels */}
              <div className="actions-bar">
                <button 
                  className={`btn ${watchlist.includes(currentMovie.title) ? 'btn-danger' : 'btn-primary'}`}
                  onClick={toggleWatchlist}
                >
                  {watchlist.includes(currentMovie.title) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
                <button className="btn btn-secondary" onClick={() => setIsTipModalOpen(true)}>
                  Tip Content Reviewer 💰
                </button>
              </div>

              {/* User Critique List Generation */}
              <div className="reviews-section">
                <h4>User Critiques & Community Feedback</h4>
                <div className="reviews-list">
                  {reviews.filter(r => r.movieId === currentMovie.id).map((review) => (
                    <div className="review-card" key={review.id}>
                      <div className="review-header">
                        <span className="reviewer-name">{review.name}</span>
                        <div>
                          <span className="stars" style={{marginRight: '15px'}}>{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                          {/* Admin Control Actions Overlay */}
                          <button className="btn-admin-moderate" onClick={() => handleModerateReview(review.id)}>Moderate 🛡️</button>
                        </div>
                      </div>
                      
                      {review.isSpoiler && !revealedSpoilers[review.id] ? (
                        <p className="spoiler-masked" onClick={() => setRevealedSpoilers({...revealedSpoilers, [review.id]: true})}>
                          ⚠️ [SPOILER WARNING] This comment contains plot details. Click to reveal.
                        </p>
                      ) : (
                        <p className="review-text">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-results">No matches identified in active catalogue pipeline.</div>
          )}
        </section>

        {/* Right Section Sidebar Content Column */}
        <aside className="sidebar-container">
          
          {/* Dynamic Trending Module */}
          <div className="trending-box">
            <h4>⚡ Trending Hotlists</h4>
            <div className="trending-list">
              {trendingMovies.map((m, index) => (
                <div 
                  className={`trending-item ${m.id === currentMovie.id ? 'active-trend' : ''}`} 
                  key={m.id}
                  onClick={() => setActiveMovieId(m.id)}
                >
                  <span className="trend-rank">#{index + 1}</span>
                  <div className="trend-details">
                    <h5>{m.title}</h5>
                    <span>Views: {m.views} clicks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Interactive Input Panel */}
          <div className="sidebar-form">
            <h4>Post a Critique</h4>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Your Signature Profile Name</label>
                <input 
                  type="text" 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Rating Metric</label>
                <select value={formRating} onChange={(e) => setFormRating(e.target.value)}>
                  <option value="5">★★★★★ (5/5)</option>
                  <option value="4">★★★★☆ (4/5)</option>
                  <option value="3">★★★☆☆ (3/5)</option>
                  <option value="2">★★☆☆☆ (2/5)</option>
                  <option value="1">★☆☆☆☆ (1/5)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Critique Notes</label>
                <textarea 
                  rows="3" 
                  value={formComment} 
                  onChange={(e) => setFormComment(e.target.value)} 
                  required
                ></textarea>
              </div>
              <div className="form-group checkbox-group">
                <input 
                  type="checkbox" 
                  id="spoiler-chk-node"
                  checked={formSpoiler} 
                  onChange={(e) => setFormSpoiler(e.target.checked)} 
                />
                <label htmlFor="spoiler-chk-node">Flag as Spoiler Content ⚠️</label>
              </div>
              <button type="submit" className="btn btn-primary full-width">Submit Data Node</button>
            </form>
          </div>
        </aside>
      </main>

      {/* Stripe Payment Gateway Mock Simulation Modal Overlay */}
      {isTipModalOpen && (
        <div className="modal-overlay">
          <div className="modal-surface">
            <h4>Stripe Monetization Portal 💳</h4>
            <p>Support community reviewers by securely tipping micro-payments via our integrated API channel layout blueprints.</p>
            
            <div className="form-group" style={{marginTop: '15px'}}>
              <label>Select Allocation Amount ($)</label>
              <select value={tipAmount} onChange={(e) => setTipAmount(e.target.value)}>
                <option value="2">$2.00 USD (Basic Appreciation)</option>
                <option value="5">$5.00 USD (Standard Support)</option>
                <option value="10">$10.00 USD (Premium Content Fan)</option>
              </select>
            </div>

            <div className="modal-actions" style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
              <button className="btn btn-primary" style={{flex: 1}} onClick={() => {
                alert(`Stripe Success Transaction Framework: Allocated $${tipAmount}.00 cleanly to chosen dynamic author profile node!`);
                setIsTipModalOpen(false);
              }}>
                Authorize Secure Checkout
              </button>
              <button className="btn btn-secondary" onClick={() => setIsTipModalOpen(false)}>Cancel Connection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;