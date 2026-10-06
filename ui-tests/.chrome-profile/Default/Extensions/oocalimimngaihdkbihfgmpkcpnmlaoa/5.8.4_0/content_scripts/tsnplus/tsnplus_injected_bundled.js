/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

const onLiveCarouselClick = (event) => {
    var _a, _b, _c;
    if (!window.location.pathname.startsWith("/live")) {
        return;
    }
    if (Date.now() < ((_a = window.telepartyProgrammaticCarouselClickUntil) !== null && _a !== void 0 ? _a : 0)) {
        return;
    }
    const target = (_c = (_b = event.target) === null || _b === void 0 ? void 0 : _b.closest) === null || _c === void 0 ? void 0 : _c.call(_b, '[data-is-live="true"][axis-id]');
    if (!target || target.tagName !== "BUTTON") {
        return;
    }
    const axisId = target.getAttribute("axis-id");
    if (!axisId) {
        return;
    }
    window.dispatchEvent(new CustomEvent("TPMessageResponse", {
        detail: {
            type: "liveCarouselClick",
            axisId: String(axisId),
        },
    }));
};
if (!window.injectScriptLoaded) {
    console.log("Browse script loaded");
    window.injectScriptLoaded = true;
    window.telepartyProgrammaticCarouselClickUntil = 0;
    window.reactPropertyPathCache = window.reactPropertyPathCache || {};
    window.addEventListener("TPMessage", function (evt) {
        var _a;
        var type = evt.detail.type;
        if (type === "getVideoId") {
            const usePlayingStream = !!evt.detail.usePlayingStream;
            const videoId = getVideoId(usePlayingStream);
            window.dispatchEvent(new CustomEvent("TPMessageResponse", {
                detail: {
                    type: "getVideoId",
                    videoId,
                    usePlayingStream,
                },
            }));
        }
        else if (type === "clickLiveArticle") {
            const axisId = evt.detail.axisId;
            clickCorrectLiveEl(axisId);
        }
        else if (type === "suppressCarouselBroadcast") {
            const durationMs = (_a = evt.detail.durationMs) !== null && _a !== void 0 ? _a : 1000;
            window.telepartyProgrammaticCarouselClickUntil = Date.now() + durationMs;
        }
    });
    document.addEventListener("click", onLiveCarouselClick, true);
}
const getReactInternalNode = (el) => {
    if (!el)
        return null;
    const key = Object.keys(el).find((k) => k.startsWith("__reactInternalInstance") || k.startsWith("__reactFiber"));
    return key ? el[key] : null;
};
const shouldSkipObject = (obj) => {
    if (!obj || (typeof obj !== "object" && typeof obj !== "function"))
        return true;
    // avoid DOM / browser globals that can trigger cross-origin access
    if (obj === window)
        return true;
    if (obj === document)
        return true;
    if (typeof Node !== "undefined" && obj instanceof Node)
        return true;
    if (typeof Window !== "undefined" && obj instanceof Window)
        return true;
    return false;
};
const getValueAtPath = (root, path) => {
    if (!root || !Array.isArray(path) || path.length === 0) {
        return undefined;
    }
    let current = root;
    for (const key of path) {
        if (current == null) {
            return undefined;
        }
        try {
            current = current[key];
        }
        catch (_a) {
            return undefined;
        }
    }
    return current;
};
const walkReactElementForKey = (element, cacheKey, targetKey) => {
    const root = getReactInternalNode(element);
    if (!root)
        return null;
    const cache = window.reactPropertyPathCache || {};
    const cachedPath = cache[cacheKey];
    if (cachedPath) {
        const cachedValue = getValueAtPath(root, cachedPath);
        if (cachedValue !== null && cachedValue !== undefined) {
            return cachedValue;
        }
    }
    const seen = new WeakSet();
    const walk = (obj, currentPath) => {
        if (shouldSkipObject(obj))
            return null;
        if (seen.has(obj))
            return null;
        seen.add(obj);
        let keys;
        try {
            keys = Reflect.ownKeys(obj);
        }
        catch (_a) {
            return null;
        }
        for (const key of keys) {
            let value;
            try {
                value = obj[key];
            }
            catch (_b) {
                continue;
            }
            const nextPath = currentPath.concat(key);
            if (key === targetKey) {
                window.reactPropertyPathCache[cacheKey] = nextPath;
                return value;
            }
            const found = walk(value, nextPath);
            if (found !== null && found !== undefined) {
                return found;
            }
        }
        return null;
    };
    return walk(root, []);
};
const getActiveCarouselAxisId = () => {
    var _a;
    const nowPlaying = document.querySelector('[data-is-live="true"][title^="Now Playing"]');
    const axisId = nowPlaying === null || nowPlaying === void 0 ? void 0 : nowPlaying.getAttribute("axis-id");
    if (axisId) {
        return String(axisId);
    }
    const activeItems = document.querySelectorAll('[data-is-live="true"][active-playlist="true"]');
    if (activeItems.length === 1) {
        const singleAxisId = (_a = activeItems[0]) === null || _a === void 0 ? void 0 : _a.getAttribute("axis-id");
        if (singleAxisId) {
            return String(singleAxisId);
        }
    }
    return null;
};
const getReactContentAxisId = () => {
    const overlayEl = document.querySelector("#jasper-player-overlay");
    const id = walkReactElementForKey(overlayEl, "videoId", "content_id");
    if (id != null && id !== "") {
        return String(id);
    }
    return null;
};
const getPlayingStreamAxisId = () => {
    return getReactContentAxisId() || getActiveCarouselAxisId();
};
const isStreamCurrentlyPlaying = (axisId) => {
    if (!axisId) {
        return false;
    }
    const nowPlayingId = getActiveCarouselAxisId();
    const reactAxisId = getReactContentAxisId();
    if (nowPlayingId && reactAxisId) {
        if (String(nowPlayingId) !== String(reactAxisId)) {
            return false;
        }
        return String(nowPlayingId) === String(axisId);
    }
    const playingId = nowPlayingId || reactAxisId;
    return playingId != null && String(playingId) === String(axisId);
};
const getVideoId = (usePlayingStream = false) => {
    // on non-live page: just return the full path
    if (!window.location.pathname.startsWith("/live")) {
        return window.location.pathname.slice(1);
    }
    const urlAxisId = new URLSearchParams(window.location.search).get("axisId");
    // Polling / route detection: only report the stream that is actually playing.
    if (usePlayingStream) {
        const playingAxisId = getPlayingStreamAxisId();
        if (playingAxisId) {
            return `live::${playingAxisId}`;
        }
        return undefined;
    }
    // Party join / sync: prefer URL axisId so we do not fight the default carousel on load.
    if (urlAxisId) {
        return `live::${urlAxisId}`;
    }
    const playingAxisId = getPlayingStreamAxisId();
    if (playingAxisId) {
        return `live::${playingAxisId}`;
    }
    return undefined;
};
const findLiveCarouselButton = (axisId) => {
    const liveCandidates = document.querySelectorAll(`[axis-id="${axisId}"][data-is-live="true"]`);
    for (const el of liveCandidates) {
        if (el.tagName === "BUTTON") {
            return el;
        }
    }
    return liveCandidates[0] || null;
};
const clickCorrectLiveEl = (axisId) => {
    if (!axisId || isStreamCurrentlyPlaying(axisId)) {
        return;
    }
    const liveEl = findLiveCarouselButton(axisId);
    if (liveEl) {
        window.telepartyProgrammaticCarouselClickUntil = Date.now() + 1000;
        liveEl.scrollIntoView({ block: "nearest", inline: "center" });
        liveEl.click();
    }
};

/******/ })()
;