// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: 'http://3.80.49.171:3000/api/v1',
    adminUrl: 'http://3.80.49.171:3000/api/v1',
    mobapiUrl: 'http://3.80.49.171:3000/api/v1',

    // apiUrl: 'http://localhost:3000/api/v1',
    // adminUrl: 'http://localhost:3000/api/v1',
    // mobapiUrl: 'http://localhost:3000/api/v1',
    ProjectName: 'Ackezy',
    validators: {
        name: { min: 3, max: 75 },
        email: { min: 3, max: 75 },
        company: { min: 3, max: 75 },
        phone: { min: 8, max: 15 },
        password: { min: 8, max: 16 },
        userCount: { minValue: 1, maxValue: 999, min: 1, max: 3 },
        notes: { min: 0, max: 300 },
        countryCode: { min: 1, max: 5 },
        countrySymbol: { min: 1, max: 5 },
        designation: { min: 3, max: 75 },
        camUrl: { min: 3, max: 200 },
        camUsername: { min: 3, max: 75 },
        camPassword: { min: 3, max: 75 }
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
