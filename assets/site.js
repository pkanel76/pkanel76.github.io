/* P. Kanellopoulos — site motion
   1. Marks <html> with .js so CSS knows scripting is available
      (without JS, everything stays fully visible).
   2. Scroll-reveals elements tagged .reveal
   3. Draws the route line + lights up section nodes as you scroll */
(function () {
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- route line ---- */
  var main = document.querySelector('main.route');
  if (!main) return;
  var bar = main.querySelector('.route-progress');
  var stops = Array.prototype.slice.call(main.querySelectorAll('.section'));
  var ticking = false;

  function update() {
    ticking = false;
    var rect = main.getBoundingClientRect();
    var mid = window.innerHeight * 0.55;
    if (bar) {
      var passed = Math.min(Math.max(mid - rect.top - 8, 0), rect.height - 16);
      bar.style.height = passed + 'px';
    }
    stops.forEach(function (s) {
      s.classList.toggle('lit', s.getBoundingClientRect().top < mid);
    });
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
