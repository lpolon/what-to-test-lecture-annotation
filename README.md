# Introduction

This repo is some annotations about what should be unit tested [based on this talk by Sandi Metz](https://www.youtube.com/watch?v=URSWYvyc42M) as recommended by [Testing basics @ theOdinProject](https://www.theodinproject.com/courses/javascript/lessons/testing-basics).

# what should you unit test?

It is usually feels like a big spagetti and it is very hard to tell about all side effects a change can cause.

The way out of this mess is to follow the message. Objects (functions) that are unit tested have a simple view of messages.

## tl;dr
| Message \ Type | Query             | Command                                 |
| :------------- | :---------------- | :-------------------------------------- |
| Incoming       | Assert<br>result | Assert<br>direct public\* side effects |
| Sent to Self | ignore | ignore |
| Outgoing | ignore | Expect to send
|

## Three origins of messages from the point-of-view of object under testing:

- Incoming
- Sent to self
- Outgoing

These messages can have two flavours types: queries and commands.

- Query: return something / change nothing (no side effects. A calculation)

- Command: change something, return nothing (has side effect, returns nothing)

- both: changes with unexpeted side-effects! It might be necessary: popping something out of a queue.

## part one: incoming

| Message \ Type | Query             | Command                                 |
| :------------- | :---------------- | :----------- |
| Incoming  | Assert:<br>result | Assert:<br>direct public\* side effects |
| Sent to Self
| Outgoing
|

// TODO: \* responsibility of the last ruby class involved. More on that later...

Sandi:
At this point i can reveal a magical secret:
we're done making assertions about values.

DRY it out:

- Receiver of incoming message has sole responsibility for asserting the result direct public side effects. in other words: when you are unit testing, the receiver of incoming values is in the place to make assertions about values. You do that here and nowhere else.

## part two: to Self

| Message \ Type | Query             | Command                                 |
| :------------- | :---------------- | :-------------------------------------- |
| Incoming       | Assert:<br>result | Assert:<br>direct public\* side effects |
| Sent to Self | ignore | ignore |
| Outgoing
|

In our example Gear class, we have .\_ratio() private method, meaning: method with a hidden interface, because, as far as my understanding goes, it is used as a helper function, or it is just how the functionality was implemented and is not directly related to interface or output.

```javascript
class Gear {
  //...
  _ratio() {
    return this.chainring / this.cog;
  }
  // ...
}
```

### how NOT to test it: (anti-patterns):<br>

[related stack overflow answer](https://stackoverflow.com/a/4277066/11103093)<br>

- Do not test private methods
- Do not make assertions about their result
- Do not expect to send them (aka call them, as far as my understanding goes)

#### bad example #1:

```javascript
describe('Gear test', () => {
  // ...
  it('calculates ratio:', () => {
    const wheel = new Wheel(26, 1.5);
    const gear = new Gear(52, 11, wheel);
    expect(gear._ratio()).toBeCloseTo(4.7, 1);
  });
});
```

as far as the rest of your app is concened, this method does not exist.

if the Gear test, "calculates gear inches" test is correct, this must be right, therefore this test is redundant.

#### bad example #2

```javascript
describe('Gear test', () => {
  // ...
  it('gearInches calls _ratio method ', () => {
    const wheel = new Wheel(26, 1.5);
    const gear = new Gear(52, 11, wheel);
    const spyGetRatio = jest.spyOn(gear, '_ratio');
    gear.gearInches();
    expect(spyGetRatio).toHaveBeenCalled();
  });
});
```

this is an over specification: adds cost, provides no benefit, bind you to the current implementation! If you think about it, it makes impossible to refactor instead of making it safe to do so.

### caveats:

If the implementation is complicated, TDD might help you create it and make sure it is working. It usually have value early on, but keep other people away of willing to improve your private code since it will screw your tests.

So, if you do it, keep it separeted and put a comment on them: "if these tests fail, delete them".

### generalizations:


## part three: Outgoing

### outgoing query messages
Spoiler alert: same rules as 'Sent to self'.

from Gear as unit (point-of-view), diameter is outgoing:  
.gearInches() (incoming query) --> Gear diameter (incoming query) --> Wheel

### How NOT to test it:

#### bad example:
```javascript
  it('checks wheel diameter', () => {
    const wheel = new Wheel(26, 1.5);
    const gear = new Gear(52, 11, wheel);

    const wheelDiameter = gear.wheel.diameter;

    expect(wheelDiameter).toBe(29);
  });
```

this test is also redundant and binds you to the current implementation It duplicates Wheel's tests, and it's responsibility of the receiver (wheel in this case) to assert state. Also makes harder to refactor wheel.

### generalizations:
- Do not test outgoing query messages
- Do not make assertions about their result
- Do not expect to send them

So, objects that sends messages to self and outgoing query messages that don't have side-effects..
if a Message has no visible sideeffects, the sender should not test it.

### outgoing command messages
let's image that this code is a bycicle race game, so change gears has to be observed to change the behaviour of the bycicle.

Ok, Sandi writes some code that i won't try to reproduce now. The main points are the following:
- Gear is a subject, and ```.setCog()``` calls changed, which in turn send chainRing and cog to its observers.

- for this example, it is important to imagine that its observers has side effects, like writing to a db when a observer is changed.

- therefore, changed() is an outgoing command with side effects. THIS message MUST GET SENT.

#### bad example:
```javascript
// pseudo code:
  it('saves changed cog in db', () => {
    const observer = new Observer;
    const gear = new Gear(52, 11, observer);

    gear.setCog(27);

    // verify something about the state of the Db
  });
```
this creates a chain of dependencies of every message object between Gear and that distant side-effect.

it does not verify if there is an actual problem with this method.

__changing the database is not Gear's responsibility__. this is an integration test.

#### good example:
Mock whether messege got sent

// TODO: write it as a mock in jest

```ruby
class GearTest < MiniTest::Unit::TestCase
def test_notifies_observers_when_cogs_change
@observer = Minitest::Mock.new
@gear = Gear.new(
  chainring: 52,
  cog: 11,
  observer: @observer)

  @observer.expect(:changed, true, [52, 27])
  @gear.set_cog(27)
  @observer.verify
  end
)
```

- dependes on the interface
- Gear *is* responsible for sending #changed to @observer.
Fast and stable.

### Rule:
- Expect to send outgoing command messages

### Caveat:
- if the side effect is simple and close, just add it.

## About mocks
What happens if observer unsubscribe to setCog?
It is painful. You may tests green and a broken app (works on the mock lol).

OK. How to use mocks them?

a mock plays the role of some object on the real app. Two separated things. They both promise they will implement a common API. So keep that promise. They have to keep in sync with the API.

// TODO: understand better how jest solves this problem.

## summary:
- Be a minimalist: avoid unecessary unit tests. These rules are enough for through coverage in as few tests as possible: test everything once.

- safe and cheap to refactor

- don't give up on finding simplicity.

- getting better in testing gets practice.