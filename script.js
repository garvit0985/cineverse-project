// --- JAVASCRIPT ARCHITECTURE & INTERACTIVE LOGIC ---


let watchlistCount = 0;
const watchlistBtn = document.getElementById('watchlist-btn');
const watchlistCounterText = document.getElementById('watchlist-count');

watchlistBtn.addEventListener('click', () => {
    if (watchlistBtn.innerText === "Add to Watchlist") {
        watchlistCount++;
        watchlistBtn.innerText = "Remove from Watchlist";
        watchlistBtn.style.backgroundColor = "#ff4d4d";
        watchlistBtn.style.color = "#ffffff";
    } else {
        watchlistCount--;
        watchlistBtn.innerText = "Add to Watchlist";
        watchlistBtn.style.backgroundColor = "var(--accent-color)";
        watchlistBtn.style.color = "#0b0c10";
    }
    watchlistCounterText.innerText = watchlistCount;
});

function revealSpoiler(element) {
    element.classList.add('revealed');
    element.style.backgroundColor = 'transparent';
    element.style.color = 'var(--text-main)';
    element.style.cursor = 'default';
}


const reviewForm = document.getElementById('review-form');
const reviewsList = document.getElementById('reviews-list');

reviewForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Browser refresh hone se rokega

    const name = document.getElementById('username').value;
    const ratingValue = document.getElementById('rating').value;
    const comment = document.getElementById('user-comment').value;
    const isSpoiler = document.getElementById('is-spoiler').checked;

    // Loop chalakar rating stars string build karna
    let starString = '';
    for (let i = 0; i < 5; i++) {
        starString += i < ratingValue ? '★' : '☆';
    }

  
    const newReview = document.createElement('div');
    newReview.classList.add('review-card');

  
    let finalComment = comment;
    if (isSpoiler) {
        finalComment = `<span class="spoiler-text" onclick="revealSpoiler(this)">[SPOILER] ${comment} (Click to reveal)</span>`;
    }

    
    newReview.innerHTML = `
        <div class="review-header">
            <span class="reviewer-name">${name}</span>
            <span class="stars">${starString}</span>
        </div>
        <p>${finalComment}</p>
    `;

   
    reviewsList.insertBefore(newReview, reviewsList.firstChild);

   
    reviewForm.reset();
});


const searchInput = document.getElementById('movie-search');
const genreFilter = document.getElementById('genre-filter');
const movieTitleText = document.getElementById('movie-title').innerText.toLowerCase();
const movieGenreText = document.getElementById('movie-genre').innerText;
const movieDetailBlock = document.querySelector('.movie-detail-card');

function filterContent() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;

    const matchesSearch = movieTitleText.includes(searchTerm);
    const matchesGenre = (selectedGenre === 'all' || movieGenreText === selectedGenre);

    // Dynamic Display property logic
    if (matchesSearch && matchesGenre) {
        movieDetailBlock.style.style.display = 'block';
    } else {
        movieDetailBlock.style.style.display = 'none';
    }
}

// Dono inputs par realtime change sync active karna
searchInput.addEventListener('input', filterContent);
genreFilter.addEventListener('change', filterContent);