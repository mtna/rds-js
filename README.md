# RDS - JS
#### _WARNING: THIS PROJECT IS IN EARLY DEVELOPMENT STAGE. CONTENT OR CODE SHOULD ONLY BE USED FOR TESTING OR EVALUATION PURPOSES._

![npm](https://img.shields.io/npm/v/@rds/sdk?style=for-the-badge)
![Travis (.com) branch](https://img.shields.io/travis/com/mtna/rds-js?style=for-the-badge)
![Coveralls github branch](https://img.shields.io/coveralls/github/mtna/rds-js?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/mtna/rds-js?style=for-the-badge)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/mtna/rds-js?style=for-the-badge)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier)

<a href="https://www2.richdataservices.com"><img src="https://www2.richdataservices.com/assets/logo.svg" align="left" target="_blank" hspace="10" vspace="6" style="max-width: 200px"></a>

**Rich Data Services** (or **RDS**) is a suite of REST APIs designed by Metadata Technology North America (MTNA) to meet various needs for data engineers, managers, custodians, and consumers. RDS provides a range of services including data profiling, mapping, transformation, validation, ingestion, and dissemination. For more information about each of these APIs and how you can incorporate or consume them as part of your work flow please visit the MTNA website.

**RDS-JS** is TypeScript/JavaScript library to simplify and faciliate interacting with any given RDS API. By using this SDK you will add to your project the benefit of strong types and easy to use helper functions that directly reflect the RDS API.

Make RDS queries easy. Write strongly typed code. Use RDS-JS.

## References
[RDS SDK Documentation](https://mtna.github.io/rds-js/) | [RDS API Documentation](https://covid19.richdataservices.com/rds/swagger/) | [Examples](https://github.com/mtna/rds-js-examples) | [Contributing](CONTRIBUTING.md) | [Developer Documentation](DEVELOPER.md) | [Changelog](https://github.com/mtna/rds-js/releases)
|---|---|---|---|---|---|

## Quick start

### Using NPM

Install the sdk into your project.

```
npm install @rds/sdk
```

#### Initialization

Import `RdsServer` and initialize to indicate where the RDS API is hosted. This must be done a single time before performing any queries.

```typescript
import { RdsServer } from '@rds/sdk';
RdsServer.init('https://', 'covid19.richdataservices.com');
```

### RDS Query Controller

This service is used to query data products for both record level and aggregate data.

#### Count

> Get the number of records in a dataset

```typescript
import { HttpResponse, RdsQueryController } from '@rds/sdk';

const CATALOG_ID = 'covid19';
const DATA_PRODUCT_ID = 'us_jhu_ccse_country';

RdsQueryController
  .count(CATALOG_ID, DATA_PRODUCT_ID)
  .then((res: HttpResponse<number>) =>
    { console.log(`Found ${res.parsedBody} records!`); }
  );
```

#### Select

> Running a select query on the specified data product returns record level microdata.

```typescript
import { AmchartsDataSet, HttpResponse, RdsQueryController, RdsSelectParameters } from '@rds/sdk';

const CATALOG_ID = 'covid19';
const DATA_PRODUCT_ID = 'us_jhu_ccse_country';
const PARAMS: RdsSelectParameters = {
  cols: 'date_stamp,cnt_confirmed,cnt_death,cnt_recovered',
  where: '(iso3166_1=US)',
  metadata: true,
  limit: 5000,
  format: 'amcharts'
};

RdsQueryController
  .select<AmchartsDataSet>(CATALOG_ID, DATA_PRODUCT_ID, PARAMS)
  .then((res: HttpResponse<AmchartsDataSet>) =>
    { /** Make a cool visualization */ }
  );
```

#### Tabulate

> Running tabulations on the specified data product returns aggregate level data about the dimensions and measures specified.

```typescript
import { AmchartsDataSet, HttpResponse, RdsQueryController, RdsTabulateParameters } from '@rds/sdk';

const CATALOG_ID = 'covid19';
const DATA_PRODUCT_ID = 'us_jhu_ccse_country';
const PARAMS: RdsTabulateParameters = {
  dims: 'iso3166_1',
  measure: 'cnt_confirmed:SUM(cnt_confirmed),cnt_death:SUM(cnt_death),cnt_recovered:SUM(cnt_recovered)',
  orderby: 'cnt_confirmed DESC',
  metadata: true,
  limit: 10
};

RdsQueryController
  .tabulate<AmchartsDataSet>(CATALOG_ID, DATA_PRODUCT_ID, PARAMS)
  .then((res: HttpResponse<AmchartsDataSet>) =>
    { /** Make a cool visualization */ }
  );
```
