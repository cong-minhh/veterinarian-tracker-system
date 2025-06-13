/**
 * Table Features JavaScript
 * Adds interactive features to tables in the VetTracker application
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all table features
    initializeTableSorting();
    initializeTableFiltering();
    initializeTablePagination();
    initializeTableSelection();
    initializeTableExpanding();
    initializeTableResponsive();
    initializeTableHighlighting();
    initializeTableExport();
});

/**
 * Initialize table sorting functionality
 */
function initializeTableSorting() {
    const sortableTables = document.querySelectorAll('table.table-sortable');
    
    sortableTables.forEach(table => {
        const headers = table.querySelectorAll('th');
        
        headers.forEach(header => {
            if (header.classList.contains('no-sort')) return;
            
            header.addEventListener('click', function() {
                const index = Array.from(header.parentNode.children).indexOf(header);
                const currentIsAscending = header.classList.contains('sort-asc');
                
                // Remove sort classes from all headers
                headers.forEach(h => {
                    h.classList.remove('sort-asc', 'sort-desc');
                });
                
                // Add appropriate sort class to clicked header
                header.classList.add(currentIsAscending ? 'sort-desc' : 'sort-asc');
                
                // Sort the table
                const rows = Array.from(table.querySelectorAll('tbody tr'));
                const sortedRows = rows.sort((a, b) => {
                    const aValue = a.children[index].textContent.trim();
                    const bValue = b.children[index].textContent.trim();
                    
                    // Check if values are numbers
                    const aNum = parseFloat(aValue);
                    const bNum = parseFloat(bValue);
                    
                    if (!isNaN(aNum) && !isNaN(bNum)) {
                        return currentIsAscending ? bNum - aNum : aNum - bNum;
                    }
                    
                    // Sort as strings
                    return currentIsAscending ? 
                        bValue.localeCompare(aValue) : 
                        aValue.localeCompare(bValue);
                });
                
                // Remove existing rows
                rows.forEach(row => row.remove());
                
                // Append sorted rows
                const tbody = table.querySelector('tbody');
                sortedRows.forEach(row => tbody.appendChild(row));
                
                // Apply zebra striping if needed
                if (table.classList.contains('table-striped')) {
                    sortedRows.forEach((row, index) => {
                        row.classList.remove('odd', 'even');
                        row.classList.add(index % 2 === 0 ? 'even' : 'odd');
                    });
                }
            });
        });
    });
}

/**
 * Initialize table filtering functionality
 */
function initializeTableFiltering() {
    const filterableTables = document.querySelectorAll('table.table-filterable');
    
    filterableTables.forEach(table => {
        // Create filter row if it doesn't exist
        let filterRow = table.querySelector('thead tr.filter-row');
        
        if (!filterRow) {
            const headerRow = table.querySelector('thead tr');
            if (!headerRow) return;
            
            filterRow = document.createElement('tr');
            filterRow.className = 'filter-row';
            
            // Create filter cells based on header cells
            Array.from(headerRow.children).forEach(headerCell => {
                const filterCell = document.createElement('th');
                
                if (!headerCell.classList.contains('no-filter')) {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'filter-input';
                    input.placeholder = 'Filter...';
                    filterCell.appendChild(input);
                }
                
                filterRow.appendChild(filterCell);
            });
            
            headerRow.parentNode.insertBefore(filterRow, headerRow.nextSibling);
        }
        
        // Add filter functionality
        const filterInputs = table.querySelectorAll('.filter-input');
        const rows = table.querySelectorAll('tbody tr');
        
        filterInputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                const filterValue = this.value.toLowerCase();
                
                rows.forEach(row => {
                    const cell = row.children[index];
                    if (!cell) return;
                    
                    const text = cell.textContent.toLowerCase();
                    row.style.display = text.includes(filterValue) ? '' : 'none';
                });
            });
        });
    });
}

/**
 * Initialize table pagination functionality
 */
