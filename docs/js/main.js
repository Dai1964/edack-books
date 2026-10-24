// A little JavaScript for EDACK Books.
// The page works without it. This only adds the gentle fade-ins
// and closes the phone menu after you tap a link.

// Tell the styles that JavaScript is on, so the fade-ins can start hidden.
document.documentElement.classList.add('js');

// Close the phone menu when a link inside it is tapped.
const nav = document.getElementById('site-nav');

if (nav && typeof nav.hidePopover === 'function') {
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a') && nav.matches(':popover-open')) {
      nav.hidePopover();
    }
  });
}

// Fade cards in as they scroll into view, once each.
const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  // Very old browsers: just show everything straight away.
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
