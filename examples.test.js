import { Wheel, Gear } from './examples';

// Incoming query messages:
/*
test incoming query messages by making assertions about what they send back.

we're testing the interface, not the implementation!
*/
describe('Wheel', () => {
  it('calculates diameter', () => {
    const wheel = new Wheel(26, 1.5);
    const diameter = wheel.diameter;
    expect(diameter).toBe(29);
  });
});

describe('Gear test', () => {
  it('calculates gear inches', () => {
    const wheel = new Wheel(26, 1.5);
    const gear = new Gear(52, 11, wheel);

    const gearSizeInInches = gear.gearInches();

    expect(gearSizeInInches).toBeCloseTo(137.1, 1);
  });
  // incoming command messages:
  /*
  test incoming command messages by making assertions about direct public side effects
  */
  it('sets cog value', () => {
    const gear = new Gear();
    const newCogValue = gear.setCog(27); // send the message
    expect(newCogValue).toBe(27); // assert the side effect
  });

  // bad example #1:
  it('calculates ratio:', () => {
    const wheel = new Wheel(26, 1.5);
    const gear = new Gear(52, 11, wheel);
    expect(gear._ratio()).toBeCloseTo(4.7, 1);
  });

  /* 
  note: i could have a full mock of the class and use it instead of spyOn
  https://jestjs.io/docs/en/es6-class-mocks#an-es6-class-example
  */
  // bad example #2:
  it('calls _ratio method ', () => {
    const wheel = new Wheel(26, 1.5);
    const gear = new Gear(52, 11, wheel);
    const spyGetRatio = jest.spyOn(gear, '_ratio');
    gear.gearInches();
    expect(spyGetRatio).toHaveBeenCalled();
  });
});
