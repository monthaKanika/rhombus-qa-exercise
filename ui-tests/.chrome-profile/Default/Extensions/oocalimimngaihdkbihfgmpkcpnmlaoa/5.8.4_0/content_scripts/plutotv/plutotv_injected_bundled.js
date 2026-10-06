/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 1385
() {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(() => {
    if (window.injectScriptLoaded) {
        return;
    }
    window.injectScriptLoaded = true;
    const PLAYER_STATE_ID = "tp-pluto-player";
    const PLAYER_HOST_SELECTOR = '[data-testid="aop-vod-slot"], #alwaysOnPlayerContainer, .player-wrapper, #main-content';
    const getFullscreenHost = (fromEl) => {
        const el = fromEl && typeof fromEl.closest === "function" ? fromEl : document.querySelector("video");
        if (!el || typeof el.closest !== "function") {
            return document.querySelector(PLAYER_HOST_SELECTOR);
        }
        return (el.closest('[data-testid="aop-vod-slot"]') ||
            el.closest("#alwaysOnPlayerContainer") ||
            el.closest(".player-wrapper") ||
            el.closest("#main-content"));
    };
    const patchFullscreenRequest = (proto, methodName) => {
        const original = proto[methodName];
        if (typeof original !== "function" || original._tpPlutoFullscreen) {
            return;
        }
        const wrapped = function (...args) {
            const host = getFullscreenHost(this);
            if (host && host !== this) {
                return original.apply(host, args);
            }
            return original.apply(this, args);
        };
        wrapped._tpPlutoFullscreen = true;
        proto[methodName] = wrapped;
    };
    patchFullscreenRequest(Element.prototype, "requestFullscreen");
    patchFullscreenRequest(Element.prototype, "webkitRequestFullscreen");
    patchFullscreenRequest(HTMLElement.prototype, "webkitRequestFullScreen");
    const videoProto = HTMLVideoElement.prototype;
    if (typeof videoProto.webkitEnterFullscreen === "function" && !videoProto.webkitEnterFullscreen._tpPlutoFullscreen) {
        const originalEnter = videoProto.webkitEnterFullscreen;
        videoProto.webkitEnterFullscreen = function () {
            const host = getFullscreenHost(this);
            if (host && host !== this && typeof host.requestFullscreen === "function") {
                return host.requestFullscreen();
            }
            return originalEnter.apply(this);
        };
        videoProto.webkitEnterFullscreen._tpPlutoFullscreen = true;
    }
    const getStateElement = () => {
        let el = document.getElementById(PLAYER_STATE_ID);
        if (!el) {
            el = document.createElement("div");
            el.id = PLAYER_STATE_ID;
            el.style.display = "none";
            (document.body || document.documentElement).appendChild(el);
        }
        return el;
    };
    const getVideo = () => document.querySelector("video");
    const getPlayer = () => { var _a; return (_a = getVideo()) === null || _a === void 0 ? void 0 : _a.player; };
    const firstString = (...values) => {
        for (const value of values) {
            if (typeof value === "string" && value.trim()) {
                return value.trim();
            }
            if (typeof value === "number" && Number.isFinite(value)) {
                return String(value);
            }
        }
        return "";
    };
    const isLiveMetadata = (meta) => {
        if (!meta || typeof meta !== "object") {
            return false;
        }
        return meta.isLive === true || meta.streamType === "live" || meta.mediaType === "Live";
    };
    const MOVIE_PATH = /(?:^|\/)((?:[a-z]{2}(?:-[a-z]{2})?\/)?movies\/[^/]+)/i;
    const EPISODE_PATH = /(?:^|\/)((?:[a-z]{2}(?:-[a-z]{2})?\/)?shows\/[^/]+\/episode\/[^/]+)/i;
    const ON_DEMAND_PATH = /(?:^|\/)((?:[a-z]{2}(?:-[a-z]{2})?\/)?on-demand\/.+)/i;
    const watchPathFromValue = (value) => {
        if (typeof value !== "string" || !value.trim()) {
            return "";
        }
        let path = value.trim();
        try {
            if (/^https?:/i.test(path)) {
                path = new URL(path).pathname;
            }
        }
        catch (_a) {
            /* keep original */
        }
        path = path.replace(/^\/+/, "").replace(/^pluto\.tv\//i, "");
        const episode = path.match(EPISODE_PATH);
        if (episode) {
            return episode[1];
        }
        const movie = path.match(MOVIE_PATH);
        if (movie) {
            return movie[1];
        }
        const onDemand = path.match(ON_DEMAND_PATH);
        if (onDemand) {
            return onDemand[1].replace(/\/+$/, "");
        }
        return "";
    };
    const extractWatchPath = (meta, movieContent) => {
        const values = [
            meta.videoPageUrl,
            meta.url,
            meta.showPageUrl,
            meta.path,
            movieContent.url,
            movieContent.videoPageUrl,
            movieContent.path,
        ];
        for (const value of values) {
            const path = watchPathFromValue(value);
            if (path) {
                return path;
            }
        }
        return "";
    };
    const compactMetadata = (meta) => {
        var _a;
        if (!meta || typeof meta !== "object") {
            return null;
        }
        const listing = Array.isArray(meta.currentListing) ? meta.currentListing[0] : undefined;
        const movieContent = meta.movieContent && typeof meta.movieContent === "object" ? meta.movieContent : {};
        const isLive = isLiveMetadata(meta);
        const seasonNum = firstString(meta.seasonNum, meta.showSeasonNumber);
        const episodeNum = firstString(meta.episodeNum, meta.showEpisodeNumber);
        const isEpisode = Number(seasonNum) > 0 && Number(episodeNum) > 0;
        if (isLive) {
            return {
                isLive: true,
                streamType: firstString(meta.streamType, "live"),
                mediaType: firstString(meta.mediaType, "Live"),
                originId: firstString(meta.originId),
                title: "",
                videoTitle: firstString(meta.liveVideoTitle, meta.videoTitle, listing === null || listing === void 0 ? void 0 : listing.title),
                movieTitle: "",
                seriesTitle: "",
                episodeTitle: "",
                seasonNum: "",
                episodeNum: "",
                channelName: firstString(meta.channelName, meta.liveTvChannel),
                liveVideoTitle: firstString(meta.liveVideoTitle, listing === null || listing === void 0 ? void 0 : listing.title, listing === null || listing === void 0 ? void 0 : listing.episodeTitle, meta.videoTitle),
                duration: Number(meta.duration) || 0,
                contentId: "",
                slug: "",
                path: "",
            };
        }
        const contentId = firstString(meta.contentId, meta.ptvEpisodeId, meta.episodeID, meta.episodeId, meta.videoId, movieContent.contentId, movieContent._id);
        const slug = firstString(meta.slug, movieContent.slug);
        const path = extractWatchPath(meta, movieContent);
        if (isEpisode) {
            return {
                isLive: false,
                streamType: firstString(meta.streamType, "vod"),
                mediaType: "episode",
                originId: firstString(meta.originId),
                title: firstString(meta.title, meta.showEpisodeTitle, meta.label),
                videoTitle: firstString(meta.videoTitle, meta.showEpisodeTitle, meta.title),
                movieTitle: "",
                seriesTitle: firstString(meta.seriesTitle, meta.showSeriesTitle),
                episodeTitle: firstString(meta.showEpisodeTitle, meta.title, meta.label),
                seasonNum,
                episodeNum,
                channelName: "",
                liveVideoTitle: "",
                duration: Number(meta.duration) || 0,
                contentId,
                slug,
                path,
            };
        }
        return {
            isLive: false,
            streamType: firstString(meta.streamType),
            mediaType: firstString(meta.mediaType, movieContent.mediaType, "Movie"),
            originId: firstString(meta.originId),
            title: firstString(meta.title, movieContent.title, meta.movieTitle),
            videoTitle: firstString(meta.videoTitle, meta.movieTitle, movieContent.title),
            movieTitle: firstString(meta.movieTitle, movieContent.title, meta.title),
            seriesTitle: "",
            episodeTitle: "",
            seasonNum: "",
            episodeNum: "",
            channelName: "",
            liveVideoTitle: "",
            duration: Number((_a = meta.duration) !== null && _a !== void 0 ? _a : movieContent.duration) || 0,
            contentId,
            slug,
            path,
        };
    };
    const publishPlayerState = () => {
        var _a, _b, _c, _d, _e;
        const el = getStateElement();
        const video = getVideo();
        const player = getPlayer();
        const metadata = compactMetadata((_a = player === null || player === void 0 ? void 0 : player.resource) === null || _a === void 0 ? void 0 : _a.metadata);
        const isLive = (metadata === null || metadata === void 0 ? void 0 : metadata.isLive) === true;
        const contentTime = Number(player === null || player === void 0 ? void 0 : player.contentTime);
        const duration = Number((_d = (_c = (_b = player === null || player === void 0 ? void 0 : player.contentDuration) !== null && _b !== void 0 ? _b : player === null || player === void 0 ? void 0 : player.duration) !== null && _c !== void 0 ? _c : video === null || video === void 0 ? void 0 : video.duration) !== null && _d !== void 0 ? _d : metadata === null || metadata === void 0 ? void 0 : metadata.duration);
        el.setAttribute("data-is-ad", !isLive && (player === null || player === void 0 ? void 0 : player.isAd) ? "true" : "false");
        el.setAttribute("data-is-live", isLive ? "true" : "false");
        el.setAttribute("data-origin-id", firstString(metadata === null || metadata === void 0 ? void 0 : metadata.originId, player === null || player === void 0 ? void 0 : player.originId, (_e = player === null || player === void 0 ? void 0 : player.resource) === null || _e === void 0 ? void 0 : _e.originId) || "");
        el.setAttribute("data-content-time", Number.isFinite(contentTime) ? String(contentTime) : "");
        el.setAttribute("data-duration", Number.isFinite(duration) && duration > 0 ? String(duration) : "");
        el.setAttribute("data-ready", player ? "true" : "false");
        try {
            el.setAttribute("data-metadata", metadata ? JSON.stringify(metadata) : "");
        }
        catch (_f) {
            el.setAttribute("data-metadata", "");
        }
    };
    const PATCH_MARK = "__tpPlutoPatched";
    const SETTLE_MS = 450;
    const SETTLE_STEP = 50;
    let tpApplying = false;
    let settleGen = 0;
    const withPlayer = (fn) => {
        const player = getPlayer();
        if (!player) {
            return;
        }
        try {
            fn(player);
        }
        catch (_a) {
            /* ignore */
        }
    };
    const getContentTime = () => {
        var _a;
        const contentTime = Number((_a = getPlayer()) === null || _a === void 0 ? void 0 : _a.contentTime);
        return Number.isFinite(contentTime) ? contentTime : NaN;
    };
    const isPaused = () => {
        var _a;
        const video = getVideo();
        if (video) {
            return video.paused;
        }
        const paused = (_a = getPlayer()) === null || _a === void 0 ? void 0 : _a.paused;
        return typeof paused === "boolean" ? paused : false;
    };
    const emitSettled = (action) => {
        publishPlayerState();
        window.postMessage({
            type: "TP_PLUTO_PLAYER_EVENT",
            action,
            contentTime: getContentTime(),
            paused: isPaused(),
        }, "*");
    };
    const settleAndEmit = (action, seekTargetSec) => {
        const gen = ++settleGen;
        const started = Date.now();
        let lastTime = getContentTime();
        let lastPaused = isPaused();
        let stablePolls = 0;
        const tick = () => {
            var _a, _b;
            if (gen !== settleGen) {
                return;
            }
            publishPlayerState();
            if (tpApplying || isLiveMetadata((_b = (_a = getPlayer()) === null || _a === void 0 ? void 0 : _a.resource) === null || _b === void 0 ? void 0 : _b.metadata)) {
                return;
            }
            const time = getContentTime();
            const paused = isPaused();
            const resolvedAction = action === "playPause" ? (paused ? "pause" : "play") : action;
            const playSettled = resolvedAction === "play" && !paused;
            const pauseSettled = resolvedAction === "pause" && paused;
            const seekSettled = resolvedAction === "seek" &&
                Number.isFinite(seekTargetSec) &&
                Number.isFinite(time) &&
                Math.abs(time - seekTargetSec) < 0.4;
            const timeStable = Number.isFinite(time) && Number.isFinite(lastTime) && Math.abs(time - lastTime) < 0.05;
            const pauseStable = paused === lastPaused;
            if ((resolvedAction === "seek" && timeStable) || (resolvedAction !== "seek" && pauseStable)) {
                stablePolls += 1;
            }
            else {
                stablePolls = 0;
            }
            lastTime = time;
            lastPaused = paused;
            if (playSettled || pauseSettled || seekSettled || stablePolls >= 2 || Date.now() - started >= SETTLE_MS) {
                emitSettled(resolvedAction);
                return;
            }
            setTimeout(tick, SETTLE_STEP);
        };
        setTimeout(tick, SETTLE_STEP);
    };
    const wrapMethod = (player, method, action) => {
        const original = player[method];
        if (typeof original !== "function" || original[PATCH_MARK]) {
            return;
        }
        const wrapped = function (...args) {
            const result = original.apply(this, args);
            const seekTarget = action === "seek" ? Number(args[0]) : NaN;
            const after = () => settleAndEmit(action, seekTarget);
            if (result && typeof result.then === "function") {
                result.then(after, after);
            }
            else {
                after();
            }
            return result;
        };
        wrapped[PATCH_MARK] = true;
        player[method] = wrapped;
    };
    const wrapPlayerFullscreen = (player, method) => {
        const original = player[method];
        if (typeof original !== "function" || original[PATCH_MARK]) {
            return;
        }
        const wrapped = function (...args) {
            const host = getFullscreenHost(getVideo());
            const exiting = method === "exitFullscreen" || args[0] === false;
            if (exiting) {
                if (document.fullscreenElement && typeof document.exitFullscreen === "function") {
                    return document.exitFullscreen();
                }
                return original.apply(this, args);
            }
            if (host && typeof host.requestFullscreen === "function") {
                if (document.fullscreenElement) {
                    return document.exitFullscreen();
                }
                return host.requestFullscreen();
            }
            return original.apply(this, args);
        };
        wrapped[PATCH_MARK] = true;
        player[method] = wrapped;
    };
    const patchPlayer = (player) => {
        if (!player) {
            return;
        }
        wrapMethod(player, "seek", "seek");
        wrapMethod(player, "play", "play");
        wrapMethod(player, "pause", "pause");
        wrapMethod(player, "playPause", "playPause");
        wrapMethod(player, "togglePlay", "playPause");
        wrapPlayerFullscreen(player, "fullscreen");
        wrapPlayerFullscreen(player, "enterFullscreen");
        wrapPlayerFullscreen(player, "exitFullscreen");
        wrapPlayerFullscreen(player, "toggleFullscreen");
        wrapPlayerFullscreen(player, "setFullscreen");
    };
    const applyFromTeleparty = (fn) => {
        tpApplying = true;
        settleGen += 1;
        try {
            withPlayer(fn);
        }
        finally {
            setTimeout(() => {
                tpApplying = false;
            }, SETTLE_MS + SETTLE_STEP);
        }
    };
    window.addEventListener("message", (event) => {
        var _a, _b;
        if (event.source !== window || !event.data) {
            return;
        }
        if (isLiveMetadata((_b = (_a = getPlayer()) === null || _a === void 0 ? void 0 : _a.resource) === null || _b === void 0 ? void 0 : _b.metadata)) {
            return;
        }
        if (event.data.type === "TP_PLUTO_SEEK" && Number.isFinite(event.data.time)) {
            applyFromTeleparty((player) => player.seek(event.data.time / 1000));
        }
        else if (event.data.type === "TP_PLUTO_PLAY") {
            applyFromTeleparty((player) => player.play());
        }
        else if (event.data.type === "TP_PLUTO_PAUSE") {
            applyFromTeleparty((player) => player.pause());
        }
    });
    const poll = () => {
        publishPlayerState();
        patchPlayer(getPlayer());
        setTimeout(poll, 250);
    };
    poll();
    const isNextControl = (target) => {
        return !!(target && typeof target.closest === "function" && target.closest("[data-controls='next'], button.btn-next"));
    };
    const isInParty = () => getStateElement().getAttribute("data-in-party") === "true";
    const isPlutoWatchUrl = (href) => {
        try {
            const url = new URL(href, window.location.href);
            if (!url.hostname.includes("pluto.tv")) {
                return false;
            }
            const path = url.pathname.replace(/^\/+|\/+$/g, "");
            return /(^|\/)(shows\/[^/]+\/episode\/[^/]+|movies\/[^/]+|on-demand\/.+)/i.test(path);
        }
        catch (_a) {
            return false;
        }
    };
    document.addEventListener("click", (event) => {
        if (!isNextControl(event.target)) {
            return;
        }
        window.postMessage({ type: "TP_PLUTO_NEXT_CLICK" }, "*");
    }, true);
    const navigation = window.navigation;
    if (navigation && typeof navigation.addEventListener === "function") {
        let allowTpNav = false;
        navigation.addEventListener("navigate", (event) => {
            if (allowTpNav || !isInParty()) {
                return;
            }
            if (!event.canIntercept || event.hashChange || event.downloadRequest) {
                return;
            }
            const dest = event.destination && event.destination.url;
            if (!dest || dest === window.location.href || !isPlutoWatchUrl(dest)) {
                return;
            }
            try {
                event.intercept({
                    handler: () => __awaiter(void 0, void 0, void 0, function* () {
                        window.postMessage({ type: "TP_PLUTO_REDIRECT", url: dest }, "*");
                        yield new Promise((resolve) => {
                            const timeout = setTimeout(resolve, 2500);
                            const onAck = (messageEvent) => {
                                var _a;
                                if (messageEvent.source !== window || ((_a = messageEvent.data) === null || _a === void 0 ? void 0 : _a.type) !== "TP_PLUTO_REDIRECT_ACK") {
                                    return;
                                }
                                clearTimeout(timeout);
                                window.removeEventListener("message", onAck);
                                resolve();
                            };
                            window.addEventListener("message", onAck);
                        });
                        allowTpNav = true;
                        window.location.replace(dest);
                    }),
                });
            }
            catch (_a) {
                /* let Pluto navigate if intercept is rejected */
            }
        });
    }
})();


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[1385].call(__webpack_exports__);
/******/ 	
/******/ })()
;