// 테마 바꾸기, 점 내비게이션, 나타나기만 한다. 고른 테마는 이 브라우저에만 남긴다.
(function () {
  var root = document.documentElement, KEY = 'portfolio-theme';
  root.classList.add('js');
  try { var saved = localStorage.getItem(KEY); if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved); } catch (e) {}
  function label(button) { button.textContent = root.getAttribute('data-theme') === 'light' ? '어둡게' : '밝게'; }
  function all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  document.addEventListener('DOMContentLoaded', function () {
    try {
      var button = document.querySelector('[data-theme-toggle]');
      if (button) {
        button.hidden = false;
        label(button);
        button.addEventListener('click', function () {
          var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
          root.setAttribute('data-theme', next);
          try { localStorage.setItem(KEY, next); } catch (e) {}
          label(button);
        });
      }
      var hasIO = 'IntersectionObserver' in window;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var items = all('.reveal');
      function show(el) { el.classList.add('is-visible'); }
      if (!hasIO || reduce) items.forEach(show);
      else {
        var seen = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); seen.unobserve(e.target); } });
        }, { rootMargin: '0px 0px -6% 0px' });
        items.forEach(function (el) { seen.observe(el); });
      }
      // 쪽 안 링크(#...)는 주소를 바꾸지 않고 여기서 직접 처리한다.
      // 2026-11-20 사용자: "자세히 보기 했을 때 아무것도 안 보인다". 앱의 미리보기 창처럼 # 이동이 다른 주소로 풀리거나 막히는 곳에서는
      // :target이 걸리지 않아 빈 화면이 됐다. 그래서 상세 화면은 클래스(is-open)로 열고 닫고, 부분 이동은 scrollIntoView로 한다.
      // JS가 없을 때는 CSS의 :target이 그대로 동작한다.
      var openDetail = null;
      var closeDetail = function () {
        if (openDetail) openDetail.classList.remove('is-open');
        openDetail = null;
        root.classList.remove('detail-open');
      };
      var showDetail = function (el) {
        if (openDetail && openDetail !== el) openDetail.classList.remove('is-open');
        el.classList.add('is-open');
        el.scrollTop = 0;
        root.classList.add('detail-open');
        openDetail = el;
        var back = el.querySelector('.detail-back a');
        if (back) { try { back.focus({ preventScroll: true }); } catch (e) {} }
      };
      var jump = function (target, smooth) {
        try { target.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' }); }
        catch (e) { target.scrollIntoView(true); }
      };
      document.addEventListener('click', function (ev) {
        var a = ev.target && ev.target.closest ? ev.target.closest('a[href^="#"]') : null;
        if (!a) return;
        var id = '';
        try { id = decodeURIComponent(a.getAttribute('href').slice(1)); } catch (e) { return; }
        var target = id ? document.getElementById(id) : null;
        if (!target) return;
        ev.preventDefault();
        if (id.indexOf('detail-') === 0) { showDetail(target); return; }
        var wasOpen = Boolean(openDetail);
        if (wasOpen) closeDetail();
        jump(target, !wasOpen);
      });
      var initial = '';
      try { initial = decodeURIComponent(location.hash.slice(1)); } catch (e) {}
      if (initial.indexOf('detail-') === 0) { var first = document.getElementById(initial); if (first) showDetail(first); }
      document.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' && openDetail) {
          var block = document.getElementById('project-' + openDetail.id.slice('detail-'.length));
          closeDetail();
          if (block) jump(block, false);
        }
      });
      var links = all('[data-section-link]');
      if (hasIO && links.length) {
        var setActive = function (id) {
          links.forEach(function (a) {
            if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
          });
        };
        var spy = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
        }, { rootMargin: '-45% 0px -50% 0px' });
        links.forEach(function (a) {
          var target = document.getElementById(a.getAttribute('href').slice(1));
          if (target) spy.observe(target);
        });
      }
    } catch (e) {
      root.classList.remove('js');
    }
  });
})();
