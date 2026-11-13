/**
 * Divan Raj Website Header Parallax Slider Engine
 * Recreates the Dribbble parallel card sliding & inner image parallax animation.
 */

class DivanParallaxSlider {
  constructor(options) {
    this.wrapper = typeof options.wrapper === 'string' ? document.querySelector(options.wrapper) : options.wrapper;
    if (!this.wrapper) return;

    this.track = typeof options.track === 'string' ? this.wrapper.querySelector(options.track) : options.track;
    if (!this.track) return;

    this.prevBtn = this.wrapper.querySelector(options.prevBtn || '.prev');
    this.nextBtn = this.wrapper.querySelector(options.nextBtn || '.next');
    this.activeNumEl = this.wrapper.querySelector(options.activeNum || '.active-num');
    this.totalNumEl = this.wrapper.querySelector(options.totalNum || '.total-num');
    this.progressFillEl = this.wrapper.querySelector(options.progressFill || '.divan-progress-fill');
    this.viewport = this.wrapper.querySelector('.divan-slider-viewport') || this.wrapper;

    this.duration = options.duration || 3200; // ms holding per card
    this.slideDuration = options.slideDuration || 1150; // ms glide transition
    this.currentIndex = 0;
    this.isHovered = false;
    this.isDragging = false;
    this.isAnimating = false;
    this.startX = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.progress = 0;
    this.lastTime = null;
    this.animFrameId = null;

    this.init();
  }

