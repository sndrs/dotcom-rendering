import resetCSS from /* preval */ '@frontend/lib/reset-css';
import { getFontsCss } from '@frontend/lib/fonts-css';
import { getStatic } from '@frontend/lib/assets';

export const htmlTemplate = ({
    title = 'The Guardian',
    linkedData,
    priorityScripts,
    lowPriorityScripts,
    css,
    html,
    data,
    cssIDs,
    nonBlockingJS = '',
    fontFiles = [],
    commercial,
}: {
    title?: string;
    linkedData: object;
    priorityScripts: string[];
    lowPriorityScripts: string[];
    css: string;
    html: string;
    data: {
        page: string;
        site: string;
    };
    cssIDs: string[];
    nonBlockingJS?: string;
    fontFiles?: string[];
    commercial: any;
}) => {
    const favicon =
        process.env.NODE_ENV === 'production'
            ? 'favicon-32x32.ico'
            : 'favicon-32x32-dev-yellow.ico';

    return `<!doctype html>
        <html>
            <head>
                <title>${title}</title>
                <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
                <link rel="icon" href="https://static.guim.co.uk/images/${favicon}">

                <script type="application/ld+json">
                    ${JSON.stringify(linkedData)}
                </script>

                ${priorityScripts
                    .map(
                        url => `<link rel="preload" href="${url}" as="script">`,
                    )
                    .join('\n')}
                ${fontFiles
                    .map(
                        fontFile =>
                            `<link rel="preload" href="${getStatic(
                                fontFile,
                            )}" as="font" crossorigin>`,
                    )
                    .join('\n')}
                <style>${getFontsCss()}${resetCSS}${css}</style>
                <script>
                window.guardian = ${JSON.stringify({
                    // app: {
                    //     data,
                    //     cssIDs,
                    // },
                    // config: {
                    //     tests: {
                    //         renderer: 'new',
                    //     },
                    // },
                    // config: {
                    //     page: commercial.page,
                    // },
                    adBlockers: {
                        active: undefined,
                        onDetect: [],
                    },
                })};
                window.guardian.config = {
                    "page": ${JSON.stringify(commercial.page)},
                    "nav": ${JSON.stringify(commercial.nav)},
                    "switches": ${JSON.stringify(commercial.switches)},
                    "tests": {},
                    "modules": {
                        "tracking": {
                            "ready": null
                        }
                    },
                    "images": {
                        "commercial": {
                            "ab-icon": "/assets/images/commercial/ab-icon.png",
                            "abp-icon": "/assets/images/commercial/abp-icon.png",
                            "abp-whitelist-instruction-chrome": "/assets/images/commercial/ad-block-instructions-chrome.png"
                        },
                        "acquisitions": {
                            "paypal-and-credit-card": "/assets/images/acquisitions/paypal-and-credit-card.png",
                            "info-logo": "/assets/images/acquisitions/info-logo.svg",
                            "ad-free": "/assets/images/acquisitions/ad-free.svg"
                        },
                        "journalism": {
                            "apple-podcast-logo": "/assets/images/journalism/apple-podcast-icon-48.png"
                        }
                    },
                    "stylesheets": {
                        "fonts": {
                            "hintingCleartype": {
                                "kerningOn": "/assets/stylesheets/webfonts-hinting-cleartype-kerning-on.css"
                            },
                            "hintingOff": {
                                "kerningOn": "/assets/stylesheets/webfonts-hinting-off-kerning-on.css"
                            },
                            "hintingAuto": {
                                "kerningOn": "/assets/stylesheets/webfonts-hinting-auto-kerning-on.css"
                            }
                        }
                    },
                    "googleAnalytics": {
                        "trackers": {
                            "editorialTest": "guardianTestPropertyTracker",
                            "editorialProd": "allEditorialPropertyTracker",
                            "editorial": "guardianTestPropertyTracker"
                        },
                        "timingEvents": []
                    },
                    "libs": {
                        "googletag": "//www.googletagservices.com/tag/js/gpt.js",
                        "sonobi": "//api.nextgen.guardianapps.co.uk/morpheus.theguardian.12919.js",
                        "cmp": {
                            "fullVendorDataUrl": "/assets/data/vendor/cmp_vendorlist.json"
                        }
                    },
                    "ophan": {
                        "pageViewId": "jqwdk27s2i3dwpji2ohh",
                        "browserId": null
                    }
                }
                // this is a global that's called at the bottom of the pf.io response,
                // once the polyfills have run. This may be useful for debugging.
                // mainly to support browsers that don't support async=false or defer
                function guardianPolyfilled() {
                    try {
                        window.guardian.polyfilled = true;
                        window.guardian.onPolyfilled();
                    } catch (e) {};
                }
                (function() {
                    var firstScript = document.scripts[0];
                    [${priorityScripts.map(script =>
                        JSON.stringify(script),
                    )}].forEach(url => {
                        if ('async' in firstScript) {
                            // modern browsers
                            var script = document.createElement('script');
                            script.async = false;
                            script.src = url;
                            if (document.head) {
                                document.head.appendChild(script);
                            }
                        } else {
                            // fall back to defer
                            document.write('<script src="' + url + '" defer></' + 'script>');
                        }
                    });
                })();
                </script>
            </head>
            <body>
                <div id="app">${html}</div>
                ${lowPriorityScripts
                    .map(script => `<script async src="${script}"></script>`)
                    .join('\n')}
                <script>
                    ${nonBlockingJS}

                    try{(function(document,window){if(!window.__cmp)window.__cmp=function(){var listen=window.attachEvent||window.addEventListener;listen("message",function(event){window.__cmp.receiveMessage(event)},false);function addLocatorFrame(){if(!window.frames["__cmpLocator"])if(document.body){var frame=document.createElement("iframe");frame.style.display="none";frame.name="__cmpLocator";frame.setAttribute("aria-hidden",true);document.body.appendChild(frame)}else setTimeout(addLocatorFrame,5)}addLocatorFrame();
                    var commandQueue=[];var cmp=function(command,parameter,callback){if(command==="ping"){if(callback)callback({gdprAppliesGlobally:!!(window.__cmp&&window.__cmp.config&&window.__cmp.config.storeConsentGlobally),cmpLoaded:false})}else commandQueue.push({command:command,parameter:parameter,callback:callback})};cmp.commandQueue=commandQueue;cmp.receiveMessage=function(event){var data=event&&event.data&&event.data.__cmpCall;if(data)commandQueue.push({callId:data.callId,command:data.command,parameter:data.parameter,
                    event:event})};cmp.config={storeConsentGlobally:false,storePublisherData:false,logging:false,gdprApplies:false};return cmp}()})(document,window)}catch(e){throw e;};

                    try{(function(document,window){function shouldServeLotame(){try{var geo=JSON.parse(window.localStorage.getItem("gu.geolocation")).value;if(geo==="US"||geo==="CA"||geo==="AU"||geo==="NZ")return false;return true}catch(e){}return false}if(shouldServeLotame()){var script=document.createElement("script");script.src="https://tags.crwdcntrl.net/c/12666/cc.js";document.body.appendChild(script)}})(document,window)}catch(e){throw e;};
                </script>
            </body>
        </html>`;
};
