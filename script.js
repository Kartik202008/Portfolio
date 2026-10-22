/**
 * ALEX RIVERA PORTFOLIO — INTERACTIVE ENGINE
 * Features:
 * - Theme Toggle (Cream Canvas / Cyber-Dark) with LocalStorage persistence
 * - Web Audio API Micro-Haptics (Subtle clicks)
 * - Mobile Navigation Drawer & Focus Management
 * - Live Ticking Clock (IST / Local Time Sync)
 * - 1-Click Clipboard Email Copy + Toast System
 * - Interactive Project Simulators:
 *   1. E-Commerce Cart & Checkout State Machine
 *   2. MedAlert 2-Minute Async Escalation Simulator
 *   3. SocietyPool Tier Pricing Algorithm & AI Copilot Generator
 * - Resume ATS Modal & Print Handler
 * - Accessible Contact Form Validation & Transmission
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  const state = {
    theme: localStorage.getItem('ar-portfolio-theme') || 'light',
    soundEnabled: localStorage.getItem('ar-portfolio-sound') !== 'false',
    audioCtx: null,
    activeModal: null,
    // E-Commerce Demo State
    cart: [
      { id: 'kb', name: 'Haptic Keyboard', price: 120, qty: 1 },
      { id: 'hp', name: 'Studio Monitors', price: 80, qty: 1 }
    ],
    couponApplied: false,
    discountRate: 0.20, // 20% with DEV2026
    // MedAlert Demo State
    medalertTimerSecs: 120,
    medalertInterval: null,
    medalertStatus: 'MONITORING DOSE',
    // SocietyPool Demo State
    poolOrderCount: 18,
    baseItemPrice: 600,
  };

  /* ==========================================================================
     1. Web Audio API Tactile Sound Engine (Zero external dependencies)
     ========================================================================== */
  function playClickSound(freq = 800, type = 'sine', duration = 0.04) {
    if (!state.soundEnabled) return;
    try {
      if (!state.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        state.audioCtx = new AudioContext();
      }
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, state.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.06, state.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(state.audioCtx.destination);

      osc.start();
      osc.stop(state.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay restrictions or unsupported
    }
  }

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle');
  const iconSpeaker = soundToggleBtn?.querySelector('.icon-speaker');

  function updateSoundUI() {
    if (!soundToggleBtn || !iconSpeaker) return;
    if (state.soundEnabled) {
      iconSpeaker.classList.remove('muted');
      soundToggleBtn.setAttribute('title', 'Audio Feedback: ON (Click to Mute)');
    } else {
      iconSpeaker.classList.add('muted');
      soundToggleBtn.setAttribute('title', 'Audio Feedback: OFF (Click to Unmute)');
    }
  }

  soundToggleBtn?.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem('ar-portfolio-sound', state.soundEnabled);
    updateSoundUI();
    if (state.soundEnabled) {
      playClickSound(950, 'triangle');
      showToast('🔊 Audio clicks enabled', 'info');
    } else {
      showToast('🔇 Audio clicks muted', 'info');
    }
  });
  updateSoundUI();

  /* ==========================================================================
     2. Theme Toggle (Cream Canvas / Cyber-Dark)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const metaThemeColor = document.getElementById('meta-theme-color');

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ar-portfolio-theme', theme);

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0E1013' : '#F7F5EE');
    }
  }

  applyTheme(state.theme);

  themeToggleBtn?.addEventListener('click', () => {
    playClickSound(650, 'sine');
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    showToast(newTheme === 'dark' ? '🌙 Cyber-Dark Mode Activated' : '☀️ Cream Canvas Mode Activated', 'info');
  });

  /* ==========================================================================
     3. Toast Notification System
     ========================================================================== */
  const toastContainer = document.getElementById('toast-container');

  function showToast(message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
      <span class="toast-msg">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 260);
    }, 3200);
  }

  /* ==========================================================================
     4. Clipboard Email Copy Micro-Interactions
     ========================================================================== */
  document.querySelectorAll('.copy-email-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      playClickSound(900, 'square', 0.05);
      const email = btn.getAttribute('data-email') || 'aahil@khan.dev';

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = email;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        showToast(`📋 Copied ${email} to clipboard!`, 'success');
      } catch (err) {
        showToast(`Email: ${email}`, 'info');
      }
    });
  });

  /* ==========================================================================
     4b. Easter Egg: "There's a far more fun version of this"
     ========================================================================== */
  const funModeTrigger = document.getElementById('fun-mode-trigger');
  funModeTrigger?.addEventListener('click', () => {
    // Play retro arpeggio notes
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => playClickSound(freq, 'triangle', 0.08), idx * 75);
    });

    // Spawn celebratory floating particles
    const emojis = ['⚡', '✨', '🚀', '🧠', '👾', '🔥', '💻', '🟡'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.position = 'fixed';
      p.style.left = `${Math.random() * 90 + 5}vw`;
      p.style.top = `${Math.random() * 40 + 20}vh`;
      p.style.fontSize = `${Math.random() * 20 + 20}px`;
      p.style.zIndex = '9999';
      p.style.pointerEvents = 'none';
      p.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
      p.style.transform = `translateY(0px) rotate(${Math.random() * 60 - 30}deg)`;
      p.style.opacity = '1';

      document.body.appendChild(p);

      requestAnimationFrame(() => {
        p.style.transform = `translateY(-120px) scale(1.4) rotate(${Math.random() * 180 - 90}deg)`;
        p.style.opacity = '0';
      });

      setTimeout(() => p.remove(), 1300);
    }

    showToast('✨ Fun mode activated! Aahil builds fast, resilient systems.', 'success');
  });

  /* ==========================================================================
     5. Live Dynamic Clock (IST / UTC+5:30)
     ========================================================================== */
  const localTimeDisplay = document.getElementById('local-time-display');

  function updateClock() {
    if (!localTimeDisplay) return;
    try {
      const now = new Date();
      // Format time in IST (Indian Standard Time)
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat([], options);
      localTimeDisplay.textContent = `${formatter.format(now)} IST`;
    } catch (e) {
      const fallback = new Date();
      localTimeDisplay.textContent = `${fallback.toTimeString().substring(0, 5)} LOC`;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);

  /* ==========================================================================
     6. Mobile Navigation Drawer
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(open) {
    const isOpen = open !== undefined ? open : !mobileNavDrawer.classList.contains('open');
    mobileNavDrawer.classList.toggle('open', isOpen);
    mobileMenuToggle.setAttribute('aria-expanded', isOpen);
    mobileNavDrawer.setAttribute('aria-hidden', !isOpen);
    playClickSound(isOpen ? 750 : 500);
  }

  mobileMenuToggle?.addEventListener('click', () => toggleMobileMenu());

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(false);
    });
  });

  // Close mobile drawer when resizing past tablet
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 860 && mobileNavDrawer.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });

  /* ==========================================================================
     7. Active Navigation Link Highlighting (IntersectionObserver)
     ========================================================================== */
  const navSections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if ('IntersectionObserver' in window && navSections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          desktopNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: 0
    });

    navSections.forEach(sec => observer.observe(sec));
  }

  /* ==========================================================================
     8. Modal System (Accessible Dialogs)
     ========================================================================== */
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    playClickSound(850, 'sine', 0.05);

    // Close any currently open modal
    if (state.activeModal && state.activeModal !== modal) {
      closeModal(state.activeModal);
    }

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    state.activeModal = modal;

    // Focus the first interactive element or close button
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    playClickSound(450, 'sine', 0.04);
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    state.activeModal = null;
  }

  // Setup close buttons on all modals
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    // Backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });

    // Close button
    const closeBtn = modal.querySelector('.modal-close-btn');
    closeBtn?.addEventListener('click', () => {
      closeModal(modal);
    });
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.activeModal) {
      closeModal(state.activeModal);
    }
  });

  // Triggers for Demo Modals
  document.querySelectorAll('.open-demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const demoType = btn.getAttribute('data-demo');
      if (demoType === 'ecommerce') openModal('modal-ecommerce');
      if (demoType === 'medalert') {
        openModal('modal-medalert');
        startMedAlertTimer();
      }
      if (demoType === 'societypool') openModal('modal-societypool');
    });
  });

  // Resume Modal Triggers
  document.getElementById('view-resume-modal-trigger')?.addEventListener('click', () => {
    openModal('modal-resume');
  });

  document.getElementById('mobile-resume-preview-btn')?.addEventListener('click', () => {
    toggleMobileMenu(false);
    openModal('modal-resume');
  });

  // Print Resume Handler
  document.getElementById('print-resume-btn')?.addEventListener('click', () => {
    window.print();
  });

  /* ==========================================================================
     9. Interactive Demo 1: E-Commerce Storefront Simulator
     ========================================================================== */
  const demoCartCount = document.getElementById('demo-cart-count');
  const demoCartItems = document.getElementById('demo-cart-items');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartDiscount = document.getElementById('cart-discount');
  const cartFinal = document.getElementById('cart-final');
  const couponInput = document.getElementById('coupon-code-input');
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  const clearCartBtn = document.getElementById('clear-demo-cart');
  const checkoutBtn = document.getElementById('simulate-checkout-btn');
  const checkoutMsg = document.getElementById('checkout-status-msg');

  function renderDemoCart() {
    if (!demoCartItems) return;
    demoCartItems.innerHTML = '';

    let sub = 0;
    let count = 0;

    state.cart.forEach(item => {
      sub += item.price * item.qty;
      count += item.qty;

      const li = document.createElement('li');
      li.className = 'cart-row-item';
      li.innerHTML = `
        <span>${item.qty}x ${item.name}</span>
        <span>$${(item.price * item.qty).toFixed(2)}</span>
      `;
      demoCartItems.appendChild(li);
    });

    if (state.cart.length === 0) {
      demoCartItems.innerHTML = '<li class="cart-row-item text-muted">Cart is currently empty.</li>';
    }

    if (demoCartCount) demoCartCount.textContent = count;

    const discountAmount = state.couponApplied ? sub * state.discountRate : 0;
    const finalAmount = Math.max(0, sub - discountAmount);

    if (cartSubtotal) cartSubtotal.textContent = `$${sub.toFixed(2)}`;
    if (cartDiscount) {
      cartDiscount.textContent = state.couponApplied ? `-$${discountAmount.toFixed(2)}` : '$0.00';
    }
    if (cartFinal) cartFinal.textContent = `$${finalAmount.toFixed(2)}`;
  }

  // Initial cart render
  renderDemoCart();

  // Add Item to cart buttons
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound(700, 'sine', 0.04);
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));

      const existing = state.cart.find(item => item.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.cart.push({ id, name, price, qty: 1 });
      }

      renderDemoCart();
      if (checkoutMsg) checkoutMsg.textContent = `+ Added ${name} to cart`;
    });
  });

  // Clear Cart
  clearCartBtn?.addEventListener('click', () => {
    playClickSound(400);
    state.cart = [];
    state.couponApplied = false;
    renderDemoCart();
    if (checkoutMsg) checkoutMsg.textContent = 'Cart cleared.';
  });

  // Apply Promo Coupon
  applyCouponBtn?.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    if (code === 'DEV2026') {
      playClickSound(880, 'triangle');
      state.couponApplied = true;
      renderDemoCart();
      if (checkoutMsg) checkoutMsg.textContent = '✓ Coupon DEV2026 applied (-20% discount)!';
      showToast('🎉 20% Discount Applied!', 'success');
    } else {
      playClickSound(300, 'sawtooth');
      state.couponApplied = false;
      renderDemoCart();
      if (checkoutMsg) checkoutMsg.textContent = 'Invalid promo code. Use DEV2026';
    }
  });

  // Simulate Checkout
  checkoutBtn?.addEventListener('click', () => {
    if (state.cart.length === 0) {
      if (checkoutMsg) checkoutMsg.textContent = '⚠️ Add items before checkout!';
      return;
    }
    playClickSound(950, 'triangle', 0.08);
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = '🔄 Processing Atomic Transaction...';

    setTimeout(() => {
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = '⚡ Execute Instant Mock Checkout';
      if (checkoutMsg) {
        checkoutMsg.innerHTML = '✅ <strong>Order #APX-9218 Confirmed!</strong> Inventory atomic decrement processed &amp; receipt signed.';
      }
      showToast('🛒 Checkout Simulated Successfully!', 'success');
      state.cart = [];
      renderDemoCart();
    }, 900);
  });

  /* ==========================================================================
     10. Interactive Demo 2: MedAlert 2-Minute Async Escalation Simulator
     ========================================================================== */
  const simCountdown = document.getElementById('sim-countdown');
  const simBar = document.getElementById('sim-bar');
  const patientStatusChip = document.getElementById('patient-status-chip');
  const waMessagesBody = document.getElementById('wa-messages-body');
  const simFastForwardBtn = document.getElementById('sim-fast-forward-btn');
  const simPatientAckBtn = document.getElementById('sim-patient-ack-btn');
  const simResetTimerBtn = document.getElementById('sim-reset-timer-btn');
  const medalertLiveTicker = document.getElementById('medalert-live-ticker');

  function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateMedAlertUI() {
    const formatted = formatTime(state.medalertTimerSecs);
    if (simCountdown) simCountdown.textContent = formatted;
    if (medalertLiveTicker) medalertLiveTicker.textContent = formatted;

    const percentage = (state.medalertTimerSecs / 120) * 100;
    if (simBar) simBar.style.width = `${Math.max(0, percentage)}%`;

    if (patientStatusChip) {
      patientStatusChip.textContent = state.medalertStatus;
      if (state.medalertStatus === 'ESCALATED TO CARETAKER') {
        patientStatusChip.style.background = 'var(--accent-red)';
        patientStatusChip.style.color = '#FFFFFF';
      } else if (state.medalertStatus === 'DOSE LOGGED') {
        patientStatusChip.style.background = 'var(--accent-green)';
        patientStatusChip.style.color = '#FFFFFF';
      } else {
        patientStatusChip.style.background = 'var(--accent-yellow)';
        patientStatusChip.style.color = '#161616';
      }
    }
  }

  function startMedAlertTimer() {
    if (state.medalertInterval) clearInterval(state.medalertInterval);

    state.medalertInterval = setInterval(() => {
      if (state.medalertTimerSecs > 0) {
        state.medalertTimerSecs -= 1;
        updateMedAlertUI();
      } else {
        clearInterval(state.medalertInterval);
        triggerCaretakerEscalation();
      }
    }, 1000);
  }

  function triggerCaretakerEscalation() {
    playClickSound(300, 'sawtooth', 0.2);
    state.medalertStatus = 'ESCALATED TO CARETAKER';
    updateMedAlertUI();

    if (waMessagesBody) {
      const msg = document.createElement('div');
      msg.className = 'wa-msg wa-escalate';
      msg.innerHTML = `
        <strong>🚨 URGENT CARETAKER ESCALATION:</strong><br>
        Patient Marcus Vance did not confirm Lisinopril 20mg within the 2-minute safety window (Timer Expiry: 00:00).<br>
        <span class="font-mono" style="font-size:0.7rem; color:#800;">Twilio Call Webhook triggered · Notifying Dr. Sarah</span>
        <span class="wa-time font-mono">08:02 AM · Webhook 200 OK</span>
      `;
      waMessagesBody.appendChild(msg);
      waMessagesBody.scrollTop = waMessagesBody.scrollHeight;
    }

    showToast('🚨 MedAlert: Escalated to Caretaker (2-min limit hit)', 'info');
  }

  // Fast Forward Button
  simFastForwardBtn?.addEventListener('click', () => {
    playClickSound(800);
    clearInterval(state.medalertInterval);
    state.medalertTimerSecs = 0;
    triggerCaretakerEscalation();
  });

  // Patient Confirmed Dose
  simPatientAckBtn?.addEventListener('click', () => {
    playClickSound(880, 'triangle');
    clearInterval(state.medalertInterval);
    state.medalertStatus = 'DOSE LOGGED';
    updateMedAlertUI();

    if (waMessagesBody) {
      const msg = document.createElement('div');
      msg.className = 'wa-msg wa-ack';
      msg.innerHTML = `
        <strong>✅ PATIENT ACKNOWLEDGED:</strong><br>
        "Marcus Vance replied 'TAKEN' via WhatsApp."<br>
        Timer canceled. Caretaker notified of on-time adherence.
        <span class="wa-time font-mono">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · Delivered</span>
      `;
      waMessagesBody.appendChild(msg);
      waMessagesBody.scrollTop = waMessagesBody.scrollHeight;
    }

    showToast('✅ Medication Intake Logged Successfully!', 'success');
  });

  // Reset Timer
  simResetTimerBtn?.addEventListener('click', () => {
    playClickSound(500);
    clearInterval(state.medalertInterval);
    state.medalertTimerSecs = 120;
    state.medalertStatus = 'MONITORING DOSE';
    updateMedAlertUI();
    startMedAlertTimer();
    showToast('🔄 Timer reset to 2 minutes', 'info');
  });

  /* ==========================================================================
     11. Interactive Demo 3: SocietyPool Dynamic Pricing & AI Copilot
     ========================================================================== */
  const poolSlider = document.getElementById('pool-slider');
  const sliderCountDisplay = document.getElementById('slider-count-display');
  const calcTierName = document.getElementById('calc-tier-name');
  const calcUnitPrice = document.getElementById('calc-unit-price');
  const calcSocietySavings = document.getElementById('calc-society-savings');
  const generateAiBroadcastBtn = document.getElementById('generate-ai-broadcast-btn');
  const aiBroadcastOutput = document.getElementById('ai-broadcast-output');
  const copyAiDraftBtn = document.getElementById('copy-ai-draft-btn');

  function calculateTier(orders) {
    if (orders >= 40) return { name: 'Tier 3 (Max -30% Off)', discount: 0.30 };
    if (orders >= 25) return { name: 'Tier 2 (-20% Off)', discount: 0.20 };
    if (orders >= 10) return { name: 'Tier 1 (-10% Off)', discount: 0.10 };
    return { name: 'Tier 0 (Base Price)', discount: 0.0 };
  }

  function updateSocietyPoolCalculation() {
    const orders = parseInt(poolSlider.value, 10);
    state.poolOrderCount = orders;
    if (sliderCountDisplay) sliderCountDisplay.textContent = `${orders} Crates`;

    const tier = calculateTier(orders);
    const unitPrice = Math.round(state.baseItemPrice * (1 - tier.discount));
    const totalSavings = (state.baseItemPrice - unitPrice) * orders;

    if (calcTierName) calcTierName.textContent = tier.name;
    if (calcUnitPrice) calcUnitPrice.textContent = `₹${unitPrice}`;
    if (calcSocietySavings) {
      calcSocietySavings.textContent = totalSavings > 0
        ? `₹${totalSavings.toLocaleString('en-IN')} saved collectively!`
        : `Pool 10+ crates to unlock savings!`;
    }
  }

  poolSlider?.addEventListener('input', () => {
    updateSocietyPoolCalculation();
  });
  updateSocietyPoolCalculation();

  // AI Broadcast Generator
  generateAiBroadcastBtn?.addEventListener('click', () => {
    playClickSound(920, 'triangle', 0.06);
    const orders = state.poolOrderCount;
    const tier = calculateTier(orders);
    const unitPrice = Math.round(state.baseItemPrice * (1 - tier.discount));
    const nextTierTarget = orders < 10 ? 10 : orders < 25 ? 25 : orders < 40 ? 40 : null;
    const needed = nextTierTarget ? nextTierTarget - orders : 0;

    generateAiBroadcastBtn.disabled = true;
    generateAiBroadcastBtn.innerHTML = '✨ AI Copilot Reasoning...';

    setTimeout(() => {
      generateAiBroadcastBtn.disabled = false;
      generateAiBroadcastBtn.innerHTML = '⚡ Generate Live WhatsApp Broadcast Draft';

      let message = '';
      if (needed > 0) {
        message = `🥭 *PALM GROVE SOCIETY POOL ALERT* 🥭\n\nHey neighbors! We are at *${orders} crates* of Alphonso Mangoes at *₹${unitPrice}/crate* (${tier.name}).\n\n🎯 *Only ${needed} more orders needed* to unlock the next discount tier!\n\n👉 Tap to join before 8 PM: society.pool/palm-grove/mangoes`;
      } else {
        message = `🎉 *MAXIMUM 30% DISCOUNT UNLOCKED!* 🎉\n\nWe hit *${orders} crates*! All residents get the ultra-wholesale price of *₹${unitPrice}/crate* (MRP ₹600).\n\n📦 Delivery arriving tomorrow 10:00 AM at Clubhouse Tower B.\n👉 Final confirmation code sent via WhatsApp bot.`;
      }

      if (aiBroadcastOutput) aiBroadcastOutput.textContent = message;
      if (copyAiDraftBtn) copyAiDraftBtn.disabled = false;
      showToast('✨ AI Copilot draft created!', 'success');
    }, 450);
  });

  // Copy AI Draft
  copyAiDraftBtn?.addEventListener('click', async () => {
    const text = aiBroadcastOutput.textContent;
    try {
      await navigator.clipboard.writeText(text);
      playClickSound(800);
      showToast('📋 Copied AI draft for WhatsApp!', 'success');
    } catch (e) {
      showToast('Ready to paste!', 'info');
    }
  });

  /* ==========================================================================
     12. Contact Form Interactive Validation & Transmission
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const contactName = document.getElementById('contact-name');
  const contactEmail = document.getElementById('contact-email');
  const contactMessage = document.getElementById('contact-message');
  const charCounter = document.getElementById('char-counter');
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');

  // Message character counter
  contactMessage?.addEventListener('input', () => {
    const len = contactMessage.value.length;
    if (charCounter) charCounter.textContent = `${len} / 500`;
  });

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errors
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';

    const nameVal = contactName?.value.trim();
    const emailVal = contactEmail?.value.trim();
    const msgVal = contactMessage?.value.trim();

    if (!nameVal) {
      if (nameError) nameError.textContent = 'Please provide your name';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      if (emailError) emailError.textContent = 'Please enter a valid email address';
      isValid = false;
    }

    if (!msgVal || msgVal.length < 10) {
      if (messageError) messageError.textContent = 'Please write at least 10 characters';
      isValid = false;
    }

    if (!isValid) {
      playClickSound(320, 'sawtooth');
      return;
    }

    // Option C: Direct Mailto Dispatch to goyalkartik208@gmail.com
    playClickSound(950, 'triangle', 0.08);
    contactSubmitBtn.disabled = true;
    contactSubmitBtn.innerHTML = `
      <span>Opening Email Client...</span>
    `;

    const contactScope = document.getElementById('contact-scope');
    const scopeLabel = contactScope ? contactScope.options[contactScope.selectedIndex].text : 'General Inquiry';

    const subject = encodeURIComponent(`[Portfolio Inquiry] ${scopeLabel} from ${nameVal}`);
    const emailBody = encodeURIComponent(
`Hi Kartik,

Name: ${nameVal}
Email: ${emailVal}
Project Scope: ${scopeLabel}

Message:
${msgVal}

--------------------------------------------------
Sent from Kartik Goyal Portfolio Contact Form`
    );

    const mailtoUrl = `mailto:goyalkartik208@gmail.com?subject=${subject}&body=${emailBody}`;

    setTimeout(() => {
      // Launch native email client with pre-filled content
      window.location.href = mailtoUrl;

      contactSubmitBtn.disabled = false;
      contactSubmitBtn.innerHTML = `
        <span>✓ Email Client Opened</span>
      `;
      showToast(`📧 Opening your email app to send message to goyalkartik208@gmail.com!`, 'success');
      contactForm.reset();
      if (charCounter) charCounter.textContent = `0 / 500`;

      setTimeout(() => {
        contactSubmitBtn.innerHTML = `
          <span>Transmit Message</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        `;
      }, 3500);
    }, 400);
  });

  /* ==========================================================================
     13. 3D / 2D Hanging ID Card Animation & Interactive Tilt Physics
     ========================================================================== */
  const idCardWrapper = document.getElementById('id-card-interactive-wrapper');
  const idBadgeCard = document.getElementById('id-badge-card');
  const idBadgeGlare = document.getElementById('id-badge-glare');

  if (idCardWrapper && idBadgeCard) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let dragRotate = 0;
    let animationFrameId = null;

    // 3D Tilt on Mouse Move
    function handleMouseMove(e) {
      if (isDragging) return;

      const rect = idBadgeCard.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Max rotation angles (degrees)
      const rotateX = (-y / (rect.height / 2)) * 14;
      const rotateY = (x / (rect.width / 2)) * 16;

      // Pause idle swing animation while inspecting
      idCardWrapper.style.animationPlayState = 'paused';

      // Apply 3D perspective tilt
      idBadgeCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;

      // Dynamic Holographic Glare Sheen
      if (idBadgeGlare) {
        const glareX = ((e.clientX - rect.left) / rect.width) * 100;
        const glareY = ((e.clientY - rect.top) / rect.height) * 100;
        idBadgeGlare.style.opacity = '1';
        idBadgeGlare.style.background = `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.06) 50%, transparent 80%)`;
      }
    }

    // Reset on Mouse Leave
    function handleMouseLeave() {
      if (isDragging) return;

      idBadgeCard.style.transform = '';
      if (idBadgeGlare) {
        idBadgeGlare.style.opacity = '0';
      }

      // Resume smooth pendulum sway
      idCardWrapper.style.animationPlayState = 'running';
    }

    idBadgeCard.addEventListener('mousemove', handleMouseMove);
    idBadgeCard.addEventListener('mouseleave', handleMouseLeave);

    // Interactive Drag / Tug on the Lanyard (Mouse & Touch)
    function onPointerDown(e) {
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      idCardWrapper.style.animationPlayState = 'paused';
      idCardWrapper.style.transition = 'none';
      playClickSound(850, 'sine', 0.03);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      currentX = clientX - startX;
      currentY = clientY - startY;

      // Damped translation & rotation for realistic tethering
      const dampX = currentX * 0.35;
      const dampY = Math.max(-10, currentY * 0.25);
      dragRotate = (currentX / 180) * 18;

      idCardWrapper.style.transform = `translate(${dampX}px, ${dampY}px) rotate(${dragRotate}deg)`;
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;

      // Spring release animation
      idCardWrapper.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.35)';
      idCardWrapper.style.transform = 'translate(0px, 0px) rotate(0deg)';
      playClickSound(550, 'triangle', 0.04);

      setTimeout(() => {
        idCardWrapper.style.transition = '';
        idCardWrapper.style.animationPlayState = 'running';
      }, 820);
    }

    idBadgeCard.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    idBadgeCard.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp, { passive: true });
  }

  /* ==========================================================================
     14. Scroll-Triggered Reveal Animations for All Blocks
     ========================================================================== */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const blockGroups = [
      // 1. Quick Stats Strip in Hero (staggered)
      { selector: '.hero-specs-strip', isScale: false, staggerChildren: '.spec-stat-item' },
      // 2. Section Headers
      { selector: '.section-header, .section-header-row', isScale: false },
      // 3. About Section: 3 Pillars (staggered cards with tactile scale)
      { selector: '.about-grid', isScale: true, staggerChildren: '.pillar-card' },
      // 4. Skills Section: 4 Arsenal Categories (staggered cards with tactile scale)
      { selector: '.skills-grid', isScale: true, staggerChildren: '.skill-category-card' },
      // 5. Experience Section: 3 Timeline Items (staggered)
      { selector: '.timeline-container', isScale: false, staggerChildren: '.timeline-item' },
      // 6. Work Section: 3 Featured Project Cards (impactful reveal)
      { selector: '.projects-list .project-card', isScale: true },
      // 7. Contact Section: Card, Channels, Form
      { selector: '.contact-card', isScale: false },
      { selector: '.contact-channels', isScale: false, staggerChildren: '.channel-card' },
      { selector: '.contact-form-col', isScale: false },
      // 8. Site Footer
      { selector: '.site-footer .footer-inner', isScale: false }
    ];

    const elementsToObserve = [];

    blockGroups.forEach(group => {
      if (group.staggerChildren) {
        const parents = document.querySelectorAll(group.selector);
        parents.forEach(parent => {
          const children = parent.querySelectorAll(group.staggerChildren);
          children.forEach((child, idx) => {
            child.classList.add(group.isScale ? 'scroll-reveal-scale' : 'scroll-reveal');
            child.classList.add(`stagger-${(idx % 4) + 1}`);
            if (!elementsToObserve.includes(child)) {
              elementsToObserve.push(child);
            }
          });
        });
      } else {
        const elements = document.querySelectorAll(group.selector);
        elements.forEach(el => {
          el.classList.add(group.isScale ? 'scroll-reveal-scale' : 'scroll-reveal');
          if (!elementsToObserve.includes(el)) {
            elementsToObserve.push(el);
          }
        });
      }
    });

    // Also pick up any elements manually given .scroll-reveal or .scroll-reveal-scale
    const manualElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-scale');
    manualElements.forEach(el => {
      if (!elementsToObserve.includes(el)) {
        elementsToObserve.push(el);
      }
    });

    if (elementsToObserve.length === 0) return;

    // Apply scroll reveal mode to html tag
    document.documentElement.classList.add('has-scroll-reveal');

    // Create IntersectionObserver
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          target.classList.add('is-revealed');

          const cleanup = () => {
            target.classList.add('reveal-done');
            target.removeEventListener('transitionend', cleanup);
          };
          target.addEventListener('transitionend', cleanup);

          // Fallback timer to guarantee reveal-done is set
          setTimeout(cleanup, 950);

          obs.unobserve(target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    // Check which blocks are already inside the viewport on initial load
    const windowHeight = window.innerHeight;
    elementsToObserve.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight * 0.95 && rect.bottom > 0) {
        // Element is already in view above the fold: reveal immediately with 0 delay
        el.classList.add('is-revealed', 'reveal-done');
      } else {
        observer.observe(el);
      }
    });
  }

  initScrollReveal();
});

