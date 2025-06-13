// Owner Module JavaScript

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
    var avatarModal = document.getElementById('avatarModal');
    var modalImg = document.getElementById('modalAvatarImage');
    var avatarImages = document.querySelectorAll('.owner-avatar-img');
    var closeBtn = document.querySelector('.avatar-modal-close');

    if (avatarImages && avatarModal && modalImg && closeBtn) {
        avatarImages.forEach(function (img) {
            img.onclick = function () {
                avatarModal.classList.add('show');
                modalImg.src = this.getAttribute('data-img-src') || this.src;
            };
        });

        closeBtn.onclick = function () {
            avatarModal.classList.remove('show');
        };
    }

    // Toggle between card and table views with local storage preference
    var cardViewBtn = document.getElementById('cardViewBtn');
    var tableViewBtn = document.getElementById('tableViewBtn');
    var cardView = document.getElementById('cardView');
    var tableView = document.getElementById('tableView');

    // Load user preference from local storage
    var viewPreference = localStorage.getItem('ownerViewPreference') || 'card';

    function setActiveView(view) {
        if (view === 'card') {
            cardView.style.display = 'flex';
            tableView.style.display = 'none';
            cardViewBtn.classList.add('active');
            tableViewBtn.classList.remove('active');
            localStorage.setItem('ownerViewPreference', 'card');
        } else {
            cardView.style.display = 'none';
            tableView.style.display = 'block';
            cardViewBtn.classList.remove('active');
            tableViewBtn.classList.add('active');
            localStorage.setItem('ownerViewPreference', 'table');
        }
    }

    // Set initial view based on preference
    setActiveView(viewPreference);

    // Add click event listeners to toggle buttons
    if (cardViewBtn && tableViewBtn) {
        cardViewBtn.addEventListener('click', function () {
            setActiveView('card');
        });

        tableViewBtn.addEventListener('click', function () {
            setActiveView('table');
        });
    }

    // Toggle pet sections in card view
    var petToggleBtns = document.querySelectorAll('.pet-toggle-btn');

    if (petToggleBtns) {
        petToggleBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var targetId = this.getAttribute('data-target');
                var targetSection = document.getElementById(targetId);
                var icon = this.querySelector('i');

                if (targetSection.style.display === 'block') {
                    targetSection.style.display = 'none';
                    icon.classList.remove('bi-chevron-down');
                    icon.classList.add('bi-chevron-right');
                } else {
                    targetSection.style.display = 'block';
                    icon.classList.remove('bi-chevron-right');
                    icon.classList.add('bi-chevron-down');
                }
            });
        });
    }

    // Table row toggle functionality
    const toggleRowBtns = document.querySelectorAll('.toggle-row-btn');
    const tableRows = document.querySelectorAll('.owner-row');
    
    // Make the toggle button clickable
    if (toggleRowBtns) {
        toggleRowBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event from bubbling to the row
                toggleExpandedRow(this.getAttribute('data-owner-id'), this);
            });
        });
    }
    
    // Make the entire row clickable
    if (tableRows) {
        tableRows.forEach(row => {
            row.addEventListener('click', function() {
                const ownerId = this.getAttribute('data-owner-id');
                const toggleBtn = this.querySelector('.toggle-row-btn');
                toggleExpandedRow(ownerId, toggleBtn);
            });
        });
    }
    
    // Function to toggle the expanded row
    function toggleExpandedRow(ownerId, toggleBtn) {
        const expandedRow = document.getElementById(`expanded-row-${ownerId}`);
        const parentRow = toggleBtn.closest('tr');
        const icon = toggleBtn.querySelector('i');
        
        // Toggle the expanded row visibility
        if (expandedRow.style.display === 'none' || !expandedRow.style.display) {
            expandedRow.style.display = 'table-row';
            toggleBtn.classList.add('active');
            parentRow.classList.add('expanded');
            parentRow.classList.add('expanded-parent');
            icon.classList.remove('bi-chevron-down');
            icon.classList.add('bi-chevron-up');
            // Position tooltips to prevent overflow
            positionTooltips();
        } else {
            expandedRow.style.display = 'none';
            toggleBtn.classList.remove('active');
            parentRow.classList.remove('expanded');
            parentRow.classList.remove('expanded-parent');
            icon.classList.remove('bi-chevron-up');
            icon.classList.add('bi-chevron-down');
        }
    }
    
    // Function to position tooltips
    function positionTooltips() {
        const tooltips = document.querySelectorAll('.owner-pet-tooltip, .owner-appointment-tooltip');
        tooltips.forEach(tooltip => {
            const item = tooltip.closest('.owner-pet-item, .owner-appointment-item');
            if (item) positionTooltip(item, tooltip);
        });
    }
    
    // Function to position a tooltip relative to its parent item
    function positionTooltip(item, tooltip) {
        const itemRect = item.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        // Check if tooltip would overflow the right edge of the viewport
        if (itemRect.right + tooltipRect.width + 15 > viewportWidth) {
            // Position tooltip to the left of the item
            tooltip.style.left = 'auto';
            tooltip.style.right = '100%';
            tooltip.style.transform = 'translateX(-15px)';
            
            // Update hover effect
            item.addEventListener('mouseenter', () => {
                tooltip.style.transform = 'translateX(-10px)';
            });
            item.addEventListener('mouseleave', () => {
                tooltip.style.transform = 'translateX(-15px)';
            });
        } else {
            // Default positioning to the right
            tooltip.style.left = '100%';
            tooltip.style.right = 'auto';
            tooltip.style.transform = 'translateX(10px)';
            
            // Update hover effect
            item.addEventListener('mouseenter', () => {
                tooltip.style.transform = 'translateX(15px)';
            });
            item.addEventListener('mouseleave', () => {
                tooltip.style.transform = 'translateX(10px)';
            });
        }
        
        // Adjust vertical position if needed
        const tooltipTop = tooltipRect.top;
        const tooltipBottom = tooltipRect.bottom;
        const viewportHeight = window.innerHeight;
        
        if (tooltipBottom > viewportHeight) {
            const overflow = tooltipBottom - viewportHeight;
            tooltip.style.top = `${-overflow - 10}px`;
        } else if (tooltipTop < 0) {
            tooltip.style.top = `${Math.abs(tooltipTop) + 10}px`;
        }
    }
    
    // Add hover functionality for pet and appointment items
    const petItems = document.querySelectorAll('.owner-pet-item');
    petItems.forEach(item => {
        const tooltip = item.querySelector('.owner-pet-tooltip');
        if (tooltip) {
            // Initial positioning
            positionTooltip(item, tooltip);
            
            // Add hover events
            item.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });
            item.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
        }
    });

    const appointmentItems = document.querySelectorAll('.owner-appointment-item');
    appointmentItems.forEach(item => {
        const tooltip = item.querySelector('.owner-appointment-tooltip');
        if (tooltip) {
            // Initial positioning
            positionTooltip(item, tooltip);
            
            // Add hover events
            item.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });
            item.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
        }
    });
    
    // Reposition tooltips on window resize
    window.addEventListener('resize', positionTooltips);

    // Reset filters button
    var resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function () {
            window.location.href = window.location.pathname;
        });
    }

    // Delete confirmation modal
    var deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.addEventListener('show.bs.modal', function (event) {
            var button = event.relatedTarget;
            var ownerId = button.getAttribute('data-owner-id');
            var ownerName = button.getAttribute('data-owner-name');
            var confirmationText = document.getElementById('deleteConfirmationText');
            var ownerIdInput = document.getElementById('ownerIdToDelete');
            var deleteForm = document.getElementById('deleteForm');

            confirmationText.textContent = `Are you sure you want to delete ${ownerName}?`;
            ownerIdInput.value = ownerId;
            deleteForm.action = `/Owner/Delete/${ownerId}`;
        });
    }
});