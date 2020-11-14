var assert = require('assert');
var fn = require('./purchaseOrder');
var fn2 = require('./orderHandling');

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
        creditScore: -1
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
        creditScore: 30
    }
];
let inventory = [
    {
        name: "shoes",
        quantity: 0
    }
];
var orderAccounts = [
  {
    // excellent account, adverse credit
    age: "55",
    balance: "2000",
    creditScore: 30
},
// excellent account, good credit
{
  age: "55",
  balance: "2000",
  creditScore: 80
},
// excellent account, invalid credit
{
  age: "55",
  balance: "2000",
  creditScore: -1
},
// good account, adverse credit
{
  age: "20",
  balance: "2000",
  creditScore: 30
},
// good account, good credit
{
  age: "55",
  balance: "2000",
  creditScore: 80
},
// good account, invalid credit
{
  age: "55",
  balance: "2000",
  creditScore: -1
},
// acceptable account, adverse credit
{
  age: "40",
  balance: "750",
  creditScore: 30
},
// acceptable account, good credit
{
  age: "40",
  balance: "750",
  creditScore: 80
},
// acceptable account, invalid credit
{
  age: "40",
  balance: "750",
  creditScore: -1
},
// adverse account, adverse credit
{
  age: "20",
  balance: "50",
  creditScore: 30
},
// adverse account, good credit
{
  age: "20",
  balance: "50",
  creditScore: 80
},
// adverse account, invalid credit
{
  age: "20",
  balance: "50",
  creditScore: -1
},
// invalid account, adverse credit
{
  age: "100",
  balance: "750",
  creditScore: 30
},
// invalid account, good credit
{
  age: "100",
  balance: "750",
  creditScore: 80
},
// invalid account, invalid credit
{
  age: "100",
  balance: "750",
  creditScore: -1
}
];
let invalidProduct = [
  {
    name: "shoes",
    quantity: -1
  }
]; 
let limitedProduct = [
  {
    name: "shoes",
    quantity: 15
  }
]; 
let availableProduct = [
  {
    name: "shoes",
    quantity: 75
  }
]; 

