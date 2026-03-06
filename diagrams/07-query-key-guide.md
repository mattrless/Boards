# 7. Query Key Guide

```mermaid
flowchart TD
    A[Query key identifies cached data] --> B[Example auth me]
    A --> C[Example boards me]
    B --> D[key auth me]
    C --> E[key boards me]
    F[Mutation success] --> G[invalidateQueries with related key]
    G --> H[Marked stale]
    H --> I[Refetch]
    I --> J[UI rerender with fresh data]
```

## Practical rules

- Same resource shape should always reuse the same key.
- Use Orval key helpers when available, for example `getBoardsControllerFindMyBoardsQueryKey`.
- After mutation, invalidate only keys affected by that change.

