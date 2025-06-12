/**
 * Enhanced sidebar functionality for VetTracker admin panel
 * Includes sidebar toggle, responsive behavior, dark mode, and active item tracking
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const body = document.body;
    const toggleBtn = document.getElementById('toggleSidebar');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const sidebar = document.getElementById('side_nav');
    const navItems = document.querySelectorAll('.nav-item');
    const notificationBell = document.querySelector('.notification-bell');
    
    // Initialize tooltips for collapsed sidebar
    function initTooltips() {
        document.querySelectorAll('.nav-link').forEach(link => {
            const span = link.querySelector('span');
            if (span) {
                link.setAttribute('data-tooltip', span.textContent.trim());
                link.classList.add('nav-tooltip');
            }
        });
    }
    
    // Toggle sidebar expanded/collapsed state
    function toggleSidebar() {
        if (window.innerWidth < 992) {
            body.classList.toggle('sidebar-open');
            
            // Add overlay click handler when sidebar is open on mobile
            if (body.classList.contains('sidebar-open')) {
                document.addEventListener('click', closeSidebarOnClickOutside);
            } else {
                document.removeEventListener('click', closeSidebarOnClickOutside);
            }
        } else {
            body.classList.toggle('sidebar-collapsed');
            localStorage.setItem('sidebarState', body.classList.contains('sidebar-collapsed') ? 'collapsed' : 'expanded');
        }
    }
    
    // Close sidebar when clicking outside on mobile
    function closeSidebarOnClickOutside(event) {
        if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
            body.classList.remove('sidebar-open');
            document.removeEventListener('click', closeSidebarOnClickOutside);
        }
    }
    
    // Toggle dark/light mode
    function toggleDarkMode() {
        if (darkModeToggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
        
        // Dispatch event for charts to update their theme
        const themeEvent = new CustomEvent('themeChanged', {
            detail: { isDark: darkModeToggle.checked }
        });
        document.dispatchEvent(themeEvent);
    }
    
    // Handle window resize
    function handleResize() {
        if (window.innerWidth < 992) {
            body.classList.remove('sidebar-collapsed');
        } else {
            body.classList.remove('sidebar-open');
            document.removeEventListener('click', closeSidebarOnClickOutside);
            
            // Restore saved sidebar state
            const savedState = localStorage.getItem('sidebarState');
            if (savedState === 'collapsed') {
                body.classList.add('sidebar-collapsed');
            } else {
                body.classList.remove('sidebar-collapsed');
            }
        }
    }
    
    // Set active nav item based on current URL
    function setActiveNavItem() {
        const currentPath = window.location.pathname;
        
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (link && link.getAttribute('href') === currentPath) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Initialize notification system
    function initNotifications() {
        if (notificationBell) {
            notificationBell.addEventListener('click', function() {
                // Future enhancement: show notification dropdown
                console.log('Notification bell clicked');
            });
        }
    }
    
    // Initialize theme based on saved preference
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = true;
        }
    }
    
    // Initialize sidebar state
    function initSidebarState() {
        if (window.innerWidth >= 992) {
            const savedState = localStorage.getItem('sidebarState');
            if (savedState === 'collapsed') {
                body.classList.add('sidebar-collapsed');
            }
        }
    }
    
    // Event Listeners
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', toggleDarkMode);
    }
    
    window.addEventListener('resize', handleResize);
    
    // Initialize
    initTooltips();
    initTheme();
    initSidebarState();
    setActiveNavItem();
    initNotifications();
    handleResize();
    
    // Add click handler for nav items (for mobile/touch devices)
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

