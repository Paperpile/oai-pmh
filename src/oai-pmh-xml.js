const { get } = require('lodash')
const parser = require('fast-xml-parser')
const { decode } = require('he')

const { OaiPmhError } = require('./errors')

function decodeHtmlEntities(obj) {
  if (typeof obj === 'number' || typeof obj === 'boolean') return obj;
  if (typeof obj === 'string') return decode(obj);

  for (const key of Object.keys(obj)) {
    obj[key] = decodeHtmlEntities(obj[key])
  }
  return obj;
}

async function parseUsingFastParser(xml) {
  const options = {
    attributeNamePrefix: '',
    attrNodeName: '$',
    textNodeName: '_',
    ignoreAttributes: false,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    parseNodeValue: false,
    parseAttributeValue: false,
    trimValues: true,
    stopNodes: ['article-title', 'abstract', 'body'],
    htmlEntities: true,
  };

  const parsedItem = parser.parse(xml, options);

  const oaiPmh = parsedItem && parsedItem['OAI-PMH'];

  if (!oaiPmh) {
    throw new OaiPmhError('Returned data does not conform to OAI-PMH');
  }

  const { error } = oaiPmh;
  // test if the parsed xml contains an error
  if (error) {
    throw new OaiPmhError(`OAI-PMH provider returned an error: ${error._}`, get(error, '$.code'));
  }

  return decodeHtmlEntities(oaiPmh);
}

async function parseOaiPmhXml(xml) {
  return parseUsingFastParser(xml);
}

module.exports = {
  parseOaiPmhXml
}
