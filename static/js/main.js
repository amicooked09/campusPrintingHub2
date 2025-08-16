// Campus Print JavaScript

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize form validation
    initializeFormValidation();
    
    // Initialize file upload if on upload page
    if (document.getElementById('uploadArea')) {
        initializeFileUpload();
    }
    
    // Auto-dismiss alerts after 5 seconds
    setTimeout(function() {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }, 5000);
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

// File upload enhancement
function initializeFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (!uploadArea || !fileInput) return;
    
    // Enhanced drag and drop
    uploadArea.addEventListener('dragenter', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('border-2');
    });
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!uploadArea.contains(e.relatedTarget)) {
            uploadArea.classList.remove('border-2');
        }
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('border-2');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    });
    
    // File input change handler
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });
}

// Handle file selection
function handleFileSelection(file) {
    const allowedTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 16 * 1024 * 1024; // 16MB
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
        showAlert('Invalid file type. Please select PDF, DOC, or DOCX files only.', 'danger');
        return;
    }
    
    // Validate file size
    if (file.size > maxSize) {
        showAlert('File size too large. Maximum size is 16MB.', 'danger');
        return;
    }
    
    // Show file info
    const fileName = document.getElementById('fileName');
    const fileInfo = document.getElementById('fileInfo');
    const uploadArea = document.getElementById('uploadArea');
    
    if (fileName && fileInfo && uploadArea) {
        fileName.textContent = file.name;
        uploadArea.classList.add('d-none');
        fileInfo.classList.remove('d-none');
        
        // Estimate pages (rough calculation)
        estimatePages(file);
    }
}

// Estimate pages from file size (rough approximation)
function estimatePages(file) {
    const pagesInput = document.getElementById('pages');
    if (!pagesInput) return;
    
    // Rough estimation: 1 page ≈ 50KB for text documents
    const estimatedPages = Math.max(1, Math.ceil(file.size / (50 * 1024)));
    pagesInput.value = Math.min(estimatedPages, 100); // Cap at 100 pages
    
    // Trigger price update if function exists
    if (typeof updatePrice === 'function') {
        updatePrice();
    }
}

// Clear file selection
function clearFile() {
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const uploadArea = document.getElementById('uploadArea');
    
    if (fileInput) fileInput.value = '';
    if (fileInfo) fileInfo.classList.add('d-none');
    if (uploadArea) uploadArea.classList.remove('d-none');
}

// Price calculation utility
function calculatePrintCost(printType, pages, copies, doubleSided) {
    const pageRate = printType === 'bw' ? 5 : 20;
    let totalPages = pages * copies;
    
    if (doubleSided) {
        totalPages = Math.ceil(totalPages / 2);
    }
    
    return {
        totalPages,
        pageRate,
        totalCost: totalPages * pageRate
    };
}

// Show alert messages
function showAlert(message, type = 'info') {
    const alertContainer = document.querySelector('.container');
    if (!alertContainer) return;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert after navbar
    const navbar = document.querySelector('.navbar');
    if (navbar && navbar.nextSibling) {
        navbar.parentNode.insertBefore(alertDiv, navbar.nextSibling);
    } else {
        alertContainer.insertBefore(alertDiv, alertContainer.firstChild);
    }
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = new bootstrap.Alert(alertDiv);
        alert.close();
    }, 5000);
}

// Utility function to format currency
function formatCurrency(amount) {
    return `₹${amount.toFixed(2)}`;
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Loading state management
function setLoadingState(element, loading = true) {
    if (loading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

// Form submission with loading state
function submitFormWithLoading(formId, submitBtnId) {
    const form = document.getElementById(formId);
    const submitBtn = document.getElementById(submitBtnId);
    
    if (!form || !submitBtn) return;
    
    form.addEventListener('submit', function(e) {
        setLoadingState(submitBtn, true);
        
        // Reset loading state after 3 seconds (fallback)
        setTimeout(() => {
            setLoadingState(submitBtn, false);
        }, 3000);
    });
}

// Print request status colors
const statusColors = {
    pending: 'warning',
    printing: 'info',
    completed: 'success',
    cancelled: 'danger'
};

// Get status badge HTML
function getStatusBadge(status) {
    const color = statusColors[status] || 'secondary';
    return `<span class="badge bg-${color}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
}

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Check if user is on mobile device
function isMobile() {
    return window.innerWidth <= 768;
}

// Debounce function for search/filter inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local storage utilities
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('Local storage not available');
        }
    },
    
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Local storage not available');
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Local storage not available');
        }
    }
};

// Export functions for use in other scripts
window.CampusPrint = {
    showAlert,
    calculatePrintCost,
    formatCurrency,
    formatDate,
    setLoadingState,
    getStatusBadge,
    scrollToElement,
    isMobile,
    debounce,
    storage
};