function initializeTablePagination() {
    const paginatedTables = document.querySelectorAll('table.table-paginated');
    
    paginatedTables.forEach(table => {
        // Check if pagination container already exists
        let paginationContainer = table.nextElementSibling;
        if (paginationContainer && !paginationContainer.classList.contains('table-pagination')) {
            paginationContainer = null;
        }
        
        // Create pagination container if it doesn't exist
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'table-pagination';
            table.parentNode.insertBefore(paginationContainer, table.nextSibling);
        }
        
        // Clear existing pagination
        paginationContainer.innerHTML = '';
        
        // Create page size selector
        const pageSizeContainer = document.createElement('div');
        pageSizeContainer.className = 'page-size';
        
        const pageSizeLabel = document.createElement('label');
        pageSizeLabel.textContent = 'Rows per page: ';
        
        const pageSizeSelect = document.createElement('select');
        pageSizeSelect.className = 'form-select form-select-sm d-inline-block w-auto';
        
        [10, 25, 50, 100].forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            pageSizeSelect.appendChild(option);
        });
        
        pageSizeLabel.appendChild(pageSizeSelect);
        pageSizeContainer.appendChild(pageSizeLabel);
        
        // Create pagination controls
        const paginationControls = document.createElement('div');
        paginationControls.className = 'pagination-controls';
        
        const pagination = document.createElement('ul');
        pagination.className = 'pagination pagination-sm';
        
        paginationControls.appendChild(pagination);
        
        // Create page info
        const pageInfo = document.createElement('div');
        pageInfo.className = 'page-info';
        
        // Add all elements to pagination container
        paginationContainer.appendChild(pageSizeContainer);
        paginationContainer.appendChild(pageInfo);
        paginationContainer.appendChild(paginationControls);
        
        // Store all rows
        const allRows = Array.from(table.querySelectorAll('tbody tr'));
        let currentPage = 1;
        let pageSize = parseInt(pageSizeSelect.value);
        
        // Function to update pagination
        const updatePagination = () => {
            const totalRows = allRows.length;
            const totalPages = Math.ceil(totalRows / pageSize);
            
            // Update page info
            const startRow = (currentPage - 1) * pageSize + 1;
            const endRow = Math.min(startRow + pageSize - 1, totalRows);
            pageInfo.textContent = `Showing ${startRow} to ${endRow} of ${totalRows} entries`;
            
            // Update pagination controls
            pagination.innerHTML = '';
            
            // Previous button
            const prevItem = document.createElement('li');
            prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
            
            const prevLink = document.createElement('a');
            prevLink.className = 'page-link';
            prevLink.href = '#';
            prevLink.innerHTML = '&laquo;';
            prevLink.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentPage > 1) {
                    currentPage--;
                    updatePagination();
                }
            });
            
            prevItem.appendChild(prevLink);
            pagination.appendChild(prevItem);
            
            // Page numbers
            const maxVisiblePages = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                const pageItem = document.createElement('li');
                pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
                
                const pageLink = document.createElement('a');
                pageLink.className = 'page-link';
                pageLink.href = '#';
                pageLink.textContent = i;
                pageLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    currentPage = i;
                    updatePagination();
                });
                
                pageItem.appendChild(pageLink);
                pagination.appendChild(pageItem);
            }
            
            // Next button
            const nextItem = document.createElement('li');
            nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
            
            const nextLink = document.createElement('a');
            nextLink.className = 'page-link';
            nextLink.href = '#';
            nextLink.innerHTML = '&raquo;';
            nextLink.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentPage < totalPages) {
                    currentPage++;
                    updatePagination();
                }
            });
            
            nextItem.appendChild(nextLink);
            pagination.appendChild(nextItem);
            
            // Show/hide rows based on current page
            allRows.forEach((row, index) => {
                const rowPage = Math.floor(index / pageSize) + 1;
                row.style.display = rowPage === currentPage ? '' : 'none';
            });
        };
        
        // Listen for page size changes
        pageSizeSelect.addEventListener('change', function() {
            pageSize = parseInt(this.value);
            currentPage = 1;
            updatePagination();
        });
        
        // Initialize pagination
        updatePagination();
    });
}

