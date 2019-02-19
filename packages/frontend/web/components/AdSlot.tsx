import React from 'react';

export const AdSlot: React.FC<{
    name: string;
    adTypes: string[];
    sizeMapping: {
        [key: string]: string[];
    };
    showLabel?: boolean;
    refresh?: boolean;
    outOfPage?: boolean;
    optId?: string;
    optClassNames?: string[];
}> = ({
    name,
    adTypes,
    sizeMapping,
    showLabel = true,
    refresh = true,
    outOfPage = false,
    optId,
    optClassNames,
}) => {
    const dataSizeMappings = Object.keys(sizeMapping).reduce(
        (
            mappings: {
                [key: string]: string;
            },
            key,
        ) => {
            mappings[`data-${key}`] = sizeMapping[key].join('|');

            return mappings;
        },
        {},
    );

    const getClassNames = (): string => {
        const baseClassNames = ['js-ad-slot', 'ad-slot', `ad-slot--${name}`];
        const adTypeClassNames = adTypes.map(adType => `ad-slot--${adType}`);

        return baseClassNames
            .concat(adTypeClassNames, optClassNames || [])
            .join(' ');
    };

    return (
        <div
            id={`dfp-ad--${optId || name}`}
            className={getClassNames()}
            data-link-name={`ad slot ${name}`}
            data-name={name}
            // data-label={showLabel}
            // data-refresh={refresh}
            // data-out-of-page={outOfPage}
            {...dataSizeMappings}
            aria-hidden="true"
        />
    );
};
