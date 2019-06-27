/**
 * @jest-environment node
 */

// tslint:disable-next-line:no-var-requires
const glob = require('glob');
// tslint:disable-next-line:no-var-requires
const fs = require('fs');
// tslint:disable-next-line:no-var-requires
const Benchmark = require('benchmark');

// JSON Schema validation layer
import { validateRequestData } from '../validate';
// NEW extraction functions without validation
import { extract as extractCAPI } from '../extract-capi';
import { extract as extractConfig } from '../extract-config';
import { extract as extractLinkedData } from '../extract-linked-data';
import { extract as extractGA } from '../extract-ga';
//  OLD data cleaner and extraction functions
import { extract as oldExtractCAPI } from '../old-extract/extract-capi';
import { extract as oldExtractConfig } from '../old-extract/extract-config';
import { extract as oldExtractLinkedData } from '../old-extract/extract-linked-data';
import { extract as oldExtractGA } from '../old-extract/extract-ga';

const validateNew = (data: any) => {
    let validatedBody;
    try {
        validatedBody = validateRequestData(data, '/AMPArticle');
    } catch (err) {
        return err;
    }

    const CAPI = extractCAPI(validatedBody);
    const linkedData = extractLinkedData(validatedBody);
    const config = extractConfig(validatedBody);
    const ga = extractGA(validatedBody); // WEB ONLY

    return {
        CAPI,
        linkedData,
        config,
        ga,
    };
};

const validateOld = (data: any) => {
    const CAPI = oldExtractCAPI(data);
    const linkedData = oldExtractLinkedData(data);
    const config = oldExtractConfig(data);
    const ga = oldExtractGA(data); // WEB ONLY

    return {
        CAPI,
        linkedData,
        config,
        ga,
    };
};



const runBenchmarks = (samples: string[]) => {
    let count = 0;
    const rootIndex = __dirname.split('/').indexOf('dotcom-rendering');
    const root = __dirname
        .split('/')
        .slice(0, rootIndex + 1)
        .join('/');




    const results = samples.map((sample: string) => {
        count = count + 1;
        const path = `${root}/${sample}`;
        const sampleJson = JSON.parse(fs.readFileSync(path, 'utf-8'));
        const suite = new Benchmark.Suite();

        try {
            suite
                .add(
                    `JSON Schema`, function () {
                        validateNew(sampleJson)
                    }
                )
                .add(
                    `Validators`, function () {
                        validateOld(sampleJson)
                    }
                )
                .on('cycle', function (event) {
                    console.log(String(event.target));
                })
                .on('complete', function () {
                })
                .run({ async: false });

            return suite.filter('fastest').map('name');

        } catch (error) {
            console.error(error)
        }
    });

    return results

};



describe('Data Validation Performance Comparison', () => {

    //  NOTE: Run scripts / validation / sampleCollection.js to collect json samples for testing
    const samples = glob.sync('scripts/validation/samples/*.json', {});
    if (samples.length > 0) {
        const results = runBenchmarks(samples);
        console.log(results);

        it("should be faster", () => {
            expect(results.length).toEqual(2)
        })


    }
});



