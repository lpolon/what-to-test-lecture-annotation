import { Wheel, Gear } from './examples';

// Incoming query messages:
/*
test incoming query messages by making assertions about what they send back.

we're testing the interface, not the implementation!
*/
describe('Wheel', () => {
  it('calculates diameter', () => {
    const wheel = new Wheel(26, 1.5);
    expect(wheel.diameter).toBe(29);
  });
});

describe('Gear test', () => {
  it('calculates gear inches', () => {
    const wheel = new Wheel(26, 1.5);
    const gear = new Gear(52, 11, wheel);

    expect(gear.gearInches()).toBeCloseTo(137.1, 1);
  });
});
