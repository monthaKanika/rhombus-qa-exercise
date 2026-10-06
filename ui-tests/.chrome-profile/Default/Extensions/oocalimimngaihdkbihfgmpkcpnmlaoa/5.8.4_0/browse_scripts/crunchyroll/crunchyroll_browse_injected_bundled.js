/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/Teleparty/Enums/InternalStreamingServiceName.ts
var InternalStreamingServiceName;
(function (InternalStreamingServiceName) {
    InternalStreamingServiceName["NETFLIX"] = "netflix";
    InternalStreamingServiceName["HULU"] = "hulu";
    InternalStreamingServiceName["DISNEY_PLUS"] = "disney";
    InternalStreamingServiceName["STAR_PLUS"] = "starplus";
    InternalStreamingServiceName["AMAZON"] = "amazon";
    InternalStreamingServiceName["YOUTUBE"] = "youtube";
    InternalStreamingServiceName["HBO_MAX"] = "hbomax";
    InternalStreamingServiceName["MAX"] = "max";
    InternalStreamingServiceName["FUBO"] = "fubo";
    InternalStreamingServiceName["CRUNCHYROLL"] = "crunchyroll";
    InternalStreamingServiceName["PARAMOUNT"] = "paramount";
    InternalStreamingServiceName["PEACOCK"] = "peacock";
    InternalStreamingServiceName["HOTSTAR"] = "hotstar";
    InternalStreamingServiceName["DISNEY_PLUS_MENA"] = "disneymena";
    InternalStreamingServiceName["APPLE_TV"] = "appletv";
    InternalStreamingServiceName["PLUTO_TV"] = "plutotv";
    InternalStreamingServiceName["FUNIMATION"] = "funimation";
    InternalStreamingServiceName["TUBI_TV"] = "tubitv";
    InternalStreamingServiceName["JIO_CINEMA"] = "jiocinema";
    InternalStreamingServiceName["MUBI"] = "mubi";
    InternalStreamingServiceName["CRAVE"] = "crave";
    InternalStreamingServiceName["STAN"] = "stan";
    InternalStreamingServiceName["SONY_LIV"] = "sonyliv";
    InternalStreamingServiceName["ZEE5"] = "zee5";
    InternalStreamingServiceName["HULU_JP"] = "hulujp";
    InternalStreamingServiceName["UNEXT"] = "unext";
    InternalStreamingServiceName["GLOBOPLAY"] = "globoplay";
    InternalStreamingServiceName["WILLOW"] = "willow";
    InternalStreamingServiceName["FANCODE"] = "fancode";
    InternalStreamingServiceName["CANALPLUS"] = "canalplus";
    InternalStreamingServiceName["SHAHID"] = "shahid";
    InternalStreamingServiceName["RTL"] = "rtl";
    InternalStreamingServiceName["ESPN"] = "espn";
    InternalStreamingServiceName["SLING"] = "sling";
    InternalStreamingServiceName["VIKI"] = "viki";
    InternalStreamingServiceName["SPOTIFY"] = "spotify";
    InternalStreamingServiceName["SHOWTIME"] = "showtime";
    InternalStreamingServiceName["SHUDDER"] = "shudder";
    InternalStreamingServiceName["AMC_PLUS"] = "amcplus";
    InternalStreamingServiceName["VIU"] = "viu";
    InternalStreamingServiceName["VIDIO"] = "vidio";
    InternalStreamingServiceName["FOX_ONE"] = "foxone";
    InternalStreamingServiceName["TSN_PLUS"] = "tsnplus";
    InternalStreamingServiceName["LEAGUE_PASS"] = "leaguepass";
    InternalStreamingServiceName["DAZN"] = "dazn";
    InternalStreamingServiceName["VIX"] = "vix";
    InternalStreamingServiceName["MIGU"] = "migu";
    InternalStreamingServiceName["F1_TV"] = "f1tv";
})(InternalStreamingServiceName || (InternalStreamingServiceName = {}));

