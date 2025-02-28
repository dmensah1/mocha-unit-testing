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
  let account = [
    {
      age: 17,
      balance: -1,
      creditScore: -1
    }
  ]
  describe('Account Status Function (AS)', function() {
    it('BV-AS1, invalid', function() {
      assert.equal(fn.accountStatus(account[0]), 'invalid');
    });
    it('BV-AS2, invalid', function() {
      account[0].age = 18;
      account[0].balance = 0;
      assert.equal(fn.accountStatus(account[0]), 'invalid');
    });
    it('BV-AS3, adverse', function() {
      account[0].age = 19;
      account[0].balance = 1;
      assert.equal(fn.accountStatus(account[0]), 'adverse');
    });
    it('BV-AS4, adverse', function() {
      account[0].age = 24;
      account[0].balance = 99;
      assert.equal(fn.accountStatus(account[0]), 'adverse');
    });
    it('BV-AS5, acceptable', function() {
      account[0].age = 25;
      account[0].balance = 100;
      assert.equal(fn.accountStatus(account[0]), 'acceptable');
    });
    it('BV-AS6, acceptable', function() {
      account[0].age = 26;
      account[0].balance = 101;
      assert.equal(fn.accountStatus(account[0]), 'acceptable');
    });
    it('BV-AS7, acceptable', function() {
      account[0].age = 34;
      account[0].balance = 499;
      assert.equal(fn.accountStatus(account[0]), 'acceptable');
    });
    it('BV-AS8, acceptable', function() {
      account[0].age = 35;
      account[0].balance = 500;
      assert.equal(fn.accountStatus(account[0]), 'acceptable');
    });
    it('BV-AS9, acceptable', function() {
      account[0].age = 36;
      account[0].balance = 501;
      assert.equal(fn.accountStatus(account[0]), 'acceptable');
    });
    it('BV-AS10, acceptable', function() {
      account[0].age = 44;
      account[0].balance = 999;
      assert.equal(fn.accountStatus(account[0]), 'acceptable');
    });
    it('BV-AS11, excellent', function() {
      account[0].age = 45;
      account[0].balance = 1000;
      assert.equal(fn.accountStatus(account[0]), 'excellent');
    });
    it('BV-AS12, excellent', function() {
      account[0].age = 46;
      account[0].balance = 1001;
      assert.equal(fn.accountStatus(account[0]), 'excellent');
    });
    it('BV-AS13, excellent', function() {
      account[0].age = 64;
      account[0].balance = 2999;
      assert.equal(fn.accountStatus(account[0]), 'excellent');
    });
    it('BV-AS14, excellent', function() {
      account[0].age = 65;
      account[0].balance = 3000;
      assert.equal(fn.accountStatus(account[0]), 'excellent');
    });
    it('BV-AS15, excellent', function() {
      account[0].age = 66;
      account[0].balance = 3001;
      assert.equal(fn.accountStatus(account[0]), 'excellent');
    });
    it('BV-AS16, excellent', function() {
      account[0].age = 94;
      account[0].balance = 4999;
      assert.equal(fn.accountStatus(account[0]), 'excellent');
    });
    it('BV-AS17, invalid', function() {
      account[0].age = 95;
      account[0].balance = 5000;
      assert.equal(fn.accountStatus(account[0]), 'invalid');
    });
    it('BV-AS18, invalid', function() {
      account[0].age = 96;
      account[0].balance = 5001;
      assert.equal(fn.accountStatus(account[0]), 'invalid');
    });
  });

  describe('Credit Status Function (CS)', function() {
    it('BV-CS1, invalid', function() {
      assert.equal(fn.creditStatus(account[0], "strict"), 'invalid');
    });
    it('BV-CS2, adverse', function() {
      account[0].creditScore = 0;
      assert.equal(fn.creditStatus(account[0], "strict"), 'adverse');
    });
    it('BV-CS3, adverse', function() {
      account[0].creditScore = 1;
      assert.equal(fn.creditStatus(account[0], "strict"), 'adverse');
    });
    it('BV-CS4, adverse', function() {
      account[0].creditScore = 64;
      assert.equal(fn.creditStatus(account[0], "strict"), 'adverse');
    });
    it('BV-CS5, good', function() {
      account[0].creditScore = 65;
      assert.equal(fn.creditStatus(account[0], "strict"), 'good');
    });
    it('BV-CS6, good', function() {
      account[0].creditScore = 66;
      assert.equal(fn.creditStatus(account[0], "strict"), 'good');
    });
    it('BV-CS7, good', function() {
      account[0].creditScore = 99;
      assert.equal(fn.creditStatus(account[0], "strict"), 'good');
    });
    it('BV-CS8, good', function() {
      account[0].creditScore = 100;
      assert.equal(fn.creditStatus(account[0], "strict"), 'good');
    });
    it('BV-CS9, invalid', function() {
      account[0].creditScore = 101;
      assert.equal(fn.creditStatus(account[0], "strict"), 'invalid');
    });
    it('BV-CS10, invalid', function() {
      account[0].creditScore = -1;
      assert.equal(fn.creditStatus(account[0], "default"), 'invalid');
    });
    it('BV-CS11, adverse', function() {
      account[0].creditScore = 0;
      assert.equal(fn.creditStatus(account[0], "default"), 'adverse');
    });
    it('BV-CS12, adverse', function() {
      account[0].creditScore = 1;
      assert.equal(fn.creditStatus(account[0], "default"), 'adverse');
    });
    it('BV-CS13, adverse', function() {
      account[0].creditScore = 74;
      assert.equal(fn.creditStatus(account[0], "default"), 'adverse');
    });
    it('BV-CS14, good', function() {
      account[0].creditScore = 75;
      assert.equal(fn.creditStatus(account[0], "default"), 'good');
    });
    it('BV-CS15, good', function() {
      account[0].creditScore = 76;
      assert.equal(fn.creditStatus(account[0], "default"), 'good');
    });
    it('BV-CS16, good', function() {
      account[0].creditScore = 99;
      assert.equal(fn.creditStatus(account[0], "default"), 'good');
    });
    it('BV-CS17, good', function() {
      account[0].creditScore = 100;
      assert.equal(fn.creditStatus(account[0], "default"), 'good');
    });
    it('BV-CS18, invalid', function() {
      account[0].creditScore = 101;
      assert.equal(fn.creditStatus(account[0], "default"), 'invalid');
    });

  });

  describe('Product Status Function (PS)', function() {
    it('BV-PS1, invalid', function() {
      inventory[0].quantity = 15;
      assert.equal(fn.productStatus('shoes', inventory, -1), 'invalid');
    });
    it('BV-PS2, invalid', function() {
      inventory[0].quantity = 5;
      assert.equal(fn.productStatus('shoes', inventory, 1200), 'invalid');
    });
    it('BV-PS3, invalid', function() {
      inventory[0].quantity = -1;
      assert.equal(fn.productStatus('shoes', inventory, 50), 'invalid');
    });
    it('BV-PS4, soldout', function() {
      inventory[0].quantity = 0;
      assert.equal(fn.productStatus('shoes', inventory, 50), 'soldout');
    });
    it('BV-PS5, limited', function() {
      inventory[0].quantity = 1;
      assert.equal(fn.productStatus('shoes', inventory, 50), 'limited');
    });
    it('BV-PS6, limited', function() {
      inventory[0].quantity = 49;
      assert.equal(fn.productStatus('shoes', inventory, 50), 'limited');
    });
    it('BV-PS7, available', function() {
      inventory[0].quantity = 50;
      assert.equal(fn.productStatus('shoes', inventory, 50), 'available');
    });
    it('BV-PS8, available', function() {
      inventory[0].quantity = 51;
      assert.equal(fn.productStatus('shoes', inventory, 50), 'available');
    });
    it('BV-PS9, available', function() {
      inventory[0].quantity = 999;
      assert.equal(fn.productStatus('shoes', inventory, 50), 'available');
    });
    it('BV-PS10, available', function() {
      inventory[0].quantity = 1000;
      assert.equal(fn.productStatus('shoes', inventory, 50), 'available');
    });
    it('BV-PS11, invalid', function() {
      inventory[0].quantity = 1001;
      assert.equal(fn.productStatus('shoes', inventory, 50), 'invalid');
    });
  });
});

