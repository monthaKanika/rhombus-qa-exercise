/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/Teleparty/Constants/Services/Shahid.ts
const VIDEO_ELEMENT_SELECTOR = "video#bitmovinplayer-video-player-element";
const LIVE_VIDEO_ELEMENT_SELECTOR = "video#bitmovinplayer-video-bitmovin-element";
const TITLE_ELEMENT_SELECTOR = 'h3[class*="VODTitle_show-title"]';
const AD_CLASS_NAME = 'video[title="Advertisement"]';
const VIDEO_TYPES = Object.freeze({
    SHOW: "player",
    LIVE_TV: "livestream",
});
const SHAHID_CONSTANTS = Object.freeze({
    VIDEO_ELEMENT_SELECTOR,
    LIVE_VIDEO_ELEMENT_SELECTOR,
    TITLE_ELEMENT_SELECTOR,
    VIDEO_TYPES,
    AD_CLASS_NAME,
});
/* harmony default export */ const Shahid = (SHAHID_CONSTANTS);

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

;// ./src/Teleparty/BrowseScripts/Shahid/shahid_browse_injected.js



const handleLiveTvUrl = () => {
    document.addEventListener("click", (event) => {
        var _a;
        const link = (_a = event.target) === null || _a === void 0 ? void 0 : _a.href;
        if (!link)
            return;
        const url = new URL(link);
        if (url.pathname.includes(Shahid.VIDEO_TYPES.LIVE_TV) && url.pathname.split("/").length === 3) {
            const observer = new MutationObserver((mutations, obs) => {
                const metaElement = document.querySelector('meta[property="og:url"]');
                if (metaElement) {
                    const channelUrl = new URL(metaElement.content || "");
                    window.history.replaceState(null, "", channelUrl.toString());
                    obs.disconnect();
                }
            });
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });
        }
    });
};
const TELEPARTY_GRADIENT = "linear-gradient(273.58deg, #9E55A0 0%, #EF3E3A 100%)";
function markNativePartyButton(button, placement) {
    // Shahid can render several card actions simultaneously, so these cannot share one document id.
    button.setAttribute("data-tp-native-party", "1");
    button.setAttribute("data-tp-shahid-placement", placement);
}
function applyTelepartyStyle(button) {
    button.setAttribute("style", `background: ${TELEPARTY_GRADIENT}; border-color: #e50914; color: #fff;`);
    button.querySelectorAll("span").forEach((span) => span.style.setProperty("color", "#fff", "important"));
    button.querySelectorAll("svg").forEach((icon) => icon.style.setProperty("fill", "#fff", "important"));
}
function replaceButtonLabel(button, label) {
    const textContainer = [...button.querySelectorAll("span")].find((element) => { var _a; return element.children.length === 0 && ((_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim().length) > 0; });
    if (textContainer != null) {
        textContainer.textContent = label;
        return;
    }
    const textNode = [...button.childNodes].find((node) => { var _a; return node.nodeType === Node.TEXT_NODE && ((_a = node.textContent) === null || _a === void 0 ? void 0 : _a.trim().length) > 0; });
    if (textNode != null) {
        textNode.textContent = label;
        return;
    }
    button.appendChild(document.createTextNode(label));
}
function createCompactNativePartyButton(referenceButton, placement) {
    var _a;
    const referenceHeight = referenceButton.offsetHeight || 32;
    const button = document.createElement("button");
    button.setAttribute("class", (_a = referenceButton.getAttribute("class")) !== null && _a !== void 0 ? _a : "");
    button.setAttribute("type", "button");
    button.setAttribute("aria-label", "Start a Teleparty");
    button.setAttribute("title", "Start a Teleparty");
    button.textContent = "TP";
    button.setAttribute("style", `min-width: ${referenceHeight}px; width: ${referenceHeight}px; height: ${referenceHeight}px; padding: 0; border-radius: 999px;`);
    applyTelepartyStyle(button);
    markNativePartyButton(button, placement);
    return button;
}
function addHeroButton(results) {
    const watchButtons = [...document.querySelectorAll("button")].filter((button) => { var _a; return ((_a = button.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "Watch Now" && button.closest(".fader") != null; });
    watchButtons.forEach((watchButton) => {
        const actionsContainer = watchButton.parentElement;
        if (actionsContainer == null || actionsContainer.querySelector('[data-tp-shahid-placement="hero"]') != null) {
            return;
        }
        const nativePartyButton = watchButton.cloneNode(true);
        nativePartyButton.removeAttribute("id");
        nativePartyButton.setAttribute("aria-label", "Start a Teleparty");
        nativePartyButton.setAttribute("title", "Start a Teleparty");
        replaceButtonLabel(nativePartyButton, "Start a Teleparty");
        applyTelepartyStyle(nativePartyButton);
        markNativePartyButton(nativePartyButton, "hero");
        actionsContainer.insertBefore(nativePartyButton, watchButton.nextSibling);
        results.push({ button: nativePartyButton, play: () => watchButton.click() });
    });
}
function addWatchNowCardButtons(results) {
    const watchButtons = [...document.querySelectorAll("button")].filter((button) => { var _a; return ((_a = button.textContent) === null || _a === void 0 ? void 0 : _a.trim()) === "Watch Now" && button.closest(".carousel-item") != null; });
    watchButtons.forEach((watchButton) => {
        const actionsContainer = watchButton.parentElement;
        if (actionsContainer == null ||
            actionsContainer.querySelector('[data-tp-shahid-placement="watch-now-card"]') != null) {
            return;
        }
        const nativePartyButton = createCompactNativePartyButton(watchButton, "watch-now-card");
        actionsContainer.insertBefore(nativePartyButton, watchButton.nextSibling);
        results.push({ button: nativePartyButton, play: () => watchButton.click() });
    });
}
function addCatchUpButtons(results) {
    const playButtons = document.querySelectorAll('a[href*="/player/"] button:not([data-tp-native-party="1"])');
    playButtons.forEach((playButton) => {
        const actionsContainer = playButton.parentElement;
        if (actionsContainer == null ||
            actionsContainer.querySelector('[data-tp-shahid-placement="catch-up-card"]') != null) {
            return;
        }
        const nativePartyButton = createCompactNativePartyButton(playButton, "catch-up-card");
        nativePartyButton.style.setProperty("right", "calc(100% + 8px)", "important");
        actionsContainer.insertBefore(nativePartyButton, playButton.nextSibling);
        results.push({ button: nativePartyButton, play: () => playButton.click() });
    });
}
function addContinueWatchingButtons(results) {
    const playLinks = document.querySelectorAll('a.cursor-default a[href*="/player/"]');
    playLinks.forEach((playLink) => {
        const actionsContainer = playLink.parentElement;
        if (actionsContainer == null ||
            actionsContainer.querySelector('[data-tp-shahid-placement="continue-watching"]') != null) {
            return;
        }
        const nativePartyButton = createCompactNativePartyButton(playLink, "continue-watching");
        nativePartyButton.style.setProperty("right", "calc(100% + 8px)", "important");
        actionsContainer.insertBefore(nativePartyButton, playLink.nextSibling);
        results.push({ button: nativePartyButton, play: () => playLink.click() });
    });
}
function addNativePartyButton() {
    const results = [];
    addHeroButton(results);
    addWatchNowCardButtons(results);
    addContinueWatchingButtons(results);
    addCatchUpButtons(results);
    return results.length > 0 ? results : undefined;
}
addNativePartyHandler(addNativePartyButton, InternalStreamingServiceName.SHAHID);
handleLiveTvUrl();

/******/ })()
;