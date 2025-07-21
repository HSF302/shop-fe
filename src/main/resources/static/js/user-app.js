/**
 * User Interface JavaScript
 * Office Dress Shop - Customer Experience Enhancement
 */

class UserApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollToTop();
        this.setupImageLazyLoading();
        this.setupToastNotifications();
        this.setupSearchEnhancements();
        this.setupProductCardAnimations();
        this.setupResponsiveNavigation();
        this.setupLoadingStates();
        this.setupSkeletonLoading();
        this.setupPageTransitions();
    }

    // Scroll to Top Button
    setupScrollToTop() {
        // Create scroll to top button
        const scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-top';
        scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollBtn);

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Enhanced Image Loading with Loading States
    setupImageLazyLoading() {
        const images = document.querySelectorAll('.product-image img, .product-main-image');

        images.forEach(img => {
            this.setupImageLoading(img);
        });

        // Setup lazy loading for images with data-src
        const lazyImages = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img, img.dataset.src);
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                this.loadImage(img, img.dataset.src);
            });
        }
    }

    setupImageLoading(img) {
        const container = img.parentElement;

        // Create loading placeholder
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'image-loading';
        loadingDiv.innerHTML = `
            <i class="fas fa-image"></i>
            <span>Đang tải...</span>
        `;

        // Create error placeholder
        const errorDiv = document.createElement('div');
        errorDiv.className = 'image-error';
        errorDiv.style.display = 'none';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>Không thể tải ảnh</span>
        `;

        container.appendChild(loadingDiv);
        container.appendChild(errorDiv);

        // Handle image load
        img.addEventListener('load', () => {
            img.classList.add('loaded');
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'none';
        });

        // Handle image error
        img.addEventListener('error', () => {
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'flex';

            // Try to load placeholder image
            setTimeout(() => {
                img.src = '/images/placeholder.svg';
            }, 1000);
        });

        // If image already has src, trigger loading
        if (img.src && img.src !== window.location.href) {
            // Image already has source, check if it's loaded
            if (img.complete && img.naturalHeight !== 0) {
                img.classList.add('loaded');
                loadingDiv.style.display = 'none';
            }
        }
    }

    loadImage(img, src) {
        const container = img.parentElement;

        // Show loading state
        let loadingDiv = container.querySelector('.image-loading');
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.className = 'image-loading';
            loadingDiv.innerHTML = `
                <i class="fas fa-image"></i>
                <span>Đang tải...</span>
            `;
            container.appendChild(loadingDiv);
        }

        // Create new image to preload
        const newImg = new Image();

        newImg.onload = () => {
            img.src = src;
            img.classList.add('loaded', 'fade-in');
            if (loadingDiv) loadingDiv.style.display = 'none';
        };

        newImg.onerror = () => {
            // Show error state
            let errorDiv = container.querySelector('.image-error');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'image-error';
                errorDiv.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Không thể tải ảnh</span>
                `;
                container.appendChild(errorDiv);
            }

            if (loadingDiv) loadingDiv.style.display = 'none';
            errorDiv.style.display = 'flex';

            // Fallback to placeholder
            setTimeout(() => {
                img.src = '/images/placeholder.svg';
                img.classList.add('loaded');
                errorDiv.style.display = 'none';
            }, 2000);
        };

        // Start loading
        newImg.src = src;
    }

    // Toast Notifications
    setupToastNotifications() {
        // Create toast container
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }

    showToast(message, type = 'success', duration = 3000) {
        const container = document.querySelector('.toast-container');
        const toast = document.createElement('div');
        toast.className = `toast-custom ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    'info-circle';
        
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${icon} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
            </div>
        `;

        container.appendChild(toast);

        // Close button functionality
        toast.querySelector('.btn-close').addEventListener('click', () => {
            this.removeToast(toast);
        });

        // Auto remove after duration
        setTimeout(() => {
            this.removeToast(toast);
        }, duration);
    }

    removeToast(toast) {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // Search Enhancements
    setupSearchEnhancements() {
        const searchInput = document.querySelector('.search-input');
        const searchForm = document.querySelector('.search-form');
        
        if (searchInput && searchForm) {
            // Search suggestions (if needed in future)
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                if (query.length > 2) {
                    searchTimeout = setTimeout(() => {
                        // Future: Implement search suggestions
                        console.log('Search suggestions for:', query);
                    }, 300);
                }
            });

            // Form submission with loading state
            searchForm.addEventListener('submit', (e) => {
                const submitBtn = searchForm.querySelector('.search-btn');
                if (submitBtn) {
                    submitBtn.innerHTML = '<span class="loading"></span> Đang tìm...';
                    submitBtn.disabled = true;
                }
            });

            // Clear search functionality
            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.className = 'btn btn-outline-secondary';
            clearBtn.innerHTML = '<i class="fas fa-times"></i>';
            clearBtn.style.display = 'none';
            
            searchInput.parentNode.appendChild(clearBtn);
            
            searchInput.addEventListener('input', () => {
                clearBtn.style.display = searchInput.value ? 'block' : 'none';
            });
            
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                clearBtn.style.display = 'none';
                searchInput.focus();
            });
        }
    }

    // Product Card Animations
    setupProductCardAnimations() {
        const cards = document.querySelectorAll('.product-card');
        
        // Stagger animation for cards
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });

        // Hover effects
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    // Responsive Navigation
    setupResponsiveNavigation() {
        const navLinks = document.querySelector('.nav-links');
        
        if (navLinks && window.innerWidth <= 768) {
            // Create mobile menu toggle
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'btn btn-outline-light d-md-none';
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            
            const header = document.querySelector('.user-header .container .row .col-md-6:first-child');
            if (header) {
                header.appendChild(toggleBtn);
            }
            
            toggleBtn.addEventListener('click', () => {
                navLinks.classList.toggle('show');
                const icon = toggleBtn.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }
    }

    // Loading States
    setupLoadingStates() {
        // Add loading state to all buttons with data-loading attribute
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-loading]');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span class="loading"></span> Đang xử lý...';
                btn.disabled = true;

                // Restore button after 3 seconds (fallback)
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 3000);
            }
        });
    }

    // Skeleton Loading
    setupSkeletonLoading() {
        // Show skeleton while page is loading
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid && productsGrid.children.length === 0) {
            this.showSkeletonCards(productsGrid);
        }
    }

    showSkeletonCards(container, count = 8) {
        container.innerHTML = '';
        container.className = 'loading-grid';

        for (let i = 0; i < count; i++) {
            const skeletonCard = document.createElement('div');
            skeletonCard.className = 'skeleton-card';
            skeletonCard.innerHTML = `
                <div class="skeleton-image"></div>
                <div class="skeleton-content">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text medium"></div>
                    <div class="skeleton-text short"></div>
                    <div class="skeleton-button"></div>
                </div>
            `;
            container.appendChild(skeletonCard);
        }

        // Remove skeletons after 3 seconds (fallback)
        setTimeout(() => {
            this.hideSkeletonCards(container);
        }, 3000);
    }

    hideSkeletonCards(container) {
        const skeletons = container.querySelectorAll('.skeleton-card');
        skeletons.forEach((skeleton, index) => {
            setTimeout(() => {
                skeleton.style.opacity = '0';
                skeleton.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    if (skeleton.parentNode) {
                        skeleton.parentNode.removeChild(skeleton);
                    }
                }, 300);
            }, index * 100);
        });

        setTimeout(() => {
            container.className = 'products-grid fade-in';
        }, skeletons.length * 100 + 300);
    }

    // Page Transitions
    setupPageTransitions() {
        // Show loading overlay for navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && !link.hasAttribute('target') &&
                !link.href.includes('#') &&
                !link.href.includes('javascript:') &&
                link.href.startsWith(window.location.origin)) {

                this.showPageLoading();
            }
        });

        // Hide loading on page load
        window.addEventListener('load', () => {
            this.hidePageLoading();
        });

        // Hide loading on back/forward navigation
        window.addEventListener('pageshow', () => {
            this.hidePageLoading();
        });
    }

    showPageLoading() {
        let overlay = document.querySelector('.page-loading');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'page-loading';
            overlay.innerHTML = `
                <div class="text-center">
                    <div class="spinner"></div>
                    <div class="loading-text">Đang tải...</div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';
    }

    hidePageLoading() {
        const overlay = document.querySelector('.page-loading');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }

    // Utility Methods
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }

    debounce(func, wait) {
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

    // Local Storage Helpers
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save to localStorage:', e);
        }
    }

    getFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('Could not read from localStorage:', e);
            return null;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.userApp = new UserApp();
});

// Global utility functions
window.showToast = (message, type, duration) => {
    if (window.userApp) {
        window.userApp.showToast(message, type, duration);
    }
};

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden
        console.log('Page hidden');
    } else {
        // Page is visible
        console.log('Page visible');
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    window.showToast('Kết nối internet đã được khôi phục', 'success');
});

window.addEventListener('offline', () => {
    window.showToast('Mất kết nối internet', 'error');
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserApp;
}
