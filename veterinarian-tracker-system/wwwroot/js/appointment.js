// Appointment Module JavaScript

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

// Table row toggle functionality
const toggleRowBtns = document.querySelectorAll('.js-toggle-row');
const tableRows = document.querySelectorAll('.appointment-table-row');

// Make the toggle button clickable
toggleRowBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event from bubbling to the row
        toggleExpandedRow(this.getAttribute('data-appointment-id'), this);
    });
});

// Make the entire row clickable
tableRows.forEach(row => {
    row.addEventListener('click', function() {
        const appointmentId = this.getAttribute('data-appointment-id');
        const toggleBtn = this.querySelector('.js-toggle-row');
        toggleExpandedRow(appointmentId, toggleBtn);
    });
});

// Function to toggle the expanded row
function toggleExpandedRow(appointmentId, toggleBtn) {
    const expandedRow = document.getElementById(`expanded-row-${appointmentId}`);
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

// Add hover functionality for pet and owner items with tooltip positioning
const appointmentPetItems = document.querySelectorAll('.appointment-pet-item');
const appointmentOwnerItems = document.querySelectorAll('.appointment-owner-item');
const appointmentVeterinarianItems = document.querySelectorAll('.appointment-veterinarian-item');

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
        ...appointmentPetItems,
        ...appointmentOwnerItems,
        ...appointmentVeterinarianItems
    ];
    
    allItems.forEach(item => {
        const tooltip = item.querySelector('.appointment-pet-tooltip') || 
                      item.querySelector('.appointment-owner-tooltip') || 
                      item.querySelector('.appointment-veterinarian-tooltip');
        
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

    // Toggle between card and table view
    var cardViewBtn = document.getElementById('cardViewBtn');
    var tableViewBtn = document.getElementById('tableViewBtn');
    var calendarViewBtn = document.getElementById('calendarViewBtn');
    var cardView = document.getElementById('cardView');
    var tableView = document.getElementById('tableView');
    var calendarView = document.getElementById('calendarView');

    if (cardViewBtn && tableViewBtn && cardView && tableView) {
        cardViewBtn.addEventListener('click', function() {
            cardView.style.display = '';
            tableView.style.display = 'none';
            if (calendarView) calendarView.style.display = 'none';
            
            cardViewBtn.classList.add('active');
            tableViewBtn.classList.remove('active');
            if (calendarViewBtn) calendarViewBtn.classList.remove('active');
            
            localStorage.setItem('appointmentViewPreference', 'card');
        });

        tableViewBtn.addEventListener('click', function() {
            cardView.style.display = 'none';
            tableView.style.display = 'block';
            if (calendarView) calendarView.style.display = 'none';
            
            tableViewBtn.classList.add('active');
            cardViewBtn.classList.remove('active');
            if (calendarViewBtn) calendarViewBtn.classList.remove('active');
            
            localStorage.setItem('appointmentViewPreference', 'table');
        });

        if (calendarViewBtn && calendarView) {
            calendarViewBtn.addEventListener('click', function() {
                cardView.style.display = 'none';
                tableView.style.display = 'none';
                calendarView.style.display = 'block';
                
                calendarViewBtn.classList.add('active');
                cardViewBtn.classList.remove('active');
                tableViewBtn.classList.remove('active');
                
                localStorage.setItem('appointmentViewPreference', 'calendar');
                
                // Initialize or refresh calendar if needed
                if (typeof initializeCalendar === 'function') {
                    initializeCalendar();
                }
            });
        }

        // Load user preference from localStorage
        var viewPreference = localStorage.getItem('appointmentViewPreference') || 'card';
        if (viewPreference === 'card') {
            cardViewBtn.click();
        } else if (viewPreference === 'table') {
            tableViewBtn.click();
        } else if (viewPreference === 'calendar' && calendarViewBtn) {
            calendarViewBtn.click();
        }
    }

    // Toggle pet info in card view
    var petToggleBtns = document.querySelectorAll('.pet-toggle-btn');
    
    petToggleBtns.forEach(function(btn) {
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

    // Toggle owner info in card view
    var ownerToggleBtns = document.querySelectorAll('.owner-toggle-btn');
    
    ownerToggleBtns.forEach(function(btn) {
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
    var vetToggleBtns = document.querySelectorAll('.vet-toggle-btn');
    
    vetToggleBtns.forEach(function(btn) {
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

    // Date range picker initialization (if using daterangepicker library)
    var dateRangePicker = document.getElementById('dateRangePicker');
    if (dateRangePicker && typeof daterangepicker !== 'undefined') {
        $(dateRangePicker).daterangepicker({
            opens: 'left',
            autoUpdateInput: false,
            locale: {
                cancelLabel: 'Clear',
                format: 'YYYY-MM-DD'
            }
        });

        $(dateRangePicker).on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'));
        });

        $(dateRangePicker).on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });
    }

    // Delete confirmation
    var deleteButtons = document.querySelectorAll('.delete-appointment-btn');
    var deleteConfirmBtn = document.getElementById('confirmDelete');
    var deleteForm = document.getElementById('deleteForm');
    var deleteAppointmentId = document.getElementById('deleteAppointmentId');
    var deletePetName = document.getElementById('deletePetName');
    var deleteAppointmentTime = document.getElementById('deleteAppointmentTime');
    
    deleteButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var appointmentId = this.getAttribute('data-appointment-id');
            var petName = this.getAttribute('data-pet-name');
            var appointmentTime = this.getAttribute('data-appointment-time');
            
            if (deleteAppointmentId) {
                deleteAppointmentId.value = appointmentId;
            }
            
            if (deletePetName) {
                deletePetName.textContent = petName;
            }
            
            if (deleteAppointmentTime) {
                deleteAppointmentTime.textContent = appointmentTime;
            }
            
            if (deleteForm) {
                deleteForm.action = '/Appointment/Delete/' + appointmentId;
            }
            
            if (confirmationText && petName && appointmentTime) {
                confirmationText.textContent = 'Are you sure you want to delete the appointment for ' + petName + ' scheduled at ' + appointmentTime + '?';
            }
        });
    });

    // Calendar view initialization (if needed)
    function initializeCalendar() {
        var calendarEl = document.getElementById('appointmentCalendar');
        if (!calendarEl || typeof FullCalendar === 'undefined') return;

        // Get appointment data from the data attribute
        var appointmentsData = [];
        try {
            appointmentsData = JSON.parse(calendarEl.getAttribute('data-appointments') || '[]');
        } catch (e) {
            console.error('Error parsing appointment data:', e);
        }

        // Format appointments for FullCalendar
        var events = appointmentsData.map(function(appointment) {
            var status = appointment.status || 'pending';
            var color;
            
            switch(status.toLowerCase()) {
                case 'confirmed':
                    color = '#2ecc71'; // Green
                    break;
                case 'cancelled':
                    color = '#e74c3c'; // Red
                    break;
                case 'completed':
                    color = '#3498db'; // Blue
                    break;
                default:
                    color = '#f39c12'; // Orange (pending)
            }
            
            return {
                id: appointment.id,
                title: appointment.petName + ' - ' + appointment.vetName,
                start: appointment.time,
                color: color,
                extendedProps: {
                    petId: appointment.petId,
                    vetId: appointment.vetId,
                    status: status,
                    notes: appointment.notes
                }
            };
        });

        // Initialize FullCalendar
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            events: events,
            eventClick: function(info) {
                // Show appointment details in a modal or popover
                var appointment = info.event;
                var modal = new bootstrap.Modal(document.getElementById('appointmentDetailModal'));
                
                document.getElementById('modalAppointmentTitle').textContent = appointment.title;
                document.getElementById('modalAppointmentTime').textContent = appointment.start.toLocaleString();
                document.getElementById('modalAppointmentStatus').textContent = appointment.extendedProps.status;
                document.getElementById('modalAppointmentNotes').textContent = appointment.extendedProps.notes || 'No notes';
                
                // Set up edit and delete buttons
                document.getElementById('editAppointmentBtn').setAttribute('href', '/Appointment/Edit/' + appointment.id);
                
                var deleteBtn = document.getElementById('deleteAppointmentBtn');
                if (deleteBtn) {
                    deleteBtn.setAttribute('data-appointment-id', appointment.id);
                    deleteBtn.setAttribute('data-pet-name', appointment.title.split(' - ')[0]);
                    deleteBtn.setAttribute('data-appointment-time', appointment.start.toLocaleString());
                    
                    // Add click event listener to populate delete modal
                    deleteBtn.addEventListener('click', function() {
                        var deleteAppointmentId = document.getElementById('deleteAppointmentId');
                        var deletePetName = document.getElementById('deletePetName');
                        var deleteAppointmentTime = document.getElementById('deleteAppointmentTime');
                        var deleteForm = document.getElementById('deleteForm');
                        
                        if (deleteAppointmentId) {
                            deleteAppointmentId.value = appointment.id;
                        }
                        
                        if (deletePetName) {
                            deletePetName.textContent = appointment.title.split(' - ')[0];
                        }
                        
                        if (deleteAppointmentTime) {
                            deleteAppointmentTime.textContent = appointment.start.toLocaleString();
                        }
                        
                        if (deleteForm) {
                            deleteForm.action = '/Appointment/Delete/' + appointment.id;
                        }
                    });
                }
                
                modal.show();
            }
        });

        calendar.render();
    }

    // Initialize calendar if view is active
    if (document.getElementById('calendarView') && 
        document.getElementById('calendarView').style.display !== 'none' && 
        typeof FullCalendar !== 'undefined') {
        initializeCalendar();
    }

    // Make initializeCalendar available globally
    window.initializeCalendar = initializeCalendar;
});