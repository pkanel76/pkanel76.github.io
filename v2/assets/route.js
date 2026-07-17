/* Route line — draws the red progress line down the left of the page
   and lights up section stops as you scroll. Standalone; nothing else
   from the v2 design is included. */
(function () {
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
