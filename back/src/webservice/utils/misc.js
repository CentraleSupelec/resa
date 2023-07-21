// @flow

const xml2json = require("xml2json");

/* Miscellaneous functions needed by multiple files */

function convertToArray /* :: 
  <K, T> 
*/(
  obj /* : {[key: K]: T} */,
) /* : Array<{| name: K, content: T|}> */ {
  /*
  obj should look like the following:
  {
    key1: value1,
    key2: value2,
    ...
  }

  This function will return the following array:
  [{ name: key1, content: value1 }, { name: key2, content: value2 }, ... ]
  */

  return Object.keys(obj).map((key /* : K */) => ({
    name: key,
    content: obj[key],
  }));
}

function getPropertyRawValues(
  object /* : any */,
  CodPro /* : string */,
) /* : string[] */ {
  /*
  After being converted to JSON, GEODE response format is:
    {
      ...
      Pro: [{
        CodPro: "1234",   // field ID
        ValPro: 5678    // value
      }, {
        CodPro: ...
        ValPro: ...
      }, ...]
    }

  This function finds the attributeObject {CodPro: ... , ValPro: ...}
  corresponding to CodPro and returns ValPro.

  object can be a room or an event.
  */

  const attributeObject = object.PRO.filter(
    property => property.CodPro === CodPro,
  );

  return attributeObject.map(property => property.ValPro);
}

function getPropertyRawValue(
  object /* : any */,
  CodPro /* : string */,
) /* : string | null */ {
  /*
  After being converted to JSON, GEODE response format is:
    {
      ...
      Pro: [{
        CodPro: "1234",   // field ID
        ValPro: 5678    // value
      }, {
        CodPro: ...
        ValPro: ...
      }, ...]
    }

  This function finds the attributeObject {CodPro: ... , ValPro: ...}
  corresponding to CodPro and returns ValPro.

  object can be a room or an event.
  */

  const attributeObject = getPropertyRawValues(object, CodPro)[0];

  // Check if attribute exists for this room
  if (!attributeObject) {
    return null;
  }

  return attributeObject;
}

function readXML(xml /* : any */) {
  return JSON.parse(xml2json.toJson(xml));
}

module.exports = {
  convertToArray,
  getPropertyRawValues,
  getPropertyRawValue,
  readXML,
};
