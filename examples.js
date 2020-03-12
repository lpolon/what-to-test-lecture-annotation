// Incoming query messages:
export const Wheel = class {
  constructor(rim, tire) {
    this.rim = rim;
    this.tire = tire;
  }

  get diameter() {
    return this.rim + this.tire * 2;
  }
};

export const Gear = class {
  constructor(chainring, cog, wheel) {
    this.chainring = chainring;
    this.cog = cog;
    this.wheel = wheel;
  }

  _ratio() {
    return (this.chainring / this.cog);
  }

  gearInches() {
    return this._ratio() * this.wheel.diameter;
  }
};
