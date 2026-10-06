/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/Teleparty/Enums/PlaybackState.ts
var PlaybackState;
(function (PlaybackState) {
    PlaybackState["LOADING"] = "loading";
    PlaybackState["PLAYING"] = "playing";
    PlaybackState["IDLE"] = "idle";
    PlaybackState["AD_PLAYING"] = "ad_playing";
    PlaybackState["PAUSED"] = "paused";
    PlaybackState["NOT_READY"] = "not_ready";
})(PlaybackState || (PlaybackState = {}));

;// ./src/Teleparty/ContentScripts/Crunchyroll/crunchyroll_injected.js

const BOTTOM_CONTROLS = '[data-testid="bottom-controls-autohide"]';
const CURRENT_MEDIA_INFO = ".erc-current-media-info";
/** New in-page player only (no Vilos iframe). */
if (window === top && document.querySelector(BOTTOM_CONTROLS)) {
    console.log("Crunchyroll injected");
    const getDomNodeReactFiberKey = (el) => {
        if (!el)
            return null;
        const keys = Object.keys(el);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].startsWith("__reactFiber$")) {
                return keys[i];
            }
        }
        return null;
    };
    const parseEpisodeNumber = (mediaTitle) => {
        if (!mediaTitle || typeof mediaTitle !== "string") {
            return 0;
        }
        const m = mediaTitle.match(/^E(\d+)\s*-/i);
        return m ? parseInt(m[1], 10) : 0;
    };
    const getVideoInformationFromCurrentMedia = (duration) => {
        var _a, _b;
        const mediaEl = document.querySelector(CURRENT_MEDIA_INFO);
        const fiberKey = getDomNodeReactFiberKey(mediaEl);
        if (!mediaEl || !fiberKey || !mediaEl[fiberKey]) {
            return null;
        }
        const p = (_a = mediaEl[fiberKey].return) === null || _a === void 0 ? void 0 : _a.memoizedProps;
        if (!p || p.id == null) {
            return null;
        }
        return {
            episodeNumber: parseEpisodeNumber(p.mediaTitle),
            videoTitle: (_b = p.mediaTitle) !== null && _b !== void 0 ? _b : "",
            videoType: "",
            videoId: String(p.id),
            seriesId: p.parentId != null ? String(p.parentId) : "",
            duration: duration !== null && duration !== void 0 ? duration : 0,
        };
    };
    const getSeekTo = () => {
        var _a, _b, _c, _d, _e;
        const el = document.querySelector(BOTTOM_CONTROLS);
        const key = getDomNodeReactFiberKey(el);
        if (!key || !(el === null || el === void 0 ? void 0 : el[key])) {
            return null;
        }
        const seekTo = (_e = (_d = (_c = (_b = (_a = el[key].child) === null || _a === void 0 ? void 0 : _a.child) === null || _b === void 0 ? void 0 : _b.child) === null || _c === void 0 ? void 0 : _c.child) === null || _d === void 0 ? void 0 : _d.memoizedProps) === null || _e === void 0 ? void 0 : _e.seekTo;
        return typeof seekTo === "function" ? seekTo : null;
    };
    const getPlayerVideoElement = () => {
        const withSrc = document.querySelector("video[src]");
        if (withSrc) {
            return withSrc;
        }
        return document.querySelector("video");
    };
    const _relayMessage = (messageObj) => {
        window.postMessage(messageObj, "*");
    };
    const _isBuffering = () => !!document.querySelector('[data-testid="buffering-indicator"]');
    const _getPlaybackState = () => {
        const video = getPlayerVideoElement();
        if (video == undefined) {
            return PlaybackState.NOT_READY;
        }
        else if (video.paused) {
            return PlaybackState.PAUSED;
        }
        else if (_isBuffering()) {
            return PlaybackState.LOADING;
        }
        else {
            return PlaybackState.PLAYING;
        }
    };
    const getCurrentVideoInformation = () => {
        var _a;
        try {
            const elementRoot = getPlayerVideoElement();
            if (elementRoot == null) {
                return null;
            }
            const duration = (_a = elementRoot.duration) !== null && _a !== void 0 ? _a : 0;
            const fromCurrentMedia = getVideoInformationFromCurrentMedia(duration);
            if (fromCurrentMedia) {
                return fromCurrentMedia;
            }
            return {
                episodeNumber: 0,
                videoTitle: "",
                videoType: "",
                videoId: "",
                seriesId: "",
                duration,
            };
        }
        catch (_err) {
            return undefined;
        }
    };
    if (!window.crunchyrollInjectedMessageListenerBound) {
        window.crunchyrollInjectedMessageListenerBound = true;
        window.addEventListener("message", (evt) => {
            var _a, _b, _c;
            const eventExists = evt.data.infoSending;
            if (!eventExists) {
                return;
            }
            const type = eventExists.type;
            if (type === "getVideoData") {
                const videoInfo = getCurrentVideoInformation();
                if (videoInfo) {
                    _relayMessage({ type: "VideoData", videoData: videoInfo });
                }
            }
            else if (type === "updateState") {
                const playerVideo = getPlayerVideoElement();
                _relayMessage({
                    type: "updatedState",
                    playerState: {
                        time: ((_a = playerVideo === null || playerVideo === void 0 ? void 0 : playerVideo.currentTime) !== null && _a !== void 0 ? _a : 0) * 1000,
                        playbackState: _getPlaybackState(),
                        loading: _isBuffering() && !(playerVideo === null || playerVideo === void 0 ? void 0 : playerVideo.paused),
                    },
                });
            }
            else if (type === "seekTo") {
                const timeMs = evt.data.infoSending.eventData.time;
                (_b = getSeekTo()) === null || _b === void 0 ? void 0 : _b(timeMs / 1000);
            }
            else if (type === "continueParty") {
                (_c = document.querySelector('[data-test-state="stopped"]')) === null || _c === void 0 ? void 0 : _c.click();
            }
        });
    }
    let _lastKnownBuffering = false;
    const bufferingObserver = new MutationObserver(() => {
        const buffering = _isBuffering();
        if (buffering === _lastKnownBuffering) {
            return;
        }
        _lastKnownBuffering = buffering;
        _relayMessage({ type: "onBufferingChange" });
    });
    const startListening = () => {
        var _a;
        if (window.crunchyrollInjectedIsListening) {
            return;
        }
        window.crunchyrollInjectedIsListening = true;
        _lastKnownBuffering = _isBuffering();
        const bufferingObserverTarget = (_a = document.documentElement) !== null && _a !== void 0 ? _a : document.body;
        if (bufferingObserverTarget) {
            bufferingObserver.observe(bufferingObserverTarget, { childList: true, subtree: true });
        }
        const video = getPlayerVideoElement();
        if (video) {
            video.addEventListener("loadstart", () => {
                _relayMessage({ type: "videoLoadStart" });
            });
        }
        document.addEventListener("fullscreenchange", () => {
            _relayMessage({ type: "onFullscreen" });
        });
        window.addEventListener("keyup", (event) => {
            if (event.key === "Escape") {
                _relayMessage({ type: "exitFullscreen" });
            }
        });
        window.videoIdScriptLoaded = true;
    };
    const waitForVideoAndStartListening = () => {
        var _a;
        if (window.crunchyrollInjectedIsListening) {
            return;
        }
        const maxWaitForVideoMs = 60000;
        let intervalId = null;
        let timeoutId = null;
        let observer = null;
        const cleanup = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            if (observer) {
                observer.disconnect();
                observer = null;
            }
        };
        const tryStartListening = () => {
            if (!getPlayerVideoElement()) {
                return false;
            }
            startListening();
            cleanup();
            return true;
        };
        if (tryStartListening()) {
            return;
        }
        intervalId = setInterval(() => {
            if (tryStartListening()) {
                cleanup();
            }
        }, 250);
        observer = new MutationObserver(() => {
            if (tryStartListening()) {
                cleanup();
            }
        });
        const observerTarget = (_a = document.documentElement) !== null && _a !== void 0 ? _a : document.body;
        if (observerTarget) {
            observer.observe(observerTarget, { childList: true, subtree: true });
        }
        timeoutId = setTimeout(() => {
            cleanup();
        }, maxWaitForVideoMs);
    };
    waitForVideoAndStartListening();
    (function () {
        if (window.tpCrunchyrollNextEpisodeBridgeLoaded) {
            return;
        }
        window.tpCrunchyrollNextEpisodeBridgeLoaded = true;
        const PATCHED_FLAG = "__tpRequestAssetQueueUpdatePatched";
        const getPlayerFromContainer = () => {
            var _a, _b, _c, _d;
            const el = document.querySelector("#player-container");
            const fiberKey = getDomNodeReactFiberKey(el);
            if (!el || !fiberKey) {
                return null;
            }
            return (_d = (_c = (_b = (_a = el[fiberKey]) === null || _a === void 0 ? void 0 : _a.return) === null || _b === void 0 ? void 0 : _b.stateNode) === null || _c === void 0 ? void 0 : _c.player) !== null && _d !== void 0 ? _d : null;
        };
        const getNextEpisodeVmPlayer = () => {
            var _a, _b, _c, _d;
            return (_d = (_c = (_b = (_a = getPlayerFromContainer()) === null || _a === void 0 ? void 0 : _a._viewModels) === null || _b === void 0 ? void 0 : _b.nextEpisodeVM) === null || _c === void 0 ? void 0 : _c._player) !== null && _d !== void 0 ? _d : null;
        };
        const tryPatchRequestAssetQueueUpdate = () => {
            var _a;
            const plr = getPlayerFromContainer();
            const nextEpisodeVM = (_a = plr === null || plr === void 0 ? void 0 : plr._viewModels) === null || _a === void 0 ? void 0 : _a.nextEpisodeVM;
            const vmp = nextEpisodeVM === null || nextEpisodeVM === void 0 ? void 0 : nextEpisodeVM._player;
            if (!vmp || typeof vmp.requestAssetQueueUpdate !== "function") {
                return false;
            }
            if (vmp[PATCHED_FLAG]) {
                return true;
            }
            const original = vmp.requestAssetQueueUpdate.bind(vmp);
            vmp.requestAssetQueueUpdate = function (...args) {
                var _a, _b, _c;
                const message = args[0];
                if (!window.__tpCrunchyrollSuppressNextEpisodeBroadcast &&
                    message &&
                    message.jump === 1) {
                    const nextEpisodeGuid = (_c = (_b = (_a = getPlayerFromContainer()) === null || _a === void 0 ? void 0 : _a._viewModels) === null || _b === void 0 ? void 0 : _b.nextEpisodeVM) === null || _c === void 0 ? void 0 : _c._nextEpisodeGuid;
                    if (typeof nextEpisodeGuid === "string" && nextEpisodeGuid.length > 0) {
                        window.postMessage({
                            type: "TP_CRUNCHYROLL_PLAY_NEXT",
                            nextContentId: nextEpisodeGuid,
                        }, "*");
                    }
                }
                return original(...args);
            };
            vmp[PATCHED_FLAG] = true;
            return true;
        };
        window.addEventListener("message", (event) => {
            var _a, _b, _c;
            if (event.source !== window || !event.data || typeof event.data.type !== "string") {
                return;
            }
            const { type, requestId } = event.data;
            if (type === "TP_CRUNCHYROLL_GET_NEXT_EPISODE_GUID") {
                const nextEpisodeGuid = (_c = (_b = (_a = getPlayerFromContainer()) === null || _a === void 0 ? void 0 : _a._viewModels) === null || _b === void 0 ? void 0 : _b.nextEpisodeVM) === null || _c === void 0 ? void 0 : _c._nextEpisodeGuid;
                window.postMessage({
                    type: "TP_CRUNCHYROLL_GET_NEXT_EPISODE_GUID_RESULT",
                    requestId,
                    ok: typeof nextEpisodeGuid === "string" && nextEpisodeGuid.length > 0,
                    nextContentId: typeof nextEpisodeGuid === "string" ? nextEpisodeGuid : undefined,
                }, "*");
                return;
            }
            if (type !== "TP_CRUNCHYROLL_DISPATCH_NEXT_EPISODE") {
                return;
            }
            const vmp = getNextEpisodeVmPlayer();
            if (!vmp || typeof vmp.requestAssetQueueUpdate !== "function") {
                window.postMessage({
                    type: "TP_CRUNCHYROLL_DISPATCH_NEXT_EPISODE_RESULT",
                    requestId,
                    ok: false,
                    error: "requestAssetQueueUpdate unavailable",
                }, "*");
                return;
            }
            try {
                window.__tpCrunchyrollSuppressNextEpisodeBroadcast = true;
                vmp.requestAssetQueueUpdate({ jump: 1 });
                window.postMessage({
                    type: "TP_CRUNCHYROLL_DISPATCH_NEXT_EPISODE_RESULT",
                    requestId,
                    ok: true,
                }, "*");
            }
            catch (error) {
                window.postMessage({
                    type: "TP_CRUNCHYROLL_DISPATCH_NEXT_EPISODE_RESULT",
                    requestId,
                    ok: false,
                    error: String(error),
                }, "*");
            }
            finally {
                window.__tpCrunchyrollSuppressNextEpisodeBroadcast = false;
            }
        });
        if (tryPatchRequestAssetQueueUpdate()) {
            return;
        }
        const interval = setInterval(() => {
            if (tryPatchRequestAssetQueueUpdate()) {
                clearInterval(interval);
            }
        }, 500);
    })();
}

/******/ })()
;