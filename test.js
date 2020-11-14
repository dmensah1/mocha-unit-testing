var assert = require('assert');
var fn = require('./purchaseOrder');
var sinon = require("sinon");
//const { orderHandling } = require("./");

var clientAccount = [
    {
        age: "15",
        balance: "0",
        creditScore: -1
    },
    {
        age: "20",
        balance: "50",
        creditScore: 150
    },
    {
        age: "30",
        balance: "250",
        creditScore: 30
    },
    {
        age: "40",
        balance: "750",
        creditScore: 80
    },
    {
        age: "55",
        balance: "2000",
        creditScore: 30
    },
    {
        age: "80",
        balance: "4000",
        creditScore: 150
    },
    {
        age: "100",
        balance: "6000",
        creditScore: 70
    },
    {
        age: "100",
        balance: "750",
        creditScore: 85
    },
    {
        age: "40",
        balance: "6000",
        creditScore: "30"
    }
];

let inventory = [
    {
        name: "shoes",
        quantity: 0
    }
];


describe('Strong Robust (SR)', function() {
  describe('Account Status Function (AS)', function() {
        it('SR-AS1, invalid', function() {
            assert.equal(fn.accountStatus(clientAccount[0]), 'invalid');
        });
        it('SR-AS2, adverse', function() {
            assert.equal(fn.accountStatus(clientAccount[1]), 'adverse');
        });
        it('SR-AS3, acceptable', function() {
            assert.equal(fn.accountStatus(clientAccount[2]), 'acceptable');
        });
        it('SR-AS4, acceptable', function() {
            assert.equal(fn.accountStatus(clientAccount[3]), 'acceptable');
        });
        it('SR-AS5, excellent', function() {
            assert.equal(fn.accountStatus(clientAccount[4]), 'excellent');
        });
        it('SR-AS6, excellent', function() {
            assert.equal(fn.accountStatus(clientAccount[5]), 'excellent');
        });
        it('SR-AS7, invalid', function() {
            assert.equal(fn.accountStatus(clientAccount[6]), 'invalid');
        });
        it('SR-AS8, invalid', function() {
            assert.equal(fn.accountStatus(clientAccount[7]), 'invalid');
        });
        it('SR-AS9, invalid', function() {
            assert.equal(fn.accountStatus(clientAccount[8]), 'invalid');
        });
  });

  describe('Credit Status Function (CS)', function() {
      it('SR-CS1, invalid', function() {
        assert.equal(fn.creditStatus(clientAccount[0], 'strict'), 'invalid')
      });
      it('SR-CS2, invalid', function() {
        assert.equal(fn.creditStatus(clientAccount[1], 'strict'), 'invalid')
      });
      it('SR-CS3, adverse', function() {
        assert.equal(fn.creditStatus(clientAccount[2], 'strict'), 'adverse')
      });
      it('SR-CS4, good', function() {
        assert.equal(fn.creditStatus(clientAccount[3], 'strict'), 'good')
      });
      it('SR-CS5, invalid', function() {
        assert.equal(fn.creditStatus(clientAccount[4], 'default'), 'invalid')
      });
      it('SR-CS6, invalid', function() {
        assert.equal(fn.creditStatus(clientAccount[5], 'default'), 'invalid')
      });
      it('SR-CS7, adverse', function() {
        assert.equal(fn.creditStatus(clientAccount[6], 'default'), 'adverse')
      });
      it('SR-CS8, good', function() {
        assert.equal(fn.creditStatus(clientAccount[7], 'default'), 'good')
      });
  });

  describe('Product Status Function (PS)', function() {
      it('SR-PS1, invalid', function() {
        assert.equal(fn.productStatus('shoes', inventory, -7), 'invalid');
      });
      it('SR-PS2, invalid', function() {
        inventory[0].quantity = 5;
        assert.equal(fn.productStatus('shoes', inventory, 1200), 'invalid');
      });
      it('SR-PS3, invalid', function() {
        inventory[0].quantity = -2;
        assert.equal(fn.productStatus('shoes', inventory, 50), 'invalid');
      });
      it('SR-PS4, invalid', function() {
        inventory[0].quantity = 1500;
        assert.equal(fn.productStatus('shoes', inventory, 50), 'invalid');
      });
      it('SR-PS5, soldout', function() {
        inventory[0].quantity = 0;
        assert.equal(fn.productStatus('shoes', inventory, 50), 'soldout');
      });
      it('SR-PS6, limited', function() {
        inventory[0].quantity = 15;
        assert.equal(fn.productStatus('shoes', inventory, 50), 'limited');
      });
      it('SR-PS7, available', function() {
        inventory[0].quantity = 75;
        assert.equal(fn.productStatus('shoes', inventory, 50), 'available');
      });
      it('SR-PS8, invalid', function() {
        inventory[0].quantity = 50;
        assert.equal(fn.productStatus('pencil', inventory, 50), 'invalid');
      });
  });

  describe.only('Order Handling Function (OH)', function() {
    it('SR-OH1, accepted', function() {
        const aStatusStub = sinon.stub(fn, "accountStatus");
        aStatusStub.returns("excellent");
        const cSatusStub = sinon.stub(fn, "creditStatus")
        cSatusStub.returns("adverse");
        const pStatusStub = sinon.stub(fn, "productStatus")
        pStatusStub.returns("soldout");

        const result = fn.orderHandling(clientAccount[1], "shoes", inventory, 50, "strict");
        assert.equal(result, 'excellent');
        
      });
  });

});