const core    = require('@actions/core');
const { getBifrostSyncVersionNumber } = require('./business/bifrost');
const github  = require('@actions/github');

(async () => {
  await getBifrostSyncVersionNumber(core, github)
})()