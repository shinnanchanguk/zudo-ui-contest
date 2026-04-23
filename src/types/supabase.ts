/**
 * Minimal type stubs for contest shell.
 * The actual Supabase types are not included in the open-source version.
 */

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Database {
  public: {
    Enums: {
      overnight_category: 'family' | 'sick' | 'field_trip' | 'competition' | 'other'
      approval_status: 'pending' | 'approved' | 'rejected' | 'cancelled'
    }
  }
}
