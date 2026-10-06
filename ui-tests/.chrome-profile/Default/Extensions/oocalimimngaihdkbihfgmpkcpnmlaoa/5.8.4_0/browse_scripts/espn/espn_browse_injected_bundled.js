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

;// ./src/Teleparty/BrowseScripts/ESPN/espn_browse_injected.js


const TP_GRADIENT = "linear-gradient(273.58deg, #9E55A0 0%, #EF3E3A 100%)";
const TP_LABEL = "Start a Teleparty";
const PLAY_LABEL = "Play";
const espn_browse_injected_NATIVE_PARTY_BUTTON_SELECTOR = '#native-party-button, [data-tp-native-party="1"]';
const ESPN_TILE_HOVER_STYLE_ID = "tp-espn-tile-hover-styles-v5";
const TILE_CIRCLE_FALLBACK_SIZE = 64;
const TILE_CIRCLE_GAP = 16;
const TP_MARK_SVG = '<svg viewBox="948 113.86 400 380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
    '<polygon fill="#fff" points="1188.01 193.86 1188.01 113.86 1108.01 113.86 1028.01 113.86 948.01 113.86 948.01 193.86 1028.01 193.86 1028.01 413.86 1108.01 413.86 1108.01 193.86 1188.01 193.86"/>' +
    '<path fill="#fff" d="M1238,213.86a110,110,0,0,0-110,110v170h80V429.71a110,110,0,1,0,30-215.85Zm0,140a30,30,0,1,1,30-30A30,30,0,0,1,1238,353.86Z"/>' +
    "</svg>";