;// ./src/Teleparty/Constants/env.ts
var _a, _b, _c, _d, _e, _f;
// NOTE: Changing the .env file seems to require re-running build-dev-watch
// if you are using that for development.
const PROD_DEFAULTS = {
    API_URL: "https://api.teleparty.com",
    WEBSOCKETS_URL: "wss://ws.teleparty.com",
    REDIRECT_URL: "https://www.teleparty.com",
    // This is a public key, so it's okay to hardcode it here
    POSTHOG_API_KEY: "phc_8h1T6DYsM416utBY2HpUYkyyBKyVErAyoNpFbtp2D9b",
    POSTHOG_API_HOST: "https://us.i.posthog.com",
    IMAGE_CDN_URL: "https://files.teleparty.com",
};
const API_URL =  true ? PROD_DEFAULTS.API_URL : (0);
const WEBSOCKETS_URL =  true
    ? PROD_DEFAULTS.WEBSOCKETS_URL
    : (0);
const REDIRECT_URL =  true
    ? PROD_DEFAULTS.REDIRECT_URL
    : (0);
const PROD_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDvZJAoFJkT2lBrhloA0e9XwKmLgELTAeQ",
    authDomain: "teleparty-mobile.firebaseapp.com",
    projectId: "teleparty-mobile",
    storageBucket: "teleparty-mobile.appspot.com",
    messagingSenderId: "961974665980",
    appId: "1:961974665980:web:fe4179db8591331aeb8d79",
    measurementId: "G-PC36DK40FL",
};
const DEV_FIREBASE_CONFIG = {
    apiKey: "AIzaSyDmxz7HsfNuhW52Mti-Q9lAGHJYOzEijb8",
    authDomain: "teleparty-auth---test.firebaseapp.com",
    projectId: "teleparty-auth---test",
    storageBucket: "teleparty-auth---test.appspot.com",
    messagingSenderId: "391169153212",
    appId: "1:391169153212:web:0eae4ff68890df614b18b9",
    measurementId: "G-MFZH5P1Z4E",
};
const FIREBASE_CONFIG =  true ? PROD_FIREBASE_CONFIG : 0;
// PostHog Configuration
const POSTHOG_API_KEY =  true
    ? PROD_DEFAULTS.POSTHOG_API_KEY
    : (0);
const POSTHOG_API_HOST =  true
    ? PROD_DEFAULTS.POSTHOG_API_HOST
    : (0);
const IGNORE_UNDER_MAINTENANCE =  true ? false : 0;
const IMAGE_CDN_URL =  true
    ? PROD_DEFAULTS.IMAGE_CDN_URL
    : (0);
const BACKEND_SELECTOR_AWS_CDN = "MISSING_ENV_VAR".BACKEND_SELECTOR_AWS_CDN || "https://d1491j4uhxdasz.cloudfront.net";

;// ./src/Teleparty/Managers/Announcements.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const ANNOUNCEMENTS_CACHE_KEY = "announcements_cache_v1";
const CACHE_TTL_MS = 10 * 60 * 1000;
function announcementApplicable(announcement, serviceName) {
    var _a;
    return (announcement &&
        typeof announcement.deviceTypes === "object" &&
        ((_a = announcement.deviceTypes) === null || _a === void 0 ? void 0 : _a.includes("chrome".toUpperCase())) &&
        (announcement.service === "all" || announcement.service === serviceName || !serviceName) &&
        compareExtensionVersion(announcement.extensionVersionIntroduced) >= 0 &&
        (announcement.extensionVersionResolved === "unresolved" ||
            compareExtensionVersion(announcement.extensionVersionResolved) <= 0) &&
        (announcement.expirationDate === -1 || Date.now() / 1000 < announcement.expirationDate));
}
const getCache = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { [ANNOUNCEMENTS_CACHE_KEY]: cache } = (yield chrome.storage.local.get(ANNOUNCEMENTS_CACHE_KEY));
        if (!((_a = cache === null || cache === void 0 ? void 0 : cache.announcements) === null || _a === void 0 ? void 0 : _a.length))
            return null;
        if (Date.now() - cache.fetchedAtMs > CACHE_TTL_MS)
            return null;
        return cache.announcements;
    }
    catch (_b) {
        return null;
    }
});
const setCache = (announcements) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = { announcements, fetchedAtMs: Date.now() };
        yield chrome.storage.local.set({ [ANNOUNCEMENTS_CACHE_KEY]: payload });
    }
    catch (_c) {
        // ignore cache write failures
    }
});
function fetchAnnouncements() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const cached = yield getCache();
        if (cached)
            return cached;
        const resp = yield fetch(`${API_URL}/announcements`);
        const data = yield resp.json();
        const announcements = (_a = data["announcements"]) !== null && _a !== void 0 ? _a : [];
        void setCache(announcements);
        return announcements;
    });
}

