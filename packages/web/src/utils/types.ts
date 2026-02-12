class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;

  constructor(zeroValue: NumType, add: (x: NumType, y: NumType) => NumType) {
    this.zeroValue = zeroValue;
    this.add = add;
  }
}

const myGenericNumber = new GenericNumber("0", (x, y) => x + y);