/**
 * Initialize table row selection functionality
 */
function initializeTableSelection() {
    const selectableTables = document.querySelectorAll('table.table-selectable');
    
    selectableTables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            row.addEventListener('click', function(e) {
                // Don't select if clicking on a button, checkbox, or link
                if (e.target.tagName === 'BUTTON' || 
                    e.target.tagName === 'A' || 
                    e.target.tagName === 'INPUT' || 
                    e.target.closest('button') || 
                    e.target.closest('a') || 
                    e.target.closest('input')) {
                    return;
                }
                
                // Toggle selected class
                this.classList.toggle('selected');
                
                // If using checkboxes, update checkbox state
                const checkbox = this.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = this.classList.contains('selected');
                }
                
                // Dispatch custom event
                const event = new CustomEvent('rowselect', {
                    detail: {
                        row: this,
                        selected: this.classList.contains('selected')
                    }
                });
                table.dispatchEvent(event);
            });
        });
        
        // Handle header checkbox for select all functionality
        const headerCheckbox = table.querySelector('thead input[type="checkbox"]');
        if (headerCheckbox) {
            headerCheckbox.addEventListener('change', function() {
                const isChecked = this.checked;
                
                rows.forEach(row => {
                    const rowCheckbox = row.querySelector('input[type="checkbox"]');
                    if (rowCheckbox) {
                        rowCheckbox.checked = isChecked;
                    }
                    
                    if (isChecked) {
                        row.classList.add('selected');
                    } else {
                        row.classList.remove('selected');
                    }
                });
                
                // Dispatch custom event
                const event = new CustomEvent('selectall', {
                    detail: {
                        selected: isChecked
                    }
                });
                table.dispatchEvent(event);
            });
        }
    });
}

/**
 * Initialize expandable row functionality
 */
function initializeTableExpanding() {
    const expandableTables = document.querySelectorAll('table.table-expandable');
    
    expandableTables.forEach(table => {
        const expandButtons = table.querySelectorAll('.expand-button');
        
        expandButtons.forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const nextRow = row.nextElementSibling;
                
                if (nextRow && nextRow.classList.contains('expandable-row')) {
                    // Toggle visibility
                    nextRow.style.display = nextRow.style.display === 'none' ? 'table-row' : 'none';
                    
                    // Toggle button state
                    this.classList.toggle('expanded');
                    
                    // Update icon if present
                    const icon = this.querySelector('i');
                    if (icon) {
                        if (this.classList.contains('expanded')) {
                            icon.className = icon.className.replace('fa-chevron-down', 'fa-chevron-up');
                        } else {
                            icon.className = icon.className.replace('fa-chevron-up', 'fa-chevron-down');
                        }
                    }
                } else {
                    // Create expandable content row if it doesn't exist
                    const expandableRow = document.createElement('tr');
                    expandableRow.className = 'expandable-row';
                    
                    const expandableCell = document.createElement('td');
                    expandableCell.colSpan = row.children.length;
                    expandableCell.className = 'expandable-content';
                    
                    // Get content from data attribute or generate based on row data
                    const contentId = row.getAttribute('data-expand-content');
                    if (contentId) {
                        const contentTemplate = document.getElementById(contentId);
                        if (contentTemplate) {
                            expandableCell.innerHTML = contentTemplate.innerHTML;
                        }
                    } else {
                        // Generate default content
                        expandableCell.innerHTML = '<div class="p-3">Additional information for this row.</div>';
                    }
                    
                    expandableRow.appendChild(expandableCell);
                    row.parentNode.insertBefore(expandableRow, row.nextSibling);
                    
                    // Toggle button state
                    this.classList.add('expanded');
                    
                    // Update icon if present
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.className = icon.className.replace('fa-chevron-down', 'fa-chevron-up');
                    }
                }
            });
        });
    });
}

/**
 * Initialize responsive table functionality
 */
