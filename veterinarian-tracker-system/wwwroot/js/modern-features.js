/**
 * Modern Features JavaScript
 * Adds modern interactive features and effects to the VetTracker application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeAnimations();
    initializeTooltips();
    initializePopovers();
    initializeToasts();
    initializeCounters();
    initializeDataTables();
    initializeCharts();
    initializeFormValidation();
    initializeImagePreview();
    initializeLazyLoading();
    
    // Listen for theme changes to update charts and other components
    document.addEventListener('themeChanged', function(e) {
        const isDarkMode = e.detail.isDark;
        updateChartsTheme(isDarkMode);
    });
});

/**
 * Initialize animations for elements with animation classes
 */
function initializeAnimations() {
    // Add .fade-in class to main content if not already present
    const mainContent = document.querySelector('.main-content');
    if (mainContent && !mainContent.classList.contains('fade-in')) {
        mainContent.classList.add('fade-in');
    }
    
    // Add staggered animation to card elements
    const cardContainers = document.querySelectorAll('.row');
    cardContainers.forEach(container => {
        if (container.querySelectorAll('.card').length > 1) {
            container.classList.add('stagger-animation');
        }
    });
    
    // Add hover effects to buttons and cards
    document.querySelectorAll('.btn:not(.btn-sm):not(.btn-xs)').forEach(btn => {
        btn.classList.add('btn-3d');
    });
    
    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('hover-lift');
    });
}

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            boundary: document.body
        });
    });
}

/**
 * Initialize Bootstrap popovers
 */
function initializePopovers() {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

/**
 * Initialize Bootstrap toasts
 */
function initializeToasts() {
    const toastElList = [].slice.call(document.querySelectorAll('.toast'));
    toastElList.map(function(toastEl) {
        return new bootstrap.Toast(toastEl);
    });
    
    // Show success toast if URL has success parameter
    if (window.location.search.includes('success=')) {
        const successParam = new URLSearchParams(window.location.search).get('success');
        if (successParam) {
            showToast('Success', decodeURIComponent(successParam), 'success');
        }
    }
    
    // Show error toast if URL has error parameter
    if (window.location.search.includes('error=')) {
        const errorParam = new URLSearchParams(window.location.search).get('error');
        if (errorParam) {
            showToast('Error', decodeURIComponent(errorParam), 'danger');
        }
    }
}

/**
 * Show a toast notification
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, danger, warning, info)
 */
function showToast(title, message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-${type} text-white">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
                <strong class="me-auto">${title}</strong>
                <small>Just now</small>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    // Initialize and show the toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 5000 });
    toast.show();
    
    // Remove toast from DOM after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        toastElement.remove();
    });
}

/**
 * Initialize animated counters
 */
function initializeCounters() {
    const counters = document.querySelectorAll('.counter-value');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = parseInt(counter.getAttribute('data-duration') || '2000');
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Initialize DataTables for tables with the .datatable class
 */
function initializeDataTables() {
    const tables = document.querySelectorAll('table.datatable');
    
    if (tables.length === 0 || typeof $.fn.DataTable === 'undefined') return;
    
    tables.forEach(table => {
        $(table).DataTable({
            responsive: true,
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search..."
            },
            dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>t<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
            lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]]
        });
    });
}

/**
 * Initialize charts using Chart.js
 */
function initializeCharts() {
    if (typeof Chart === 'undefined') return;
    
    // Set default Chart.js options based on current theme
    const isDarkMode = document.body.classList.contains('dark-mode');
    setChartDefaults(isDarkMode);
    
    // Initialize charts based on canvas elements with data attributes
    const chartElements = document.querySelectorAll('canvas[data-chart-type]');
    
    chartElements.forEach(canvas => {
        const chartType = canvas.getAttribute('data-chart-type');
        const chartData = JSON.parse(canvas.getAttribute('data-chart-data') || '{}');
        const chartOptions = JSON.parse(canvas.getAttribute('data-chart-options') || '{}');
        
        new Chart(canvas, {
            type: chartType,
            data: chartData,
            options: chartOptions
        });
    });
}

/**
 * Set Chart.js defaults based on theme
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
function setChartDefaults(isDarkMode) {
    if (typeof Chart === 'undefined') return;
    
    Chart.defaults.color = isDarkMode ? '#e9ecef' : '#6b7280';
    Chart.defaults.borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
}

/**
 * Update charts when theme changes
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
function updateChartsTheme(isDarkMode) {
    if (typeof Chart === 'undefined') return;
    
    setChartDefaults(isDarkMode);
    
    // Update all existing charts
    Chart.instances.forEach(chart => {
        chart.options.scales.x.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        chart.options.scales.y.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        chart.update();
    });
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
        }, false);
    });
}

/**
 * Initialize image preview for file inputs
 */
function initializeImagePreview() {
    const imageInputs = document.querySelectorAll('input[type="file"][data-preview]');
    
    imageInputs.forEach(input => {
        const previewId = input.getAttribute('data-preview');
        const previewElement = document.getElementById(previewId);
        
        if (!previewElement) return;
        
        input.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewElement.src = e.target.result;
                    previewElement.classList.remove('d-none');
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    });
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length === 0) return;
        
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    img.classList.remove('lazy');
                    lazyImageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }
}