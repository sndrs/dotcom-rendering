import resetCSS from /* preval */ '../lib/reset-css';
import fontsCSS from '../lib/fonts-css';
import assets from '../lib/assets';

export default ({
    title = 'The Guardian',
    priorityScripts,
    css,
    html,
    data,
    cssIDs,
    nonBlockingJS = '',
    fontFiles = [],
}: {
    title?: string;
    priorityScripts: string[];
    css: string;
    html: string;
    data: {
        page: string;
        site: string;
    };
    cssIDs: string[];
    nonBlockingJS?: string;
    fontFiles?: string[];
}) => {
    const sanitiseDomRefs = (jsString: string) =>
        jsString.replace(/"(document.*?innerHTML)"/g, '$1');

    return `<!doctype html>
        <html>
            <head>
                <title>${title}</title>
                <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
                ${priorityScripts
                    .map(
                        url => `<link rel="preload" href="${url}" as="script">`,
                    )
                    .join('\n')}
                ${fontFiles
                    .map(
                        fontFile =>
                            `<link rel="preload" href="${assets.static(
                                fontFile,
                            )}" as="font" crossorigin>`,
                    )
                    .join('\n')}
                <style>${fontsCSS}${resetCSS}${css}</style>
                <script>
                window.guardian = ${sanitiseDomRefs(
                    JSON.stringify({
                        app: {
                            data,
                            cssIDs,
                        },
                        config: {},
                    }),
                )};
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
                <script>
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
                </script>
                <script>${nonBlockingJS}</script>
            </body>
        </html>`;
};
