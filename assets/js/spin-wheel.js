/**
 * DEMO SILKS - ROYAL SPIN & WIN FORTUNE WHEEL
 * High-DPI Canvas Rendering, Authentic Physics Deceleration,
 * Web Audio Mechanical Ticking & Celebration, Confetti, and Coupon Integration.
 */

(function () {
  'use strict';

  // Slices configuration matching the reference image exactly (60 deg each, 6 total)
  // Slice 0 starts at 0 deg (3 o'clock under the pointer)
  const WHEEL_SLICES = [
    {
      id: '30_OFF',
      label: 'Get 30% Off!',
      iconType: 'flower',
      bg: '#fae2d7', // Soft Peach Cream
      textColor: '#631124', // Deep Burgundy
      isWin: true,
      coupon: 'SILK30',
      headline: '30% OFF YOUR ORDER!',
      description: 'Namaste! You have unlocked our exclusive 30% Royal Discount.'
    },
    {
      id: 'NO_LUCK',
      label: 'No Luck! Try Again',
      iconType: 'gift',
      bg: '#721528', // Royal Maroon
      textColor: '#fceadb', // Soft Ivory
      isWin: false,
      coupon: null,
      headline: 'So Close!',
      description: 'Spin one more time to claim your royal saree offer!'
    },
    {
      id: 'FREE_SHIP',
      label: 'Free Shipping!',
      iconType: 'truck',
      bg: '#fae2d7',
      textColor: '#631124',
      isWin: true,
      coupon: 'FREESHIP',
      headline: 'FREE EXPRESS SHIPPING!',
      description: 'Enjoy 100% complimentary insured royal delivery on your saree.'
    },
    {
      id: '20_OFF',
      label: 'Get 20% Off!',
      iconType: 'lotus',
      bg: '#721528',
      textColor: '#fceadb',
      isWin: true,
      coupon: 'ROYAL20',
      headline: '20% OFF YOUR ORDER!',
      description: 'Enjoy 20% off pure silk heritage sarees.'
    },
    {
      id: '10_OFF',
      label: 'Get 10% Off!',
      iconType: 'gift',
      bg: '#fae2d7',
      textColor: '#631124',
      isWin: true,
      coupon: 'ROYAL10',
      headline: '10% PRIVILEGE DISCOUNT!',
      description: 'Save 10% across all handcrafted Kanjivaram and Banarasi silks.'
    },
    {
      id: 'CARE_KIT',
      label: 'Free Saree Care Kit!',
      iconType: 'saree',
      bg: '#721528',
      textColor: '#fceadb',
      isWin: true,
      coupon: 'CAREKIT',
      headline: 'FREE SAREE CARE KIT!',
      description: 'Get our handcrafted organic muslin bag & cedar protection kit free!'
    }
  ];

  // Global State
  let currentRotation = 0; // in degrees
  let isSpinning = false;
  let canvas = null;
  let ctx = null;
  let pointerEl = null;
  let lastPinIndex = -1;
  let audioContext = null;
  let countdownTimer = null;

  // Initialize Web Audio API for zero-latency realistic sound effects
  function getAudioContext() {
    try {
      if (!audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioContext = new AudioCtx();
      }
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {});
      }
      return audioContext;
    } catch (e) {
      return null;
    }
  }

  // Mechanical Ticker Sound (clicks when divider peg passes pointer)
  function playTickSound(velocityRatio = 1) {
    try {
      const actx = getAudioContext();
      if (!actx) return;
      const osc = actx.createOscillator();
      const gain = actx.createGain();

      osc.type = 'triangle';
      const pitch = 580 + Math.random() * 80;
      osc.frequency.setValueAtTime(pitch, actx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, actx.currentTime + 0.035);

      const vol = Math.min(0.22, 0.08 + velocityRatio * 0.14);
      gain.gain.setValueAtTime(vol, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + 0.036);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Celebratory Royal Fanfare (plays upon winning)
  function playFanfareSound() {
    try {
      const actx = getAudioContext();
      if (!actx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 royal triad
      notes.forEach((freq, i) => {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, actx.currentTime + i * 0.11);
        gain.gain.setValueAtTime(0.18, actx.currentTime + i * 0.11);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + i * 0.11 + 0.55);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(actx.currentTime + i * 0.11);
        osc.stop(actx.currentTime + i * 0.11 + 0.58);
      });
    } catch (e) {}
  }

  // Build Modal DOM dynamically
  function injectModalHTML() {
    if (document.getElementById('spinPopupBackdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'spinPopupBackdrop';
    backdrop.className = 'spin-popup-backdrop';
    backdrop.innerHTML = `
      <div class="spin-popup-card" role="dialog" aria-modal="true" aria-label="Spin and Win Exclusive Offers">
        <!-- Close Button -->
        <button type="button" class="spin-close-btn" id="spinCloseBtn" title="Close Spin & Win" aria-label="Close">✕</button>

        <!-- Decorative Corner Lotus -->
        <img src="assets/images/spin-win-lotus-br.png" alt="" class="spin-corner-art spin-corner-br" onerror="this.style.display='none'">
        <img src="assets/images/spin-win-lotus-br.png" alt="" class="spin-corner-art spin-corner-tl" onerror="this.style.display='none'">

        <!-- Confetti Canvas -->
        <canvas id="spinConfettiCanvas"></canvas>

        <!-- Left Column: The Interactive Spinning Wheel -->
        <div class="spin-wheel-col">
          <div class="spin-wheel-stage" id="spinWheelStage" onclick="window.startSpinAndWin()" title="Click to Spin the Royal Wheel!">
            <canvas id="spinCanvas" width="840" height="840" onclick="window.startSpinAndWin()"></canvas>
            
            <!-- Metallic Golden Center Spin Button -->
            <button type="button" class="spin-center-btn" id="spinCenterBtn" onclick="event.stopPropagation(); window.startSpinAndWin();" title="Click to Spin!">
              <span class="spin-center-text">SPIN</span>
            </button>

            <!-- Metallic Golden Pointer Mounted at 3 O'Clock -->
            <div class="spin-pointer-wrap" id="spinPointer" onclick="window.startSpinAndWin()">
              <svg class="spin-pointer-svg" viewBox="0 0 70 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="pointerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fff0c4" />
                    <stop offset="35%" stop-color="#e5b869" />
                    <stop offset="70%" stop-color="#b8842d" />
                    <stop offset="100%" stop-color="#734a10" />
                  </linearGradient>
                  <linearGradient id="screwGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="50%" stop-color="#d4a34b" />
                    <stop offset="100%" stop-color="#5a3809" />
                  </linearGradient>
                  <filter id="pointerShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="-2" dy="3" stdDeviation="3" flood-color="#3d0a14" flood-opacity="0.45" />
                  </filter>
                </defs>
                <!-- Golden Pointer Body pointing left -->
                <path d="M 6 27 L 46 8 C 50 8 52 11 52 16 L 52 38 C 52 43 50 46 46 46 Z" 
                      fill="url(#pointerGoldGrad)" stroke="#66410e" stroke-width="1.5" filter="url(#pointerShadow)"/>
                <!-- Mounting Circular Rim -->
                <circle cx="48" cy="27" r="16" fill="url(#pointerGoldGrad)" stroke="#633c08" stroke-width="1.5"/>
                <!-- Center Pivot Rivet/Screw -->
                <circle cx="48" cy="27" r="8" fill="url(#screwGoldGrad)" stroke="#4d2c02" stroke-width="1"/>
                <circle cx="48" cy="27" r="3" fill="#ffe9af"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Right Column: Content & Interaction -->
        <div class="spin-form-col">
          <!-- Top Lotus Emblem -->
          <div class="spin-header-lotus">
            <div class="lotus-line"></div>
            <img src="assets/images/spin-win-top-lotus-clean.png" alt="Lotus Motif" onerror="this.src='assets/images/navbar-logo-clean.png'">
            <div class="lotus-line right"></div>
          </div>

          <!-- Main Title with Radiating Sunburst -->
          <div class="spin-title-wrap">
            <span class="spin-sunburst-l">✦</span>
            <h2 class="spin-title">SPIN & WIN!</h2>
            <span class="spin-sunburst-r">✦</span>
          </div>

          <p class="spin-subtitle">Your Next Favourite Saree Could Be Just a Spin Away!</p>

          <!-- Input Form Container -->
          <form id="spinForm" class="spin-form-wrap" onsubmit="event.preventDefault(); window.startSpinAndWin();">
            <!-- Mobile Phone Input -->
            <div class="spin-input-group">
              <span class="spin-input-icon"><i class="fa-solid fa-phone"></i></span>
              <div class="spin-country-select">
                <span>IN +91</span>
                <i class="fa-solid fa-chevron-down" style="font-size:0.7rem; color:#8c6e4e;"></i>
              </div>
              <input type="tel" id="spinPhone" class="spin-input" placeholder="Enter your mobile number" maxlength="14">
            </div>

            <!-- Email Input -->
            <div class="spin-input-group">
              <span class="spin-input-icon"><i class="fa-solid fa-envelope"></i></span>
              <input type="email" id="spinEmail" class="spin-input" placeholder="Enter your email address">
            </div>

            <!-- CTA Submit Button -->
            <button type="button" id="spinSubmitBtn" class="spin-btn-submit" onclick="window.startSpinAndWin()">
              <span class="spin-btn-icon"><i class="fa-solid fa-gift"></i></span>
              <span>Get My Coupon</span>
              <span class="spin-btn-arrow">→</span>
            </button>

            <p class="spin-disclaimer">
              By submitting your information, you agree to our <a href="contact.html">Privacy Policy</a> and <a href="contact.html">Terms of Service</a>.
            </p>
          </form>

          <!-- Winner Reward Reveal (Hidden initially) -->
          <div id="spinWinnerCard" class="spin-winner-card">
            <div class="spin-winner-badge">
              <i class="fa-solid fa-crown"></i>
              <span>EXCLUSIVE WINNER</span>
            </div>
            <h3 class="spin-winner-title" id="winnerHeadline">30% OFF YOUR ORDER!</h3>
            <p class="spin-winner-desc" id="winnerDesc">Namaste! You have unlocked our exclusive 30% Royal Discount.</p>

            <div class="spin-coupon-ticket">
              <span class="spin-coupon-code" id="winnerCouponCode">SILK30</span>
              <button type="button" class="spin-coupon-copy-btn" id="copyCouponBtn" onclick="window.copySpinCoupon()">
                <i class="fa-regular fa-copy"></i>
                <span id="copyBtnText">Copy Code</span>
              </button>
            </div>

            <button type="button" class="spin-winner-cta-btn" onclick="window.claimAndShopNow()">
              <i class="fa-solid fa-bag-shopping"></i>
              <span>Apply to Cart & Shop Sarees →</span>
            </button>

            <button type="button" class="spin-again-btn" id="spinAgainBtn" onclick="window.resetAndSpinAgain()">
              <i class="fa-solid fa-rotate-right"></i>
              <span>Spin Again</span>
            </button>

            <div class="spin-timer-badge">
              <i class="fa-regular fa-clock"></i>
              <span>Offer expires in: <strong id="spinCountdown">14:59</strong></span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    // Floating side badge pinned at right edge
    const trigger = document.createElement('div');
    trigger.id = 'spinFloatingTrigger';
    trigger.className = 'spin-floating-trigger';
    trigger.title = "Spin to Win Saree Discounts!";
    trigger.innerHTML = `
      <div class="spin-floating-wheel-icon"><i class="fa-solid fa-gift"></i></div>
      <span class="spin-floating-text">SPIN & WIN</span>
    `;
    trigger.onclick = () => window.openSpinModal(true);
    document.body.appendChild(trigger);

    // Setup event listeners
    document.getElementById('spinCloseBtn').onclick = () => window.closeSpinModal();
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) window.closeSpinModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('active')) {
        window.closeSpinModal();
      }
    });

    // Reference elements
    canvas = document.getElementById('spinCanvas');
    if (canvas) ctx = canvas.getContext('2d');
    pointerEl = document.getElementById('spinPointer');
  }

  // Draw High-DPI Canvas Wheel with Metallic Gold Rim, Studs, and Elegant Slices
  function drawWheel(rotationDeg = 0) {
    if (!canvas) canvas = document.getElementById('spinCanvas');
    if (canvas && !ctx) ctx = canvas.getContext('2d');
    if (!ctx || !canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const outerRadius = cx - 20; // 400px on 840x840 canvas
    const innerRadius = 70; // Medallion boundary

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotationDeg * Math.PI) / 180);

    const sliceAngle = (2 * Math.PI) / WHEEL_SLICES.length; // 60 deg each

    // 1. Draw Slices
    WHEEL_SLICES.forEach((slice, i) => {
      // Slice 0 is centered at 0 deg, so angle ranges from -30 deg to +30 deg
      const startAngle = i * sliceAngle - sliceAngle / 2;
      const endAngle = startAngle + sliceAngle;

      // Fill Slice Arc
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, outerRadius - 16, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = slice.bg;
      ctx.fill();

      // Subtle radial silk sheen gradient
      const sheenGrad = ctx.createRadialGradient(0, 0, 80, 0, 0, outerRadius - 16);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      sheenGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.03)');
      sheenGrad.addColorStop(1, 'rgba(0, 0, 0, 0.12)');
      ctx.fillStyle = sheenGrad;
      ctx.fill();

      // Draw Slice Divider Line (Gold filigree)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo((outerRadius - 16) * Math.cos(startAngle), (outerRadius - 16) * Math.sin(startAngle));
      ctx.strokeStyle = '#d4a34b';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Draw Slice Content (Icon & Text)
      ctx.save();
      const midAngle = i * sliceAngle;
      ctx.rotate(midAngle);

      // Icon & Text placement along radial direction
      drawSliceContent(ctx, slice, outerRadius);

      ctx.restore();
    });

    // Draw last divider line for closure
    const lastDividerAngle = WHEEL_SLICES.length * sliceAngle - sliceAngle / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo((outerRadius - 16) * Math.cos(lastDividerAngle), (outerRadius - 16) * Math.sin(lastDividerAngle));
    ctx.strokeStyle = '#d4a34b';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // 2. Outer Golden Bevel & Beaded Rivet Track
    drawGoldenRim(ctx, outerRadius);

    // 3. Center Medallion (Golden 3D Hub with Embossed Lotus)
    drawCenterMedallion(ctx, innerRadius);

    ctx.restore();
  }

  // Draw slice icon and text
  function drawSliceContent(c, slice, outerRadius) {
    c.textAlign = 'center';
    c.textBaseline = 'middle';

    const textDist = outerRadius * 0.62;
    const iconDist = outerRadius * 0.81;

    // Draw Icon at outer segment
    c.save();
    c.translate(iconDist, 0);
    c.rotate(Math.PI / 2); // Rotate so icon faces upwards

    c.fillStyle = slice.textColor;
    c.strokeStyle = slice.textColor;
    c.lineWidth = 2.2;

    if (slice.iconType === 'gift') {
      // Gift Box Icon
      c.strokeRect(-12, -8, 24, 20);
      c.beginPath();
      c.moveTo(0, -8); c.lineTo(0, 12);
      c.moveTo(-12, 2); c.lineTo(12, 2);
      c.stroke();
      // Bow on top
      c.beginPath();
      c.arc(-6, -11, 4, 0, Math.PI * 2);
      c.arc(6, -11, 4, 0, Math.PI * 2);
      c.stroke();
    } else if (slice.iconType === 'truck') {
      // Delivery Truck
      c.strokeRect(-16, -6, 20, 16);
      c.strokeRect(4, -2, 10, 12);
      c.beginPath();
      c.arc(-8, 12, 4, 0, Math.PI * 2);
      c.arc(9, 12, 4, 0, Math.PI * 2);
      c.stroke();
    } else if (slice.iconType === 'flower') {
      // 8-Petal Royal Floral Motif
      for (let p = 0; p < 8; p++) {
        c.rotate((Math.PI * 2) / 8);
        c.beginPath();
        c.ellipse(0, -9, 3.5, 6.5, 0, 0, Math.PI * 2);
        c.fill();
      }
      c.beginPath();
      c.arc(0, 0, 3.5, 0, Math.PI * 2);
      c.fillStyle = '#fae2d7';
      c.fill();
    } else if (slice.iconType === 'lotus') {
      // Lotus Bloom
      c.beginPath();
      c.ellipse(0, 0, 5, 12, 0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.ellipse(-7, 2, 4.5, 10, -0.3, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.ellipse(7, 2, 4.5, 10, 0.3, 0, Math.PI * 2);
      c.fill();
    } else if (slice.iconType === 'saree') {
      // Saree Drape / Hanger
      c.beginPath();
      c.moveTo(0, -12);
      c.lineTo(-14, 0);
      c.lineTo(14, 0);
      c.closePath();
      c.stroke();
      c.beginPath();
      c.moveTo(0, -12);
      c.arc(0, -15, 3.5, 0, Math.PI, true);
      c.stroke();
      c.strokeRect(-10, 2, 20, 12);
    }
    c.restore();

    // Draw Text (2-line support)
    c.save();
    c.translate(textDist, 0);
    c.rotate(Math.PI / 2); // Readable text orientation

    c.fillStyle = slice.textColor;
    c.font = 'bold 22px "Cinzel", "Playfair Display", Georgia, serif';

    const words = slice.label.split(' ');
    let line1 = '', line2 = '';

    if (words.length <= 2) {
      line1 = words[0];
      line2 = words[1] || '';
    } else {
      line1 = words.slice(0, 2).join(' ');
      line2 = words.slice(2).join(' ');
    }

    c.fillText(line1, 0, -10);
    c.font = '700 24px "Cinzel", "Playfair Display", Georgia, serif';
    c.fillText(line2, 0, 16);

    // Decorative underline
    c.beginPath();
    c.moveTo(-24, 30);
    c.lineTo(24, 30);
    c.strokeStyle = slice.textColor;
    c.lineWidth = 1;
    c.stroke();
    // Center diamond on underline
    c.beginPath();
    c.arc(0, 30, 2.5, 0, Math.PI * 2);
    c.fillStyle = slice.textColor;
    c.fill();

    c.restore();
  }

  // Draw Outer Golden Rim with 24 Beaded Rivet Studs
  function drawGoldenRim(c, outerRadius) {
    // Outer Track Ring
    const rimWidth = 26;
    const rimGrad = c.createRadialGradient(0, 0, outerRadius - rimWidth, 0, 0, outerRadius);
    rimGrad.addColorStop(0, '#8c591b');
    rimGrad.addColorStop(0.3, '#dca954');
    rimGrad.addColorStop(0.6, '#fff0be');
    rimGrad.addColorStop(0.85, '#c9943c');
    rimGrad.addColorStop(1, '#663e0d');

    c.beginPath();
    c.arc(0, 0, outerRadius, 0, Math.PI * 2);
    c.arc(0, 0, outerRadius - rimWidth, 0, Math.PI * 2, true);
    c.fillStyle = rimGrad;
    c.fill();

    // Fine inner and outer gold border lines
    c.beginPath();
    c.arc(0, 0, outerRadius, 0, Math.PI * 2);
    c.strokeStyle = '#ffeaa7';
    c.lineWidth = 2.5;
    c.stroke();

    c.beginPath();
    c.arc(0, 0, outerRadius - rimWidth, 0, Math.PI * 2);
    c.strokeStyle = '#5a3507';
    c.lineWidth = 2.5;
    c.stroke();

    // 24 Metallic Studs / Rivets evenly around rim
    const numStuds = 24;
    const studRadius = outerRadius - rimWidth / 2;
    for (let s = 0; s < numStuds; s++) {
      const angle = (s * 2 * Math.PI) / numStuds;
      const sx = studRadius * Math.cos(angle);
      const sy = studRadius * Math.sin(angle);

      // Stud gradient with top-left specular highlight
      const studGrad = c.createRadialGradient(sx - 2, sy - 2, 1, sx, sy, 5.5);
      studGrad.addColorStop(0, '#ffffff');
      studGrad.addColorStop(0.4, '#ffd782');
      studGrad.addColorStop(0.8, '#b8812c');
      studGrad.addColorStop(1, '#4d2d05');

      c.beginPath();
      c.arc(sx, sy, 5, 0, Math.PI * 2);
      c.fillStyle = studGrad;
      c.fill();

      // Stud stroke
      c.strokeStyle = '#3e2202';
      c.lineWidth = 0.8;
      c.stroke();
    }
  }

  // Draw 3D Golden Medallion Hub with Lotus Motif
  function drawCenterMedallion(c, radius) {
    // Drop shadow
    c.save();
    c.shadowColor = 'rgba(40, 5, 12, 0.55)';
    c.shadowBlur = 18;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 6;

    // Outer Hub Bevel
    const hubGrad = c.createRadialGradient(0, 0, radius * 0.4, 0, 0, radius);
    hubGrad.addColorStop(0, '#fff4cb');
    hubGrad.addColorStop(0.4, '#d8a34b');
    hubGrad.addColorStop(0.7, '#8e5b18');
    hubGrad.addColorStop(1, '#512f06');

    c.beginPath();
    c.arc(0, 0, radius, 0, Math.PI * 2);
    c.fillStyle = hubGrad;
    c.fill();
    c.restore();

    // Inner Dome
    const domeGrad = c.createRadialGradient(-10, -10, 5, 0, 0, radius * 0.75);
    domeGrad.addColorStop(0, '#fffbe6');
    domeGrad.addColorStop(0.35, '#e0b25e');
    domeGrad.addColorStop(0.75, '#a67228');
    domeGrad.addColorStop(1, '#633e0d');

    c.beginPath();
    c.arc(0, 0, radius * 0.75, 0, Math.PI * 2);
    c.fillStyle = domeGrad;
    c.fill();
    c.strokeStyle = '#4e2d04';
    c.lineWidth = 2;
    c.stroke();

    // Embossed 8-Petal Golden Lotus Flower
    c.save();
    c.fillStyle = '#6b4009';
    c.strokeStyle = '#fff0ba';
    c.lineWidth = 1.2;

    for (let p = 0; p < 8; p++) {
      c.rotate((Math.PI * 2) / 8);
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(-7, -15, 0, -26);
      c.quadraticCurveTo(7, -15, 0, 0);
      c.fill();
      c.stroke();
    }

    // Center Gold Ruby Bead
    const beadGrad = c.createRadialGradient(-2, -2, 1, 0, 0, 8);
    beadGrad.addColorStop(0, '#ffffff');
    beadGrad.addColorStop(0.4, '#fcd783');
    beadGrad.addColorStop(0.8, '#b88127');
    beadGrad.addColorStop(1, '#532f05');

    c.beginPath();
    c.arc(0, 0, 7.5, 0, Math.PI * 2);
    c.fillStyle = beadGrad;
    c.fill();
    c.strokeStyle = '#ffeaa7';
    c.lineWidth = 1;
    c.stroke();

    c.restore();
  }

  // Check pin division hits to trigger ticker wobble and audio click
  function checkPinCrossings(currentDeg) {
    // 6 divider lines are at 30, 90, 150, 210, 270, 330 deg
    // When pointer is at 0 deg, a divider crosses pointer whenever (currentDeg + 30) % 60 crosses integer
    const pinIndex = Math.floor((currentDeg + 30) / 60);
    if (pinIndex !== lastPinIndex && lastPinIndex !== -1) {
      if (pointerEl) {
        pointerEl.classList.remove('tick-wobble');
        void pointerEl.offsetWidth; // Force CSS reflow
        pointerEl.classList.add('tick-wobble');
      }
      playTickSound();
    }
    lastPinIndex = pinIndex;
  }

  // Spin Engine with High-Fidelity Physics Deceleration
  window.startSpinAndWin = function () {
    if (isSpinning) return;

    const formEl = document.getElementById('spinForm');
    const winnerCard = document.getElementById('spinWinnerCard');
    const centerBtn = document.getElementById('spinCenterBtn');
    const phoneInput = document.getElementById('spinPhone');
    const emailInput = document.getElementById('spinEmail');
    const submitBtn = document.getElementById('spinSubmitBtn');

    // If winner card is currently showing, switch back to form view
    if (winnerCard) winnerCard.style.display = 'none';
    if (formEl) formEl.style.display = 'flex';

    let phone = phoneInput ? phoneInput.value.trim() : '';
    let email = emailInput ? emailInput.value.trim() : '';

    // If blank on quick spin/test, auto-fill default values
    if (!phone || phone.length < 6) {
      phone = '9876543210';
      if (phoneInput) phoneInput.value = phone;
    }
    if (!email) {
      email = 'namaste@demosilks.com';
      if (emailInput) emailInput.value = email;
    }

    // Resume AudioContext on user interaction
    getAudioContext();

    isSpinning = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Spinning...</span>`;
    }
    if (centerBtn) {
      centerBtn.disabled = true;
      centerBtn.classList.add('spinning');
    }

    // Pick winning slice:
    // Weighted to exciting prizes: Slice 0 (30% Off) is top favorite, Slice 3 (20% Off), Slice 2 (Free Shipping)
    const prizeRoster = [0, 0, 0, 3, 3, 2, 5, 4]; // heavily favors 30% and 20%
    const winningSliceIndex = prizeRoster[Math.floor(Math.random() * prizeRoster.length)];
    const chosenSlice = WHEEL_SLICES[winningSliceIndex];

    // Compute target angle:
    // Pointer is at 0 deg. Slice k center is at k * 60 deg.
    const sliceCenterAngle = winningSliceIndex * 60;
    // Add small random jitter (+/- 11 deg) within wedge for realism
    const jitter = (Math.random() - 0.5) * 22;
    const targetSliceAngle = (sliceCenterAngle + jitter + 360) % 360;

    // Number of full 360 spins (6 to 8 full revolutions)
    const fullSpins = 6 + Math.floor(Math.random() * 2);
    const startAngle = currentRotation;
    const endModulo = (360 - targetSliceAngle) % 360;
    const currentModulo = startAngle % 360;

    let deltaAngle = (endModulo - currentModulo + 360) % 360;
    if (deltaAngle < 120) deltaAngle += 360;
    const totalSpinDelta = fullSpins * 360 + deltaAngle;
    const finalTargetAngle = startAngle + totalSpinDelta;

    lastPinIndex = Math.floor((startAngle + 30) / 60);

    // Animation physics parameters
    const duration = 4800; // 4.8 seconds for dramatic suspense
    const startTime = performance.now();

    function animateSpin(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Quintic Ease-Out curve for authentic deceleration: 1 - (1 - t)^5
      const easeProgress = 1 - Math.pow(1 - progress, 5);

      currentRotation = startAngle + totalSpinDelta * easeProgress;

      // Realistic Micro-bounce / settle dampening in last 4%
      if (progress > 0.96) {
        const settlePhase = (progress - 0.96) / 0.04; // 0 to 1
        const damping = Math.sin(settlePhase * Math.PI * 3) * (1 - settlePhase) * 1.2;
        currentRotation += damping;
      }

      drawWheel(currentRotation);
      checkPinCrossings(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        // Complete! Settle cleanly on target
        currentRotation = finalTargetAngle;
        drawWheel(currentRotation);
        isSpinning = false;
        if (centerBtn) {
          centerBtn.disabled = false;
          centerBtn.classList.remove('spinning');
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span class="spin-btn-icon"><i class="fa-solid fa-gift"></i></span>
            <span>Get My Coupon</span>
            <span class="spin-btn-arrow">→</span>
          `;
        }
        handleSpinCompletion(chosenSlice);
      }
    }

    requestAnimationFrame(animateSpin);
  };

  // Reset and trigger a fresh spin
  window.resetAndSpinAgain = function () {
    const formEl = document.getElementById('spinForm');
    const winnerCard = document.getElementById('spinWinnerCard');
    const submitBtn = document.getElementById('spinSubmitBtn');

    if (winnerCard) winnerCard.style.display = 'none';
    if (formEl) formEl.style.display = 'flex';
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span class="spin-btn-icon"><i class="fa-solid fa-gift"></i></span>
        <span>Get My Coupon</span>
        <span class="spin-btn-arrow">→</span>
      `;
    }
    window.startSpinAndWin();
  };

  // Handle Win: Confetti, Fanfare, Reveal Reward, Save to Session
  function handleSpinCompletion(prize) {
    playFanfareSound();
    launchConfetti();

    // Store user spin victory
    const spinRecord = {
      prizeId: prize.id,
      headline: prize.headline,
      desc: prize.description,
      coupon: prize.coupon || 'SILK30',
      timestamp: Date.now()
    };
    try {
      sessionStorage.setItem('Demo_spin_winner', JSON.stringify(spinRecord));
      if (prize.coupon) {
        sessionStorage.setItem('Demo_applied_coupon', prize.coupon);
      }
    } catch (e) {}

    // Transition form to Winner Reveal Card
    setTimeout(() => {
      const formEl = document.getElementById('spinForm');
      const winnerCard = document.getElementById('spinWinnerCard');
      const headlineEl = document.getElementById('winnerHeadline');
      const descEl = document.getElementById('winnerDesc');
      const codeEl = document.getElementById('winnerCouponCode');

      if (formEl) formEl.style.display = 'none';
      if (headlineEl) headlineEl.textContent = prize.headline;
      if (descEl) descEl.textContent = prize.description;
      if (codeEl) codeEl.textContent = prize.coupon || 'SILK30';
      if (winnerCard) winnerCard.style.display = 'flex';

      startUrgencyCountdown(15 * 60); // 15 minutes timer
    }, 450);
  }

  // 15-Minute Urgency Countdown Timer
  function startUrgencyCountdown(seconds) {
    clearInterval(countdownTimer);
    let remaining = seconds;
    const timerEl = document.getElementById('spinCountdown');

    function update() {
      if (!timerEl) return;
      const m = Math.floor(remaining / 60);
      const s = remaining % 60;
      timerEl.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      if (remaining > 0) {
        remaining--;
      } else {
        clearInterval(countdownTimer);
      }
    }
    update();
    countdownTimer = setInterval(update, 1000);
  }

  // Copy Coupon Code
  window.copySpinCoupon = function () {
    const codeEl = document.getElementById('winnerCouponCode');
    const btnText = document.getElementById('copyBtnText');
    const code = codeEl ? codeEl.textContent.trim() : 'SILK30';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        if (btnText) btnText.textContent = 'Copied! ✓';
        if (typeof DemoStore !== 'undefined' && DemoStore.showToast) {
          DemoStore.showToast(`Coupon "${code}" copied to clipboard!`);
        }
        setTimeout(() => {
          if (btnText) btnText.textContent = 'Copy Code';
        }, 2500);
      });
    } else {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (btnText) btnText.textContent = 'Copied! ✓';
    }
  };

  // Claim Coupon & Shop Sarees
  window.claimAndShopNow = function () {
    const codeEl = document.getElementById('winnerCouponCode');
    const code = codeEl ? codeEl.textContent.trim() : 'SILK30';

    try {
      sessionStorage.setItem('Demo_applied_coupon', code);
    } catch (e) {}

    window.closeSpinModal();

    if (typeof DemoStore !== 'undefined' && DemoStore.showToast) {
      DemoStore.showToast(`✨ Privilege coupon ${code} will be applied at checkout!`);
    }

    // If currently on cart.html, reload or auto-apply
    if (window.location.pathname.includes('cart.html')) {
      const couponInput = document.getElementById('couponInput');
      if (couponInput) {
        couponInput.value = code;
        if (typeof applyCoupon === 'function') applyCoupon();
      }
    } else {
      // Scroll to shop section or redirect to shop.html
      const shopSec = document.getElementById('shopSection');
      if (shopSec) {
        shopSec.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = 'shop.html';
      }
    }
  };

  // Confetti & Silk Petal Shower Canvas Generator
  function launchConfetti() {
    const confettiCanvas = document.getElementById('spinConfettiCanvas');
    if (!confettiCanvas) return;
    const cctx = confettiCanvas.getContext('2d');
    if (!cctx) return;

    confettiCanvas.width = confettiCanvas.offsetWidth || 900;
    confettiCanvas.height = confettiCanvas.offsetHeight || 520;

    const particles = [];
    const colors = ['#fce7ba', '#e5b869', '#74162a', '#a3203c', '#ffffff', '#fae2d7'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * confettiCanvas.width,
        y: -10 - Math.random() * 80,
        size: 5 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: 2.5 + Math.random() * 4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        isPetal: Math.random() > 0.45,
        opacity: 1
      });
    }

    const startTime = performance.now();
    function renderParticles(t) {
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      const elapsed = t - startTime;

      let activeCount = 0;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        if (p.y > confettiCanvas.height * 0.7) {
          p.opacity -= 0.015;
        }

        if (p.opacity > 0 && p.y < confettiCanvas.height + 20) {
          activeCount++;
          cctx.save();
          cctx.translate(p.x, p.y);
          cctx.rotate((p.rotation * Math.PI) / 180);
          cctx.globalAlpha = Math.max(0, p.opacity);
          cctx.fillStyle = p.color;

          if (p.isPetal) {
            // Silk Petal shape
            cctx.beginPath();
            cctx.ellipse(0, 0, p.size * 0.7, p.size * 1.3, 0, 0, Math.PI * 2);
            cctx.fill();
          } else {
            // Square gold foil
            cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          }
          cctx.restore();
        }
      });

      if (activeCount > 0 && elapsed < 4000) {
        requestAnimationFrame(renderParticles);
      } else {
        cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    requestAnimationFrame(renderParticles);
  }

  // Modal Open / Close handlers
  window.openSpinModal = function (freshSpin = false) {
    const backdrop = document.getElementById('spinPopupBackdrop');
    if (!backdrop) return;
    backdrop.classList.add('active');

    const formEl = document.getElementById('spinForm');
    const winnerCard = document.getElementById('spinWinnerCard');
    const submitBtn = document.getElementById('spinSubmitBtn');

    // On page load or fresh spin request, always show fresh spin form
    if (freshSpin) {
      if (formEl) formEl.style.display = 'flex';
      if (winnerCard) winnerCard.style.display = 'none';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span class="spin-btn-icon"><i class="fa-solid fa-gift"></i></span>
          <span>Get My Coupon</span>
          <span class="spin-btn-arrow">→</span>
        `;
      }
      isSpinning = false;
    } else {
      // If user clicked floating button and had previously won, show their voucher
      try {
        const savedWin = sessionStorage.getItem('Demo_spin_winner');
        if (savedWin) {
          const prize = JSON.parse(savedWin);
          const headlineEl = document.getElementById('winnerHeadline');
          const descEl = document.getElementById('winnerDesc');
          const codeEl = document.getElementById('winnerCouponCode');

          if (formEl) formEl.style.display = 'none';
          if (headlineEl) headlineEl.textContent = prize.headline;
          if (descEl) descEl.textContent = prize.desc;
          if (codeEl) codeEl.textContent = prize.coupon;
          if (winnerCard) winnerCard.style.display = 'flex';
          startUrgencyCountdown(15 * 60);
        } else {
          if (formEl) formEl.style.display = 'flex';
          if (winnerCard) winnerCard.style.display = 'none';
        }
      } catch (e) {}
    }

    // Redraw wheel to ensure sharp rendering
    drawWheel(currentRotation);
  };

  window.closeSpinModal = function () {
    const backdrop = document.getElementById('spinPopupBackdrop');
    if (backdrop) backdrop.classList.remove('active');
  };

  // Auto-trigger during refreshing or page loading time!
  function initOnPageLoad() {
    injectModalHTML();
    drawWheel(currentRotation);

    // Automatically slide in on every page refresh / load
    setTimeout(() => {
      window.openSpinModal(true); // fresh spin ready on refresh!

      // Automatically spin the wheel during refreshing time!
      setTimeout(() => {
        window.startSpinAndWin();
      }, 700);
    }, 500);
  }

  // Hook into DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOnPageLoad);
  } else {
    initOnPageLoad();
  }
})();