describe('Strong Robust Equivalence Classes (SR)', function() {
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

  describe('Order Handling Function (OH)', function() {
    // resetting quantity which was set to diff. value during PS tests
    before(function() {
      inventory[0].quantity = 0;
    }); 
    
    it('SR-OH1, accepted', function() {
        assert.equal(fn2.orderHandling(orderAccounts[0], "shoes", inventory, 50, "strict"), 'accepted');
      });
    it('SR-OH2, accepted', function() {
        assert.equal(fn2.orderHandling(orderAccounts[0], "shoes", limitedProduct, 50, "strict"), 'accepted');
      });
    it('SR-OH3, accepted', function() {
        assert.equal(fn2.orderHandling(orderAccounts[0], "shoes", availableProduct, 50, "strict"), 'accepted');
      });
    it('SR-OH4, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[0], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
    it('SR-OH5, accepted', function() {
        assert.equal(fn2.orderHandling(orderAccounts[1], "shoes", inventory, 50, "strict"), 'accepted');
      });
    it('SR-OH6, accepted', function() {
        assert.equal(fn2.orderHandling(orderAccounts[1], "shoes", limitedProduct, 50, "strict"), 'accepted');
      });
    it('SR-OH7, accepted', function() {
        assert.equal(fn2.orderHandling(orderAccounts[1], "shoes", availableProduct, 50, "strict"), 'accepted');
      });
      it('SR-OH8, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[1], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH9, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[2], "shoes", inventory, 50, "strict"), 'rejected');
      });
      it('SR-OH10, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[2], "shoes", limitedProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH11, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[2], "shoes", availableProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH12, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[2], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH13, underReview', function() {
        assert.equal(fn2.orderHandling(orderAccounts[3], "shoes", inventory, 50, "strict"), 'underReview');
      });
      it('SR-OH14, underReview', function() {
        assert.equal(fn2.orderHandling(orderAccounts[3], "shoes", limitedProduct, 50, "strict"), 'underReview');
      });
      it('SR-OH15, underReview', function() {
        assert.equal(fn2.orderHandling(orderAccounts[3], "shoes", availableProduct, 50, "strict"), 'underReview');
      });
      it('SR-OH16, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[3], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH17, accepted', function() {
        assert.equal(fn2.orderHandling(orderAccounts[4], "shoes", inventory, 50, "strict"), 'accepted');
      });
      it('SR-OH18, accepted', function() {
        assert.equal(fn2.orderHandling(orderAccounts[4], "shoes", limitedProduct, 50, "strict"), 'accepted');
      });
      it('SR-OH19, accepted', function() {
        assert.equal(fn2.orderHandling(orderAccounts[4], "shoes", availableProduct, 50, "strict"), 'accepted');
      });
      it('SR-OH20, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[4], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH21, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[5], "shoes", inventory, 50, "strict"), 'rejected');
      });
      it('SR-OH22, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[5], "shoes", limitedProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH23, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[5], "shoes", availableProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH24, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[5], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH25, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[6], "shoes", inventory, 50, "strict"), 'rejected');
      });
      it('SR-OH26, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[6], "shoes", limitedProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH27, underReview', function() {
        assert.equal(fn2.orderHandling(orderAccounts[6], "shoes", availableProduct, 50, "strict"), 'underReview');
      });
      it('SR-OH28, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[6], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH29, pending', function() {
        assert.equal(fn2.orderHandling(orderAccounts[7], "shoes", inventory, 50, "strict"), 'pending');
      });
      it('SR-OH30, pending', function() {
        assert.equal(fn2.orderHandling(orderAccounts[7], "shoes", limitedProduct, 50, "strict"), 'pending');
      });
      it('SR-OH31, accepted', function() {
        assert.equal(fn2.orderHandling(orderAccounts[7], "shoes", availableProduct, 50, "strict"), 'accepted');
      });
      it('SR-OH32, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[7], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH33, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[8], "shoes", inventory, 50, "strict"), 'rejected');
      });
      it('SR-OH34, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[8], "shoes", limitedProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH35, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[8], "shoes", availableProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH36, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[8], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH37, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[9], "shoes", inventory, 50, "strict"), 'rejected');
      });
      it('SR-OH38, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[9], "shoes", limitedProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH39, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[9], "shoes", availableProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH40, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[9], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH41, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[10], "shoes", inventory, 50, "strict"), 'rejected');
      });
      it('SR-OH42, pending', function() {
        assert.equal(fn2.orderHandling(orderAccounts[10], "shoes", limitedProduct, 50, "strict"), 'pending');
      });
      it('SR-OH43, underReview', function() {
        assert.equal(fn2.orderHandling(orderAccounts[10], "shoes", availableProduct, 50, "strict"), 'underReview');
      });
      it('SR-OH44, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[10], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH45, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[11], "shoes", inventory, 50, "strict"), 'rejected');
      });
      it('SR-OH46, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[11], "shoes", limitedProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH47, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[11], "shoes", availableProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH48, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[11], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH49, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[12], "shoes", inventory, 50, "strict"), 'rejected');
      });
      it('SR-OH50, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[12], "shoes", limitedProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH51, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[12], "shoes", availableProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH52, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[12], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH53, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[13], "shoes", inventory, 50, "strict"), 'rejected');
      });
      it('SR-OH54, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[13], "shoes", limitedProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH55, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[13], "shoes", availableProduct, 50, "strict"), 'rejected');
      });      
      it('SR-OH56, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[13], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH57, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[14], "shoes", inventory, 50, "strict"), 'rejected');
      });
      it('SR-OH58, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[14], "shoes", limitedProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH59, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[14], "shoes", availableProduct, 50, "strict"), 'rejected');
      });
      it('SR-OH60, rejected', function() {
        assert.equal(fn2.orderHandling(orderAccounts[14], "shoes", invalidProduct, 50, "strict"), 'rejected');
      });
  });

});

describe('Boundary Value Testing (BV)', function() {
  
});