;// ./src/Teleparty/Utils/NativePartyPageState.ts
const IN_PARTY_ATTR = "data-tp-in-party";
/** Shared DOM flag readable from both content scripts and page-injected browse scripts. */
function setPageInParty(inParty) {
    if (inParty) {
        document.documentElement.setAttribute(IN_PARTY_ATTR, "true");
    }
    else {
        document.documentElement.removeAttribute(IN_PARTY_ATTR);
    }
}
function isPageInParty() {
    return document.documentElement.getAttribute(IN_PARTY_ATTR) === "true";
}
const NATIVE_PARTY_BUTTON_SELECTOR = "#native-party-button, [id^='native-party-button'], .native-party-button, #native-party-button-homepage, [data-tp-native-party='1']";

;// ./src/Teleparty/BrowseScripts/NativePartyHandler.ts
var NativePartyHandler_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



// How long the party-status entry written by BrowseScript is considered fresh.
// BrowseScript refreshes it every ~1s; if we don't see a recent update we assume
// the bridge isn't running and fall back to "not in party" rather than blocking.
const PARTY_STATUS_FRESHNESS_MS = 2000;
function getTelepartyConfig() {
    try {
        const stored = sessionStorage.getItem("telepartyPremiumConfig");
        if (stored) {
            const config = JSON.parse(stored);
            return config;
        }
    }
    catch (e) {
        // console.error("Error parsing sessionStorage config:", e)
    }
    return null;
}
function defaultCleanupNativePartyButtons() {
    document.querySelectorAll(NATIVE_PARTY_BUTTON_SELECTOR).forEach((button) => {
        button.remove();
    });
}
function hasNativePartyButtons() {
    return document.querySelector(NATIVE_PARTY_BUTTON_SELECTOR) !== null;
}
const nativePartyPlayHandlers = new WeakMap();
let nativePartyClickDelegationInstalled = false;
function handleNativePartyButtonClick(button, play, e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("Native party button clicked");
    const config = getTelepartyConfig();
    if ((config === null || config === void 0 ? void 0 : config.serviceIsPremium) && !(config === null || config === void 0 ? void 0 : config.userHasPremium)) {
        console.log("Redirecting non-premium user on premium service to premium page");
        window.open("https://teleparty.com/premium?ref=start-" + config.serviceName, "_blank");
        return;
    }
    localStorage.setItem("nativeParty", JSON.stringify({
        shouldStart: true,
        expiry: Date.now() + 1000 * 60 * 2,
        randomId: Math.random().toString(),
    }));
    play(e);
}
function ensureNativePartyClickDelegation() {
    if (nativePartyClickDelegationInstalled) {
        return;
    }
    nativePartyClickDelegationInstalled = true;
    // Fallback for SPAs (e.g. Migu) that replace injected buttons between bind cycles.
    document.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) {
            return;
        }
        const button = target.closest(NATIVE_PARTY_BUTTON_SELECTOR);
        if (!(button instanceof HTMLElement)) {
            return;
        }
        const binding = button;
        if (binding._telepartyHandlerBound) {
            return;
        }
        const play = nativePartyPlayHandlers.get(button);
        if (!play) {
            return;
        }
        handleNativePartyButtonClick(button, play, e);
    }, true);
}
function bindNativePartyButtonHandlers(buttons) {
    if (!buttons) {
        return;
    }
    ensureNativePartyClickDelegation();
    for (const { button, play } of buttons) {
        const buttonElement = button;
        nativePartyPlayHandlers.set(button, play);
        if (buttonElement._telepartyHandler) {
            button.removeEventListener("click", buttonElement._telepartyHandler, true);
        }
        const clickHandler = (e) => {
            var _a;
            const playFn = (_a = nativePartyPlayHandlers.get(button)) !== null && _a !== void 0 ? _a : play;
            handleNativePartyButtonClick(button, playFn, e);
        };
        buttonElement._telepartyHandler = clickHandler;
        buttonElement._telepartyHandlerBound = true;
        button.addEventListener("click", clickHandler, true);
    }
}
function addNativePartyHandler(tryAddButton, service, options = {}) {
    var _a;
    return NativePartyHandler_awaiter(this, void 0, void 0, function* () {
        const cleanupNativePartyButtons = (_a = options.cleanupNativePartyButtons) !== null && _a !== void 0 ? _a : defaultCleanupNativePartyButtons;
        let unavailable = [];
        try {
            const announcements = yield fetchAnnouncements();
            unavailable = announcements
                .filter((a) => a.enforcement === "DISABLE_SERVICE")
                .map((a) => a.service)
                .filter(Boolean);
        }
        catch (e) {
            console.error(e);
        }
        // Immediately bail out if this service is under maintenance
        if (unavailable.includes(service) && !IGNORE_UNDER_MAINTENANCE) {
            console.log(`Service under maintenance: ${service}`);
            return;
        }
        let inPartyCached = isPageInParty();
        bindNativePartyButtonHandlers(tryAddButton());
        setInterval(() => {
            try {
                const inParty = isPageInParty();
                if (inParty) {
                    if (!inPartyCached || hasNativePartyButtons()) {
                        cleanupNativePartyButtons();
                    }
                    inPartyCached = true;
                    return;
                }
                inPartyCached = false;
                bindNativePartyButtonHandlers(tryAddButton());
            }
            catch (error) {
                // console.error("Error in addNativePartyHandler:", error)
            }
        }, 500);
    });
}