describe('Decision Table Testing (DT)', function() {
  let account2 = [
    {
      age: 17,
      balance: -1,
      creditScore: -1
    }
  ]
  describe('Account Status Function (AS)', function() {
    it('DT-AS1, invalid', function() {
      assert.equal(fn.accountStatus(account2[0]), 'invalid');
    });
    it('DT-AS2, invalid', function() {
      assert.equal(fn.accountStatus(account2[0]), 'invalid');
    });
    it('DT-AS3, adverse', function() {
      account2[0].age = 20;
      account2[0].balance = 50;
      assert.equal(fn.accountStatus(account2[0]), 'adverse');
    });
    it('DT-AS4, acceptable', function() {
      account2[0].age = 30;
      account2[0].balance = 250;
      assert.equal(fn.accountStatus(account2[0]), 'acceptable');
    });
    it('DT-AS5, good', function() {
      account2[0].age = 20;
      account2[0].balance = 2000;
      assert.equal(fn.accountStatus(account2[0]), 'good');
    });
    it('DT-AS6, excellent', function() {
      account2[0].age = 50;
      account2[0].balance = 2000;
      assert.equal(fn.accountStatus(account2[0]), 'excellent');
    });
    it('DT-AS7, excellent', function() {
      account2[0].age = 70;
      account2[0].balance = 4000;
      assert.equal(fn.accountStatus(account2[0]), 'excellent');
    });
  });

  describe('Credit Status Function (CS)', function() {
    it('DT-CS1, invalid', function() {
      assert.equal(fn.creditStatus(account2[0], "strict"), 'invalid');
    });
    it('DT-CS2, adverse', function() {
      account2[0].creditScore = 30;
      assert.equal(fn.creditStatus(account2[0], "strict"), 'adverse');
    });
    it('DT-CS3, good', function() {
      account2[0].creditScore = 80;
      assert.equal(fn.creditStatus(account2[0], "strict"), 'good');
    });
    it('DT-CS4, invalid', function() {
      account2[0].creditScore = 105;
      assert.equal(fn.creditStatus(account2[0], "default"), 'invalid');
    });
    it('DT-CS5, adverse', function() {
      account2[0].creditScore = 30;
      assert.equal(fn.creditStatus(account2[0], "default"), 'adverse');
    });
    it('DT-CS6, good', function() {
      account2[0].creditScore = 90;
      assert.equal(fn.creditStatus(account2[0], "default"), 'good');
    });
  });

  describe('Product Status Function (PS)', function() {
    it('DT-PS1, soldout', function() {
      inventory[0].quantity = 0;
      assert.equal(fn.productStatus('shoes', inventory, 50), 'soldout');
    });
    it('DT-PS2, limited', function() {
      inventory[0].quantity = 20;
      assert.equal(fn.productStatus('shoes', inventory, 50), 'limited');
    });
    it('DT-PS3, available', function() {
      inventory[0].quantity = 70;
      assert.equal(fn.productStatus('shoes', inventory, 50), 'available');
    });
  });

  describe('Order Status Function (OS)', function() {
    it('DT-OH1, rejected', function() {
      account2[0].age = 15;
      assert.equal(fn2.orderHandling(account2[0], "shoes", inventory, 50, "strict"), 'rejected');
    });
    it('DT-OH2, rejected', function() {
      inventory[0].quantity = 0;
      account2[0].creditScore = 30;
      account2[0].age = 30;
      account2[0].balance = 250;
      assert.equal(fn2.orderHandling(account2[0], "shoes", inventory, 50, "strict"), 'rejected');
    });
    it('DT-OH3, rejected', function() {
      account2[0].age = 30;
      account2[0].balance = 250;
      account2[0].creditScore = 30;
      inventory[0].quantity = 30;
      assert.equal(fn2.orderHandling(account2[0], "shoes", inventory, 50, "strict"), 'rejected');
    });
    it('DT-OH4, rejected', function() {
      account2[0].age = 20;
      account2[0].balance = 50;
      account2[0].creditScore = 80;
      inventory[0].quantity = 0;
      assert.equal(fn2.orderHandling(account2[0], "shoes", inventory, 50, "strict"), 'rejected');
    });
    it('DT-OH5, rejected', function() {
      account2[0].creditScore = -1;
      assert.equal(fn2.orderHandling(account2[0], "shoes", inventory, 50, "strict"), 'rejected');
    });
    it('DT-OH6, underReview', function() {
      account2[0].age = 20;
      account2[0].balance = 2000;
      account2[0].creditScore = 30;
      assert.equal(fn2.orderHandling(account2[0], "shoes", inventory, 50, "strict"), 'underReview');
    });
    it('DT-OH7, pending', function() {
      account2[0].age = 30;
      account2[0].balance = 250;
      account2[0].creditScore = 80;
      inventory[0].quantity = 30;
      assert.equal(fn2.orderHandling(account2[0], "shoes", inventory, 50, "strict"), 'pending');
    });
    it('DT-OH8, accepted', function() {
      account2[0].age = 50;
      account2[0].balance = 2000;
      assert.equal(fn2.orderHandling(account2[0], "shoes", inventory, 50, "strict"), 'accepted');
    });
    
  
  
  });

});