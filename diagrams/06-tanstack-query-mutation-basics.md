# 6. TanStack Query Mutation Basics

```mermaid
flowchart TD
    A[Need to read data] --> B[Use Query]
    A2[Need to create update delete] --> C[Use Mutation]

    B --> D[Example GET users me]
    D --> E[useMeQuery]
    E --> F[queryKey auth me]
    E --> G[queryFn calls API]
    G --> H[Cache data]
    H --> I[Component reads data status error]

    C --> J[Example POST boards]
    J --> K[useBoardsControllerCreate]
    K --> L[mutate or mutateAsync]
    L --> M[onSuccess invalidate related queryKey]
    M --> N[Query refetch and UI updates]
```

## What each one needs

- Query:
  - `queryKey`
  - `queryFn`
  - optional retry/stale options
- Mutation:
  - `mutationFn`
  - optional `onSuccess` and `onError`
  - usually invalidation of related query keys

