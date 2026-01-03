// DOM Elements
const fileInput = document.getElementById('fileInput');
const uploadBox = document.getElementById('uploadBox');
const uploadSection = document.getElementById('uploadSection');
const analysisSection = document.getElementById('analysisSection');
const templatesSection = document.getElementById('templatesSection');
const finalAdSection = document.getElementById('finalAdSection');

// State
let uploadedImage = null;
let selectedTemplate = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    addSmoothScrolling();
});

// Event Listeners Setup
function setupEventListeners() {
    fileInput.addEventListener('change', handleFileSelect);
    uploadBox.addEventListener('click', () => fileInput.click());
    uploadBox.addEventListener('dragover', handleDragOver);
    uploadBox.addEventListener('dragleave', handleDragLeave);
    uploadBox.addEventListener('drop', handleDrop);
}

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadBox.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadBox.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    uploadBox.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

// File Selection Handler
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

// Process Uploaded File
function processFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please upload a valid image file (JPG, PNG, WebP)', 'error');
        return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        showNotification('File size must be less than 10MB', 'error');
        return;
    }

    uploadedImage = file;
    showLoadingState();
    
    // Simulate AI processing
    setTimeout(() => {
        showAnalysisSection();
    }, 2500);
}

// Show Loading State
function showLoadingState() {
    uploadBox.innerHTML = `
        <div class="loading-spinner"></div>
        <h3 class="loading-text">Processing Image...</h3>
        <p class="loading-subtext">AI is analyzing your product</p>
    `;
    uploadBox.style.border = 'none';
    uploadBox.style.cursor = 'default';
}

// Show Analysis Section
function showAnalysisSection() {
    uploadSection.classList.add('hidden');
    analysisSection.classList.remove('hidden');
    
    // Animate cards
    const cards = analysisSection.querySelectorAll('.insight-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        setTimeout(() => {
            card.classList.add('fade-in');
            card.style.opacity = '1';
        }, index * 150);
    });

    // Animate quality bar
    setTimeout(() => {
        const qualityFill = document.querySelector('.quality-fill');
        if (qualityFill) {
            qualityFill.style.width = '0%';
            setTimeout(() => {
                qualityFill.style.width = '92%';
            }, 100);
        }
    }, 600);

    // Show templates after delay
    setTimeout(() => {
        showTemplatesSection();
    }, 2000);

    // Smooth scroll
    setTimeout(() => {
        analysisSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// Show Templates Section
function showTemplatesSection() {
    templatesSection.classList.remove('hidden');
    
    const cards = templatesSection.querySelectorAll('.template-card-modern');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        setTimeout(() => {
            card.classList.add('scale-in');
            card.style.opacity = '1';
        }, index * 200);
    });

    setTimeout(() => {
        templatesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
}

// Select Template
function selectTemplate(templateId) {
    selectedTemplate = templateId;
    
    // Show loading notification
    showNotification('Generating your ad creative...', 'success');
    
    // Simulate generation delay
    setTimeout(() => {
        showFinalSection();
    }, 2000);
}

// Show Final Section
function showFinalSection() {
    finalAdSection.classList.remove('hidden');
    
    // Animate elements
    const elements = finalAdSection.querySelectorAll('.compliance-indicator, .final-preview, .format-showcase, .success-metrics');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        setTimeout(() => {
            element.classList.add('fade-in');
            element.style.opacity = '1';
        }, index * 200);
    });

    // Animate compliance score circle
    setTimeout(() => {
        animateComplianceScore();
    }, 500);

    setTimeout(() => {
        finalAdSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

    // Show success notification
    setTimeout(() => {
        showNotification('Your ad is ready for download! 🎉', 'success');
    }, 1000);
}

// Animate Compliance Score
function animateComplianceScore() {
    const circle = document.querySelector('.compliance-score circle:last-child');
    if (!circle) return;

    const score = 92;
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (score / 100) * circumference;
    
    circle.style.strokeDashoffset = circumference;
    
    setTimeout(() => {
        circle.style.transition = 'stroke-dashoffset 1.5s ease-out';
        circle.style.strokeDashoffset = offset;
    }, 100);
}

// Download Image
function downloadImage(imageUrl, filename) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification(`${filename} downloaded successfully! ✓`, 'success');
}

// Export All Formats
function exportAllFormats() {
    showNotification('Exporting all formats... This may take a moment', 'success');
    
    // Simulate export process
    const formats = [
        'Facebook_Feed_1200x1200.png',
        'Instagram_Story_1080x1920.png',
        'Display_Ad_728x90.png',
        'LinkedIn_Post_1200x627.png'
    ];

    formats.forEach((format, index) => {
        setTimeout(() => {
            downloadImage('assets/ad1.png', format);
        }, index * 800);
    });
}

// Reset Demo
function resetDemo() {
    // Reset state
    uploadedImage = null;
    selectedTemplate = null;
    fileInput.value = '';

    // Hide all sections except upload
    analysisSection.classList.add('hidden');
    templatesSection.classList.add('hidden');
    finalAdSection.classList.add('hidden');
    uploadSection.classList.remove('hidden');

    // Reset upload box
    uploadBox.innerHTML = `
        <div class="upload-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
        </div>
        <h3 class="upload-title">Drop your product image here</h3>
        <p class="upload-desc">or click to browse from your computer</p>
        <input type="file" id="fileInput" accept="image/*" hidden>
        <button class="btn-upload" onclick="document.getElementById('fileInput').click()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Choose File
        </button>
        <div class="upload-formats">
            <span>Supported: JPG, PNG, WebP (Max 10MB)</span>
        </div>
    `;
    uploadBox.style.border = '3px dashed rgba(102, 126, 234, 0.3)';
    uploadBox.style.cursor = 'pointer';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showNotification('Demo reset! Upload a new image to start', 'success');
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const iconSvg = type === 'success' 
        ? `<svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
               <polyline points="22 4 12 14.01 9 11.01"></polyline>
           </svg>`
        : `<svg class="notification-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <circle cx="12" cy="12" r="10"></circle>
               <line x1="12" y1="8" x2="12" y2="12"></line>
               <line x1="12" y1="16" x2="12.01" y2="16"></line>
           </svg>`;
    
    notification.innerHTML = `
        ${iconSvg}
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Smooth Scrolling for Navigation Links
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Add parallax effect to shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.1 + (index * 0.05);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });
});

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.glass-card, .template-card-modern');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});

// Performance optimization: Lazy load images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});
