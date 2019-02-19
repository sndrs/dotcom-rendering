import React from 'react';
import { Container } from '@guardian/guui';
import { css } from 'emotion';
import { palette } from '@guardian/pasteup/palette';
import { desktop, mobileLandscape } from '@guardian/pasteup/breakpoints';

import { MostViewed } from '@frontend/web/components/MostViewed';
import { Header } from '@frontend/web/components/Header/Header';
import { Footer } from '@frontend/web/components/Footer';
import { ArticleBody } from '@frontend/web/components/ArticleBody';
import { BackToTop } from '@frontend/web/components/BackToTop';
import { SubNav } from '@frontend/web/components/Header/Nav/SubNav/SubNav';
import { CookieBanner } from '@frontend/web/components/CookieBanner';
import { AdSlot } from '@frontend/web/components/AdSlot';

// TODO: find a better of setting opacity
const articleWrapper = css`
    background-color: rgba(18, 18, 18, 0.05);
`;

const secondaryColumn = css`
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 20px;
    width: 300px;
    margin-left: 20px;
    margin-top: 6px;

    min-height: 300px;
    display: none;

    ${desktop} {
        display: block;
    }
`;

const articleContainer = css`
    position: relative;
    background-color: ${palette.neutral[100]};
    padding: 0 10px;

    ${mobileLandscape} {
        padding: 0 20px;
    }
`;

export const Article: React.FC<{
    data: ArticleProps;
}> = ({ data }) => (
    <div>
        <Header
            nav={data.NAV}
            pillar={data.CAPI.pillar}
            edition={data.CAPI.editionId}
        />
        <main className={articleWrapper}>
            <Container className={articleContainer}>
                <article>
                    <ArticleBody CAPI={data.CAPI} config={data.config} />
                    <div className={secondaryColumn}>
                        {/* <div
                            id="dfp-ad--right"
                            className="js-ad-slot ad-slot ad-slot--right ad-slot--mpu-banner-ad js-sticky-mpu"
                            data-link-name="ad slot right"
                            data-name="right"
                            data-mobile="1,1|2,2|300,250|300,274|300,600|fluid"
                            aria-hidden="true"
                        /> */}
                        <AdSlot
                            name="right"
                            adTypes={['mpu-banner-ad']}
                            optClassNames={['js-sticky-mpu']}
                            sizeMapping={{
                                mobile: [
                                    '1,1',
                                    '2,2',
                                    '300,250',
                                    '300,274',
                                    '300,600',
                                    'fluid',
                                ],
                            }}
                        />
                    </div>
                </article>
                <MostViewed sectionName={data.CAPI.sectionName} />
            </Container>
        </main>

        <SubNav
            subnav={data.NAV.subNavSections}
            pillar={data.CAPI.pillar}
            currentNavLink={data.NAV.currentNavLink}
        />
        <BackToTop />

        <Footer />

        <CookieBanner />
    </div>
);
