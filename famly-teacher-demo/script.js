(function () {
  "use strict";

  const desktopImg = document.getElementById("screen-desktop");
  const touchImg = document.getElementById("screen-touch");
  const emptyDesktop = document.getElementById("empty-desktop");
  const emptyTouch = document.getElementById("empty-touch");

  /** Get URL parameter by name */
  function getParam(name) {
    const params = new URLSearchParams(window.location.search);
    const value = params.get(name);
    return value && value.trim().length > 0 ? value.trim() : null;
  }

  /** Show or hide empty states and images */
  function setEmptyState(isEmpty) {
    if (!desktopImg || !touchImg || !emptyDesktop || !emptyTouch) return;
    desktopImg.hidden = isEmpty;
    touchImg.hidden = isEmpty;
    emptyDesktop.hidden = !isEmpty;
    emptyTouch.hidden = !isEmpty;
  }

  /** Assign image sources to both views */
  function setImages(src, altText) {
    if (desktopImg) {
      desktopImg.src = src;
      desktopImg.alt = altText;
    }
    if (touchImg) {
      touchImg.src = src;
      touchImg.alt = altText;
    }
  }

  /** Attempt to resolve the screen mapping and load */
  async function init() {
    const screenParam = getParam("screen");

    let mappings = {};
    try {
      const res = await fetch("screens.json", { cache: "no-store" });
      if (res.ok) {
        mappings = await res.json();
      }
    } catch (_) {
      // ignore; mappings stays empty
    }

    // If a mapping exists, prefer it; else consider direct image filename via ?file=
    let selectedKey = screenParam || Object.keys(mappings)[0] || null;
    let imageFile = selectedKey ? mappings[selectedKey] : null;

    // Optional direct file override e.g. ?file=my.png (must be placed in assets/screens)
    const directFile = getParam("file");
    if (!imageFile && directFile) {
      imageFile = directFile;
      selectedKey = selectedKey || directFile;
    }

    if (!imageFile) {
      setEmptyState(true);
      return;
    }

    const src = `assets/screens/${imageFile}`;

    // Preload with error handling to decide empty state
    const testImage = new Image();
    testImage.decoding = "async";
    testImage.onload = function () {
      setImages(src, `Famly teacher — ${selectedKey}`);
      setEmptyState(false);
    };
    testImage.onerror = function () {
      console.warn("Could not load image:", src);
      setEmptyState(true);
    };
    testImage.src = src;
  }

  // Kick off
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

