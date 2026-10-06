/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;
(function () {
    const isLivePlayback = () => window.location.pathname.includes("/watch/playback/live/");
    const getReactKey = (el) => {
        if (!el)
            return null;
        return Object.keys(el).find((k) => k.startsWith("__reactInternalInstance") || k.startsWith("__reactFiber"));
    };
    // Walk an object for an `allAdBreakData` array (same idea as documentation/search-all-elements-for-react-values.js)
    const findAllAdBreakDataInObject = (obj, seen, depth) => {
        if (obj == null || typeof obj !== "object" || depth > 50) {
            return undefined;
        }
        if (seen.has(obj)) {
            return undefined;
        }
        seen.add(obj);
        try {
            if (Object.prototype.hasOwnProperty.call(obj, "allAdBreakData") && Array.isArray(obj.allAdBreakData)) {
                return obj.allAdBreakData;
            }
        }
        catch (e) {
            return undefined;
        }
        let keys;
        try {
            keys = Object.keys(obj);
        }
        catch (e) {
            return undefined;
        }
        for (let i = 0; i < keys.length; i++) {
            try {
                const found = findAllAdBreakDataInObject(obj[keys[i]], seen, depth + 1);
                if (found) {
                    return found;
                }
            }
            catch (e) {
                // ignore cross-origin / revoked accessors
            }
        }
        return undefined;
    };
    /**
     * Amazon-style scan: walk every element with a React fiber and search
     * `return.stateNode` (and nearby props) for `allAdBreakData`.
     * Skipped on live — no mid-roll map and the full-DOM walk freezes these pages.
     */
    const findAllAdBreakData = () => {
        var _a, _b;
        if (isLivePlayback()) {
            return [];
        }
        const allElements = document.querySelectorAll("*");
        for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i];
            const key = getReactKey(el);
            if (!key)
                continue;
            const fiber = el[key];
            const roots = [(_a = fiber === null || fiber === void 0 ? void 0 : fiber.return) === null || _a === void 0 ? void 0 : _a.stateNode, (_b = fiber === null || fiber === void 0 ? void 0 : fiber.return) === null || _b === void 0 ? void 0 : _b.memoizedProps, fiber === null || fiber === void 0 ? void 0 : fiber.memoizedProps];
            for (let r = 0; r < roots.length; r++) {
                const rootObj = roots[r];
                if (!rootObj || typeof rootObj !== "object")
                    continue;
                const found = findAllAdBreakDataInObject(rootObj, new WeakSet(), 0);
                if (found) {
                    return found;
                }
            }
        }
        return [];
    };
    /**
     * Peacock allAdBreakData.position is content timeline (matches _PTxx ids).
     * Convert to stream/video timeline offsets for AdInjectedVideoApi.
     */
    const mapAdBreaksToStreamOffsets = (allAdBreakData) => {
        if (!Array.isArray(allAdBreakData)) {
            return [];
        }
        const sorted = allAdBreakData
            .slice()
            .filter((ad) => ad && Number.isFinite(ad.position) && Number.isFinite(ad.expectedDuration))
            .sort((a, b) => a.position - b.position);
        let cumulativeAdMs = 0;
        return sorted.map((ad) => {
            const contentPosMs = ad.position * 1000;
            const durationMs = ad.expectedDuration * 1000;
            const startingOffset = contentPosMs + cumulativeAdMs;
            cumulativeAdMs += durationMs;
            return {
                startingOffset,
                duration: durationMs,
                type: ad.type,
                id: ad.id,
            };
        });
    };
    let _cachedAdBreaks = [];
    let _cachedAdBreaksAt = 0;
    const getMappedAdBreaks = (forceRefresh) => {
        if (isLivePlayback()) {
            _cachedAdBreaks = [];
            _cachedAdBreaksAt = Date.now();
            return _cachedAdBreaks;
        }
        if (!forceRefresh && _cachedAdBreaks.length > 0 && Date.now() - _cachedAdBreaksAt < 30000) {
            return _cachedAdBreaks;
        }
        const raw = findAllAdBreakData();
        _cachedAdBreaks = mapAdBreaksToStreamOffsets(raw);
        _cachedAdBreaksAt = Date.now();
        console.log("Peacock allAdBreakData mapped", _cachedAdBreaks.length, _cachedAdBreaks);
        return _cachedAdBreaks;
    };
    const getVideo = () => document.querySelector("#core-video-shaka") ||
        document.querySelector("[data-gsp-video-component] video") ||
        document.querySelector("video");
    const assetToEpisodeId = (asset) => {
        if (!asset || typeof asset !== "object") {
            return undefined;
        }
        const contentId = asset.contentId || asset.content_id || asset.key;
        const providerVariantId = asset.providerVariantId || asset.provider_variant_id || asset.pvid;
        if (!contentId || !providerVariantId) {
            return undefined;
        }
        return `${contentId}/${providerVariantId}`;
    };
    const findBingeAssetInObject = (obj, seen, depth) => {
        if (obj == null || typeof obj !== "object" || depth > 40) {
            return undefined;
        }
        if (seen.has(obj)) {
            return undefined;
        }
        seen.add(obj);
        try {
            if (obj.bingePopUpAsset) {
                const id = assetToEpisodeId(obj.bingePopUpAsset);
                if (id) {
                    return obj.bingePopUpAsset;
                }
            }
            if (obj.upNextAsset) {
                const id = assetToEpisodeId(obj.upNextAsset);
                if (id) {
                    return obj.upNextAsset;
                }
            }
            // Direct asset shape
            const direct = assetToEpisodeId(obj);
            if (direct && (obj.type === "binge" || obj.binge || obj.upNext || obj.isBinge)) {
                return obj;
            }
        }
        catch (e) {
            return undefined;
        }
        let keys;
        try {
            keys = Object.keys(obj);
        }
        catch (e) {
            return undefined;
        }
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            // Only descend into binge/up-next-ish keys to keep this scan cheap
            if (!/binge|upnext|up_next|next.?episode|pop.?up|asset|rail/i.test(key)) {
                continue;
            }
            try {
                const found = findBingeAssetInObject(obj[key], seen, depth + 1);
                if (found) {
                    return found;
                }
            }
            catch (e) {
                // ignore
            }
        }
        return undefined;
    };
    /** Scan React fibers for binge / up-next asset (UI classnames change; props stay). */
    const findBingeAsset = () => {
        var _a, _b, _c, _d;
        // Legacy container still works when present
        try {
            const legacy = document.querySelector(".playback-binge__container");
            const legacyKey = getReactKey(legacy);
            if (legacyKey) {
                const props = (_b = (_a = legacy[legacyKey]) === null || _a === void 0 ? void 0 : _a.return) === null || _b === void 0 ? void 0 : _b.memoizedProps;
                const asset = (props === null || props === void 0 ? void 0 : props.bingePopUpAsset) || findBingeAssetInObject(props, new WeakSet(), 0);
                if (assetToEpisodeId(asset)) {
                    return asset;
                }
            }
        }
        catch (e) {
            /* ignore */
        }
        const allElements = document.querySelectorAll("*");
        for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i];
            const key = getReactKey(el);
            if (!key)
                continue;
            const fiber = el[key];
            const roots = [(_c = fiber === null || fiber === void 0 ? void 0 : fiber.return) === null || _c === void 0 ? void 0 : _c.stateNode, (_d = fiber === null || fiber === void 0 ? void 0 : fiber.return) === null || _d === void 0 ? void 0 : _d.memoizedProps, fiber === null || fiber === void 0 ? void 0 : fiber.memoizedProps];
            for (let r = 0; r < roots.length; r++) {
                const rootObj = roots[r];
                if (!rootObj || typeof rootObj !== "object")
                    continue;
                const found = findBingeAssetInObject(rootObj, new WeakSet(), 0);
                if (found) {
                    return found;
                }
            }
        }
        return undefined;
    };
    /** Current episode tile in the More Episodes rail (has a `selected-*` class). */
    const getNextMoreEpisodesTile = () => {
        const tiles = Array.from(document.querySelectorAll('[data-testid="more-episodes-tile"]'));
        const selectedIdx = tiles.findIndex((tile) => typeof tile.className === "string" && /\bselected-/.test(tile.className));
        if (selectedIdx >= 0 && selectedIdx < tiles.length - 1) {
            return tiles[selectedIdx + 1];
        }
        return undefined;
    };
    const ensureMoreEpisodesOpen = () => {
        if (document.querySelector('[data-testid="more-episodes-list"]')) {
            return;
        }
        const toggle = document.querySelector('[data-testid="more-episodes-toggle-mobile"]') ||
            document.querySelector('[data-testid="more-episodes-toggle"]');
        if (toggle && typeof toggle.click === "function") {
            toggle.click();
        }
    };
    /** Read contentId/providerVariantId from React props on a more-episodes tile. */
    const getEpisodeIdFromTile = (tile) => {
        var _a, _b, _c, _d, _e;
        if (!tile) {
            return undefined;
        }
        try {
            const key = getReactKey(tile);
            if (!key) {
                return undefined;
            }
            const fiber = tile[key];
            const roots = [fiber === null || fiber === void 0 ? void 0 : fiber.memoizedProps, (_a = fiber === null || fiber === void 0 ? void 0 : fiber.return) === null || _a === void 0 ? void 0 : _a.memoizedProps, (_b = fiber === null || fiber === void 0 ? void 0 : fiber.return) === null || _b === void 0 ? void 0 : _b.stateNode];
            for (let r = 0; r < roots.length; r++) {
                const found = findBingeAssetInObject(roots[r], new WeakSet(), 0);
                const id = assetToEpisodeId(found);
                if (id) {
                    return id;
                }
                // Common tile prop shapes
                const direct = assetToEpisodeId(((_c = roots[r]) === null || _c === void 0 ? void 0 : _c.item) || ((_d = roots[r]) === null || _d === void 0 ? void 0 : _d.asset) || ((_e = roots[r]) === null || _e === void 0 ? void 0 : _e.data));
                if (direct) {
                    return direct;
                }
            }
        }
        catch (e) {
            /* ignore */
        }
        return undefined;
    };
    var messageHandler = function (e) {
        try {
            if (e.source != window) {
                return;
            }
            const messageType = e.data.type;
            if (messageType === "GetAdBreaks") {
                const adBreaks = isLivePlayback() ? [] : getMappedAdBreaks(true);
                window.dispatchEvent(new CustomEvent("FromNode", {
                    detail: {
                        type: "AdBreaks",
                        adBreaks,
                        updatedAt: Date.now(),
                    },
                }));
            }
            else if (messageType === "Seek") {
                // Local/stream time in ms (already converted from global by VideoApi)
                const video = getVideo();
                const timeInSeconds = e.data.time / 1000;
                if (video) {
                    console.log("Peacock Seek (local) to", timeInSeconds);
                    video.currentTime = timeInSeconds;
                }
                window.dispatchEvent(new CustomEvent("FromNode", {
                    detail: {
                        type: "Seek",
                        isPaused: video === null || video === void 0 ? void 0 : video.paused,
                        updatedAt: Date.now(),
                    },
                }));
            }
            else if (messageType === "NextEpisode") {
                if (isLivePlayback()) {
                    window.dispatchEvent(new CustomEvent("FromNode", {
                        detail: {
                            type: "NextEpisode",
                            nextEpisodeId: undefined,
                            updatedAt: Date.now(),
                        },
                    }));
                    return;
                }
                ensureMoreEpisodesOpen();
                // Prefer the tile after the selected More Episodes item (true up-next)
                const nextTile = getNextMoreEpisodesTile();
                let nextEpisodeId = getEpisodeIdFromTile(nextTile);
                if (!nextEpisodeId) {
                    const asset = findBingeAsset();
                    nextEpisodeId = assetToEpisodeId(asset);
                }
                console.log("Peacock NextEpisode", { nextEpisodeId, nextTileId: nextTile === null || nextTile === void 0 ? void 0 : nextTile.id });
                window.dispatchEvent(new CustomEvent("FromNode", {
                    detail: {
                        type: "NextEpisode",
                        nextEpisodeId,
                        updatedAt: Date.now(),
                    },
                }));
            }
        }
        catch (error) {
            console.error(error);
        }
    };
    if (!window.injectScriptLoaded) {
        window.injectScriptLoaded = true;
        console.log("Loaded TP Peacock Injected");
        window.addEventListener("message", messageHandler, !1);
        setTimeout(() => {
            try {
                if (!isLivePlayback()) {
                    getMappedAdBreaks(true);
                }
            }
            catch (e) {
                /* ignore */
            }
        }, 2000);
    }
})();

/******/ })()
;