// Pet Module JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize Bootstrap toasts
    var toastElList = [].slice.call(document.querySelectorAll('.toast'));
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    });

    // Show success toast if present
    var successToast = document.getElementById('successToast');
    if (successToast) {
        var toast = new bootstrap.Toast(successToast);
        toast.show();
    }

    // Avatar modal functionality
    var avatarImages = document.querySelectorAll('.pet-avatar-img');
    var avatarModal = document.getElementById('avatarModal');
    var modalImage = document.getElementById('modalAvatarImage');
    var modalClose = document.querySelector('.avatar-modal-close');

    if (avatarImages.length > 0 && avatarModal && modalImage) {
        avatarImages.forEach(function(img) {
            img.addEventListener('click', function() {
                modalImage.src = this.src;
                avatarModal.style.display = 'flex';
            });
        });

        // Close modal when clicking the close button
        if (modalClose) {
            modalClose.addEventListener('click', function() {
                avatarModal.style.display = 'none';
            });
        }

        // Close modal when clicking outside the image
        avatarModal.addEventListener('click', function(event) {
            if (event.target === avatarModal) {
                avatarModal.style.display = 'none';
            }
        });
    }

    // Toggle between card and table view
    var cardViewBtn = document.getElementById('cardViewBtn');
    var tableViewBtn = document.getElementById('tableViewBtn');
    var cardView = document.getElementById('cardView');
    var tableView = document.getElementById('tableView');

    if (cardViewBtn && tableViewBtn && cardView && tableView) {
        cardViewBtn.addEventListener('click', function() {
            cardView.style.display = '';
            tableView.style.display = 'none';
            cardViewBtn.classList.add('active');
            tableViewBtn.classList.remove('active');
            localStorage.setItem('petViewPreference', 'card');
        });

        tableViewBtn.addEventListener('click', function() {
            cardView.style.display = 'none';
            tableView.style.display = 'block';
            tableViewBtn.classList.add('active');
            cardViewBtn.classList.remove('active');
            localStorage.setItem('petViewPreference', 'table');
        });

        // Load user preference from localStorage
        var viewPreference = localStorage.getItem('petViewPreference') || 'card';
        if (viewPreference === 'card') {
            cardViewBtn.click();
        } else {
            tableViewBtn.click();
        }
    }

    // Toggle appointment sections in card view
    var appointmentToggleBtns = document.querySelectorAll('.appointment-toggle-btn');
    
    appointmentToggleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetId = this.getAttribute('data-target');
            var targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                this.classList.toggle('active');
                targetSection.classList.toggle('show');
                
                var icon = this.querySelector('i');
                if (icon) {
                    if (targetSection.classList.contains('show')) {
                        icon.classList.remove('bi-chevron-right');
                        icon.classList.add('bi-chevron-down');
                    } else {
                        icon.classList.remove('bi-chevron-down');
                        icon.classList.add('bi-chevron-right');
                    }
                }
            }
        });
    });

    // Toggle medicine sections in card view
    var medicineToggleBtns = document.querySelectorAll('.medicine-toggle-btn');
    
    medicineToggleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetId = this.getAttribute('data-target');
            var targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                this.classList.toggle('active');
                targetSection.classList.toggle('show');
                
                var icon = this.querySelector('i');
                if (icon) {
                    if (targetSection.classList.contains('show')) {
                        icon.classList.remove('bi-chevron-right');
                        icon.classList.add('bi-chevron-down');
                    } else {
                        icon.classList.remove('bi-chevron-down');
                        icon.classList.add('bi-chevron-right');
                    }
                }
            }
        });
    });

    // Toggle vaccine sections in card view
    var vaccineToggleBtns = document.querySelectorAll('.vaccine-toggle-btn');
    
    vaccineToggleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetId = this.getAttribute('data-target');
            var targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                this.classList.toggle('active');
                targetSection.classList.toggle('show');
                
                var icon = this.querySelector('i');
                if (icon) {
                    if (targetSection.classList.contains('show')) {
                        icon.classList.remove('bi-chevron-right');
                        icon.classList.add('bi-chevron-down');
                    } else {
                        icon.classList.remove('bi-chevron-down');
                        icon.classList.add('bi-chevron-right');
                    }
                }
            }
        });
    });

    // Table row toggle functionality
    const toggleRowBtns = document.querySelectorAll('.js-toggle-row');
    const tableRows = document.querySelectorAll('.pet-table-row');
    
    // Make the toggle button clickable
    toggleRowBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling to the row
            toggleExpandedRow(this.getAttribute('data-pet-id'), this);
        });
    });
    
    // Make the entire row clickable
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            const petId = this.getAttribute('data-pet-id');
            const toggleBtn = this.querySelector('.js-toggle-row');
            toggleExpandedRow(petId, toggleBtn);
        });
    });
    
    // Function to toggle the expanded row
    function toggleExpandedRow(petId, toggleBtn) {
        const expandedRow = document.getElementById(`expanded-row-${petId}`);
        const parentRow = toggleBtn.closest('tr');
        
        // Toggle the expanded row visibility
        if (expandedRow.style.display === 'none' || !expandedRow.style.display) {
            expandedRow.style.display = 'table-row';
            toggleBtn.classList.add('active');
            parentRow.classList.add('expanded-parent');
            positionTooltips();
        } else {
            expandedRow.style.display = 'none';
            toggleBtn.classList.remove('active');
            parentRow.classList.remove('expanded-parent');
        }
    }
    
    // Add hover functionality for pet and appointment items with tooltip positioning
    const petAppointmentItems = document.querySelectorAll('.pet-appointment-item');
    const petMedicineItems = document.querySelectorAll('.pet-medicine-item');
    const petVaccineItems = document.querySelectorAll('.pet-vaccine-item');
    
    // Function to position tooltips to prevent viewport overflow
    function positionTooltip(item, tooltip) {
        const itemRect = item.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Reset positioning
        tooltip.style.left = '';
        tooltip.style.right = '';
        tooltip.style.top = '';
        tooltip.style.transform = '';
        
        // Check if tooltip would go off the right edge of the viewport
        if (itemRect.right + tooltipRect.width > window.innerWidth) {
            tooltip.style.left = 'auto';
            tooltip.style.right = '100%';
            tooltip.style.transform = 'translateX(-15px)';
        } else {
            tooltip.style.right = 'auto';
            tooltip.style.left = '100%';
            tooltip.style.transform = 'translateX(15px)';
        }
        
        // Check if tooltip would go off the top or bottom of the viewport
        const tooltipTop = itemRect.top + (itemRect.height / 2) - (tooltipRect.height / 2);
        if (tooltipTop < 0) {
            tooltip.style.top = '0';
        } else if (tooltipTop + tooltipRect.height > window.innerHeight) {
            tooltip.style.top = `${window.innerHeight - tooltipRect.height - 10}px`;
        } else {
            tooltip.style.top = `${tooltipTop}px`;
        }
    }
    
    // Function to position all tooltips
    function positionTooltips() {
        const allItems = [
            ...petAppointmentItems,
            ...petMedicineItems,
            ...petVaccineItems
        ];
        
        allItems.forEach(item => {
            const tooltip = item.querySelector('.pet-appointment-tooltip') || 
                          item.querySelector('.pet-medicine-tooltip') || 
                          item.querySelector('.pet-vaccine-tooltip');
            
            if (tooltip) {
                item.addEventListener('mouseenter', () => {
                    positionTooltip(item, tooltip);
                    tooltip.style.opacity = '1';
                    tooltip.style.visibility = 'visible';
                });
                
                item.addEventListener('mouseleave', () => {
                    tooltip.style.opacity = '0';
                    tooltip.style.visibility = 'hidden';
                });
            }
        });
    }
    
    // Call positionTooltips initially
    positionTooltips();
    
    // Reposition tooltips on window resize
    window.addEventListener('resize', positionTooltips);

    // Enhanced Filter and Search functionality
    var filterForm = document.getElementById('filterForm');
    var searchInput = document.querySelector('input[name="searchString"]');
    var petCards = document.querySelectorAll('.col-md-6.col-lg-4'); // Card containers
    var petTableRows = document.querySelectorAll('.pet-table-row'); // Table rows
    var noResultsCard = document.createElement('div');
    var noResultsTable = document.createElement('tr');
    
    // Setup no results messages
    noResultsCard.className = 'col-12 text-center';
    noResultsCard.innerHTML = '<div class="alert alert-info">No pets found matching your search criteria.</div>';
    noResultsCard.style.display = 'none';
    
    noResultsTable.innerHTML = '<td colspan="13" class="text-center">No pets found matching your search criteria.</td>';
    noResultsTable.style.display = 'none';
    
    // Add no results elements to DOM
    if (document.getElementById('cardView')) {
        document.getElementById('cardView').appendChild(noResultsCard);
    }
    
    if (document.querySelector('.pet-table tbody')) {
        document.querySelector('.pet-table tbody').appendChild(noResultsTable);
    }
    
    // Client-side search function
    function performClientSearch(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();
        let cardMatchCount = 0;
        let tableMatchCount = 0;
        
        // Filter card view
        petCards.forEach(function(card) {
            const petName = card.querySelector('.pet-card-header h5')?.textContent.toLowerCase() || '';
            const petType = card.querySelector('.pet-badge')?.textContent.toLowerCase() || '';
            const petDetails = card.querySelector('.pet-card-body')?.textContent.toLowerCase() || '';
            
            if (searchTerm === '' || 
                petName.includes(searchTerm) || 
                petType.includes(searchTerm) || 
                petDetails.includes(searchTerm)) {
                card.style.display = '';
                cardMatchCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Filter table view
        petTableRows.forEach(function(row) {
            const rowText = row.textContent.toLowerCase();
            const expandedRow = document.getElementById(`expanded-row-${row.getAttribute('data-pet-id')}`);
            
            if (searchTerm === '' || rowText.includes(searchTerm)) {
                row.style.display = '';
                if (expandedRow && expandedRow.classList.contains('show')) {
                    expandedRow.style.display = 'table-row';
                }
                tableMatchCount++;
            } else {
                row.style.display = 'none';
                if (expandedRow) {
                    expandedRow.style.display = 'none';
                }
            }
        });
        
        // Show/hide no results messages
        noResultsCard.style.display = cardMatchCount === 0 ? 'block' : 'none';
        noResultsTable.style.display = tableMatchCount === 0 ? 'table-row' : 'none';
        
        // Update stats to reflect filtered results
        updateFilteredStats(cardMatchCount);
    }
    
    // Update stats based on filtered results
    function updateFilteredStats(count) {
        const totalPetsElement = document.querySelector('.pet-stat-info h3');
        if (totalPetsElement) {
            const originalCount = parseInt(totalPetsElement.getAttribute('data-original-count') || totalPetsElement.textContent);
            
            // Store original count if not already stored
            if (!totalPetsElement.hasAttribute('data-original-count')) {
                totalPetsElement.setAttribute('data-original-count', originalCount);
            }
            
            // Update displayed count
            if (searchInput.value.trim() !== '') {
                totalPetsElement.textContent = count;
                totalPetsElement.innerHTML += `<small class="filtered-indicator"> (filtered from ${originalCount})</small>`;
            } else {
                totalPetsElement.textContent = originalCount;
            }
        }
    }
    
    // Initialize search functionality
    if (searchInput) {
        // Add debounce to prevent excessive filtering
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performClientSearch(this.value);
            }, 300); // 300ms debounce
        });
        
        // Add clear search button
        const searchContainer = searchInput.parentElement;
        const clearButton = document.createElement('button');
        clearButton.className = 'btn btn-outline-secondary search-clear-btn';
        clearButton.type = 'button';
        clearButton.innerHTML = '<i class="bi bi-x"></i>';
        clearButton.style.display = 'none';
        
        searchContainer.appendChild(clearButton);
        
        // Show/hide clear button based on input
        searchInput.addEventListener('input', function() {
            clearButton.style.display = this.value.length > 0 ? 'block' : 'none';
        });
        
        // Clear search when button is clicked
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            performClientSearch('');
            this.style.display = 'none';
            searchInput.focus();
        });
    }
    
    // Form submission handling
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            // Form will submit normally for server-side filtering
        });

        // Reset filters
        var resetBtn = document.getElementById('resetFilters');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                var inputs = filterForm.querySelectorAll('input:not([type=submit]), select');
                inputs.forEach(function(input) {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                });
                
                // Reset client-side filtering
                performClientSearch('');
                
                // Hide clear button
                const clearButton = document.querySelector('.search-clear-btn');
                if (clearButton) {
                    clearButton.style.display = 'none';
                }
                
                // Submit form for server-side reset
                filterForm.submit();
            });
        }
    }

    // Delete confirmation
    var deleteButtons = document.querySelectorAll('.delete-pet-btn');
    var deleteConfirmBtn = document.getElementById('confirmDelete');
    var petIdInput = document.getElementById('petIdToDelete');
    
    deleteButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var petId = this.getAttribute('data-pet-id');
            var petName = this.getAttribute('data-pet-name');
            var confirmationText = document.getElementById('deleteConfirmationText');
            
            if (petIdInput) {
                petIdInput.value = petId;
            }
            
            if (confirmationText && petName) {
                confirmationText.textContent = 'Are you sure you want to delete ' + petName + '?';
            }
        });
    });

    // Age calculation helper (if needed)
    function calculateAge(birthDate) {
        var today = new Date();
        var birth = new Date(birthDate);
        var age = today.getFullYear() - birth.getFullYear();
        var monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }
});