const WATCH_CTA_SELECTOR = 'a[data-testid="watchButton"], a[aria-label^="Watch,"]';
const PLAYABLE_CTA_TEXT_RE = /^(Watch|Watch Now|Watch Live|Play|Resume|Continue|Replay|Live)\b/i;
const TILE_SELECTOR = 'a[href*="/watch/player/"]';
const SCHEDULE_ROW_SELECTOR = "td.Table__TD--name a[data-watch-streamid]";
function isInjectableSurface() {
    const path = window.location.pathname;
    if (/^\/watch\/player(\/|$)/.test(path)) {
        return false;
    }
    return /^\/watch(\/|$)/.test(path) || /^\/search(\/|$)/.test(path);
}
function isUpcomingSchedule() {
    return /^\/watch\/schedule\/_\/type\/upcoming(\/|$)/.test(window.location.pathname);
}
function buildStartPartyPill(playButton) {
    const cs = getComputedStyle(playButton);
    const rect = playButton.getBoundingClientRect();
    const height = rect.height || parseFloat(cs.height) || 32;
    const tp = document.createElement("a");
    tp.setAttribute("role", "button");
    tp.setAttribute("data-tp-native-party", "1");
    const href = playButton.getAttribute("href");
    if (href)
        tp.setAttribute("href", href);
    tp.style.cssText = [
        `background-image: ${TP_GRADIENT}`,
        "background-color: transparent",
        "color: #fff",
        "border: none",
        "cursor: pointer",
        `height: ${height}px`,
        `padding: ${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
        `font-family: ${cs.fontFamily}`,
        `font-size: ${cs.fontSize}`,
        `font-weight: ${cs.fontWeight}`,
        `line-height: ${cs.lineHeight}`,
        `letter-spacing: ${cs.letterSpacing}`,
        `text-transform: ${cs.textTransform}`,
        `border-radius: ${cs.borderRadius !== "0px" ? cs.borderRadius : "4px"}`,
        "display: inline-flex",
        "align-items: center",
        "justify-content: center",
        "white-space: nowrap",
        "margin-left: 8px",
        "flex-shrink: 0",
        "box-sizing: border-box",
        "text-decoration: none",
    ].join("; ");
    tp.textContent = TP_LABEL;
    return tp;
}
function injectPerCtaPills(results) {
    document.querySelectorAll(WATCH_CTA_SELECTOR).forEach((playButton) => {
        var _a;
        const label = ((_a = playButton.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "";
        if (!PLAYABLE_CTA_TEXT_RE.test(label))
            return;
        const href = playButton.getAttribute("href") || "";
        if (!href.includes("/watch/player"))
            return;
        const rect = playButton.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0)
            return;
        const container = playButton.parentElement;
        if (!container || container.querySelector(espn_browse_injected_NATIVE_PARTY_BUTTON_SELECTOR))
            return;
        const tp = buildStartPartyPill(playButton);
        container.insertBefore(tp, playButton.nextSibling);
        results.push({ button: tp, play: () => playButton.click() });
    });
}
function buildScheduleRowPill(rowAnchor) {
    const tp = document.createElement("a");
    tp.setAttribute("role", "button");
    tp.setAttribute("data-tp-native-party", "1");
    const href = rowAnchor.getAttribute("href");
    if (href)
        tp.setAttribute("href", href);
    tp.style.cssText = [
        `background-image: ${TP_GRADIENT}`,
        "background-color: transparent",
        "color: #fff",
        "border: none",
        "cursor: pointer",
        "display: inline-flex",
        "align-items: center",
        "justify-content: center",
        "vertical-align: middle",
        "padding: 3px 10px",
        "border-radius: 999px",
        "font-size: 11px",
        "font-weight: 700",
        "line-height: 1.2",
        "letter-spacing: 0.2px",
        "white-space: nowrap",
        "text-decoration: none",
        "margin-left: 10px",
        "box-sizing: border-box",
    ].join("; ");
    tp.textContent = TP_LABEL;
    return tp;
}
function injectScheduleRowPills(results) {
    if (isUpcomingSchedule())
        return;
    document.querySelectorAll(SCHEDULE_ROW_SELECTOR).forEach((rowAnchor) => {
        const cell = rowAnchor.parentElement;
        if (!cell || cell.querySelector(espn_browse_injected_NATIVE_PARTY_BUTTON_SELECTOR))
            return;
        const tp = buildScheduleRowPill(rowAnchor);
        rowAnchor.insertAdjacentElement("afterend", tp);
        results.push({ button: tp, play: () => rowAnchor.click() });
    });
}
function ensureTileHoverStylesInjected() {
    if (document.getElementById(ESPN_TILE_HOVER_STYLE_ID))
        return;
    const style = document.createElement("style");
    style.id = ESPN_TILE_HOVER_STYLE_ID;
    style.textContent = `
        [data-tp-espn-tile-host="1"] {
            position: relative;
        }
        [data-tp-espn-tile-wrap="1"] .MediaPlaceholder__Button {
            translate: var(--tp-espn-play-shift, 0px) 0;
            transition: translate 160ms ease-in-out;
        }
        [data-tp-espn-tile-host="1"] [data-tp-native-party="1"][data-tp-espn-tile-overlay="1"] {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0.86);
            box-sizing: border-box;
            border-radius: 50%;
            background-image: ${TP_GRADIENT};
            border: none;
            padding: 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            box-shadow: 0 4px 14px rgba(0,0,0,0.45);
            opacity: 0;
            pointer-events: none;
            transition: opacity 160ms ease-in-out, transform 160ms ease-in-out;
            z-index: 5;
        }
        [data-tp-espn-tile-host="1"] [data-tp-espn-tile-overlay="1"] svg {
            width: 46%;
            height: 46%;
            display: block;
            pointer-events: none;
        }
        [data-tp-espn-tile-host="1"]:hover [data-tp-native-party="1"][data-tp-espn-tile-overlay="1"],
        [data-tp-espn-tile-host="1"]:focus-within [data-tp-native-party="1"][data-tp-espn-tile-overlay="1"] {
            opacity: 1;
            pointer-events: auto;
            transform: translate(-50%, -50%) scale(1);
        }
        [data-tp-espn-tile-host="1"] [data-tp-espn-play-hit="1"] {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            background: transparent;
            pointer-events: none;
            z-index: 5;
        }
        [data-tp-espn-tile-host="1"]:hover [data-tp-espn-play-hit="1"] {
            pointer-events: auto;
        }
        [data-tp-espn-tile-host="1"] [data-tp-espn-tile-label="1"] {
            position: absolute;
            top: calc(100% + 7px);
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.82);
            color: #fff;
            font-family: inherit;
            font-size: 11px;
            font-weight: 600;
            line-height: 1.2;
            letter-spacing: 0.2px;
            white-space: nowrap;
            padding: 4px 9px;
            border-radius: 999px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 120ms ease-in-out;
        }
        [data-tp-espn-tile-host="1"] [data-tp-espn-tile-overlay="1"]:hover [data-tp-espn-tile-label="1"],
        [data-tp-espn-tile-host="1"] [data-tp-espn-tile-overlay="1"]:focus [data-tp-espn-tile-label="1"],
        [data-tp-espn-tile-host="1"] [data-tp-espn-play-hit="1"]:hover [data-tp-espn-tile-label="1"] {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}
