import { getObject } from './validators';

export const extract = (data: {}): any => ({
    page: getObject(data, 'config.page'),
    nav: getObject(data, 'config.nav', ''),
    switches: getObject(data, 'config.page.switches', ''),
});
