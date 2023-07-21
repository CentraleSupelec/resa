/*
* Recapitalize names
* In database, some firstnames/lastnames are saved as "JOHN" "DOE"
* Change capitalization to "John" "Doe"
*/

export const recapitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const forbiddenInTitles = new RegExp(/[^a-zA-Z0-9\u00C0-\u017F '^¨]/, 'gi');

export const filterTitles = (title) => title.replace(forbiddenInTitles, '');
