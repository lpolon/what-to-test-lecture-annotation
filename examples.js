class Wheel {
  constructor(rim, tire) {
    this.rim = rim;
    this.tire = tire;
  }

  get diameter() {
    return this.rim + this.tire * 2;
  }
}

Wheel;

const aWheel = new Wheel(1, 2);

console.log(aWheel.diameter);
