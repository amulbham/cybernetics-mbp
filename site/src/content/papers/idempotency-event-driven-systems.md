---
title: 'Designing for Idempotency: Event-Driven Systems at Scale'
pillar: 'systems-architecture'
pubDate: 2026-07-28
dateModified: 2026-08-01
description: 'A practical framework for reasoning about idempotency guarantees in event-driven systems, and where those guarantees tend to quietly break.'
canonicalURL: 'https://amulbham.com/research-hub/systems-architecture/idempotency-event-driven-systems/'
tags: ['systems-architecture', 'distributed-systems', 'event-driven']
---

## Abstract

At-least-once delivery is the norm in most event-driven infrastructure, which
pushes idempotency from a nice-to-have into a correctness requirement. This
paper lays out a practical framework for reasoning about where idempotency
guarantees need to be enforced, and catalogs the places those guarantees tend
to quietly break under real production conditions.

## Why Idempotency Breaks in Practice

Idempotency is usually designed in at the handler level — a deduplication key,
an upsert instead of an insert — and then assumed to hold everywhere
downstream. In practice it breaks at boundaries: a handler that's idempotent
on its own database writes but triggers a non-idempotent side effect, such as
sending a notification or calling a third-party API, still produces duplicate
side effects under retry.

## A Framework for Reasoning About Guarantees

Rather than asking whether a system "is idempotent," it's more useful to ask,
for each side effect, whether it is:

1. **Naturally idempotent** — e.g. a `SET` operation that overwrites state.
2. **Made idempotent via a dedup key** — requires durable tracking of
   processed event IDs, and a decision about the tracking window.
3. **Not idempotent, and isolated behind an idempotency boundary** — e.g. an
   outbox pattern that ensures the non-idempotent call only fires once even
   under retry.

Every side effect in a handler should be classified into one of these three
categories explicitly, rather than inheriting an idempotency assumption from
the handler as a whole.

## Conclusion

Idempotency is a property of individual side effects, not of handlers or
services. Systems that treat it as a blanket property tend to have gaps at
exactly the boundaries — third-party calls, notifications, billing events —
where a duplicate is most costly.
