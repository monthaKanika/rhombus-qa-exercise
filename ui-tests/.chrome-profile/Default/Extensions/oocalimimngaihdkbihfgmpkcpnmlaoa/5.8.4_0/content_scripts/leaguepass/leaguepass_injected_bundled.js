/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;
(() => {
    if (window.__leaguePassWmcBridgeInstalled)
        return;
    window.__leaguePassWmcBridgeInstalled = true;
    window.injectScriptLoaded = true;
    if (window.teleparty) {
        window.teleparty.injectScriptLoaded = true;
    }
    const REQUEST_TYPE = "TP_LEAGUEPASS_WMC_REQUEST";
    const RESPONSE_TYPE = "TP_LEAGUEPASS_WMC_RESPONSE";
    window.addEventListener("message", (event) => {
        if (event.source !== window)
            return;
        const data = event.data;
        if (!data || data.type !== REQUEST_TYPE)
            return;
        const sdk = window.wmcsdk;
        try {
            if (!sdk) {
                throw new Error("wmcsdk not found");
            }
            if (data.command === "play") {
                sdk.doResume();
            }
            else if (data.command === "pause") {
                sdk.doPause();
            }
            else if (data.command === "seek") {
                sdk.doSeek(data.timeSeconds);
            }
            else {
                throw new Error("unknown command");
            }
            window.postMessage({ type: RESPONSE_TYPE, id: data.id, ok: true }, "*");
        }
        catch (error) {
            window.postMessage({
                type: RESPONSE_TYPE,
                id: data.id,
                ok: false,
                error: error && error.message ? error.message : String(error),
            }, "*");
        }
    });
})();

/******/ })()
;