/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 272
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
;
(() => {
    if (window.__f1TvPlayerBridgeInstalled)
        return;
    window.__f1TvPlayerBridgeInstalled = true;
    window.injectScriptLoaded = true;
    if (window.teleparty) {
        window.teleparty.injectScriptLoaded = true;
    }
    const REQUEST_TYPE = "F1_TV_PLAYER_BRIDGE_REQUEST";
    const RESPONSE_TYPE = "F1_TV_PLAYER_BRIDGE_RESPONSE";
    const PLAYER_CONTAINER_SELECTOR = "div.player-container.main.shown, div.player-container.slave.shown, div.player-container.main, div.player-container.slave, .player-container.main, .player-container.slave";
    const VIDEO_SELECTOR = "#bitmovinplayer-video-main-embeddedPlayer, #bitmovinplayer-video-slave-embeddedPlayer, #main-embeddedPlayer video, #slave-embeddedPlayer video, .bitmovinplayer-container video, #video-grid-root video, video";
    function getReactFiber(element) {
        if (!element)
            return null;
        const fiberKey = Object.keys(element).find((key) => key.startsWith("__reactFiber") || key.startsWith("__reactInternalInstance"));
        return fiberKey ? element[fiberKey] : null;
    }
    function getPlayer() {
        const containers = document.querySelectorAll(PLAYER_CONTAINER_SELECTOR);
        for (let i = 0; i < containers.length; i++) {
            let fiber = getReactFiber(containers[i]);
            while (fiber) {
                const stateNode = fiber.stateNode;
                if (stateNode &&
                    typeof stateNode.play === "function" &&
                    typeof stateNode.getCurrentTime === "function") {
                    return stateNode;
                }
                fiber = fiber.return;
            }
        }
        return null;
    }
    function getVideoElement() {
        const player = getPlayer();
        if (player && typeof player.getVideoContainer === "function") {
            try {
                const container = player.getVideoContainer();
                const video = container && container.querySelector ? container.querySelector("video") : null;
                if (video)
                    return video;
            }
            catch (_error) {
                // Fall through to selector lookup.
            }
        }
        return document.querySelector(VIDEO_SELECTOR);
    }
    function safeCall(fn, fallback) {
        try {
            return fn();
        }
        catch (_error) {
            return fallback;
        }
    }
    function isSeeking() {
        const video = getVideoElement();
        return !!(video && video.seeking);
    }
    function getPlayerState() {
        const player = getPlayer();
        const video = getVideoElement();
        const seeking = isSeeking();
        if (!player && !video) {
            return {
                hasPlayer: false,
                seeking: false,
                isReady: false,
                isPlaying: false,
                isPaused: false,
                isLive: false,
                currentTime: undefined,
                duration: undefined,
            };
        }
        const currentTime = player && typeof player.getCurrentTime === "function"
            ? safeCall(() => player.getCurrentTime())
            : video
                ? video.currentTime
                : undefined;
        const duration = player && typeof player.getDuration === "function"
            ? safeCall(() => player.getDuration())
            : video && Number.isFinite(video.duration)
                ? video.duration
                : undefined;
        const isReady = player && typeof player.isReady === "function"
            ? safeCall(() => player.isReady(), false)
            : !!(video && (video.src || video.currentSrc || video.readyState > 0));
        const isPaused = player && typeof player.isPaused === "function"
            ? safeCall(() => player.isPaused(), true)
            : !!(video && video.paused);
        const isPlaying = player && typeof player.isPlaying === "function"
            ? safeCall(() => player.isPlaying(), false)
            : !!(video && !video.paused);
        return {
            hasPlayer: !!player || !!video,
            seeking,
            isReady,
            isPlaying,
            isPaused,
            isLive: player && typeof player.isLive === "function" ? safeCall(() => player.isLive(), false) : false,
            currentTime,
            duration,
        };
    }
    function invokePlayerMethod(method, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = getPlayer();
            if (!player) {
                throw new Error("F1 TV React player not found");
            }
            const fn = player[method];
            if (typeof fn !== "function") {
                throw new Error(`Player method not found: ${method}`);
            }
            return yield fn.apply(player, args);
        });
    }
    function seek(timeSeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = getPlayer();
            if (player && typeof player.seek === "function") {
                return yield player.seek(timeSeconds);
            }
            if (player && typeof player.setCurrentTime === "function") {
                player.setCurrentTime(timeSeconds);
                return true;
            }
            const video = getVideoElement();
            if (video) {
                video.currentTime = timeSeconds;
                return true;
            }
            throw new Error("No F1 TV seek target found");
        });
    }
    function play() {
        return __awaiter(this, void 0, void 0, function* () {
            const player = getPlayer();
            if (player && typeof player.play === "function") {
                return yield player.play();
            }
            const video = getVideoElement();
            if (video) {
                return yield video.play();
            }
            throw new Error("No F1 TV play target found");
        });
    }
    function pause() {
        return __awaiter(this, void 0, void 0, function* () {
            const player = getPlayer();
            if (player && typeof player.pause === "function") {
                player.pause();
                return true;
            }
            const video = getVideoElement();
            if (video) {
                video.pause();
                return true;
            }
            throw new Error("No F1 TV pause target found");
        });
    }
    window.addEventListener("message", (event) => __awaiter(void 0, void 0, void 0, function* () {
        if (event.source !== window)
            return;
        const data = event.data;
        if (!data || data.type !== REQUEST_TYPE)
            return;
        const { id, command, args = [] } = data;
        try {
            let result;
            switch (command) {
                case "ping":
                    result = { ok: true, hasPlayer: !!getPlayer() || !!getVideoElement() };
                    break;
                case "hasPlayer":
                    result = !!getPlayer() || !!getVideoElement();
                    break;
                case "getPlayerState":
                    result = getPlayerState();
                    break;
                case "isSeeking":
                    result = isSeeking();
                    break;
                case "play":
                    result = yield play();
                    break;
                case "pause":
                    result = yield pause();
                    break;
                case "seek":
                    result = yield seek(args[0]);
                    break;
                case "call":
                    result = yield invokePlayerMethod(data.method, args);
                    break;
                default:
                    throw new Error(`Unknown command: ${command}`);
            }
            window.postMessage({
                type: RESPONSE_TYPE,
                id,
                ok: true,
                result,
            }, "*");
        }
        catch (error) {
            window.postMessage({
                type: RESPONSE_TYPE,
                id,
                ok: false,
                error: (error === null || error === void 0 ? void 0 : error.message) || String(error),
            }, "*");
        }
    }));
    // --- Fullscreen interception (block Bitmovin FS while chat open; we drive real FS) ---
    const FULLSCREEN_REQUEST_TYPE = "F1_TV_FULLSCREEN_REQUEST";
    const ENTER_FULLSCREEN_TYPE = "F1_TV_ENTER_FULLSCREEN";
    const EXIT_FULLSCREEN_TYPE = "F1_TV_EXIT_FULLSCREEN";
    const PLAYER_FS_ROOT_SELECTOR = "#video-grid-root, .video-grid, .embedded-player-container, .bitmovinplayer-container, #main-embeddedPlayer, #slave-embeddedPlayer";
    function isPlayerFullscreenTarget(el) {
        if (!el || typeof el.closest !== "function")
            return false;
        return !!el.closest(PLAYER_FS_ROOT_SELECTOR);
    }
    function isTelepartyChatOpen() {
        return !!document.querySelector("#tp-layout-wrapper.tp-f1-chat-open");
    }
    function isOurVideoGridFullscreen() {
        const fs = document.fullscreenElement ||
            document.webkitFullscreenElement ||
            null;
        const grid = document.querySelector(".video-grid");
        return !!(fs && grid && (fs === grid || grid.contains(fs)));
    }
    function relayFullscreenRequest() {
        window.postMessage({ type: FULLSCREEN_REQUEST_TYPE, source: "f1_tv_injected" }, "*");
    }
    const originalRequestFullscreen = Element.prototype.requestFullscreen;
    const originalWebkitRequestFullscreen = Element.prototype.webkitRequestFullscreen;
    const originalWebkitRequestFullScreen = Element.prototype.webkitRequestFullScreen;
    const originalMozRequestFullScreen = Element.prototype.mozRequestFullScreen;
    const originalMsRequestFullscreen = Element.prototype.msRequestFullscreen;
    const originalExitFullscreen = Document.prototype.exitFullscreen;
    const originalWebkitExitFullscreen = Document.prototype.webkitExitFullscreen;
    function callOriginalRequestFullscreen(el) {
        const req = originalRequestFullscreen ||
            originalWebkitRequestFullscreen ||
            originalWebkitRequestFullScreen ||
            originalMozRequestFullScreen ||
            originalMsRequestFullscreen;
        if (typeof req === "function") {
            return req.call(el);
        }
        return Promise.resolve();
    }
    function callOriginalExitFullscreen() {
        const exit = originalExitFullscreen || originalWebkitExitFullscreen;
        if (typeof exit === "function") {
            return exit.call(document);
        }
        return Promise.resolve();
    }
    function wrapFullscreenMethod(proto, methodName, original) {
        if (typeof original !== "function")
            return;
        proto[methodName] = function (...args) {
            // Steal FS while chat is open, or while we're already in video-grid FS
            // (chat may be hidden but user still needs the toggle to exit).
            if (isPlayerFullscreenTarget(this) && (isTelepartyChatOpen() || isOurVideoGridFullscreen())) {
                relayFullscreenRequest();
                return Promise.resolve();
            }
            return original.apply(this, args);
        };
    }
    wrapFullscreenMethod(Element.prototype, "requestFullscreen", originalRequestFullscreen);
    wrapFullscreenMethod(Element.prototype, "webkitRequestFullscreen", originalWebkitRequestFullscreen);
    wrapFullscreenMethod(Element.prototype, "webkitRequestFullScreen", originalWebkitRequestFullScreen);
    wrapFullscreenMethod(Element.prototype, "mozRequestFullScreen", originalMozRequestFullScreen);
    wrapFullscreenMethod(Element.prototype, "msRequestFullscreen", originalMsRequestFullscreen);
    window.addEventListener("message", (event) => {
        if (event.source !== window)
            return;
        const data = event.data;
        if (!data)
            return;
        if (data.type === ENTER_FULLSCREEN_TYPE) {
            const grid = document.querySelector(".video-grid");
            if (grid) {
                void callOriginalRequestFullscreen(grid);
            }
            return;
        }
        if (data.type === EXIT_FULLSCREEN_TYPE) {
            void callOriginalExitFullscreen();
        }
    });
    // Bitmovin often uses CSS fullscreen without requestFullscreen.
    document.addEventListener("click", (event) => {
        if (!isTelepartyChatOpen() && !isOurVideoGridFullscreen())
            return;
        const target = event.target;
        if (!target || typeof target.closest !== "function")
            return;
        const fsButton = target.closest(".bmpui-ui-fullscreentogglebutton, button[class*='fullscreen'], [class*='fullscreentoggle']");
        if (!fsButton || !isPlayerFullscreenTarget(fsButton))
            return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        relayFullscreenRequest();
    }, true);
})();


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__[272].call(__webpack_exports__);
/******/ 	
/******/ })()
;