;// ./src/Teleparty/BrowseScripts/NativePartyTooltip.ts
const TOOLTIP_STYLE_ID = "tp-native-party-tooltip-styles";
const DEFAULT_TOOLTIP_TEXT = "Start a Teleparty";
const THEME_VARIABLES = {
    background: "--tp-tooltip-background",
    color: "--tp-tooltip-color",
    fontFamily: "--tp-tooltip-font-family",
    fontSize: "--tp-tooltip-font-size",
    fontWeight: "--tp-tooltip-font-weight",
    lineHeight: "--tp-tooltip-line-height",
    padding: "--tp-tooltip-padding",
    borderRadius: "--tp-tooltip-border-radius",
    boxShadow: "--tp-tooltip-box-shadow",
    width: "--tp-tooltip-width",
    maxWidth: "--tp-tooltip-max-width",
    whiteSpace: "--tp-tooltip-white-space",
    textAlign: "--tp-tooltip-text-align",
    offset: "--tp-tooltip-offset",
    zIndex: "--tp-tooltip-z-index",
    transitionDuration: "--tp-tooltip-transition-duration",
};
function ensureNativePartyTooltipStyles(ownerDocument) {
    if (ownerDocument.getElementById(TOOLTIP_STYLE_ID) != null)
        return;
    const style = ownerDocument.createElement("style");
    style.id = TOOLTIP_STYLE_ID;
    style.textContent = `
        [data-tp-tooltip]::after {
            content: attr(data-tp-tooltip);
            position: absolute;
            z-index: var(--tp-tooltip-z-index, 1000);
            width: var(--tp-tooltip-width, max-content);
            max-width: var(--tp-tooltip-max-width, none);
            padding: var(--tp-tooltip-padding, 0.4rem 0.55rem);
            border-radius: var(--tp-tooltip-border-radius, 0.25rem);
            background: var(--tp-tooltip-background, rgba(20, 20, 20, 0.96));
            box-shadow: var(--tp-tooltip-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.4));
            color: var(--tp-tooltip-color, #fff);
            font-family: var(--tp-tooltip-font-family, Arial, sans-serif);
            font-size: var(--tp-tooltip-font-size, 0.75rem);
            font-weight: var(--tp-tooltip-font-weight, 500);
            line-height: var(--tp-tooltip-line-height, 1.2);
            letter-spacing: normal;
            opacity: 0;
            pointer-events: none;
            text-align: var(--tp-tooltip-text-align, center);
            transform: translate(var(--tp-tooltip-translate-x, -50%), var(--tp-tooltip-translate-y, 0))
                translate(var(--tp-tooltip-enter-x, 0), var(--tp-tooltip-enter-y, 0.2rem));
            transition: opacity var(--tp-tooltip-transition-duration, 120ms) ease,
                transform var(--tp-tooltip-transition-duration, 120ms) ease,
                visibility var(--tp-tooltip-transition-duration, 120ms) ease;
            visibility: hidden;
            white-space: var(--tp-tooltip-white-space, nowrap);
        }

        [data-tp-tooltip]:hover::after,
        [data-tp-tooltip]:focus-visible::after,
        [data-tp-tooltip]:focus-within::after {
            --tp-tooltip-enter-x: 0;
            --tp-tooltip-enter-y: 0;
            opacity: 1;
            visibility: visible;
        }

        [data-tp-tooltip-placement="top"]::after,
        [data-tp-tooltip-placement="bottom"]::after {
            left: 50%;
            --tp-tooltip-translate-x: -50%;
            --tp-tooltip-translate-y: 0;
        }

        [data-tp-tooltip-placement="top"]::after {
            bottom: calc(100% + var(--tp-tooltip-offset, 0.5rem));
            --tp-tooltip-enter-y: 0.2rem;
        }

        [data-tp-tooltip-placement="bottom"]::after {
            top: calc(100% + var(--tp-tooltip-offset, 0.5rem));
            --tp-tooltip-enter-y: -0.2rem;
        }

        [data-tp-tooltip-placement="top"][data-tp-tooltip-align="start"]::after,
        [data-tp-tooltip-placement="bottom"][data-tp-tooltip-align="start"]::after {
            left: 0;
            --tp-tooltip-translate-x: 0;
        }

        [data-tp-tooltip-placement="top"][data-tp-tooltip-align="end"]::after,
        [data-tp-tooltip-placement="bottom"][data-tp-tooltip-align="end"]::after {
            right: 0;
            left: auto;
            --tp-tooltip-translate-x: 0;
        }

        [data-tp-tooltip-placement="left"]::after,
        [data-tp-tooltip-placement="right"]::after {
            top: 50%;
            --tp-tooltip-translate-x: 0;
            --tp-tooltip-translate-y: -50%;
        }

        [data-tp-tooltip-placement="left"]::after {
            right: calc(100% + var(--tp-tooltip-offset, 0.5rem));
            --tp-tooltip-enter-x: 0.2rem;
        }

        [data-tp-tooltip-placement="right"]::after {
            left: calc(100% + var(--tp-tooltip-offset, 0.5rem));
            --tp-tooltip-enter-x: -0.2rem;
        }

        [data-tp-tooltip-placement="left"][data-tp-tooltip-align="start"]::after,
        [data-tp-tooltip-placement="right"][data-tp-tooltip-align="start"]::after {
            top: 0;
            --tp-tooltip-translate-y: 0;
        }

        [data-tp-tooltip-placement="left"][data-tp-tooltip-align="end"]::after,
        [data-tp-tooltip-placement="right"][data-tp-tooltip-align="end"]::after {
            top: auto;
            bottom: 0;
            --tp-tooltip-translate-y: 0;
        }
    `;
    ownerDocument.head.appendChild(style);
}
function attachNativePartyTooltip(host, options = {}) {
    const { text = DEFAULT_TOOLTIP_TEXT, ariaLabel = text, accessibleTarget = host, placement = "top", align = "center", className, theme = {}, } = options;
    ensureNativePartyTooltipStyles(host.ownerDocument);
    host.setAttribute("data-tp-tooltip", text);
    host.setAttribute("data-tp-tooltip-placement", placement);
    host.setAttribute("data-tp-tooltip-align", align);
    if (className)
        host.classList.add(className);
    const view = host.ownerDocument.defaultView;
    if (view != null && view.getComputedStyle(host).position === "static") {
        host.style.position = "relative";
    }
    Object.entries(theme).forEach(([key, value]) => {
        if (value == null)
            return;
        host.style.setProperty(THEME_VARIABLES[key], String(value));
    });
    accessibleTarget.setAttribute("aria-label", ariaLabel);
    accessibleTarget.removeAttribute("title");
}

