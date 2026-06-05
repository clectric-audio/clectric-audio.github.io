/* ============================================================
   Current reveal page — page behavior
   Pack data, scroll reveals, sticky-nav state, footer year.
   ============================================================ */
(function () {
  "use strict";

  // ---- custom always-visible scrollbar for carousels --------
  function setupCarouselBar(carousel) {
    if (!carousel) return;
    var bar = document.createElement("div");
    bar.className = "carousel-bar";
    var thumb = document.createElement("div");
    thumb.className = "carousel-bar__thumb";
    bar.appendChild(thumb);
    carousel.insertAdjacentElement("afterend", bar);

    function update() {
      var ratio = carousel.clientWidth / carousel.scrollWidth;
      if (ratio >= 1) { bar.style.display = "none"; return; }
      bar.style.display = "";
      var maxScroll = carousel.scrollWidth - carousel.clientWidth;
      var p = maxScroll > 0 ? carousel.scrollLeft / maxScroll : 0;
      thumb.style.width = (ratio * 100) + "%";
      thumb.style.left = (p * (100 - ratio * 100)) + "%";
    }

    carousel.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // drag the thumb to scroll
    var dragging = false, startX = 0, startScroll = 0;
    thumb.addEventListener("pointerdown", function (e) {
      dragging = true; startX = e.clientX; startScroll = carousel.scrollLeft;
      thumb.setPointerCapture(e.pointerId); e.preventDefault();
    });
    thumb.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      carousel.scrollLeft = startScroll + (dx / bar.clientWidth) * carousel.scrollWidth;
    });
    thumb.addEventListener("pointerup", function () { dragging = false; });

    // click the track to jump
    bar.addEventListener("pointerdown", function (e) {
      if (e.target === thumb) return;
      var rect = bar.getBoundingClientRect();
      var clickP = (e.clientX - rect.left) / rect.width;
      carousel.scrollTo({ left: clickP * carousel.scrollWidth - carousel.clientWidth / 2, behavior: "smooth" });
    });

    update();
  }
  setupCarouselBar(document.querySelector(".why__grid"));
  setupCarouselBar(document.querySelector(".audience__list"));

  // ---- scroll reveal ----------------------------------------
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("is-in"); });
  }

  // ---- sticky nav border on scroll --------------------------
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---- footer year ------------------------------------------
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
})();
