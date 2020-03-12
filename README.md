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

### They are tested differently:
| Message \ Type | Query | Command |
| :--- |:---:|:---:|
| Incoming | Assert result |
| Sent to Self
| Outgoing
|
