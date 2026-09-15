/* Scope Digest — motion for the module pages: reveals, the depth rail that draws
   itself as you read, a reading-depth readout in the header, and prefetch of the
   next page on hover. Content is never hidden unless GSAP is present and motion
   is allowed. */
(function(){
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* reading depth: a line under the header and a "D nn cm" readout */
  var head = document.querySelector(".site-head");
  if(head){
    var bar = document.createElement("div"); bar.className = "readbar"; bar.innerHTML = "<i></i>"; head.appendChild(bar);
    var wrap = head.querySelector(".wrap"), nav = head.querySelector(".site-nav");
    var depth = document.createElement("span"); depth.className = "depth"; depth.setAttribute("aria-hidden", "true");
    depth.innerHTML = "D&nbsp;<b>0</b>&nbsp;cm";
    if(wrap && nav) wrap.insertBefore(depth, nav);
    var fill = bar.firstChild, num = depth.querySelector("b"), ticking = false;
    var update = function(){
      ticking = false;
      var max = root.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      fill.style.transform = "scaleX(" + p.toFixed(4) + ")";
      num.textContent = Math.round(p * 95);
    };
    window.addEventListener("scroll", function(){ if(!ticking){ ticking = true; requestAnimationFrame(update); } }, {passive:true});
    window.addEventListener("resize", update); update();
  }

  /* prefetch the page under the pointer so the next click is instant */
(function(){
  var seen = {};
  document.addEventListener("pointerover", function(e){
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null; if(!a) return;
    var href = a.getAttribute("href") || "";
    if(!/^[\w-]+\.html(#.*)?$/.test(href)) return;
    var file = href.split("#")[0]; if(seen[file]) return; seen[file] = 1;
    var l = document.createElement("link"); l.rel = "prefetch"; l.href = file; l.as = "document"; document.head.appendChild(l);
  }, {passive:true});
})();

  if(reduce || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  root.classList.add("has-motion");

  /* reveals — each block rises into place the first time it enters the viewport */
  var SEL = ".topic-head > .wrap > *, .bottomline, .redflag, .steps .step, .pearls, .trials, .refs, .calc, .pager .pg";
  var els = gsap.utils.toArray(SEL);
  els.forEach(function(el, i){
    el.classList.add("m-reveal");
    var inHead = !!el.closest(".topic-head");
    gsap.from(el, {opacity:0, y:22, duration:.75, ease:"power3.out", delay: inHead ? i * .07 : 0,
      scrollTrigger:{trigger:el, start:"top 90%", once:true, onEnter:function(){ el.classList.add("on"); }}});
  });

  /* the depth rail draws itself as you read down the steps */
  gsap.utils.toArray(".steps").forEach(function(rail){
    gsap.to(rail, {"--rail":1, ease:"none", scrollTrigger:{trigger:rail, start:"top 72%", end:"bottom 72%", scrub:.6}});
  });

  window.addEventListener("beforeprint", function(){ gsap.set(els, {clearProps:"opacity,transform"}); });
})();
