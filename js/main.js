/* ====================================================
   MAIN.JS — AOS, sticky header, countup, smooth scroll, burger
   ==================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* === 1. AOS — анимации прокрутки === */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 620,
      once: true,
      offset: 60,
      easing: 'ease-out-cubic'
    });
  }

  /* === 2. Lucide Icons === */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* === 3. Sticky header === */
  var header = document.querySelector('.site-header');
  if (header) {
    function onScroll() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* === 4. Burger меню === */
  var burger = document.querySelector('.burger');
  var mobileNav = document.querySelector('.mobile-nav');

  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* === 5. Smooth scroll для якорных ссылок === */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* === 6. CountUp + последовательная анимация статистики === */
  function countUp(el, target, duration, cb) {
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (cb) {
        cb();
      }
    }
    requestAnimationFrame(step);
  }

  var statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    var statItems = Array.from(statsBar.querySelectorAll('.stat-item'));

    var statsBarObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !statsBar.dataset.animated) {
          statsBar.dataset.animated = 'true';

          function activateStat(index) {
            if (index >= statItems.length) return;
            var item = statItems[index];
            item.classList.add('stat-active');
            var numEl = item.querySelector('.stat-number[data-target]');
            if (numEl) {
              countUp(numEl, parseInt(numEl.dataset.target, 10), 700, function () {
                setTimeout(function () { activateStat(index + 1); }, 180);
              });
            } else {
              setTimeout(function () { activateStat(index + 1); }, 880);
            }
          }

          activateStat(0);
        }
      });
    }, { threshold: 0.4 });

    statsBarObserver.observe(statsBar);
  }

  /* === 7. Typewriter для hero-subtitle === */
  var twEl = document.getElementById('hero-typewriter');
  if (twEl) {
    var twNormal = twEl.querySelector('.tw-normal');
    var twBold   = twEl.querySelector('.tw-bold');
    var twCursor = twEl.querySelector('.tw-cursor');
    var part1 = 'АНО «Прометей Консалтинг» развивает потенциал уязвимых групп через системный подход — активизацию и эмпауэрмент. ';
    var part2 = 'Мы не решаем проблемы за вас. Мы помогаем вам решать их самостоятельно.';
    var delay = 900; // пауза перед стартом

    function typeChars(target, text, i, cb) {
      if (i <= text.length) {
        target.textContent = text.slice(0, i);
        setTimeout(function () { typeChars(target, text, i + 1, cb); }, 28);
      } else if (cb) {
        cb();
      }
    }

    setTimeout(function () {
      typeChars(twNormal, part1, 0, function () {
        typeChars(twBold, part2, 0, function () {
          setTimeout(function () { twCursor.style.display = 'none'; }, 1800);
        });
      });
    }, delay);
  }

  /* === 8. Активный пункт навигации === */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.header-nav a[href^="#"]');

  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(function (section) {
    navObserver.observe(section);
  });

});