;// ./src/Teleparty/BrowseScripts/Crunchyroll/crunchyroll_browse_injected.js



const crunchyroll_browse_injected_NATIVE_PARTY_BUTTON_SELECTOR = '#native-party-button, [data-tp-native-party="1"]';
function markNativePartyButton(button) {
    button.setAttribute("data-tp-native-party", "1");
}
function updateIconForTeleparty(button) {
    const icon = button.querySelector("svg");
    if (icon == null) {
        return;
    }
    icon.removeAttribute("data-t");
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = `
        <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
        <text x="12" y="15" fill="currentColor" font-family="Arial, sans-serif" font-size="8" font-weight="700" text-anchor="middle">TP</text>
    `;
}
function addNativePartyButton() {
    const results = [];
    // Handle the main play button(s)
    let playButton = document.querySelector('a[data-t="start-watching-btn"]');
    if (playButton == null) {
        playButton = document.querySelector('a[data-t="continue-watching-btn"]');
    }
    if (playButton != null && playButton.parentElement != null) {
        const parentDiv = playButton.parentElement;
        if (!parentDiv.querySelector(crunchyroll_browse_injected_NATIVE_PARTY_BUTTON_SELECTOR)) {
            const nativePartyButton = document.createElement("button");
            nativePartyButton.setAttribute("class", playButton.getAttribute("class"));
            nativePartyButton.setAttribute("style", "background: linear-gradient(273.58deg, #9E55A0 0%, #EF3E3A 100%); color: #fff; align-items: center;");
            markNativePartyButton(nativePartyButton);
            nativePartyButton.innerHTML = "<span>Start a Teleparty</span>";
            parentDiv.insertBefore(nativePartyButton, playButton.nextSibling);
            results.push({ button: nativePartyButton, play: () => playButton.click() });
        }
    }
    // Handle the homepage hero button(s)
    const upNextButtons = document.querySelectorAll('a[data-t="up-next-btn"]');
    upNextButtons.forEach((btn) => {
        if (btn.parentElement && !btn.parentElement.querySelector(crunchyroll_browse_injected_NATIVE_PARTY_BUTTON_SELECTOR)) {
            const nativePartyButton = document.createElement("button");
            nativePartyButton.setAttribute("class", btn.getAttribute("class"));
            nativePartyButton.setAttribute("style", "background: linear-gradient(273.58deg, #9E55A0 0%, #EF3E3A 100%); color: #fff; align-items: center;");
            markNativePartyButton(nativePartyButton);
            nativePartyButton.innerHTML = "<span>Start a Teleparty</span>";
            btn.parentElement.insertBefore(nativePartyButton, btn.nextSibling);
            results.push({ button: nativePartyButton, play: () => btn.click() });
        }
    });
    // Add a compact Teleparty action to series-card hover overlays.
    const seriesCardHovers = document.querySelectorAll('[data-t~="series-card"] [data-t="hover-component"]');
    seriesCardHovers.forEach((hoverCard) => {
        var _a, _b, _c, _d;
        const cardPlayButton = hoverCard.querySelector('button[data-t="play-button"]');
        const actionContainer = (_b = (_a = cardPlayButton === null || cardPlayButton === void 0 ? void 0 : cardPlayButton.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;
        const footer = actionContainer === null || actionContainer === void 0 ? void 0 : actionContainer.parentElement;
        if (cardPlayButton == null ||
            actionContainer == null ||
            footer == null ||
            footer.querySelector(crunchyroll_browse_injected_NATIVE_PARTY_BUTTON_SELECTOR) != null) {
            return;
        }
        const nativePartyActionContainer = actionContainer.cloneNode(true);
        const nativePartyButton = nativePartyActionContainer.querySelector("button");
        if (nativePartyButton == null) {
            return;
        }
        const title = (_d = (_c = hoverCard.querySelector('[data-t="title"]')) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.trim();
        const label = title ? `Start a Teleparty for ${title}` : "Start a Teleparty";
        nativePartyButton.removeAttribute("data-t");
        markNativePartyButton(nativePartyButton);
        updateIconForTeleparty(nativePartyButton);
        attachNativePartyTooltip(nativePartyActionContainer, {
            accessibleTarget: nativePartyButton,
            ariaLabel: label,
            theme: {
                background: "#23252b",
                borderRadius: "0",
                boxShadow: "none",
                fontFamily: "inherit",
                fontSize: "0.875rem",
                lineHeight: "normal",
                padding: "0.375rem 0.5rem",
                zIndex: 1000,
            },
        });
        footer.insertBefore(nativePartyActionContainer, actionContainer.nextSibling);
        results.push({ button: nativePartyButton, play: () => cardPlayButton.click() });
    });
    // Add a clearly labeled action to cards in Continue Watching only.
    const continueWatchingCards = document.querySelectorAll('[data-t="history"] [data-t~="episode-card"] [data-t="hover-component"]');
    continueWatchingCards.forEach((hoverCard) => {
        var _a, _b;
        const continueLink = hoverCard.querySelector('a[class^="playable-card-hover__link"]');
        const continueAction = hoverCard.querySelector('div[data-t="play-button"]');
        const footer = continueAction === null || continueAction === void 0 ? void 0 : continueAction.parentElement;
        const body = footer === null || footer === void 0 ? void 0 : footer.parentElement;
        const episodeCard = hoverCard.closest('[data-t~="episode-card"]');
        const cardFooter = episodeCard === null || episodeCard === void 0 ? void 0 : episodeCard.querySelector('[class^="playable-card__footer"]');
        if (continueLink == null || continueAction == null || footer == null || body == null || cardFooter == null) {
            return;
        }
        // Crunchyroll's transparent card footer sits above the hover overlay. Let clicks pass through its
        // empty area to the Teleparty action while keeping More Options and any other controls clickable.
        cardFooter.style.pointerEvents = "none";
        cardFooter.querySelectorAll("a, button, [role='button']").forEach((control) => {
            control.style.pointerEvents = "auto";
        });
        if (body.querySelector(crunchyroll_browse_injected_NATIVE_PARTY_BUTTON_SELECTOR) != null) {
            return;
        }
        const nativePartyButton = document.createElement("button");
        nativePartyButton.setAttribute("class", continueAction.getAttribute("class"));
        nativePartyButton.setAttribute("style", "background: transparent; border: 0; color: inherit; cursor: pointer; margin-top: 0.75rem; padding: 0; position: relative; z-index: 2;");
        nativePartyButton.setAttribute("aria-label", "Continue in a Teleparty");
        markNativePartyButton(nativePartyButton);
        const playIcon = (_a = continueAction.querySelector("svg")) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
        const label = (_b = continueAction.querySelector("span")) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
        if (playIcon != null) {
            nativePartyButton.appendChild(playIcon);
        }
        if (label != null) {
            label.textContent = "Continue in a Teleparty";
            nativePartyButton.appendChild(label);
        }
        else {
            nativePartyButton.appendChild(document.createTextNode("Continue in a Teleparty"));
        }
        body.insertBefore(nativePartyButton, footer.nextSibling);
        results.push({ button: nativePartyButton, play: () => continueLink.click() });
    });
    return results.length > 0 ? results : undefined;
}
addNativePartyHandler(addNativePartyButton, InternalStreamingServiceName.CRUNCHYROLL);

/******/ })()
;