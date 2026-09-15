/* Scope Digest — light / dark theme. The viewer chooses; the choice is remembered.
   Loaded in <head> so the page paints in the right theme from the first frame. */
(function(){
  var root=document.documentElement, KEY='sd-theme', timer=null;
  function stored(){ try{ return localStorage.getItem(KEY); }catch(e){ return null; } }
  function system(){ return (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'; }
  function apply(t){ root.setAttribute('data-theme', t); }
  function label(b){
    var d = root.getAttribute('data-theme')==='dark';
    b.setAttribute('aria-label', d ? 'Switch to light theme' : 'Switch to dark theme');
    b.setAttribute('title', d ? 'Light theme' : 'Dark theme');
    b.setAttribute('aria-pressed', d ? 'true' : 'false');
  }
  function labels(){ var bs=document.querySelectorAll('[data-theme-toggle]'); for(var i=0;i<bs.length;i++) label(bs[i]); }
  var t=stored(); if(t!=='dark' && t!=='light') t=system();
  apply(t);
  window.sdTheme={
    get:function(){ return root.getAttribute('data-theme')||'light'; },
    set:function(t){
      root.classList.add('theming'); clearTimeout(timer);
      timer=setTimeout(function(){ root.classList.remove('theming'); }, 560);
      apply(t); try{ localStorage.setItem(KEY,t); }catch(e){}
      labels();
    },
    toggle:function(){ this.set(this.get()==='dark' ? 'light' : 'dark'); }
  };
  function wire(){
    var bs=document.querySelectorAll('[data-theme-toggle]');
    for(var i=0;i<bs.length;i++){ label(bs[i]); bs[i].addEventListener('click', function(){ window.sdTheme.toggle(); }); }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', wire); else wire();
  if(window.matchMedia){
    var mq=matchMedia('(prefers-color-scheme: dark)');
    var onchange=function(){ if(!stored()){ apply(system()); labels(); } };
    if(mq.addEventListener) mq.addEventListener('change', onchange); else if(mq.addListener) mq.addListener(onchange);
  }
})();
