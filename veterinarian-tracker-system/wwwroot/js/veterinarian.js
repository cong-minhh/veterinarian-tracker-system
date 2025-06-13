// Veterinarian Module JavaScript

document.addEventListener('DOMContentLoaded', function () {
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
    
    // Avatar modal functionality
    const avatarModal = document.getElementById('avatarModal');
    const modalImg = document.getElementById('avatarModalImg');
    const closeBtn = document.querySelector('.avatar-modal-close');
    const avatars = document.querySelectorAll('.js-avatar');
    
    // Show modal on avatar click
    avatars.forEach(avatar => {
        avatar.addEventListener('click', function() {
            const imgSrc = this.src;
            avatarModal.classList.add('show');
            modalImg.src = imgSrc;
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    });
    
    // Close modal when clicking the close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            avatarModal.classList.remove('show');
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }
    
    // Close modal when clicking outside the image
    if (avatarModal) {
        avatarModal.addEventListener('click', function(event) {
            if (event.target === avatarModal) {
                avatarModal.classList.remove('show');
                document.body.style.overflow = 'auto'; // Re-enable scrolling
            }
        });
    }
    
    // Toggle sections functionality for card view
    const togglePetsBtns = document.querySelectorAll('.js-toggle-pets');
    const toggleAppointmentsBtns = document.querySelectorAll('.js-toggle-appointments');
    
    // Function to handle toggle sections
    function setupToggleButtons(buttons) {
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetSection = document.getElementById(targetId);
                
                // Toggle the section visibility
                if (targetSection.classList.contains('show')) {
                    targetSection.classList.remove('show');
                    this.classList.remove('active');
                } else {
                    targetSection.classList.add('show');
                    this.classList.add('active');
                }
            });
        });
    }
    
    // Setup toggle buttons for card view
    setupToggleButtons(togglePetsBtns);
    setupToggleButtons(toggleAppointmentsBtns);
    
    // Table row toggle functionality
    const toggleRowBtns = document.querySelectorAll('.js-toggle-row');
    const tableRows = document.querySelectorAll('.vet-table-row');
    
    // Make the toggle button clickable
    toggleRowBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling to the row
            toggleExpandedRow(this.getAttribute('data-vet-id'), this);
        });
    });
    
    // Make the entire row clickable
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            const vetId = this.getAttribute('data-vet-id');
            const toggleBtn = this.querySelector('.js-toggle-row');
            toggleExpandedRow(vetId, toggleBtn);
        });
    });
    
    // Function to toggle the expanded row
    function toggleExpandedRow(vetId, toggleBtn) {
        const expandedRow = document.getElementById(`expanded-row-${vetId}`);
        const parentRow = toggleBtn.closest('tr');
        
        // Toggle the expanded row visibility
        if (expandedRow.style.display === 'none' || !expandedRow.style.display) {
            expandedRow.style.display = 'table-row';
            toggleBtn.classList.add('active');
            parentRow.classList.add('expanded-parent');
        } else {
            expandedRow.style.display = 'none';
            toggleBtn.classList.remove('active');
            parentRow.classList.remove('expanded-parent');
        }
    }
    
    // Add hover functionality for pet and appointment items
    const petItems = document.querySelectorAll('.vet-pet-item');
    const appointmentItems = document.querySelectorAll('.vet-appointment-item');
    
    // Ensure tooltips don't overflow the viewport
    function positionTooltip(item, tooltip) {
        const itemRect = item.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Check if tooltip would go off the right edge of the viewport
        if (itemRect.right + tooltipRect.width > window.innerWidth) {
            tooltip.style.left = 'auto';
            tooltip.style.right = '100%';
            tooltip.style.transform = 'translateX(-15px)';
        }
    }
    
    petItems.forEach(item => {
        const tooltip = item.querySelector('.vet-pet-tooltip');
        if (tooltip) {
            item.addEventListener('mouseenter', () => positionTooltip(item, tooltip));
        }
    });
    
    appointmentItems.forEach(item => {
        const tooltip = item.querySelector('.vet-appointment-tooltip');
        if (tooltip) {
            item.addEventListener('mouseenter', () => positionTooltip(item, tooltip));
        }
    });

    // Toggle between card and table view
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const cardView = document.getElementById('cardView');
    const tableView = document.getElementById('tableView');

    // Check local storage for view preference
    const viewPreference = localStorage.getItem('vetViewPreference') || 'table';

    // Set initial view based on preference
    if (viewPreference === 'table') {
        cardView.style.display = 'none';
        tableView.style.display = 'block';
        cardViewBtn.classList.remove('active');
        tableViewBtn.classList.add('active');
    }

    // Card view button click handler
    cardViewBtn.addEventListener('click', function () {
        cardView.style.display = 'flex';
        tableView.style.display = 'none';
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        localStorage.setItem('vetViewPreference', 'card');
    });

    // Table view button click handler
    tableViewBtn.addEventListener('click', function () {
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
        searchForm.addEventListener('submit', function (e) {
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