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

  // in the lecturer example, this method is private.
  _ratio() {
    return this.chainring / this.cog;
  }

  gearInches() {
    return this._ratio() * this.wheel.diameter;
  }

  /*
  note that this is a combination of query and command, since it assings a new value to this.cog (command), but also changes what people see when they query this.cog latter
  */
  setCog(newCog) {
    this.cog = newCog;
    return this.cog;
  }
};
