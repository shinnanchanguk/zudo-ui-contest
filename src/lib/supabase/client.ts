/**
 * Mock Supabase client for contest shell.
 * Returns a no-op client that prevents runtime errors.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): any {
  return {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null }),
    }),
    rpc: () => ({ data: null, error: null }),
    auth: {
      getUser: () => ({ data: { user: null }, error: null }),
      getSession: () => ({ data: { session: null }, error: null }),
    },
    channel: () => ({
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({}),
    }),
    removeChannel: () => {},
  }
}
