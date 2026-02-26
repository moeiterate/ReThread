// GitHub service removed — dashboard data is persisted via localStorage.
// Token-based GitHub API calls were causing secrets scanner failures on deploy
// because VITE_-prefixed env vars are baked into the client bundle by Vite.
export {};
