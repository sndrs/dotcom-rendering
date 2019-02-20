import { getNonEmptyString, getString, getObject } from './validators';

const getCommercialUrl = (data: {}): string => {
    const realtivePath = getNonEmptyString(data, 'config.commercialUrl');

    if (process.env.NODE_ENV !== 'production') {
        return `${getNonEmptyString(
            data,
            'config.page.guardianBaseURL',
        )}${realtivePath}`;
    }

    return realtivePath;
};

export const extract = (data: {}): ConfigType => ({
    ajaxUrl: getNonEmptyString(data, 'config.page.ajaxUrl'),
    sentryPublicApiKey: getString(data, 'config.page.sentryPublicApiKey', ''),
    sentryHost: getString(data, 'config.page.sentryHost', ''),
    subscribeWithGoogleApiUrl: getString(
        data,
        'config.page.subscribeWithGoogleApiUrl',
        '',
    ),
    isDev: process.env.NODE_ENV === 'development',
    switches: getObject(data, 'config.page.switches', {}),
    dfpAccountId: getObject(data, 'config.page.dfpAccountId', ''), // TODO check and fix
    commercialUrl: getCommercialUrl(data),
});
