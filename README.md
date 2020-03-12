# Introduction

This repo is some annotations about what should be unit tested [based on this talk by Sandi Metz](https://www.youtube.com/watch?v=URSWYvyc42M) as recommended by [Testing basics @ theOdinProject](https://www.theodinproject.com/courses/javascript/lessons/testing-basics).

# what should you unit test?

It is usually feels like a big spagetti and it is very hard to tell about all side effects a change can cause.

The way out of this mess is to follow the message. Objects (functions) that are unit tested have a simple view of messages.

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

## part two: to self

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