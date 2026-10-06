/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

let resizeVisible;
function resizeYoutube(ytPlayer) {
    let video = document.querySelector("#movie_player");
    Object.getOwnPropertyNames(ytPlayer).forEach((prop) => {
        let obj = ytPlayer[prop];
        if (obj && obj.toString() === "function(a,b){this.width=a;this.height=b}") {
            const oldObj = obj;
            window._yt_player[prop] = function (a, b) {
                if (video.isFullscreen() && resizeVisible) {
                    //let adjustSize = window.outerWidth - window.innerWidth
                    let adjustSize = 14;
                    let aspectRatio = b / a;
                    a = a - (304 + adjustSize);
                    b = aspectRatio * a;
                }
                const x = new oldObj(a, b);
                return x;
            };
            window._yt_player[prop].prototype = oldObj.prototype;
            window.resizeScriptReady = true;
        }
    });
}
if (!window.videoIdScriptLoaded) {
    window.videoIdScriptLoaded = true;
    window.resizeScriptReady = false;
    window.addEventListener("YoutubeVideoMessage", function (event) {
        if (event.detail) {
            var type = event.detail.type;
            if (type === "pauseVideo") {
                if (window.resizeScriptReady === false && window._yt_player) {
                    resizeYoutube(window._yt_player);
                }
                getVideoElement().pauseVideo();
            }
            else if (type === "playVideo") {
                if (window.resizeScriptReady === false && window._yt_player) {
                    resizeYoutube(window._yt_player);
                }
                getVideoElement().playVideo();
            }
            else if (type === "getVideoTitle") {
                if (window.resizeScriptReady === false && window._yt_player) {
                    resizeYoutube(window._yt_player);
                }
                const video = getVideoElement();
                const data = video.getVideoData();
                const title = data.title;
                if (title) {
                    const titleEvent = new CustomEvent("FromNode", { detail: { type: "VideoTitle", title: title } });
                    window.dispatchEvent(titleEvent);
                }
            }
            else if (type === "setTheater") {
                setTheater();
            }
            else if (type === "disableTheater") {
                disableTheater();
            }
            else if (type === "getVideoId") {
                const videoId = getVideoElement().getVideoData().video_id;
                const isLive = getVideoElement().getVideoData().isLive;
                if (videoId) {
                    const videoIdEvent = new CustomEvent("FromNode", {
                        detail: { type: "VideoId", videoId: videoId, isLive: isLive },
                    });
                    window.dispatchEvent(videoIdEvent);
                }
            }
            else if (type === "seekTo") {
                const video = getVideoElement();
                if (video) {
                    video.seekTo(event.detail.seekTo);
                }
            }
            else if (type === "getVideoTime") {
                const video = getVideoElement();
                if (video) {
                    const videoTime = video.getCurrentTime();
                    const videoTimeEvent = new CustomEvent("FromNode", { detail: { type: "VideoTime", videoTime } });
                    window.dispatchEvent(videoTimeEvent);
                }
            }
            else if (type === "jumpToNextEpisode") {
                const isYoutubeTV = window.location.hostname === "tv.youtube.com";
                const isShort = !!event.detail.isShort;
                const urlPath = isYoutubeTV
                    ? `/watch/${event.detail.nextVideoId}`
                    : isShort
                        ? `/shorts/${event.detail.nextVideoId}`
                        : `/watch?v=${event.detail.nextVideoId}`;
                const navigationData = {
                    endpoint: {
                        commandMetadata: Object.assign({ webCommandMetadata: {
                                url: urlPath,
                                rootVe: isShort ? 37414 : 3832,
                                webPageType: isShort ? "WEB_PAGE_TYPE_SHORTS" : "WEB_PAGE_TYPE_WATCH",
                            } }, (isShort
                            ? {
                                reelWatchEndpoint: {
                                    videoId: event.detail.nextVideoId,
                                },
                            }
                            : {
                                watchEndpoint: {
                                    videoId: event.detail.nextVideoId,
                                    nofollow: true,
                                },
                            })),
                    },
                };
                const ytNavigator = document.querySelector(isYoutubeTV ? "ytu-app" : "ytd-app");
                if (ytNavigator) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ytNavigator.fire("yt-navigate", navigationData);
                    const navigateEvent = new CustomEvent("FromNode", { detail: { type: "Navigated" } });
                    window.dispatchEvent(navigateEvent);
                }
                else if (isYoutubeTV) {
                    window.location.href = urlPath;
                    const navigateEvent = new CustomEvent("FromNode", { detail: { type: "Navigated" } });
                    window.dispatchEvent(navigateEvent);
                }
                else {
                    throw new Error("There is no navigation on this page");
                }
            }
            else if (type == "SetChatVisible") {
                resizeVisible = event.detail.visible;
                const video = getVideoElement();
                if (video) {
                    video.setSize();
                    video.setInternalSize();
                }
            }
        }
    });
    const setTheater = () => {
        const inTheater = document.querySelector("ytd-watch-flexy");
        if (inTheater && inTheater.theater !== null) {
            const theaterButton = document.querySelector(".ytp-size-button");
            if (theaterButton && !inTheater.theater) {
                theaterButton.click();
                theaterButton.style.display = "none";
            }
            if (theaterButton && inTheater.theater) {
                theaterButton.style.display = "none";
            }
        }
    };
    const disableTheater = () => {
        const theaterButton = document.querySelector(".ytp-size-button");
        if (theaterButton) {
            theaterButton.style.display = "";
        }
        // Theater exit is handled in YoutubeChatApi teardown (content script) so we
        // don't double-toggle the size button here if the attribute is still settling.
        restoreWatchLayout();
    };
    const restoreWatchLayout = () => {
        const flexy = document.querySelector("ytd-watch-flexy");
        if (flexy) {
            try {
                if (typeof flexy.set === "function") {
                    flexy.set("panelExpanded", false);
                }
                else {
                    flexy.panelExpanded = false;
                }
            }
            catch (e) {
                // ignore
            }
            flexy.removeAttribute("panel-expanded");
        }
        const hideChatButton = document.querySelector('button[aria-label="Hide chat"][aria-pressed="true"]');
        if (hideChatButton) {
            hideChatButton.click();
        }
        const video = getVideoElement();
        if (video) {
            try {
                resizeVisible = false;
                video.setSize();
                video.setInternalSize();
            }
            catch (e) {
                // ignore
            }
        }
    };
    const getVideoElement = () => {
        const url = window.location.href;
        if (!isPlayerPage()) {
            return null;
        }
        if (url.includes("/shorts/")) {
            return document.querySelector("#shorts-player");
        }
        if (url.includes("/watch")) {
            return document.querySelector("#movie_player");
        }
        throw new Error("Unknown Video Type");
    };
    const isPlayerPage = () => {
        const url = window.location.href;
        if (window.location.hostname === "tv.youtube.com" && url.includes("/watch")) {
            return true;
        }
        return url.includes("/watch") || url.includes("/shorts/");
    };
}

/******/ })()
;