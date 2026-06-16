// Client side script for Bootstrap Plus

document.addEventListener('DOMContentLoaded', () => {
    // Dynamically restructure code containers (move copy btn, remove header)
    document.querySelectorAll('.code-container').forEach(container => {
        const header = container.querySelector('.code-header');
        const copyBtn = container.querySelector('.copy-btn');
        if (header && copyBtn) {
            copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
            copyBtn.title = 'Copy to clipboard';
            container.prepend(copyBtn);
            header.remove();
        }
    });

    // -------------------------------------------------------------
    // 1. Theme Management (Light / Dark Mode)
    // -------------------------------------------------------------
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Set theme on load
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeUI(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeUI(newTheme);
    });

    function updateThemeUI(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'bi bi-sun-fill';
            themeToggle.classList.remove('btn-outline-dark');
            themeToggle.classList.add('btn-outline-warning');
        } else {
            themeIcon.className = 'bi bi-moon-stars-fill';
            themeToggle.classList.remove('btn-outline-warning');
            themeToggle.classList.add('btn-outline-dark');
        }
    }

    // -------------------------------------------------------------
    // 2. Responsive Sidebar Controls
    // -------------------------------------------------------------
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav-link');

    function toggleSidebar() {
        sidebar.classList.toggle('show');
        sidebarOverlay.classList.toggle('show');
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // Close sidebar on mobile when a link is clicked
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Highlight active link
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            if (window.innerWidth < 992) {
                toggleSidebar();
            }
        });
    });

    // ScrollSpy indicator (highlights sidebar menu depending on scroll position)
    const sections = document.querySelectorAll('.scroll-section');
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 120)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // -------------------------------------------------------------
    // 3. Search Engine (Headers indexing & dropdown results)
    // -------------------------------------------------------------
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    // Build index from headers inside scroll-sections
    const index = [];
    document.querySelectorAll('.scroll-section').forEach(section => {
        const h2 = section.querySelector('h2');
        if (h2) {
            index.push({
                id: section.id,
                title: h2.textContent.trim(),
                category: 'Main Section',
                element: section
            });
        }
        
        // Sub-headers
        section.querySelectorAll('h3').forEach(h3 => {
            index.push({
                id: section.id, // scrolls to main section containing this sub-component
                subId: h3.id || h3.textContent.trim().toLowerCase().replace(/\s+/g, '-'),
                title: h3.textContent.trim(),
                category: h2 ? h2.textContent.trim() : 'Component',
                element: h3
            });
            // Ensure the h3 has an id for anchor links
            if (!h3.id) {
                h3.id = h3.textContent.trim().toLowerCase().replace(/\s+/g, '-');
            }
        });
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            return;
        }

        // Fuzzy/substring search
        const matches = index.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.category.toLowerCase().includes(query)
        );

        renderSearchResults(matches);
    });

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });

    // Open search dropdown on focus if input not empty
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            searchResults.classList.add('active');
        }
    });

    function renderSearchResults(results) {
        searchResults.innerHTML = '';
        if (results.length === 0) {
            const noResult = document.createElement('div');
            noResult.className = 'p-3 text-muted text-center small';
            noResult.innerHTML = '<i class="bi bi-exclamation-circle me-1"></i> No matching components found';
            searchResults.appendChild(noResult);
            searchResults.classList.add('active');
            return;
        }

        results.slice(0, 8).forEach((item, index) => {
            const link = document.createElement('a');
            link.href = `#${item.subId || item.id}`;
            link.className = 'search-result-item';
            
            link.innerHTML = `
                <div class="search-result-category">${item.category}</div>
                <div class="search-result-title">${item.title}</div>
            `;
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                searchResults.classList.remove('active');
                searchInput.value = '';
                
                const targetEl = document.getElementById(item.subId || item.id);
                if (targetEl) {
                    // Smooth scroll to target
                    const offset = 90;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = targetEl.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Highlight card momentarily
                    const card = targetEl.closest('.component-card') || targetEl;
                    card.classList.add('component-highlight');
                    setTimeout(() => {
                        card.classList.remove('component-highlight');
                    }, 2000);
                }
            });

            searchResults.appendChild(link);
        });

        searchResults.classList.add('active');
    }

    // Handle enter key on search input to click first match
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const firstLink = searchResults.querySelector('.search-result-item');
            if (firstLink) {
                firstLink.click();
                searchInput.blur();
            }
        }
    });

    // -------------------------------------------------------------
    // 4. Code Copy to Clipboard
    // -------------------------------------------------------------
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pre = btn.closest('.code-container').querySelector('pre');
            if (pre) {
                // Get pre content and clean it up (unescape basic HTML codes if any)
                const codeText = pre.innerText;
                navigator.clipboard.writeText(codeText).then(() => {
                    btn.innerHTML = '<i class="bi bi-check2 text-success"></i>';
                    btn.classList.add('copied');
                    
                    setTimeout(() => {
                        btn.innerHTML = '<i class="bi bi-clipboard"></i>';
                        btn.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        });
    });

    // -------------------------------------------------------------
    // 5. Custom Slider Simulation (Owl Carousel simulation)
    // -------------------------------------------------------------
    const track = document.querySelector('.owl-sim-track');
    if (track) {
        const prevBtn = document.querySelector('.owl-nav-prev');
        const nextBtn = document.querySelector('.owl-nav-next');
        const dotsContainer = document.querySelector('.owl-sim-dots');
        const items = document.querySelectorAll('.owl-sim-item');
        
        let currentIndex = 0;
        let itemsPerView = getItemsPerView();
        let maxIndex = Math.max(0, items.length - itemsPerView);

        // Responsive columns check
        function getItemsPerView() {
            if (window.innerWidth < 768) return 1;
            return 3;
        }

        // Render dots
        function renderDots() {
            dotsContainer.innerHTML = '';
            const totalDots = Math.ceil(items.length / itemsPerView);
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.className = `owl-sim-dot ${i === Math.floor(currentIndex / itemsPerView) ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    currentIndex = i * itemsPerView;
                    if (currentIndex > maxIndex) currentIndex = maxIndex;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateSlider() {
            const itemWidth = items[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            
            // Update dots
            const dots = dotsContainer.querySelectorAll('.owl-sim-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === Math.floor(currentIndex / itemsPerView));
            });
        }

        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // wrap around
            }
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = maxIndex; // wrap to end
            }
            updateSlider();
        });

        // Resize updates
        window.addEventListener('resize', () => {
            const oldItemsPerView = itemsPerView;
            itemsPerView = getItemsPerView();
            maxIndex = Math.max(0, items.length - itemsPerView);
            if (itemsPerView !== oldItemsPerView) {
                currentIndex = Math.min(currentIndex, maxIndex);
                renderDots();
                updateSlider();
            } else {
                updateSlider();
            }
        });

        renderDots();
        updateSlider();
    }

    // -------------------------------------------------------------
    // 6. Rating Interaction
    // -------------------------------------------------------------
    const stars = document.querySelectorAll('.rating-stars i');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            stars.forEach((s, idx) => {
                if (idx <= index) {
                    s.classList.remove('bi-star');
                    s.classList.add('bi-star-fill');
                } else {
                    s.classList.remove('bi-star-fill');
                    s.classList.add('bi-star');
                }
            });
        });
    });

    // -------------------------------------------------------------
    // 7. Initialize Real-Time clock widget in extra section
    // -------------------------------------------------------------
    if (document.getElementById('realtime-widget-container')) {
        initRealTimeBootstrap('realtime-widget-container');
    }

    // -------------------------------------------------------------
    // 9. Run HTML Syntax Highlighting dynamically
    // -------------------------------------------------------------
    document.querySelectorAll('.code-pre code').forEach(codeBlock => {
        highlightHTML(codeBlock);
    });
});

// -------------------------------------------------------------
// 8. Reusable Real-Time function (accessible globally via id binding)
// -------------------------------------------------------------
/**
 * Binds a real-time updating digital clock widget with interactive features into any specified container ID.
 * @param {string} targetId - The ID of the container element.
 */
function initRealTimeBootstrap(targetId) {
    const container = document.getElementById(targetId);
    if (!container) {
        console.error(`Realtime widget target element #${targetId} not found.`);
        return;
    }

    // Set structure
    container.innerHTML = `
        <div class="card border-0 shadow-sm overflow-hidden">
            <div class="card-body bg-light-subtle text-center p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-2">
                        <span class="realtime-pulse"></span> Live Sync Active
                    </span>
                    <small class="text-muted" id="realtime-timezone">Local Time</small>
                </div>
                <div class="realtime-clock mb-2" id="realtime-time-display">00:00:00</div>
                <div class="h6 text-secondary mb-3" id="realtime-date-display">Loading date...</div>
                
                <div class="row g-2 mt-2 pt-3 border-top border-secondary-subtle">
                    <div class="col-6">
                        <div class="p-2 border border-secondary-subtle rounded text-start bg-body-tertiary">
                            <small class="text-muted d-block">System Uptime</small>
                            <span class="fw-bold text-primary" id="realtime-uptime">0m 0s</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="p-2 border border-secondary-subtle rounded text-start bg-body-tertiary">
                            <small class="text-muted d-block">Character Count (Live)</small>
                            <input type="text" id="realtime-text-counter" class="form-control form-control-sm border-0 bg-transparent p-0 fw-bold" placeholder="Type here..." style="font-size: 0.9rem; box-shadow: none;">
                            <small class="text-primary d-none fw-bold" id="realtime-char-count">0 chars</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const clockDisplay = container.querySelector('#realtime-time-display');
    const dateDisplay = container.querySelector('#realtime-date-display');
    const timezoneDisplay = container.querySelector('#realtime-timezone');
    const uptimeDisplay = container.querySelector('#realtime-uptime');
    const inputCounter = container.querySelector('#realtime-text-counter');
    const countDisplay = container.querySelector('#realtime-char-count');

    // Uptime ticker
    let secondsUptime = 0;
    setInterval(() => {
        secondsUptime++;
        const minutes = Math.floor(secondsUptime / 60);
        const secs = secondsUptime % 60;
        uptimeDisplay.textContent = `${minutes}m ${secs}s`;
    }, 1000);

    // Live clock ticker
    function tick() {
        const now = new Date();
        
        // Time format
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;

        // Date format
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = now.toLocaleDateString(undefined, options);

        // Timezone details
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        timezoneDisplay.textContent = tz;
    }

    tick();
    setInterval(tick, 1000);

    // Live input characters count
    inputCounter.addEventListener('input', () => {
        const len = inputCounter.value.length;
        if (len > 0) {
            countDisplay.classList.remove('d-none');
            countDisplay.textContent = `${len} characters`;
        } else {
            countDisplay.classList.add('d-none');
        }
    });
}

// Expose globally
window.initRealTimeBootstrap = initRealTimeBootstrap;

/**
 * Client-side HTML syntax highlighter for preview code cards.
 * @param {HTMLElement} codeElement - The <code> DOM element.
 */
function highlightHTML(codeElement) {
    let html = codeElement.innerHTML;
    
    // Escape check / clean comments first
    html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="code-comment">$1</span>');
    
    // Match doctype
    html = html.replace(/(&lt;!doctype html&gt;)/gi, '<span class="code-doctype">$1</span>');
    
    // Match tag elements & tags hierarchy
    html = html.replace(/&lt;(\/?[a-zA-Z0-9\-]+)([\s\S]*?)&gt;/g, (match, tagName, attrs) => {
        let tagSpan = `&lt;<span class="code-tag">${tagName}</span>`;
        
        // Match tag attributes inside tag brackets
        let highlightedAttrs = attrs.replace(/([a-zA-Z0-9\-]+)\s*=\s*(['"])([\s\S]*?)\2/g, (m, attrName, quote, attrValue) => {
            return `<span class="code-attr">${attrName}</span>=<span class="code-string">${quote}${attrValue}${quote}</span>`;
        });
        
        return tagSpan + highlightedAttrs + '&gt;';
    });
    
    codeElement.innerHTML = html;
}
