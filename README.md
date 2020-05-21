# RDS - JS
#### _WARNING: THIS PROJECT IS IN EARLY DEVELOPMENT STAGE. CONTENT OR CODE SHOULD ONLY BE USED FOR TESTING OR EVALUATION PURPOSES._

![npm](https://img.shields.io/npm/v/@rds/sdk?style=for-the-badge)
![Travis (.com) branch](https://img.shields.io/travis/com/mtna/rds-js?style=for-the-badge)
![Coveralls github branch](https://img.shields.io/coveralls/github/mtna/rds-js?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/mtna/rds-js?style=for-the-badge)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/mtna/rds-js?style=for-the-badge)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge)](https://github.com/semantic-release/semantic-release)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge)](https://github.com/prettier/prettier)

## Checkout our awesome [examples/showcases][examples] repo.
<br>

<a href="https://www.richdataservices.com"><img src="./resources/rds-logo.png" align="left" width="200"></a>

**Rich Data Services** (or **RDS**) is a suite of REST APIs designed by Metadata Technology North America (MTNA) to meet various needs for data engineers, managers, custodians, and consumers. RDS provides a range of services including data profiling, mapping, transformation, validation, ingestion, and dissemination. For more information about each of these APIs and how you can incorporate or consume them as part of your work flow please visit the MTNA website.

**RDS-JS** is TypeScript/JavaScript library to simplify and faciliate interacting with any given RDS API. By using this SDK you will add to your project the benefit of strong types and easy to use helper functions that directly reflect the RDS API.

Make RDS queries easy. Write strongly typed code. Use RDS-JS.

## References
[RDS SDK Documentation][docs] | [RDS API Documentation](https://covid19.richdataservices.com/rds/swagger/) | [Examples][examples] | [Contributing](CONTRIBUTING.md) | [Developer Documentation](DEVELOPER.md) | [Changelog](https://github.com/mtna/rds-js/releases)
|---|---|---|---|---|---|

## Quick start

### Using NPM

Install the sdk into your project.

```
npm install @rds/sdk
```

### The setup

```typescript
import { RdsServer, RdsCatalog, RdsDataProduct } from '@rds/sdk';

// Instantiate a new server to define where the RDS API is hosted.
const server = new RdsServer('https://covid19.richdataservices.com/rds');
// Instantiate a catalog that exists on the server
const catalog = new RdsCatalog(server, 'int');
// Instantiate a data product that exists on the catalog
const dataProduct = new RdsDataProduct(catalog, 'jhu_country');
```

These are the basic, foundational building blocks of the RDS SDK. From here, we can explore what catalogs/data products exist on the server, details about them, subset the data through various queries, and downloading customized data packages.

See the [documentation][docs] for the full SDK API.

---

### RdsServer

A basic building block to interact with a RDS API.
Includes methods to query server-level information.

> Get the root catalog on the server
```ts
import { RdsServer } from '@rds/sdk';
const server = new RdsServer('https://covid19.richdataservices.com/rds');
server
  .getRootCatalog()
  .then(res=>
    console.log(`There are ${res.parsedBody.catalogs.length} catalogs on this server!`)
  );
```

---

### RdsCatalog

A basic building block to interact with a RDS API.
Represents a single catalog, includes methods to query catalog related information.

> Resolve properties about the catalog
```ts
import { RdsCatalog } from '@rds/sdk';
// Given a previously instantiated server, like in the examples above
const catalog = new RdsCatalog(server, 'int');
catalog
  .resolve()
  .then(()=>
    catalog.name; // Name of catalog
    catalog.description; // Catalog description
    catalog.dataProducts; // All the data products on this catalog
    // See the docs for all the possible properties
  );
```

---

### RdsDataProduct

A basic building block to interact with a RDS API.
Represents a single data product within a catalog, includes methods to query data product related information.

> Run a **select** query to get record level microdata.

```ts
import { AmchartsDataSet, HttpResponse, RdsDataProduct, RdsSelectParameters } from '@rds/sdk';

// Given the catalog from the above examples
const dataProduct = new RdsDataProduct(catalog, 'jhu_country');
// Specify some parameters
const params: RdsSelectParameters = {
  cols: 'date_stamp,cnt_confirmed,cnt_death,cnt_recovered',
  where: '(iso3166_1=US)',
  metadata: true,
  limit: 5000,
  format: 'amcharts'
};

dataProduct
  .select<AmchartsDataSet>(params)
  .then((res: HttpResponse<AmchartsDataSet>) =>
    { /* Make a cool visualization */ }
  );
```

> Run a **tabulation** to get aggregate level data about the dimensions and measures specified.

```typescript
import { AmchartsDataSet, HttpResponse, RdsDataProduct, RdsTabulateParameters } from '@rds/sdk';

// Given the catalog from the above examples
const dataProduct = new RdsDataProduct(catalog, 'jhu_country');
// Specify some parameters
const params: RdsTabulateParameters = {
  dims: 'date_stamp,iso3166_1',
  measure: 'cnt_confirmed:SUM(cnt_confirmed)',
  where: '(year_stamp=2020) AND (iso3166_1=US OR iso3166_1=CA OR iso3166_1=ES OR iso3166_1=IT OR iso3166_1=CN)',
  orderby: 'date_stamp ASC,iso3166_1 ASC',
  metadata: true,
  inject: true,
  totals: true,
  format: 'plotly_heatmap'
};

dataProduct
  .tabulate<PlotlyDataSet>(params)
  .then((res: HttpResponse<PlotlyDataSet>) =>
    { /* Make a cool visualization */ }
  );
```

[docs]: https://mtna.github.io/rds-js/
[examples]: https://github.com/mtna/rds-js-examples