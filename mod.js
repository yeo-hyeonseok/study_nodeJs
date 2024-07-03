Object.prototype.ramen = 1200;

function Bill(number) {
  this.number = number;
}

Bill.prototype.getSum = function () {
  return this.ramen * this.number;
};

const bill1 = new Bill(2);
const bill2 = new Bill(5);

console.log(bill1.number, bill2.getSum());
