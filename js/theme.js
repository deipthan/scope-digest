/* Scope Digest — colour theme: green (the signature), white, or black.
   The viewer chooses from the header; the choice is remembered. Loaded in <head>
   so the page paints in the right theme from the first frame. */
(function(){
  var root=document.documentElement, KEY='sd-theme', THEMES=['green','white','black'], timer=null;
  function stored(){
    try{ var v=localStorage.getItem(KEY); if(v==='light') v='green'; if(v==='dark') v='black';
         return THEMES.indexOf(v)>=0 ? v : null; }catch(e){ return null; }
  }
  function apply(t){ root.setAttribute('data-theme', t); }
  function mark(){
    var t=root.getAttribute('data-theme'), bs=document.querySelectorAll('[data-theme-set]');
    for(var i=0;i<bs.length;i++) bs[i].setAttribute('aria-pressed', bs[i].getAttribute('data-theme-set')===t ? 'true' : 'false');
  }
  apply(stored()||'green');
  window.sdTheme={
    themes:THEMES,
    get:function(){ return root.getAttribute('data-theme')||'green'; },
    set:function(t){
      if(THEMES.indexOf(t)<0 || t===this.get()) return;
      root.classList.add('theming'); clearTimeout(timer);
      timer=setTimeout(function(){ root.classList.remove('theming'); }, 560);
      apply(t); try{ localStorage.setItem(KEY,t); }catch(e){}
      mark();
      try{ window.dispatchEvent(new CustomEvent('sd-theme',{detail:{theme:t}})); }catch(e){}
    },
    next:function(){ var i=THEMES.indexOf(this.get()); this.set(THEMES[(i+1)%THEMES.length]); }
  };
  function wire(){
    mark();
    document.addEventListener('click', function(e){
      var b=e.target && e.target.closest ? e.target.closest('[data-theme-set]') : null;
      if(b) window.sdTheme.set(b.getAttribute('data-theme-set'));
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();
