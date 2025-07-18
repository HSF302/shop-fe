// ===== AUTHENTICATION JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication features
    initFormValidation();
    initPasswordToggle();
    initFormAnimations();
    initLoadingStates();
});

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('.form-control');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // Form submission validation
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                return false;
            }
            
            showLoadingState(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Clear previous validation
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Password validation
    if (fieldType === 'password' && value) {
        if (value.length < 6) {
            showFieldError(field, 'Password must be at least 6 characters long');
            return false;
        }
    }
    
    // Confirm password validation
    if (fieldName === 'confirmPassword' && value) {
        const passwordField = document.querySelector('input[name="password"]');
        if (passwordField && value !== passwordField.value) {
            showFieldError(field, 'Passwords do not match');
            return false;
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    showFieldSuccess(field);
    return true;
}

// Validate entire form
function validateForm(form) {
    const inputs = form.querySelectorAll('.form-control[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Show field success
function showFieldSuccess(field) {
    field.classList.add('is-valid');
    field.classList.remove('is-invalid');
    
    // Remove error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('is-invalid', 'is-valid');
    
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

// Password Toggle Functionality
function initPasswordToggle() {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    
    passwordFields.forEach(field => {
        const wrapper = field.parentNode;
        
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        toggleBtn.style.cssText = `
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #6c757d;
            cursor: pointer;
            z-index: 3;
        `;
        
        wrapper.style.position = 'relative';
        wrapper.appendChild(toggleBtn);
        
        // Toggle functionality
        toggleBtn.addEventListener('click', function() {
            const type = field.getAttribute('type') === 'password' ? 'text' : 'password';
            field.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    });
}

// Form Animations
function initFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Loading States
function initLoadingStates() {
    const submitButtons = document.querySelectorAll('.auth-btn');
    
    submitButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.type === 'submit') {
                setTimeout(() => {
                    showLoadingState(this.closest('form'));
                }, 100);
            }
        });
    });
}

// Show loading state
function showLoadingState(form) {
    const submitBtn = form.querySelector('.auth-btn[type="submit"]');
    if (submitBtn) {
        submitBtn.classList.add('auth-loading');
        submitBtn.disabled = true;
        
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        
        // Reset after 5 seconds (in case of no response)
        setTimeout(() => {
            hideLoadingState(form, originalText);
        }, 5000);
    }
}

// Hide loading state
function hideLoadingState(form, originalText) {
    const submitBtn = form.querySelector('.auth-btn[type="submit"]');
    if (submitBtn) {
        submitBtn.classList.remove('auth-loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText || 'Submit';
    }
}

// Auto-hide alerts
function initAutoHideAlerts() {
    const alerts = document.querySelectorAll('.auth-error, .auth-success');
    
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 5000);
    });
}

// Initialize auto-hide alerts
document.addEventListener('DOMContentLoaded', initAutoHideAlerts);

// Smooth scroll to error
function scrollToError() {
    const firstError = document.querySelector('.is-invalid');
    if (firstError) {
        firstError.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        firstError.focus();
    }
}

// Format phone number input
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 10) {
        value = value.substring(0, 11);
        if (value.length === 10) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        } else {
            value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
        }
    }
    
    input.value = value;
}

// Add phone formatting to phone inputs
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[name="phone"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
});

// Prevent form resubmission
window.addEventListener('beforeunload', function() {
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        hideLoadingState(form);
    });
});

// Enhanced form security
function initFormSecurity() {
    // Disable autocomplete on sensitive fields
    const sensitiveFields = document.querySelectorAll('input[type="password"]');
    sensitiveFields.forEach(field => {
        field.setAttribute('autocomplete', 'new-password');
    });
    
    // Add CSRF protection if available
    const csrfToken = document.querySelector('meta[name="_csrf"]');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]');
    
    if (csrfToken && csrfHeader) {
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(form => {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = csrfHeader.getAttribute('content');
            hiddenInput.value = csrfToken.getAttribute('content');
            form.appendChild(hiddenInput);
        });
    }
}

// Initialize form security
document.addEventListener('DOMContentLoaded', initFormSecurity);
