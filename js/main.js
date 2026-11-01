/* ===================================================================
 * Hudson 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function (html) {
  "use strict";

  /* preloader
   * -------------------------------------------------- */
  const ssPreloader = function () {
    const siteBody = document.querySelector("body");
    const preloader = document.querySelector("#preloader");
    if (!preloader) return;

    html.classList.add("ss-preload");

    window.addEventListener("load", function () {
      html.classList.remove("ss-preload");
      html.classList.add("ss-loaded");

      preloader.addEventListener("transitionend", function afterTransition(e) {
        if (e.target.matches("#preloader")) {
          siteBody.classList.add("ss-show");
          e.target.style.display = "none";
          preloader.removeEventListener(e.type, afterTransition);
        }
      });
    });
  }; // end ssPreloader

  /* move header
   * -------------------------------------------------- */
  const ssMoveHeader = function () {
    const hdr = document.querySelector(".s-header");
    const hero = document.querySelector("#intro");
    let triggerHeight;

    if (!(hdr && hero)) return;

    setTimeout(function () {
      triggerHeight = hero.offsetHeight - 350;
    }, 300);

    window.addEventListener("scroll", function () {
      let loc = window.scrollY;

      if (loc > triggerHeight) {
        hdr.classList.add("sticky");
      } else {
        hdr.classList.remove("sticky");
      }

      if (loc > triggerHeight + 20) {
        hdr.classList.add("offset");
      } else {
        hdr.classList.remove("offset");
      }

      if (loc > triggerHeight + 150) {
        hdr.classList.add("scrolling");
      } else {
        hdr.classList.remove("scrolling");
      }
    });
  }; // end ssMoveHeader

  /* mobile menu
   * ---------------------------------------------------- */
  const ssMobileMenu = function () {
    const toggleButton = document.querySelector(".s-header__menu-toggle");
    const mainNavWrap = document.querySelector(".s-header__nav");
    const siteBody = document.querySelector("body");

    if (!(toggleButton && mainNavWrap)) return;

    const submenuToggles = mainNavWrap.querySelectorAll(
      ".s-header__submenu-toggle",
    );
    let closeTransitionHandler;

    const setMenuOpen = function (isOpen, animateClose) {
      if (closeTransitionHandler) {
        mainNavWrap.removeEventListener(
          "transitionend",
          closeTransitionHandler,
        );
        closeTransitionHandler = null;
      }

      if (isOpen) {
        siteBody.classList.remove("menu-is-closing");
      } else if (animateClose && siteBody.classList.contains("menu-is-open")) {
        siteBody.classList.add("menu-is-closing");
        closeTransitionHandler = function (event) {
          if (
            event.target !== mainNavWrap ||
            event.propertyName !== "transform"
          )
            return;

          siteBody.classList.remove("menu-is-closing");
          mainNavWrap.removeEventListener(
            "transitionend",
            closeTransitionHandler,
          );
          closeTransitionHandler = null;
        };
        mainNavWrap.addEventListener("transitionend", closeTransitionHandler);
      } else {
        siteBody.classList.remove("menu-is-closing");
      }

      siteBody.classList.toggle("menu-is-open", isOpen);
      toggleButton.classList.toggle("is-clicked", isOpen);
      toggleButton.setAttribute("aria-expanded", String(isOpen));
      toggleButton.setAttribute(
        "aria-label",
        isOpen ? "Закрыть меню" : "Открыть меню",
      );
      if (!isOpen) closeSubmenus();
    };

    const closeSubmenus = function () {
      submenuToggles.forEach(function (button) {
        button.setAttribute("aria-expanded", "false");
        button.closest(".s-header__menu-item").classList.remove("is-open");
      });
    };

    submenuToggles.forEach(function (button) {
      button.addEventListener("click", function () {
        const menuItem = button.closest(".s-header__menu-item");
        const isOpen = button.getAttribute("aria-expanded") === "true";

        closeSubmenus();
        if (!isOpen) {
          button.setAttribute("aria-expanded", "true");
          menuItem.classList.add("is-open");
        }
      });
    });

    toggleButton.addEventListener("click", function (e) {
      e.preventDefault();
      setMenuOpen(
        !siteBody.classList.contains("menu-is-open"),
        siteBody.classList.contains("menu-is-open"),
      );
    });

    mainNavWrap.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (
          window.matchMedia("(max-width: 992px)").matches &&
          siteBody.classList.contains("menu-is-open")
        ) {
          setMenuOpen(false, true);
        }
      });
    });

    mainNavWrap.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;

      const openToggle = mainNavWrap.querySelector(
        '.s-header__submenu-toggle[aria-expanded="true"]',
      );
      if (openToggle) {
        closeSubmenus();
        openToggle.focus();
        return;
      }

      if (siteBody.classList.contains("menu-is-open")) {
        setMenuOpen(false, true);
        toggleButton.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!mainNavWrap.contains(event.target)) closeSubmenus();
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 993px)").matches)
        setMenuOpen(false, false);
    });
  }; // end ssMobileMenu

  /* highlight active menu link on pagescroll
   * ------------------------------------------------------ */
  const ssScrollSpy = function () {
    const mainNav = document.querySelector(".s-header__nav");
    if (!mainNav) return;

    const sections = document.querySelectorAll(".target-section");
    if (!sections.length) return;

    // Add an event listener listening for scroll
    window.addEventListener("scroll", navHighlight);

    function navHighlight() {
      // Get current scroll position
      let scrollY = window.pageYOffset;

      // Loop through sections to get height(including padding and border),
      // top and ID values for each
      sections.forEach(function (current) {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute("id");

        /* If our current scroll position enters the space where current section
         * on screen is, add .current class to parent element(li) of the thecorresponding
         * navigation link, else remove it. To know which link is active, we use
         * sectionId variable we are getting while looping through sections as
         * an selector
         */
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          const navLink = mainNav.querySelector('a[href*="' + sectionId + '"]');
          if (navLink) navLink.parentNode.classList.add("current");
        } else {
          const navLink = mainNav.querySelector('a[href*="' + sectionId + '"]');
          if (navLink) navLink.parentNode.classList.remove("current");
        }
      });
    }
  }; // end ssScrollSpy

  /* swiper
   * ------------------------------------------------------ */
  const ssSwiper = function () {
    const videoSlider = document.querySelector(".video-reviews__slider");

    if (videoSlider) {
      const videoControls = videoSlider.closest(".video-reviews");
      const wrapper = videoSlider.querySelector(".swiper-wrapper");
      const groupedSlides = Array.from(wrapper.children);
      const groupedContent = groupedSlides.map(function (slide) {
        const grid = slide.querySelector(".video-review-grid");
        const stack = grid.querySelector(".video-review-grid__stack");

        return {
          slide: slide,
          grid: grid,
          featured: grid.querySelector(".video-review-card--featured"),
          stack: stack,
          stackedCards: Array.from(
            stack.querySelectorAll(".video-review-card"),
          ),
        };
      });
      const mobileQuery = window.matchMedia("(max-width: 576px)");
      let isMobileLayout;
      let videoSwiper;

      const setMobileSlides = function (isMobile) {
        if (isMobile === isMobileLayout) return;

        if (videoSwiper) videoSwiper.destroy(true, true);

        if (isMobile) {
          const individualSlides = [];

          groupedContent.forEach(function (group) {
            [group.featured]
              .concat(group.stackedCards)
              .forEach(function (card) {
                const slide = document.createElement("div");
                slide.className = "swiper-slide";
                slide.appendChild(card);
                individualSlides.push(slide);
              });
          });

          wrapper.replaceChildren(...individualSlides);
        } else {
          groupedContent.forEach(function (group) {
            group.stack.replaceChildren(...group.stackedCards);
            group.grid.replaceChildren(group.featured, group.stack);
            group.slide.replaceChildren(group.grid);
          });

          wrapper.replaceChildren(...groupedSlides);
        }

        isMobileLayout = isMobile;
        videoSwiper = new Swiper(videoSlider, {
          loop: true,
          slidesPerView: 1,
          speed: 650,
          navigation: {
            nextEl: videoControls.querySelector(".video-reviews__next"),
            prevEl: videoControls.querySelector(".video-reviews__prev"),
          },
          pagination: {
            el: videoControls.querySelector(".video-reviews__pagination"),
            clickable: true,
          },
        });
      };

      setMobileSlides(mobileQuery.matches);
      mobileQuery.addEventListener("change", function (event) {
        setMobileSlides(event.matches);
      });
    }

    const writtenSlider = document.querySelector(".written-reviews__slider");

    if (writtenSlider) {
      const writtenControls = writtenSlider.closest(
        ".written-reviews__carousel",
      );

      new Swiper(writtenSlider, {
        loop: true,
        slidesPerView: "auto",
        slidesPerGroup: 1,
        spaceBetween: 18,
        speed: 550,
        navigation: {
          nextEl: writtenControls.querySelector(".written-reviews__next"),
          prevEl: writtenControls.querySelector(".written-reviews__prev"),
        },
        pagination: {
          el: writtenControls.querySelector(".written-reviews__pagination"),
          clickable: true,
        },
      });
    }
  }; // end ssSwiper

  /* video review controls
   * ------------------------------------------------------ */
  const ssVideoReviewControls = function () {
    const cards = document.querySelectorAll(".video-review-card");

    const formatTime = function (seconds) {
      if (!Number.isFinite(seconds)) return "0:00";

      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");

      return minutes + ":" + remainingSeconds;
    };

    cards.forEach(function (card) {
      const video = card.querySelector("video");
      if (!video) return;

      video.removeAttribute("controls");
      video.tabIndex = 0;

      const centerPlay = document.createElement("button");
      centerPlay.className = "video-review-card__play";
      centerPlay.type = "button";
      centerPlay.setAttribute("aria-label", "Воспроизвести видео");
      centerPlay.innerHTML =
        '<i class="bi bi-play-fill" aria-hidden="true"></i>';

      const controls = document.createElement("div");
      controls.className = "video-review-card__controls";
      controls.hidden = true;

      const togglePlay = document.createElement("button");
      togglePlay.className = "video-review-card__toggle";
      togglePlay.type = "button";
      togglePlay.setAttribute("aria-label", "Воспроизвести видео");

      const playIcon = document.createElement("i");
      playIcon.className = "bi bi-play-fill";
      playIcon.setAttribute("aria-hidden", "true");
      togglePlay.append(playIcon);

      const timeline = document.createElement("input");
      timeline.className = "video-review-card__timeline";
      timeline.type = "range";
      timeline.min = "0";
      timeline.max = "1000";
      timeline.value = "0";
      timeline.setAttribute("aria-label", "Позиция видео");
      timeline.setAttribute("aria-valuetext", "0:00 из 0:00");

      const time = document.createElement("span");
      time.className = "video-review-card__time";
      time.textContent = "0:00 / 0:00";

      const fullscreenClose = document.createElement("button");
      fullscreenClose.className = "video-review-card__fullscreen-close";
      fullscreenClose.type = "button";
      fullscreenClose.hidden = true;
      fullscreenClose.setAttribute("aria-label", "Закрыть полноэкранное видео");
      fullscreenClose.innerHTML =
        '<i class="bi bi-x-lg" aria-hidden="true"></i>';

      controls.append(togglePlay, timeline, time);
      card.append(centerPlay, controls, fullscreenClose);

      let hasStarted = false;

      const requestCardFullscreen = function () {
        if (document.fullscreenElement === card) return;

        if (card.requestFullscreen) {
          const fullscreenRequest = card.requestFullscreen();
          if (fullscreenRequest) fullscreenRequest.catch(function () {});
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      };

      const updateTimeline = function () {
        const duration = video.duration;
        const currentTime = video.currentTime;
        const progress =
          Number.isFinite(duration) && duration > 0
            ? (currentTime / duration) * 100
            : 0;

        timeline.value = String(Math.round(progress * 10));
        timeline.style.setProperty("--video-progress", progress + "%");
        timeline.setAttribute(
          "aria-valuetext",
          formatTime(currentTime) + " из " + formatTime(duration),
        );
        time.textContent =
          formatTime(currentTime) + " / " + formatTime(duration);
      };

      const updatePlayState = function () {
        const isPlaying = !video.paused && !video.ended;
        const label = isPlaying
          ? "Поставить видео на паузу"
          : "Воспроизвести видео";

        centerPlay.hidden = isPlaying;
        centerPlay.setAttribute("aria-label", label);
        togglePlay.setAttribute("aria-label", label);
        playIcon.className = isPlaying ? "bi bi-pause-fill" : "bi bi-play-fill";

        if (hasStarted) controls.hidden = false;
      };

      const togglePlayback = function () {
        if (video.paused || video.ended) {
          requestCardFullscreen();
          const playback = video.play();
          if (playback) playback.catch(function () {});
        } else {
          video.pause();
        }
      };

      centerPlay.addEventListener("click", togglePlayback);
      togglePlay.addEventListener("click", togglePlayback);
      video.addEventListener("click", togglePlayback);
      fullscreenClose.addEventListener("click", function () {
        video.pause();

        if (document.fullscreenElement === card) {
          document.exitFullscreen().catch(function () {});
        } else if (video.webkitExitFullscreen) {
          video.webkitExitFullscreen();
        }
      });

      const syncFullscreenState = function () {
        const isFullscreen = document.fullscreenElement === card;
        card.classList.toggle("is-fullscreen", isFullscreen);
        fullscreenClose.hidden = !isFullscreen;

        if (!isFullscreen && hasStarted && !video.paused) video.pause();
      };

      document.addEventListener("fullscreenchange", syncFullscreenState);
      video.addEventListener("webkitendfullscreen", function () {
        if (hasStarted && !video.paused) video.pause();
      });
      video.addEventListener("play", function () {
        hasStarted = true;
        controls.hidden = false;
        updatePlayState();
      });
      video.addEventListener("pause", updatePlayState);
      video.addEventListener("ended", updatePlayState);
      video.addEventListener("loadedmetadata", updateTimeline);
      video.addEventListener("timeupdate", updateTimeline);
      video.addEventListener("keydown", function (event) {
        if (event.key !== " " && event.key !== "Enter") return;
        event.preventDefault();
        togglePlayback();
      });
      timeline.addEventListener("input", function () {
        if (!Number.isFinite(video.duration)) return;
        video.currentTime = (Number(timeline.value) / 1000) * video.duration;
      });
    });
  }; // end ssVideoReviewControls

  /* Back to Top
   * ------------------------------------------------------ */
  const ssBackToTop = function () {
    const goTopButton = document.querySelector(".ss-go-top");
    const aboutSection = document.querySelector("#about");
    const aboutDiv = document.querySelector(".course-layout");

    if (!(goTopButton && (aboutSection || aboutDiv))) return;

    const updateVisibility = function () {
      let isVisible = false;

      if (aboutDiv) {
        const aboutTop = aboutDiv.getBoundingClientRect().top + window.scrollY;
        isVisible = window.scrollY >= aboutTop;
      } else if (aboutSection) {
        const aboutBottom =
          aboutSection.getBoundingClientRect().bottom + window.scrollY;
        isVisible = window.scrollY >= aboutBottom;
      }

      goTopButton.classList.toggle("link-is-visible", isVisible);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
  }; // end ssBackToTop

  /* program format filters
   * ------------------------------------------------------ */
  const ssProgramFilters = function () {
    const section = document.querySelector("#works");
    if (!section) return;

    const filters = section.querySelectorAll(".programs-filter");
    const cards = section.querySelectorAll(".program-card");
    const grid = section.querySelector(".programs-grid");

    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        const selectedFormat = button.dataset.filter;
        grid.classList.toggle("is-filtered", selectedFormat !== "all");

        filters.forEach(function (filter) {
          const isActive = filter === button;
          filter.classList.toggle("is-active", isActive);
          filter.setAttribute("aria-pressed", String(isActive));
        });

        cards.forEach(function (card) {
          card.hidden =
            selectedFormat !== "all" && card.dataset.format !== selectedFormat;
        });
      });
    });

    const filterLinks = document.querySelectorAll("[data-program-filter]");

    filterLinks.forEach(function (link) {
      const filterButton = section.querySelector(
        `.programs-filter[data-filter="${link.dataset.programFilter}"]`,
      );

      if (filterButton) {
        link.addEventListener("click", function () {
          filterButton.click();
        });
      }
    });
  }; // end ssProgramFilters

  /* smoothscroll
   * ------------------------------------------------------ */
  const ssMoveTo = function () {
    const easeFunctions = {
      easeInQuad: function (t, b, c, d) {
        t /= d;
        return c * t * t + b;
      },
      easeOutQuad: function (t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
      },
      easeInOutQuad: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      },
      easeInOutCubic: function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t * t + b;
        t -= 2;
        return (c / 2) * (t * t * t + 2) + b;
      },
    };

    const triggers = document.querySelectorAll(".smoothscroll");

    const moveTo = new MoveTo(
      {
        tolerance: 0,
        duration: 1200,
        easing: "easeInOutCubic",
        container: window,
      },
      easeFunctions,
    );

    triggers.forEach(function (trigger) {
      moveTo.registerTrigger(trigger);
    });
  }; // end ssMoveTo

  /* Initialize
   * ------------------------------------------------------ */
  (function ssInit() {
    // Функция прелоадера запускается на всех страницах
    ssPreloader();

    // Остальные функции запускаются только не на странице 404
    if (!document.body.classList.contains("error404")) {
      ssMoveHeader();
      ssMobileMenu();
      ssScrollSpy();
      ssSwiper();
      ssVideoReviewControls();
      ssBackToTop();
      ssProgramFilters();
      ssMoveTo();
    }
  })();
})(document.documentElement);
