// Medicine Module JavaScript

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

    // Toggle between card and table view
    var cardViewBtn = document.getElementById('cardViewBtn');
    var tableViewBtn = document.getElementById('tableViewBtn');
    var cardView = document.getElementById('cardView');
    var tableView = document.getElementById('tableView');

    if (cardViewBtn && tableViewBtn && cardView && tableView) {
        cardViewBtn.addEventListener('click', function() {
            cardView.style.display = 'block';
            tableView.style.display = 'none';
            cardViewBtn.classList.add('active');
            tableViewBtn.classList.remove('active');
            localStorage.setItem('medicineViewPreference', 'card');
        });

        tableViewBtn.addEventListener('click', function() {
            cardView.style.display = 'none';
            tableView.style.display = 'block';
            tableViewBtn.classList.add('active');
            cardViewBtn.classList.remove('active');
            localStorage.setItem('medicineViewPreference', 'table');
        });

        // Load user preference from localStorage
        var viewPreference = localStorage.getItem('medicineViewPreference') || 'card';
        if (viewPreference === 'card') {
            cardViewBtn.click();
        } else {
            tableViewBtn.click();
        }
    }
    
    // Expanded row toggle functionality
    var toggleButtons = document.querySelectorAll('.js-toggle-row');
    var tableRows = document.querySelectorAll('.medicine-table-row');
    
    // Function to toggle expanded row
    function toggleExpandedRow(medicineId) {
        var expandedRow = document.getElementById('expanded-row-' + medicineId);
        var toggleButton = document.querySelector('.js-toggle-row[data-medicine-id="' + medicineId + '"]');
        var parentRow = toggleButton.closest('tr');
        
        if (expandedRow.style.display === 'none' || expandedRow.style.display === '') {
            expandedRow.style.display = 'table-row';
            toggleButton.classList.add('active');
            parentRow.classList.add('expanded-parent');
        } else {
            expandedRow.style.display = 'none';
            toggleButton.classList.remove('active');
            parentRow.classList.remove('expanded-parent');
        }
    }
    
    // Add click event to toggle buttons
    toggleButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            var medicineId = this.getAttribute('data-medicine-id');
            toggleExpandedRow(medicineId);
        });
    });
    
    // Add click event to table rows
    tableRows.forEach(function(row) {
        row.addEventListener('click', function(e) {
            if (e.target.closest('a') || e.target.closest('button:not(.js-toggle-row)')) {
                return;
            }
            var medicineId = this.getAttribute('data-medicine-id');
            toggleExpandedRow(medicineId);
        });
    });
    
    // Function to position tooltip to prevent viewport overflow
    function positionTooltip(tooltip, item) {
        var itemRect = item.getBoundingClientRect();
        var tooltipRect = tooltip.getBoundingClientRect();
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;
        
        // Reset position to default
        tooltip.style.top = '';
        tooltip.style.left = '';
        tooltip.style.right = '';
        tooltip.style.bottom = '';
        
        // Check horizontal overflow
        if (itemRect.left + tooltipRect.width > viewportWidth) {
            tooltip.style.right = '100%';
            tooltip.style.left = 'auto';
        } else {
            tooltip.style.left = '100%';
            tooltip.style.right = 'auto';
        }
        
        // Check vertical overflow
        if (itemRect.top + tooltipRect.height > viewportHeight) {
            tooltip.style.bottom = '0';
            tooltip.style.top = 'auto';
        } else {
            tooltip.style.top = '0';
            tooltip.style.bottom = 'auto';
        }
    }
    
    // Position tooltips for pet items
    var petItems = document.querySelectorAll('.medicine-pet-item');
    petItems.forEach(function(item) {
        var tooltip = item.querySelector('.medicine-pet-tooltip');
        if (tooltip) {
            item.addEventListener('mouseenter', function() {
                positionTooltip(tooltip, item);
            });
        }
    });
    
    // Position tooltips for owner items
    var ownerItems = document.querySelectorAll('.medicine-owner-item');
    ownerItems.forEach(function(item) {
        var tooltip = item.querySelector('.medicine-owner-tooltip');
        if (tooltip) {
            item.addEventListener('mouseenter', function() {
                positionTooltip(tooltip, item);
            });
        }
    });
    
    // Position tooltips for veterinarian items
    var vetItems = document.querySelectorAll('.medicine-veterinarian-item');
    vetItems.forEach(function(item) {
        var tooltip = item.querySelector('.medicine-veterinarian-tooltip');
        if (tooltip) {
            item.addEventListener('mouseenter', function() {
                positionTooltip(tooltip, item);
            });
        }
    });

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
    var deleteButtons = document.querySelectorAll('.delete-medicine-btn');
    var deleteConfirmBtn = document.getElementById('confirmDelete');
    var medicineIdInput = document.getElementById('medicineIdToDelete');
    
    deleteButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var medicineId = this.getAttribute('data-medicine-id');
            var medicineName = this.getAttribute('data-medicine-name');
            var petName = this.getAttribute('data-pet-name');
            var confirmationText = document.getElementById('deleteConfirmationText');
            
            if (medicineIdInput) {
                medicineIdInput.value = medicineId;
            }
            
            if (confirmationText && medicineName && petName) {
                confirmationText.textContent = 'Are you sure you want to delete ' + medicineName + ' for ' + petName + '?';
            }
        });
    });

    // Dosage calculator (if needed)
    var calculateDosageBtn = document.getElementById('calculateDosageBtn');
    if (calculateDosageBtn) {
        calculateDosageBtn.addEventListener('click', function() {
            var weight = parseFloat(document.getElementById('petWeight').value);
            var dosePerKg = parseFloat(document.getElementById('dosePerKg').value);
            var resultElement = document.getElementById('calculatedDose');
            
            if (!isNaN(weight) && !isNaN(dosePerKg)) {
                var calculatedDose = weight * dosePerKg;
                resultElement.textContent = calculatedDose.toFixed(2);
                document.getElementById('doseResult').classList.remove('d-none');
            } else {
                alert('Please enter valid weight and dose values');
            }
        });
    }

    // Medicine schedule visualization (if needed)
    function initializeMedicineSchedule() {
        var scheduleContainer = document.getElementById('medicineScheduleChart');
        if (!scheduleContainer || typeof Chart === 'undefined') return;

        // Get medicine schedule data
        var scheduleData = [];
        try {
            scheduleData = JSON.parse(scheduleContainer.getAttribute('data-schedule') || '[]');
        } catch (e) {
            console.error('Error parsing medicine schedule data:', e);
            return;
        }

        // Prepare data for chart
        var labels = scheduleData.map(function(item) { return item.time; });
        var doses = scheduleData.map(function(item) { return item.dose; });

        // Create chart
        var ctx = scheduleContainer.getContext('2d');
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Dosage Schedule',
                    data: doses,
                    backgroundColor: 'rgba(26, 188, 156, 0.2)',
                    borderColor: 'rgba(26, 188, 156, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(26, 188, 156, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(26, 188, 156, 1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Dose'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
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
                                return 'Dose: ' + context.raw;
                            }
                        }
                    }
                }
            }
        });
    }

    // Initialize medicine schedule chart if container exists
    if (document.getElementById('medicineScheduleChart')) {
        initializeMedicineSchedule();
    }
});