function initializeTableResponsive() {
    const responsiveStackTables = document.querySelectorAll('table.table-responsive-stack');
    
    responsiveStackTables.forEach(table => {
        // Add data-label attributes to cells based on header text
        const headers = table.querySelectorAll('thead th');
        const headerTexts = Array.from(headers).map(header => header.textContent.trim());
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (index < headerTexts.length) {
                    cell.setAttribute('data-label', headerTexts[index]);
                }
            });
        });
    });
}

/**
 * Initialize table row highlighting functionality
 */
function initializeTableHighlighting() {
    // Highlight rows based on URL hash
    if (window.location.hash) {
        const rowId = window.location.hash.substring(1);
        const row = document.getElementById(rowId);
        
        if (row && row.tagName === 'TR') {
            row.classList.add('highlight');
            
            // Scroll to the highlighted row
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Remove highlight after a few seconds
            setTimeout(() => {
                row.classList.remove('highlight');
            }, 5000);
        }
    }
    
    // Add highlight functionality to tables with data-highlight-param attribute
    const highlightTables = document.querySelectorAll('table[data-highlight-param]');
    
    highlightTables.forEach(table => {
        const param = table.getAttribute('data-highlight-param');
        const urlParams = new URLSearchParams(window.location.search);
        const highlightValue = urlParams.get(param);
        
        if (highlightValue) {
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const idCell = row.querySelector(`td[data-id]`);
                if (idCell && idCell.getAttribute('data-id') === highlightValue) {
                    row.classList.add('highlight');
                    
                    // Scroll to the highlighted row
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Remove highlight after a few seconds
                    setTimeout(() => {
                        row.classList.remove('highlight');
                    }, 5000);
                }
            });
        }
    });
}

/**
 * Initialize table export functionality
 */
function initializeTableExport() {
    const exportButtons = document.querySelectorAll('[data-table-export]');
    
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tableId = this.getAttribute('data-table-export');
            const format = this.getAttribute('data-export-format') || 'csv';
            const table = document.getElementById(tableId);
            
            if (!table) return;
            
            if (format === 'csv') {
                exportTableToCSV(table, tableId + '.csv');
            } else if (format === 'excel') {
                exportTableToExcel(table, tableId + '.xlsx');
            } else if (format === 'pdf') {
                exportTableToPDF(table, tableId + '.pdf');
            }
        });
    });
}

/**
 * Export table to CSV
 * @param {HTMLTableElement} table - The table to export
 * @param {string} filename - The filename for the exported file
 */
function exportTableToCSV(table, filename) {
    const rows = table.querySelectorAll('tr');
    let csv = [];
    
    for (let i = 0; i < rows.length; i++) {
        const row = [], cols = rows[i].querySelectorAll('td, th');
        
        for (let j = 0; j < cols.length; j++) {
            // Replace double quotes with two double quotes
            let data = cols[j].textContent.replace(/"/g, '""');
            // Add double quotes around the data
            row.push('"' + data + '"');
        }
        
        csv.push(row.join(','));
    }
    
    downloadCSV(csv.join('\n'), filename);
}

/**
 * Download CSV data as a file
 * @param {string} csv - The CSV data
 * @param {string} filename - The filename for the downloaded file
 */
function downloadCSV(csv, filename) {
    const csvFile = new Blob([csv], {type: 'text/csv'});
    const downloadLink = document.createElement('a');
    
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

/**
 * Export table to Excel (simplified version, requires third-party library for full functionality)
 * @param {HTMLTableElement} table - The table to export
 * @param {string} filename - The filename for the exported file
 */
function exportTableToExcel(table, filename) {
    // This is a simplified version, for full Excel export functionality,
    // you would need to include a library like SheetJS (xlsx)
    alert('Excel export requires the SheetJS library. Please include it in your project.');
}

/**
 * Export table to PDF (simplified version, requires third-party library for full functionality)
 * @param {HTMLTableElement} table - The table to export
 * @param {string} filename - The filename for the exported file
 */
function exportTableToPDF(table, filename) {
    // This is a simplified version, for full PDF export functionality,
    // you would need to include a library like jsPDF
    alert('PDF export requires the jsPDF library. Please include it in your project.');
}