import React from 'react';
import { InnerContainer } from '@frontend/amp/components/InnerContainer';
import { css } from 'emotion';
import { ArticleModel } from '@frontend/amp/pages/Article';
import { TopMetaLiveblog } from '@frontend/amp/components/topMeta/TopMetaLiveblog';
import { SubMeta } from '@frontend/amp/components/SubMeta';
import { palette } from '@guardian/pasteup/palette';
import { KeyEvents } from '@frontend/amp/components/KeyEvents';
import { Blocks } from '@frontend/amp/components/Blocks';
import RefreshIcon from '@guardian/pasteup/icons/refresh.svg';
import { Pagination } from '@frontend/amp/components/Pagination';
import { headline, textSans } from '@guardian/pasteup/typography';
import { getSharingUrls } from '@frontend/model/sharing-urls';

// TODO check if liveblog background colours are more complex - like regular
// article is

const bodyStyle = css`
    background-color: ${palette.neutral[97]};

    h2 {
        ${headline(3)};
        font-weight: 500;
        margin-block-start: 0.83em;
        margin-block-end: 0.83em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
    }
`;

// To override AMP styles we need to use nested and specific selectors here
// unfortunately.
const updateButtonStyle = css`
    &.amp-active[update] {
        position: fixed;
        left: 0;
        top: 12px;
        display: flex;
        justify-content: center;
    }

    width: 100%;

    button {
        border: none;
        border-radius: 1000px;
        height: 36px;
        padding: 0 12px;

        background-color: ${palette.news.main};
        color: ${palette.neutral[100]};
        font-weight: bold;
        ${textSans(1)};

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    svg {
        height: 20px;
        width: 20px;
        margin-right: 6px;
    }
`;

// Note, it is possible for liveblog updates to lack styling if a style change
// to any block content is deployed between a user loading a live blog and the
// updates happening. This happens because we don't include new styles on block
// updates, but only on initial page load.
export const Body: React.FC<{
    pillar: Pillar;
    data: ArticleModel;
    config: ConfigType;
}> = ({ pillar, data, config }) => {
    const url = `${data.guardianBaseURL}/${data.pageId}`;
    const isFirstPage = data.pagination
        ? data.pagination.currentPage === 1
        : false;

    return (
        <InnerContainer className={bodyStyle}>
            <TopMetaLiveblog articleData={data} />
            <KeyEvents events={data.keyEvents} url={url} />

            {!isFirstPage && (
                <Pagination guardianURL={url} pagination={data.pagination} />
            )}

            <amp-live-list
                id="live-blog-entries-main"
                data-max-items-per-page="20" // TODO confirm if this should be dynamic
            >
                <div update="" className={updateButtonStyle}>
                    <button on="tap:live-blog-entries-main.update">
                        <RefreshIcon />
                        <span>You have updates</span>
                    </button>
                </div>
                <div items="">
                    <Blocks
                        pillar={pillar}
                        blocks={data.blocks}
                        // stuff for ads
                        edition={data.editionId}
                        section={data.sectionName}
                        contentType={data.contentType}
                        switches={config.switches}
                        commercialProperties={data.commercialProperties}
                        url={url}
                        shouldHideAds={data.shouldHideAds}
                    />
                </div>
            </amp-live-list>

            <Pagination guardianURL={url} pagination={data.pagination} />

            <SubMeta
                sections={data.subMetaSectionLinks}
                keywords={data.subMetaKeywordLinks}
                pillar={pillar}
                sharingURLs={getSharingUrls(data.pageId, data.webTitle)}
                pageID={data.pageId}
                isCommentable={data.isCommentable}
                guardianBaseURL={data.guardianBaseURL}
            />
        </InnerContainer>
    );
};
