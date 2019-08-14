import React from 'react';
import { css, cx } from 'emotion';

import { serif, sans, textSans, headline } from '@guardian/pasteup/typography';
import ArrowRightIcon from '@guardian/pasteup/icons/arrow-right.svg';
import { palette } from '@guardian/pasteup/palette';
import {
    tablet,
    desktop,
    mobileMedium,
    until,
    leftCol,
} from '@guardian/pasteup/breakpoints';

import { getCookie } from '@frontend/web/browser/cookie';
import { AsyncClientComponent } from '@frontend/web/components/lib/AsyncClientComponent';

const message = css`
    color: ${palette.highlight.main};
    display: none;
    ${serif.headline};
    font-size: 20px;
    font-weight: 800;
    padding-top: 3px;
    margin-bottom: 3px;

    ${tablet} {
        display: block;
    }

    ${desktop} {
        ${headline(4)}
    }

    ${leftCol} {
        ${headline(6)}
    }
`;

const link = css`
    background: ${palette.highlight.main};
    border-radius: 16px;
    box-sizing: border-box;
    color: ${palette.neutral[7]};
    float: left;
    ${sans.body};
    font-weight: 700;
    height: 32px;
    text-decoration: none;
    padding: 7px 12px 0 12px;
    position: relative;
    margin-right: 10px;

    ${mobileMedium} {
        padding-right: 34px;
    }

    svg {
        fill: currentColor;
        position: absolute;
        right: 3px;
        top: 50%;
        height: 32px;
        width: 32px;
        transform: translate(0, -50%);
        transition: transform 0.3s ease-in-out;

        ${until.mobileMedium} {
            display: none;
        }
    }

    :hover svg {
        transform: translate(3px, -50%);
    }
`;

const hiddenUntilTablet = css`
    ${until.tablet} {
        display: none;
    }
`;

const hiddenFromTablet = css`
    ${tablet} {
        display: none;
    }
`;

const hidden = css`
    display: none;
`;

const subMessage = css`
    color: ${palette.neutral[100]};
    ${textSans(5)};
    margin-bottom: 9px;
`;

export const ReaderRevenueLinks: React.FC<{
    edition: Edition;
    urls: {
        subscribe: string;
        support: string;
        contribute: string;
    };
    dataLinkNamePrefix: string;
}> = ({ edition, urls, dataLinkNamePrefix }) => {
    return (
        <AsyncClientComponent f={shouldShow}>
            {({ data }) => (
                <>
                    {data && (
                        <>
                            {/* <div className={readerRevenueLinks}> */}
                            <div className={message}>
                                Support The&nbsp;Guardian
                            </div>
                            <div className={cx(subMessage, hiddenUntilTablet)}>
                                Available for everyone, funded by readers
                            </div>
                            <a
                                className={cx(link, hiddenUntilTablet)}
                                href={urls.contribute}
                                data-link-name={`${dataLinkNamePrefix}contribute-cta`}
                            >
                                Contribute <ArrowRightIcon />
                            </a>
                            <a
                                className={cx(link, hiddenUntilTablet)}
                                href={urls.subscribe}
                                data-link-name={`${dataLinkNamePrefix}subscribe-cta`}
                            >
                                Subscribe <ArrowRightIcon />
                            </a>
                            <a
                                className={cx(link, hiddenFromTablet, {
                                    [hidden]: edition !== 'UK',
                                })}
                                href={urls.support}
                                data-link-name={`${dataLinkNamePrefix}support-cta`}
                            >
                                Support us <ArrowRightIcon />
                            </a>
                            <a
                                className={cx(link, hiddenFromTablet, {
                                    [hidden]: edition === 'UK',
                                })}
                                href={urls.contribute}
                                data-link-name={`${dataLinkNamePrefix}contribute-cta`}
                            >
                                Contribute <ArrowRightIcon />
                            </a>
                            {/* </div> */}
                        </>
                    )}
                </>
            )}
        </AsyncClientComponent>
    );
};

const shouldShow: () => Promise<boolean> = () =>
    Promise.resolve(!(isRecentContributor() || isPayingMember()));

const isRecentContributor: () => boolean = () => {
    const value = getCookie('gu.contributions.contrib-timestamp');

    if (!value) {
        return false;
    }

    const now = new Date().getTime();
    const lastContribution = new Date(value).getTime();
    const diffDays = Math.ceil((now - lastContribution) / (1000 * 3600 * 24));

    return diffDays <= 180;
};

const isPayingMember: () => boolean = () => {
    return getCookie('gu_paying_member') === 'true';
};