const UPCOMING_PILL_RE = /\b(AM|PM)\b/i;
function isPlayableTile(tile) {
    const href = tile.getAttribute("href") || "";
    if (!href.includes("/watch/player/"))
        return false;
    const rect = tile.getBoundingClientRect();
    if (rect.width < 80 || rect.height < 60)
        return false;
    const wrapper = tile.closest(".WatchTile__Wrapper") || tile.parentElement;
    if (!wrapper)
        return false;
    const pill = wrapper.querySelector(".MediaPlaceholder__Pill");
    if (pill == null)
        return true;
    return !UPCOMING_PILL_RE.test(pill.textContent || "");
}
function positionTileOverlay(tile, overlay) {
    const wrapper = tile.closest(".WatchTile__Wrapper") || tile.parentElement;
    const artwork = wrapper && wrapper.querySelector(".MediaPlaceholder");
    if (!artwork)
        return false;
    const artworkHeight = artwork.getBoundingClientRect().height;
    if (!artworkHeight)
        return false;
    const playIcon = wrapper.querySelector(".MediaPlaceholder__Button");
    const playRect = playIcon && playIcon.getBoundingClientRect();
    const size = Math.round((playRect && playRect.height) || TILE_CIRCLE_FALLBACK_SIZE);
    const shift = playIcon ? Math.round((size + TILE_CIRCLE_GAP) / 2) : 0;
    overlay.style.top = `${Math.round(artworkHeight / 2)}px`;
    overlay.style.width = `${size}px`;
    overlay.style.height = `${size}px`;
    overlay.style.marginLeft = `${shift}px`;
    wrapper.style.setProperty("--tp-espn-play-shift", `-${shift}px`);
    const playHit = tile.querySelector('[data-tp-espn-play-hit="1"]');
    if (playHit) {
        playHit.style.display = playIcon ? "" : "none";
        playHit.style.top = `${Math.round(artworkHeight / 2)}px`;
        playHit.style.width = `${size}px`;
        playHit.style.height = `${size}px`;
        playHit.style.marginLeft = `-${shift}px`;
    }
    overlay.setAttribute("data-tp-espn-tile-positioned", "1");
    return true;
}
function buildPlayHitArea() {
    const playHit = document.createElement("span");
    playHit.setAttribute("data-tp-espn-play-hit", "1");
    playHit.setAttribute("aria-hidden", "true");
    const playLabel = document.createElement("span");
    playLabel.setAttribute("data-tp-espn-tile-label", "1");
    playLabel.textContent = PLAY_LABEL;
    playHit.appendChild(playLabel);
    return playHit;
}
function injectTileHoverOverlays(results) {
    const tiles = document.querySelectorAll(TILE_SELECTOR);
    if (tiles.length === 0)
        return;
    ensureTileHoverStylesInjected();
    tiles.forEach((tile) => {
        if (!isPlayableTile(tile))
            return;
        if (tile.getAttribute("data-tp-espn-tile-host") !== "1") {
            tile.setAttribute("data-tp-espn-tile-host", "1");
        }
        const tileWrapper = tile.closest(".WatchTile__Wrapper") || tile.parentElement;
        if (tileWrapper && tileWrapper.getAttribute("data-tp-espn-tile-wrap") !== "1") {
            tileWrapper.setAttribute("data-tp-espn-tile-wrap", "1");
        }
        const existing = tile.querySelector('[data-tp-espn-tile-overlay="1"]');
        if (existing) {
            const hitStripped = !tile.querySelector('[data-tp-espn-play-hit="1"]');
            if (hitStripped) {
                tile.appendChild(buildPlayHitArea());
            }
            if (hitStripped || existing.getAttribute("data-tp-espn-tile-positioned") !== "1") {
                positionTileOverlay(tile, existing);
            }
            return;
        }
        const overlay = document.createElement("span");
        overlay.setAttribute("data-tp-native-party", "1");
        overlay.setAttribute("data-tp-espn-tile-overlay", "1");
        overlay.setAttribute("role", "button");
        overlay.setAttribute("tabindex", "0");
        overlay.setAttribute("aria-label", TP_LABEL);
        overlay.innerHTML = TP_MARK_SVG;
        const label = document.createElement("span");
        label.setAttribute("data-tp-espn-tile-label", "1");
        label.textContent = TP_LABEL;
        overlay.appendChild(label);
        tile.appendChild(overlay);
        tile.appendChild(buildPlayHitArea());
        positionTileOverlay(tile, overlay);
        results.push({
            button: overlay,
            play: () => {
                const href = tile.getAttribute("href");
                if (href)
                    window.location.href = new URL(href, window.location.origin).toString();
                else
                    tile.click();
            },
        });
    });
}
function addNativePartyButton() {
    if (!isInjectableSurface())
        return undefined;
    const results = [];
    injectPerCtaPills(results);
    injectScheduleRowPills(results);
    injectTileHoverOverlays(results);
    if (results.length === 0)
        return undefined;
    if (results[0])
        results[0].button.id = "native-party-button";
    return results;
}
function cleanupNativePartyButtons() {
    document.querySelectorAll(espn_browse_injected_NATIVE_PARTY_BUTTON_SELECTOR).forEach((button) => button.remove());
    document.querySelectorAll('[data-tp-espn-play-hit="1"]').forEach((hit) => hit.remove());
}
addNativePartyHandler(addNativePartyButton, InternalStreamingServiceName.ESPN, {
    cleanupNativePartyButtons,
});

/******/ })()
;