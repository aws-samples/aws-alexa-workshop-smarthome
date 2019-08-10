const describe = require('mocha').describe;
const { getDevicesByUsername } = require('../index');

describe('AlexaHandler', function() {
  describe('TestIndex', function () {

    it('getDevicesByUsername', async function () {

      const items = await getDevicesByUsername('3add67b1-e318-42e8-9eb4-577f38be4482');

      console.log(items);

    });
  })
});