const { get } = require('lodash')
const { XMLParser } = require('fast-xml-parser')
const { decode } = require('he')

const { OaiPmhError } = require('./errors')

const options = {
  attributeNamePrefix: '',
  attrNodeName: '$',
  textNodeName: '_',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  // parseFooValue controls whether fxp parses strings into numbers.
  // Callers generally prefer to be able to handle that as needed. 
  parseNodeValue: false,
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
  stopNodes: ['article-title', 'abstract', 'body'],
  // fast-xml-parser handles decoding XML entities.
  processEntities: true,
};
const parser = new XMLParser(options);

async function parseUsingFastParser(xml) {
  const parsedItem = parser.parse(xml);

  const oaiPmh = parsedItem && parsedItem['OAI-PMH'];

  if (!oaiPmh) {
    throw new OaiPmhError('Returned data does not conform to OAI-PMH');
  }

  const { error } = oaiPmh;
  if (error) {
    throw new OaiPmhError(`OAI-PMH provider returned an error: ${error._}`, get(error, '$.code'));
  }

  return oaiPmh;
}

async function parseOaiPmhXml(xml) {
  return parseUsingFastParser(xml);
}

module.exports = {
  parseOaiPmhXml
}
