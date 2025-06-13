// Veterinarian Module JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize toasts
    var toastElList = [].slice.call(document.querySelectorAll('.toast'));
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    });

    // Toggle between card and table view
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const cardView = document.getElementById('cardView');
    const tableView = document.getElementById('tableView');

    // Check local storage for view preference
    const viewPreference = localStorage.getItem('vetViewPreference') || 'card';
    
    // Set initial view based on preference
    if (viewPreference === 'table') {
        cardView.style.display = 'none';
        tableView.style.display = 'block';
        cardViewBtn.classList.remove('active');
        tableViewBtn.classList.add('active');
    }

    // Card view button click handler
    cardViewBtn.addEventListener('click', function() {
        cardView.style.display = 'flex';
        tableView.style.display = 'none';
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        localStorage.setItem('vetViewPreference', 'card');
    });

    // Table view button click handler
    tableViewBtn.addEventListener('click', function() {
        cardView.style.display = 'none';
        tableView.style.display = 'block';
        cardViewBtn.classList.remove('active');
        tableViewBtn.classList.add('active');
        localStorage.setItem('vetViewPreference', 'table');
    });
    
    // Handle filter selection persistence
    const qualificationSelect = document.getElementById('filterQualification');
    const sortBySelect = document.getElementById('sortBy');
    
    // Set selected values based on URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    if (qualificationSelect && urlParams.has('qualification')) {
        qualificationSelect.value = urlParams.get('qualification');
    }
    
    if (sortBySelect && urlParams.has('sortBy')) {
        sortBySelect.value = urlParams.get('sortBy');
    }
    
    // Animate stats cards on page load
    const statCards = document.querySelectorAll('.vet-stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 100);
    });
    
    // Add animation to veterinarian cards
    const vetCards = document.querySelectorAll('.vet-card');
    vetCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, 300 + index * 100); // Delay after stats cards
    });

    // Handle search form submission
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchTerm = document.getElementById('searchTerm').value.trim();
            const qualification = document.getElementById('filterQualification').value;
            const sortBy = document.getElementById('sortBy').value;
            
            // If all fields are empty, prevent form submission
            if (searchTerm === '' && qualification === '' && sortBy === 'name') {
                e.preventDefault();
            }
        });
    }

    // Add animation to cards
    const cards = document.querySelectorAll('.vet-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});