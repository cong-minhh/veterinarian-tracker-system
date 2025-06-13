// Vaccine Module JavaScript

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

    // Toggle between card, table, and timeline view
    var cardViewBtn = document.getElementById('cardViewBtn');
    var tableViewBtn = document.getElementById('tableViewBtn');
    var timelineViewBtn = document.getElementById('timelineViewBtn');
    var cardView = document.getElementById('cardView');
    var tableView = document.getElementById('tableView');
    var timelineView = document.getElementById('timelineView');

    if (cardViewBtn && tableViewBtn && cardView && tableView) {
        cardViewBtn.addEventListener('click', function() {
            cardView.style.display = 'block';
            tableView.style.display = 'none';
            if (timelineView) timelineView.style.display = 'none';
            
            cardViewBtn.classList.add('active');
            tableViewBtn.classList.remove('active');
            if (timelineViewBtn) timelineViewBtn.classList.remove('active');
            
            localStorage.setItem('vaccineViewPreference', 'card');
        });

        tableViewBtn.addEventListener('click', function() {
            cardView.style.display = 'none';
            tableView.style.display = 'block';
            if (timelineView) timelineView.style.display = 'none';
            
            tableViewBtn.classList.add('active');
            cardViewBtn.classList.remove('active');
            if (timelineViewBtn) timelineViewBtn.classList.remove('active');
            
            localStorage.setItem('vaccineViewPreference', 'table');
        });

        if (timelineViewBtn && timelineView) {
            timelineViewBtn.addEventListener('click', function() {
                cardView.style.display = 'none';
                tableView.style.display = 'none';
                timelineView.style.display = 'block';
                
                timelineViewBtn.classList.add('active');
                cardViewBtn.classList.remove('active');
                tableViewBtn.classList.remove('active');
                
                localStorage.setItem('vaccineViewPreference', 'timeline');
            });
        }

        // Load user preference from localStorage
        var viewPreference = localStorage.getItem('vaccineViewPreference') || 'card';
        if (viewPreference === 'card') {
            cardViewBtn.click();
        } else if (viewPreference === 'table') {
            tableViewBtn.click();
        } else if (viewPreference === 'timeline' && timelineViewBtn) {
            timelineViewBtn.click();
        }
    }

    // Toggle pet info in card view
    var petInfoToggleBtns = document.querySelectorAll('.pet-info-toggle-btn');
    
    petInfoToggleBtns.forEach(function(btn) {
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
    
    // Expanded row functionality for table view
    const toggleButtons = document.querySelectorAll('.js-toggle-row');
    const tableRows = document.querySelectorAll('tr[data-vaccine-id]');
    
    // Function to toggle expanded row
    function toggleExpandedRow(vaccineId) {
        const row = document.querySelector(`tr[data-vaccine-id="${vaccineId}"]`);
        const expandedRow = document.getElementById(`expanded-row-${vaccineId}`);
        const toggleButton = row.querySelector('.js-toggle-row');
        
        if (expandedRow) {
            row.classList.toggle('active');
            
            if (expandedRow.style.display === 'none' || expandedRow.style.display === '') {
                expandedRow.style.display = 'table-row';
                // Position tooltips after expanding
                positionTooltips(expandedRow);
            } else {
                expandedRow.style.display = 'none';
            }
        }
    }
    
    // Add click event to toggle buttons
    toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const vaccineId = button.getAttribute('data-vaccine-id');
            toggleExpandedRow(vaccineId);
        });
    });
    
    // Add click event to table rows
    tableRows.forEach(row => {
        row.addEventListener('click', () => {
            const vaccineId = row.getAttribute('data-vaccine-id');
            toggleExpandedRow(vaccineId);
        });
    });
    
    // Function to position tooltips
    function positionTooltips(expandedRow) {
        const petItems = expandedRow.querySelectorAll('.vaccine-pet-item');
        const ownerItems = expandedRow.querySelectorAll('.vaccine-owner-item');
        const vetItems = expandedRow.querySelectorAll('.vaccine-veterinarian-item');
        
        const positionTooltip = (items, tooltipClass) => {
            items.forEach(item => {
                const tooltip = item.querySelector(tooltipClass);
                
                if (!tooltip) return;
                
                item.addEventListener('mouseenter', () => {
                    // Reset position first
                    tooltip.style.top = '0';
                    tooltip.style.left = '100%';
                    tooltip.style.display = 'block';
                    
                    // Get positions
                    const itemRect = item.getBoundingClientRect();
                    const tooltipRect = tooltip.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;
                    
                    // Check if tooltip goes beyond right edge of viewport
                    if (tooltipRect.right > viewportWidth) {
                        tooltip.style.left = 'auto';
                        tooltip.style.right = '100%';
                    }
                    
                    // Check if tooltip goes beyond bottom edge of viewport
                    if (tooltipRect.bottom > viewportHeight) {
                        const overflowAmount = tooltipRect.bottom - viewportHeight;
                        tooltip.style.top = `-${overflowAmount}px`;
                    }
                });
                
                item.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                });
            });
        };
        
        positionTooltip(petItems, '.vaccine-pet-tooltip');
        positionTooltip(ownerItems, '.vaccine-owner-tooltip');
        positionTooltip(vetItems, '.vaccine-veterinarian-tooltip');
    }

    // Toggle vet info in card view
    var vetInfoToggleBtns = document.querySelectorAll('.vet-info-toggle-btn');
    
    vetInfoToggleBtns.forEach(function(btn) {
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

    // Expand/collapse rows in table view
    var expandButtons = document.querySelectorAll('.expand-row-btn');
    
    expandButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetId = this.getAttribute('data-target');
            var targetRow = document.getElementById(targetId);
            
            if (targetRow) {
                targetRow.classList.toggle('d-none');
                
                var icon = this.querySelector('i');
                if (icon) {
                    if (targetRow.classList.contains('d-none')) {
                        icon.classList.remove('bi-chevron-down');
                        icon.classList.add('bi-chevron-right');
                    } else {
                        icon.classList.remove('bi-chevron-right');
                        icon.classList.add('bi-chevron-down');
                    }
                }
            }
        });
    });

    // Filter functionality
    var filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            // Form will submit normally, no need to prevent default
            // This is just a hook for any additional client-side filtering if needed
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
                filterForm.submit();
            });
        }
    }

    // Delete confirmation
    var deleteButtons = document.querySelectorAll('.delete-vaccine-btn');
    var deleteConfirmBtn = document.getElementById('confirmDelete');
    var vaccineIdInput = document.getElementById('vaccineIdToDelete');
    
    deleteButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var vaccineId = this.getAttribute('data-vaccine-id');
            var vaccineName = this.getAttribute('data-vaccine-name');
            var petName = this.getAttribute('data-pet-name');
            var confirmationText = document.getElementById('deleteConfirmationText');
            
            if (vaccineIdInput) {
                vaccineIdInput.value = vaccineId;
            }
            
            if (confirmationText && vaccineName && petName) {
                confirmationText.textContent = 'Are you sure you want to delete ' + vaccineName + ' vaccine for ' + petName + '?';
            }
        });
    });

    // Vaccine schedule visualization (if needed)
    function initializeVaccineSchedule() {
        var scheduleContainer = document.getElementById('vaccineScheduleChart');
        if (!scheduleContainer || typeof Chart === 'undefined') return;

        // Get vaccine schedule data
        var scheduleData = [];
        try {
            scheduleData = JSON.parse(scheduleContainer.getAttribute('data-schedule') || '[]');
        } catch (e) {
            console.error('Error parsing vaccine schedule data:', e);
            return;
        }

        // Prepare data for chart
        var labels = scheduleData.map(function(item) { return item.name; });
        var currentDates = scheduleData.map(function(item) { 
            return new Date(item.date).getTime(); 
        });
        var nextDates = scheduleData.map(function(item) { 
            return item.nextDate ? new Date(item.nextDate).getTime() : null; 
        });

        // Get min and max dates for scale
        var allDates = currentDates.concat(nextDates.filter(function(date) { return date !== null; }));
        var minDate = Math.min.apply(null, allDates);
        var maxDate = Math.max.apply(null, allDates);
        var dateRange = maxDate - minDate;

        // Normalize dates to 0-100 scale for visualization
        var normalizedCurrentDates = currentDates.map(function(date) {
            return ((date - minDate) / dateRange) * 100;
        });
        var normalizedNextDates = nextDates.map(function(date) {
            return date ? ((date - minDate) / dateRange) * 100 : null;
        });

        // Create chart
        var ctx = scheduleContainer.getContext('2d');
        var chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Current Vaccination',
                        data: normalizedCurrentDates,
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Next Due',
                        data: normalizedNextDates,
                        backgroundColor: 'rgba(243, 156, 18, 0.7)',
                        borderColor: 'rgba(243, 156, 18, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Timeline'
                        },
                        ticks: {
                            callback: function(value) {
                                // Convert normalized value back to date
                                var date = new Date(minDate + (value / 100) * dateRange);
                                return date.toLocaleDateString();
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Vaccines'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                var datasetLabel = context.dataset.label || '';
                                var value = context.raw;
                                var date = new Date(minDate + (value / 100) * dateRange);
                                return datasetLabel + ': ' + date.toLocaleDateString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Initialize vaccine schedule chart if container exists
    if (document.getElementById('vaccineScheduleChart')) {
        initializeVaccineSchedule();
    }

    // Vaccine reminder functionality (if needed)
    var reminderButtons = document.querySelectorAll('.set-reminder-btn');
    
    reminderButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var vaccineId = this.getAttribute('data-vaccine-id');
            var vaccineName = this.getAttribute('data-vaccine-name');
            var petName = this.getAttribute('data-pet-name');
            var nextDueDate = this.getAttribute('data-next-due');
            
            var reminderModal = document.getElementById('reminderModal');
            var reminderForm = document.getElementById('reminderForm');
            var vaccineIdInput = document.getElementById('reminderVaccineId');
            var reminderTitle = document.getElementById('reminderModalTitle');
            
            if (reminderModal && reminderForm && vaccineIdInput && reminderTitle) {
                vaccineIdInput.value = vaccineId;
                reminderTitle.textContent = 'Set Reminder for ' + vaccineName + ' - ' + petName;
                
                if (nextDueDate) {
                    var dueDateInput = document.getElementById('reminderDate');
                    if (dueDateInput) {
                        dueDateInput.value = nextDueDate;
                    }
                }
                
                var modal = new bootstrap.Modal(reminderModal);
                modal.show();
            }
        });
    });
});