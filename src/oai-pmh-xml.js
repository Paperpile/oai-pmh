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
  // We generally prefer to control that ourselves. 
  parseNodeValue: false,
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
  stopNodes: ['article-title', 'abstract', 'body'],
  // Let fast-xml-parser handle decoding HTML character entities.
  htmlEntities: true,
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