  init() {
    this.cards = Array.from(this.track.children);
    this.originalCount = this.cards.length;
    if (this.originalCount === 0) return;

    // Set total count formatted as 2 digits (e.g., 05, 12)
    if (this.totalNumEl) {
      this.totalNumEl.textContent = String(this.originalCount).padStart(2, '0');
    }

    // Clone the first set of cards to enable infinite seamless looping
    // We clone up to 5 cards or all cards (whichever is smaller)
    const cloneCount = Math.min(this.originalCount, 6);
    this.clones = [];
    for (let i = 0; i < cloneCount; i++) {
      const clone = this.cards[i].cloneNode(true);
      clone.classList.add('divan-clone');
      clone.setAttribute('data-clone-idx', i);
      this.track.appendChild(clone);
      this.clones.push(clone);
    }

    this.allCards = Array.from(this.track.children);

    this.measure();
    this.updateParallax(0);
    this.updateCounter(0);

    // Event listeners
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.prev();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.next();
      });
    }

    // Hover pause
    this.wrapper.addEventListener('mouseenter', () => {
      this.isHovered = true;
    });

    this.wrapper.addEventListener('mouseleave', () => {
      this.isHovered = false;
    });

    // Touch & Mouse Dragging
    this.setupDragEvents();

    // Window resize
    window.addEventListener('resize', () => {
      this.measure();
      this.goTo(this.currentIndex, false);
    });

    // Start auto progress loop
    this.lastTime = performance.now();
    this.startLoop();
  }

  measure() {
    if (!this.cards || this.cards.length === 0) return;

    const isMobile = window.innerWidth <= 768;

    // Mobile single-card width calculation: guarantee 1 card alone fills 100% of the viewport width
    if (isMobile && this.viewport) {
      const vWidth = Math.round(this.viewport.getBoundingClientRect().width || this.viewport.clientWidth);
      if (vWidth > 0) {
        this.track.style.setProperty('--divan-card-w', `${vWidth}px`);
        this.wrapper.style.setProperty('--divan-card-w', `${vWidth}px`);
        if (this.allCards) {
          for (let i = 0; i < this.allCards.length; i++) {
            this.allCards[i].style.width = `${vWidth}px`;
            this.allCards[i].style.minWidth = `${vWidth}px`;
            this.allCards[i].style.maxWidth = `${vWidth}px`;
            this.allCards[i].style.flex = `0 0 ${vWidth}px`;
          }
        }
      }
    } else if (this.allCards) {
      for (let i = 0; i < this.allCards.length; i++) {
        this.allCards[i].style.width = '';
        this.allCards[i].style.minWidth = '';
        this.allCards[i].style.maxWidth = '';
        this.allCards[i].style.flex = '';
      }
    }

    const firstCard = this.cards[0];
    const rect = firstCard.getBoundingClientRect();
    this.cardWidth = Math.round(rect.width) || 300;

    // Calculate gap from margin/flex gap
    const style = window.getComputedStyle(this.track);
    const gapVal = parseFloat(style.gap) || 0;
    this.cardStep = this.cardWidth + (isMobile ? 0 : gapVal);
  }

  goTo(index, animate = true) {
    this.currentIndex = index;
    const targetX = -index * this.cardStep;
    this.currentTranslate = targetX;
    this.prevTranslate = targetX;

    if (animate) {
      this.track.style.transition = `transform ${this.slideDuration}ms cubic-bezier(0.25, 1, 0.35, 1)`;
      this.isAnimating = true;
    } else {
      this.track.style.transition = 'none';
      this.isAnimating = false;
    }

    this.track.style.transform = `translateX(${targetX}px)`;
    this.updateParallax(index);
    this.updateCounter(index % this.originalCount);

    if (animate) {
      clearTimeout(this.animTimeout);
      this.animTimeout = setTimeout(() => {
        this.isAnimating = false;
        // Check if we reached the clone threshold
        if (this.currentIndex >= this.originalCount) {
          // Seamless snap back to 0 without animation
          this.track.style.transition = 'none';
          this.currentIndex = 0;
          const snapX = 0;
          this.currentTranslate = snapX;
          this.prevTranslate = snapX;
          this.track.style.transform = `translateX(${snapX}px)`;
          this.updateParallax(0);
          this.updateCounter(0);
          void this.track.offsetHeight; // force reflow
        }
      }, this.slideDuration);
    }
  }

  updateParallax(activeIndex) {
    if (!this.allCards) return;
    this.allCards.forEach((card, idx) => {
      const dist = idx - activeIndex;
      // Cards further away shift their inner image horizontally
      const maxOffset = 28;
      const offset = Math.max(-maxOffset, Math.min(maxOffset, dist * -14));
      card.style.setProperty('--divan-img-parallax', `${offset}px`);
    });
  }

  updateCounter(normalizedIdx) {
    if (this.activeNumEl) {
      this.activeNumEl.textContent = String(normalizedIdx + 1).padStart(2, '0');
    }
  }

  next() {
    // If rapid-clicking when at or past the clone threshold, immediately snap to 0 first
    if (this.currentIndex >= this.originalCount) {
      this.track.style.transition = 'none';
      this.currentIndex = 0;
      this.currentTranslate = 0;
      this.prevTranslate = 0;
      this.track.style.transform = 'translateX(0px)';
      void this.track.offsetHeight;
    }
    this.progress = 0;
    if (this.progressFillEl) this.progressFillEl.style.width = '0%';
    this.measure();
    this.goTo(this.currentIndex + 1, true);
  }

  prev() {
    this.progress = 0;
    if (this.progressFillEl) this.progressFillEl.style.width = '0%';
    this.measure();
    if (this.currentIndex <= 0) {
      // Snap to end clone first then animate to last card
      this.goTo(this.originalCount - 1, true);
    } else {
      this.goTo(this.currentIndex - 1, true);
    }
  }

  startLoop() {
    const loop = (currentTime) => {
      const delta = currentTime - this.lastTime;
      this.lastTime = currentTime;

      const isMobile = window.innerWidth <= 768;
      const holdDuration = isMobile ? Math.max(this.duration, 4800) : this.duration;

      if (!this.isHovered && !this.isDragging && !this.isAnimating) {
        this.progress += (delta / holdDuration) * 100;
        if (this.progressFillEl) {
          this.progressFillEl.style.width = `${Math.min(100, this.progress)}%`;
        }

        if (this.progress >= 100) {
          this.next();
        }
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  setupDragEvents() {
    let startX = 0;
    let startY = 0;
    let diffX = 0;
    let diffY = 0;
    let isHorizontal = null;
    let hasMoved = false;

    const onStart = (e) => {
      // Don't intercept if clicking wishlist or action buttons directly
      if (e.target.closest('.saree-wish-btn, .btn-add-cart, .btn-whatsapp-cart, .saree-quick-view, .divan-nav-btn, .reel-play-btn, a, button')) {
        return;
      }
      this.isDragging = true;
      hasMoved = false;
      isHorizontal = null;
      const touch = e.type.includes('touch') ? e.touches[0] : e;
      startX = touch.clientX;
      startY = touch.clientY;
      diffX = 0;
      diffY = 0;
      this.isHovered = true; // Pause auto loop during swipe
    };

    const onMove = (e) => {
      if (!this.isDragging) return;
      const touch = e.type.includes('touch') ? e.touches[0] : e;
      diffX = touch.clientX - startX;
      diffY = touch.clientY - startY;

      // Determine gesture direction once movement threshold reached
      if (isHorizontal === null && (Math.abs(diffX) > 6 || Math.abs(diffY) > 6)) {
        isHorizontal = Math.abs(diffX) >= Math.abs(diffY);
        if (isHorizontal) {
          this.track.style.transition = 'none';
        }
      }

      if (isHorizontal) {
        hasMoved = true;
        const moveX = this.currentTranslate + diffX;
        this.track.style.transform = `translateX(${moveX}px)`;
      }
    };

    const onEnd = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      if (isHorizontal && hasMoved && Math.abs(diffX) > 40) {
        if (diffX < -40) {
          this.next();
        } else {
          this.prev();
        }
      } else {
        this.goTo(this.currentIndex, true);
      }

      if (hasMoved && isHorizontal) {
        const preventClick = (clickEvent) => {
          clickEvent.stopPropagation();
          clickEvent.preventDefault();
          window.removeEventListener('click', preventClick, true);
        };
        window.addEventListener('click', preventClick, true);
      }

      diffX = 0;
      diffY = 0;
      hasMoved = false;
      isHorizontal = null;

      setTimeout(() => {
        this.isHovered = false;
      }, 3500);
    };

    this.viewport.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    this.viewport.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  }
}

// Global initialization function
window.initDivanParallaxSliders = function() {
  // 1. Initialize New Arrivals Slider
  const arrivalsWrap = document.getElementById('newArrivalsSlider');
  if (arrivalsWrap) {
    new DivanParallaxSlider({
      wrapper: arrivalsWrap,
      track: '#newArrivalsGrid',
      prevBtn: '#arrivalsPrevBtn',
      nextBtn: '#arrivalsNextBtn',
      activeNum: '#arrivalsActiveNum',
      totalNum: '#arrivalsTotalNum',
      progressFill: '#arrivalsProgressFill',
      duration: 3400,
      slideDuration: 1150
    });
  }

  // 2. Initialize Signature Collections Slider
  const collectionsWrap = document.getElementById('collectionsSlider');
  if (collectionsWrap) {
    new DivanParallaxSlider({
      wrapper: collectionsWrap,
      track: '.collections-grid',
      prevBtn: '#colPrevBtn',
      nextBtn: '#colNextBtn',
      activeNum: '#colActiveNum',
      totalNum: '#colTotalNum',
      progressFill: '#colProgressFill',
      duration: 3600,
      slideDuration: 1150
    });
  }

  // 3. Initialize Sarees In Motion & Styling Reels Slider
  const reelsWrap = document.getElementById('reelsSlider');
  if (reelsWrap) {
    new DivanParallaxSlider({
      wrapper: reelsWrap,
      track: '#homeReelsGrid',
      prevBtn: '#reelsPrevBtn',
      nextBtn: '#reelsNextBtn',
      activeNum: '#reelsActiveNum',
      totalNum: '#reelsTotalNum',
      progressFill: '#reelsProgressFill',
      duration: 3800,
      slideDuration: 1150
    });
  }
};
