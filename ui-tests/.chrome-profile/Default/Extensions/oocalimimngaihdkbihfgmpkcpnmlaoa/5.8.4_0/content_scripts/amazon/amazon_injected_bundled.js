/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;
(function initializeTelepartyAmazon() {
    if (window.telepartyAmazonInjectLoaded) {
        return;
    }
    window.telepartyAmazonInjectLoaded = true;
    window.teleparty = window.teleparty || {};
    window.teleparty.injectScriptLoaded = true;
    const TP_PATCHED = "__tpAmazonPatched";
    const POLL_MS = 250;
    const URL_POLL_MS = 500;
    const WEB_PLAYER_REFRESH_MS = 1000;
    /** @type {any} */
    let webPlayer = null;
    let lastUrl = location.href;
    /** @type {{
     *   playbackState: string,
     *   currentTime: number,
     *   adPlaying: boolean,
     *   videoId: string | null,
     *   duration: number,
     *   updatedAt: number,
     *   source: "webPlayer" | "fallback" | "none"
     * }} */
    let playerState = {
        playbackState: "paused",
        currentTime: 0,
        adPlaying: false,
        videoId: null,
        duration: 0,
        updatedAt: 0,
        source: "none",
    };
    function getReactInternalNode(el) {
        if (!el)
            return null;
        const key = Object.keys(el).find((k) => k.startsWith("__reactInternalInstance") || k.startsWith("__reactFiber"));
        return key ? el[key] : null;
    }
    function getContentId(wp) {
        if (!wp)
            return null;
        return wp.currentTitleId || wp.contentId || wp.currentContentId || null;
    }
    function findAllWebPlayers() {
        var _a, _b, _c;
        const players = [];
        const seen = new Set();
        for (const el of document.querySelectorAll("*")) {
            const node = getReactInternalNode(el);
            const stateNode = (_b = (_a = node === null || node === void 0 ? void 0 : node.return) === null || _a === void 0 ? void 0 : _a.stateNode) !== null && _b !== void 0 ? _b : node === null || node === void 0 ? void 0 : node.stateNode;
            const candidate = (_c = stateNode === null || stateNode === void 0 ? void 0 : stateNode.context) === null || _c === void 0 ? void 0 : _c.webPlayer;
            if (!candidate || typeof candidate.refreshEnvelopeCallback !== "function") {
                continue;
            }
            if (seen.has(candidate)) {
                continue;
            }
            seen.add(candidate);
            players.push(candidate);
        }
        return players;
    }
    function findWebPlayer() {
        const players = findAllWebPlayers();
        if (players.length === 0) {
            return null;
        }
        const withTitle = players.find((wp) => getContentId(wp) != null);
        return withTitle || null;
    }
    function isInAd(obj) {
        var _a, _b, _c;
        try {
            const timeline = obj === null || obj === void 0 ? void 0 : obj.timeline;
            if (!timeline)
                return false;
            const index = (_a = obj === null || obj === void 0 ? void 0 : obj.currentTime) === null || _a === void 0 ? void 0 : _a.currentTimelineItemIndex;
            if (index == null)
                return false;
            const item = (_b = timeline.items) === null || _b === void 0 ? void 0 : _b[index];
            if (!(item === null || item === void 0 ? void 0 : item.contentId))
                return false;
            const info = (_c = timeline.contentInfos) === null || _c === void 0 ? void 0 : _c[item.contentId];
            if (!(info === null || info === void 0 ? void 0 : info.contentType))
                return false;
            return info.contentType === "Advertisement" || info.contentType === "AdTransition";
        }
        catch (_d) {
            return false;
        }
    }
    function mapPlaybackState(raw) {
        if (typeof raw !== "string") {
            return "paused";
        }
        switch (raw) {
            case "Playing":
            case "playing":
                return "playing";
            case "Waiting":
            case "waiting":
            case "Buffering":
            case "buffering":
            case "Loading":
            case "loading":
                return "loading";
            case "Ready":
            case "ready":
                return "ready";
            case "Paused":
            case "paused":
            default:
                return "paused";
        }
    }
    function isSettledPlaybackState(state) {
        return state === "playing" || state === "paused" || state === "ready";
    }
    function wasPausedBeforeSeek() {
        // Only true user-paused — do not treat Ready (post-buffer) as paused.
        return playerState.playbackState === "paused";
    }
    function wasPlayingBeforeSeek() {
        return playerState.playbackState === "playing";
    }
    // --- React fallback (getPropsAlt2 path only) ---
    function findElementWithTimelineContext(root = document) {
        var _a, _b, _c, _d;
        const allEls = root.querySelectorAll("*");
        let firstTimelineEl = null;
        for (const el of allEls) {
            const node = getReactInternalNode(el);
            const timelineInfo = (_d = (_c = (_b = (_a = node === null || node === void 0 ? void 0 : node.return) === null || _a === void 0 ? void 0 : _a.stateNode) === null || _b === void 0 ? void 0 : _b.context) === null || _c === void 0 ? void 0 : _c.timeline) === null || _d === void 0 ? void 0 : _d.timelineInfo;
            if (!timelineInfo)
                continue;
            if (!firstTimelineEl)
                firstTimelineEl = el;
            if (timelineInfo.positionMs != null && timelineInfo.positionMs !== 0) {
                return el;
            }
        }
        return firstTimelineEl;
    }
    function findElementWithSeekbarPositionContext() {
        var _a, _b, _c, _d;
        let fallback = null;
        for (const el of document.querySelectorAll("*")) {
            const node = getReactInternalNode(el);
            const seekBar = (_d = (_c = (_b = (_a = node === null || node === void 0 ? void 0 : node.return) === null || _a === void 0 ? void 0 : _a.stateNode) === null || _b === void 0 ? void 0 : _b.context) === null || _c === void 0 ? void 0 : _c.seekBar) === null || _d === void 0 ? void 0 : _d.seekBar;
            if (!seekBar)
                continue;
            if (seekBar.positionMs && seekBar.positionMs !== 0) {
                return el;
            }
            if (!fallback)
                fallback = el;
        }
        return fallback;
    }
    function findElementWithTitleContext() {
        return [...document.querySelectorAll("*")].find((el) => {
            var _a, _b, _c;
            const node = getReactInternalNode(el);
            return !!((_c = (_b = (_a = node === null || node === void 0 ? void 0 : node.return) === null || _a === void 0 ? void 0 : _a.stateNode) === null || _b === void 0 ? void 0 : _b.context) === null || _c === void 0 ? void 0 : _c.title);
        });
    }
    function findElementWithAdContext(root = document) {
        var _a, _b, _c;
        for (const el of root.querySelectorAll("*")) {
            const node = getReactInternalNode(el);
            if ((_c = (_b = (_a = node === null || node === void 0 ? void 0 : node.return) === null || _a === void 0 ? void 0 : _a.stateNode) === null || _b === void 0 ? void 0 : _b.context) === null || _c === void 0 ? void 0 : _c.adPlayback) {
                return el;
            }
        }
        return null;
    }
    function getPropsAlt2() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
        try {
            const timelineEl = findElementWithTimelineContext();
            const sbPosEl = findElementWithSeekbarPositionContext();
            const titleEl = findElementWithTitleContext();
            const node = getReactInternalNode(timelineEl);
            const timelineInfo = (_d = (_c = (_b = (_a = node === null || node === void 0 ? void 0 : node.return) === null || _a === void 0 ? void 0 : _a.stateNode) === null || _b === void 0 ? void 0 : _b.context) === null || _c === void 0 ? void 0 : _c.timeline) === null || _d === void 0 ? void 0 : _d.timelineInfo;
            const seekbarPosition = (_k = (_j = (_h = (_g = (_f = (_e = getReactInternalNode(sbPosEl)) === null || _e === void 0 ? void 0 : _e.return) === null || _f === void 0 ? void 0 : _f.stateNode) === null || _g === void 0 ? void 0 : _g.context) === null || _h === void 0 ? void 0 : _h.seekBar) === null || _j === void 0 ? void 0 : _j.seekBar) === null || _k === void 0 ? void 0 : _k.positionMs;
            const contentType = (_q = (_p = (_o = (_m = (_l = getReactInternalNode(titleEl)) === null || _l === void 0 ? void 0 : _l.return) === null || _m === void 0 ? void 0 : _m.stateNode) === null || _o === void 0 ? void 0 : _o.context) === null || _p === void 0 ? void 0 : _p.title) === null || _q === void 0 ? void 0 : _q.videoMaterialType;
            const isLive = contentType === null || contentType === void 0 ? void 0 : contentType.toLowerCase().includes("live");
            const adEl = findElementWithAdContext();
            const adInfo = adEl
                ? (_v = (_u = (_t = (_s = (_r = getReactInternalNode(adEl)) === null || _r === void 0 ? void 0 : _r.return) === null || _s === void 0 ? void 0 : _s.stateNode) === null || _t === void 0 ? void 0 : _t.context) === null || _u === void 0 ? void 0 : _u.adPlayback) === null || _v === void 0 ? void 0 : _v.currentAdInfo
                : null;
            const duration = ((_w = timelineInfo === null || timelineInfo === void 0 ? void 0 : timelineInfo.lastPlayablePositionMs) !== null && _w !== void 0 ? _w : 0) +
                Math.max(0, (seekbarPosition !== null && seekbarPosition !== void 0 ? seekbarPosition : 0) - ((_x = timelineInfo === null || timelineInfo === void 0 ? void 0 : timelineInfo.positionMs) !== null && _x !== void 0 ? _x : 0));
            return {
                positionMs: (_y = seekbarPosition !== null && seekbarPosition !== void 0 ? seekbarPosition : timelineInfo === null || timelineInfo === void 0 ? void 0 : timelineInfo.positionMs) !== null && _y !== void 0 ? _y : null,
                lastPlayablePositionMs: duration,
                state: (_4 = (_3 = (_2 = (_1 = (_0 = (_z = node === null || node === void 0 ? void 0 : node.return) === null || _z === void 0 ? void 0 : _z.stateNode) === null || _0 === void 0 ? void 0 : _0.context) === null || _1 === void 0 ? void 0 : _1.uiStatus) === null || _2 === void 0 ? void 0 : _2.uiStatus) === null || _3 === void 0 ? void 0 : _3.state) !== null && _4 !== void 0 ? _4 : null,
                currentAdInfo: adInfo,
                isLive,
            };
        }
        catch (_5) {
            return null;
        }
    }
    function findElementWithSeekContext() {
        return [...document.querySelectorAll("*")].find((el) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const node = getReactInternalNode(el);
            return (!!((_e = (_d = (_c = (_b = (_a = node === null || node === void 0 ? void 0 : node.return) === null || _a === void 0 ? void 0 : _a.stateNode) === null || _b === void 0 ? void 0 : _b.props) === null || _c === void 0 ? void 0 : _c.context) === null || _d === void 0 ? void 0 : _d.seekBar) === null || _e === void 0 ? void 0 : _e.seekToPosition) ||
                !!((_j = (_h = (_g = (_f = node === null || node === void 0 ? void 0 : node.return) === null || _f === void 0 ? void 0 : _f.stateNode) === null || _g === void 0 ? void 0 : _g.context) === null || _h === void 0 ? void 0 : _h.seekBar) === null || _j === void 0 ? void 0 : _j.seekToPosition));
        });
    }
    function getSeekBarContext() {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            const match = findElementWithSeekContext();
            if (!match)
                return null;
            const node = getReactInternalNode(match);
            return ((_d = (_c = (_b = (_a = node === null || node === void 0 ? void 0 : node.return) === null || _a === void 0 ? void 0 : _a.stateNode) === null || _b === void 0 ? void 0 : _b.props) === null || _c === void 0 ? void 0 : _c.context) === null || _d === void 0 ? void 0 : _d.seekBar) || ((_g = (_f = (_e = node === null || node === void 0 ? void 0 : node.return) === null || _e === void 0 ? void 0 : _e.stateNode) === null || _f === void 0 ? void 0 : _f.context) === null || _g === void 0 ? void 0 : _g.seekBar) || null;
        }
        catch (_h) {
            return null;
        }
    }
    function seekFallback(positionMs) {
        const seekBar = getSeekBarContext();
        if (!seekBar || typeof seekBar.seekToPosition !== "function") {
            return false;
        }
        seekBar.seekToPosition(positionMs);
        return true;
    }
    function getVideoElement() {
        const videos = Array.from(document.querySelectorAll("video"));
        if (videos.length === 0)
            return null;
        const candidates = videos.filter((v) => v.readyState > 0);
        if (candidates.length > 0) {
            return candidates.reduce((best, current) => (current.readyState > best.readyState ? current : best));
        }
        return videos[0];
    }
    // --- State / poll ---
    function emitUpdateState() {
        window.dispatchEvent(new CustomEvent("FromNode", {
            detail: {
                type: "UpdateState",
                playbackState: playerState.playbackState,
                currentTime: playerState.currentTime,
                adPlaying: playerState.adPlaying,
                videoId: playerState.videoId,
                duration: playerState.duration,
                updatedAt: playerState.updatedAt,
                source: playerState.source,
            },
        }));
    }
    function emitPlayerEvent(action, extra) {
        window.dispatchEvent(new CustomEvent("FromNode", {
            detail: Object.assign({ type: "PlayerEvent", action, playbackState: playerState.playbackState, currentTime: playerState.currentTime, adPlaying: playerState.adPlaying, videoId: playerState.videoId, updatedAt: playerState.updatedAt }, (extra || {})),
        }));
    }
    function pollFromWebPlayer(wp) {
        var _a, _b, _c;
        const adPlaying = isInAd(wp);
        const playbackState = mapPlaybackState(wp.playbackState);
        const position = Number((_a = wp === null || wp === void 0 ? void 0 : wp.currentTime) === null || _a === void 0 ? void 0 : _a.currentPosition);
        const videoId = getContentId(wp);
        let duration = playerState.duration;
        const lastPlayable = Number((_c = (_b = wp === null || wp === void 0 ? void 0 : wp.timeline) === null || _b === void 0 ? void 0 : _b.timelineInfo) === null || _c === void 0 ? void 0 : _c.lastPlayablePositionMs);
        if (Number.isFinite(lastPlayable) && lastPlayable > 0) {
            duration = lastPlayable;
        }
        playerState = {
            playbackState,
            currentTime: resolveSeekPosition(position, playbackState, adPlaying),
            adPlaying,
            videoId,
            duration,
            updatedAt: Date.now(),
            source: "webPlayer",
        };
        return playerState;
    }
    function pollFromFallback() {
        const props = getPropsAlt2();
        if (!props) {
            playerState = Object.assign(Object.assign({}, playerState), { updatedAt: Date.now(), source: "none" });
            return playerState;
        }
        const adPlaying = props.currentAdInfo != null;
        const playbackState = mapPlaybackState(props.state);
        const position = Number(props.positionMs);
        playerState = {
            playbackState,
            currentTime: resolveSeekPosition(position, playbackState, adPlaying),
            adPlaying,
            videoId: playerState.videoId,
            duration: Number(props.lastPlayablePositionMs) || playerState.duration,
            updatedAt: Date.now(),
            source: "fallback",
        };
        return playerState;
    }
    function poll() {
        if (webPlayer) {
            return pollFromWebPlayer(webPlayer);
        }
        return pollFromFallback();
    }
    // --- Monkey patch play / pause / seek ---
    let seekSettleTargetMs = null;
    let seekSettling = false;
    let seekSettleSafetyUntil = 0;
    const SEEK_SETTLE_SAFETY_MS = 10000;
    /** When we restore play/pause after our own seek, don't broadcast synthetic events. */
    let suppressPauseEvent = false;
    let suppressPlayEvent = false;
    function beginSeekSettle(targetMs) {
        if (!Number.isFinite(targetMs))
            return;
        seekSettleTargetMs = targetMs;
        seekSettling = true;
        seekSettleSafetyUntil = Date.now() + SEEK_SETTLE_SAFETY_MS;
    }
    function endSeekSettle() {
        seekSettling = false;
        seekSettleTargetMs = null;
        seekSettleSafetyUntil = 0;
    }
    function resolveSeekPosition(position, playbackState, adPlaying) {
        if (adPlaying) {
            return playerState.currentTime;
        }
        if (!seekSettling || seekSettleTargetMs == null) {
            return Number.isFinite(position) ? position : playerState.currentTime;
        }
        if (isSettledPlaybackState(playbackState) || Date.now() >= seekSettleSafetyUntil) {
            endSeekSettle();
            return Number.isFinite(position) ? position : playerState.currentTime;
        }
        return seekSettleTargetMs;
    }
    function getPlayerMethods(obj) {
        const methods = new Set();
        let cur = obj;
        while (cur && cur !== Object.prototype) {
            for (const name of Object.getOwnPropertyNames(cur)) {
                try {
                    if (typeof obj[name] === "function" && name !== "constructor") {
                        methods.add(name);
                    }
                }
                catch (_a) {
                    // ignore accessors that throw
                }
            }
            cur = Object.getPrototypeOf(cur);
        }
        return [...methods];
    }
    function patchControlMethod(obj, name) {
        if (!obj || typeof obj[name] !== "function" || obj[name][TP_PATCHED]) {
            return false;
        }
        const original = obj[name];
        const wrapped = function (...args) {
            var _a;
            console.log("[TpDebug]", name, args);
            if (name === "play") {
                playerState = Object.assign(Object.assign({}, playerState), { playbackState: "playing", updatedAt: Date.now() });
                if (!suppressPlayEvent) {
                    emitPlayerEvent("play");
                }
            }
            else if (name === "pause") {
                playerState = Object.assign(Object.assign({}, playerState), { playbackState: "paused", updatedAt: Date.now() });
                if (!suppressPauseEvent) {
                    emitPlayerEvent("pause");
                }
            }
            else if (name === "seek") {
                const seekMs = Number(args[0]);
                if (Number.isFinite(seekMs) && !playerState.adPlaying) {
                    beginSeekSettle(seekMs);
                    playerState = Object.assign(Object.assign({}, playerState), { currentTime: seekMs, updatedAt: Date.now() });
                }
                else {
                    playerState = Object.assign(Object.assign({}, playerState), { updatedAt: Date.now() });
                }
                emitPlayerEvent("seek", { seekTargetMs: Number.isFinite(seekMs) ? seekMs : null });
            }
            else if (name === "start") {
                const titleId = (_a = args[0]) === null || _a === void 0 ? void 0 : _a.titleId;
                if (typeof titleId === "string" && titleId) {
                    playerState = Object.assign(Object.assign({}, playerState), { videoId: titleId, updatedAt: Date.now() });
                    emitPlayerEvent("start", { titleId });
                }
            }
            else if (name === "onStateChange") {
                const nextRaw = args[0];
                const mapped = mapPlaybackState(nextRaw);
                playerState = Object.assign(Object.assign({}, playerState), { playbackState: mapped, updatedAt: Date.now() });
                if (nextRaw === "Waiting" || nextRaw === "waiting") {
                    emitPlayerEvent("bufferingStart", { playbackState: mapped, rawState: nextRaw });
                }
                else if (nextRaw === "Ready" ||
                    nextRaw === "ready" ||
                    nextRaw === "Playing" ||
                    nextRaw === "playing" ||
                    nextRaw === "Paused" ||
                    nextRaw === "paused") {
                    emitPlayerEvent("bufferingEnd", { playbackState: mapped, rawState: nextRaw });
                }
            }
            return original.apply(this, args);
        };
        wrapped[TP_PATCHED] = true;
        try {
            Object.defineProperty(obj, name, {
                configurable: true,
                writable: true,
                value: wrapped,
            });
        }
        catch (_a) {
            obj[name] = wrapped;
        }
        return true;
    }
    function patchWebPlayer(wp) {
        const methods = getPlayerMethods(wp);
        const patched = [];
        for (const name of methods) {
            if (patchControlMethod(wp, name)) {
                patched.push(name);
            }
        }
        if (patched.length > 0) {
            console.log("[TpDebug] patched webPlayer methods", patched);
        }
        window.__tpAmazonWebPlayer = wp;
    }
    function refreshWebPlayer() {
        const next = findWebPlayer();
        if (next && next !== webPlayer) {
            webPlayer = next;
            patchWebPlayer(webPlayer);
            poll();
            return true;
        }
        if (!next) {
            webPlayer = null;
            window.__tpAmazonWebPlayer = null;
            return false;
        }
        // same instance — ensure patches still applied
        patchWebPlayer(webPlayer);
        return true;
    }
    function doStart(titleId) {
        if (!titleId || typeof titleId !== "string") {
            return { ok: false, reason: "invalid_title_id" };
        }
        if (!webPlayer || typeof webPlayer.start !== "function") {
            return { ok: false, reason: "no_web_player" };
        }
        const startArgs = { titleId };
        console.log("[TpDebug] doStart calling webPlayer.start", startArgs);
        webPlayer.start(startArgs);
        return { ok: true, reason: null };
    }
    function doPlay() {
        if (webPlayer && typeof webPlayer.play === "function") {
            webPlayer.play();
            return true;
        }
        const video = getVideoElement();
        if (video) {
            video.play();
            return true;
        }
        return false;
    }
    function doPause() {
        if (webPlayer && typeof webPlayer.pause === "function") {
            webPlayer.pause();
            return true;
        }
        const video = getVideoElement();
        if (video) {
            video.pause();
            return true;
        }
        return false;
    }
    function doSeek(positionMs) {
        const ms = Number(positionMs);
        if (!Number.isFinite(ms) || ms < 0) {
            return false;
        }
        const keepPaused = wasPausedBeforeSeek();
        const keepPlaying = wasPlayingBeforeSeek();
        beginSeekSettle(ms);
        let ok = false;
        if (webPlayer && typeof webPlayer.seek === "function") {
            webPlayer.seek(ms);
            ok = true;
        }
        else {
            ok = seekFallback(ms);
        }
        // Restore prior play/pause without broadcasting synthetic events.
        if (ok && keepPaused) {
            suppressPauseEvent = true;
            try {
                doPause();
            }
            finally {
                suppressPauseEvent = false;
            }
        }
        else if (ok && keepPlaying) {
            suppressPlayEvent = true;
            try {
                doPlay();
            }
            finally {
                suppressPlayEvent = false;
            }
        }
        return ok;
    }
    window.addEventListener("AmazonVideoMessage", function (evt) {
        var _a;
        const type = (_a = evt.detail) === null || _a === void 0 ? void 0 : _a.type;
        if (type === "play") {
            const ok = doPlay();
            window.dispatchEvent(new CustomEvent("FromNode", {
                detail: { type: "ActionResult", action: "play", ok, updatedAt: Date.now() },
            }));
        }
        else if (type === "pause") {
            const ok = doPause();
            window.dispatchEvent(new CustomEvent("FromNode", {
                detail: { type: "ActionResult", action: "pause", ok, updatedAt: Date.now() },
            }));
        }
        else if (type === "seek") {
            const ok = doSeek(evt.detail.positionMs);
            window.dispatchEvent(new CustomEvent("FromNode", {
                detail: {
                    type: "ActionResult",
                    action: "seek",
                    ok,
                    positionMs: Number(evt.detail.positionMs),
                    updatedAt: Date.now(),
                },
            }));
        }
        else if (type === "start") {
            const titleId = evt.detail.titleId;
            const result = doStart(titleId);
            window.dispatchEvent(new CustomEvent("FromNode", {
                detail: {
                    type: "ActionResult",
                    action: "start",
                    ok: !!result.ok,
                    reason: result.reason,
                    titleId,
                    updatedAt: Date.now(),
                },
            }));
        }
        else if (type === "poll") {
            poll();
            emitUpdateState();
        }
        else if (type === "refreshWebPlayer") {
            refreshWebPlayer();
            poll();
            emitUpdateState();
        }
    });
    window.__tpGetWebPlayer = function () {
        return webPlayer || findWebPlayer();
    };
    window.__tpGetAllWebPlayers = function () {
        return findAllWebPlayers();
    };
    refreshWebPlayer();
    poll();
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            refreshWebPlayer();
        }
    }, URL_POLL_MS);
    // Re-select the active webPlayer (prefer one with a titleId) every second.
    setInterval(() => {
        refreshWebPlayer();
    }, WEB_PLAYER_REFRESH_MS);
    // Keep inject-side state warm; content script still drives sync via bridge poll.
    setInterval(() => {
        poll();
    }, POLL_MS);
})();

/******/ })()
;