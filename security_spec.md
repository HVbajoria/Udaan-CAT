# Security Specification & Threat Model

## 1. Data Invariants
1. **User Scoping & Isolation**: All user profiles, study states, daily test submissions, mock scores, Pomodoro sessions, and error logs are private to the owning authenticated user (`request.auth.uid == userId`).
2. **Master Gate Parent Existence**: Every subcollection item (`studyState`, `dailySubmissions`, `mockScores`, `sessionLogs`, `errorLogs`) resides strictly under `/users/{userId}` where the parent user profile document exists: `exists(/databases/$(database)/documents/users/$(userId))`.
3. **Identity Verification & Anti-Spoofing**: Documents must have their `userId` property matching `request.auth.uid`. No user may forge another student's UID.
4. **Id Sanitization**: All path parameters (`userId`, `stateId`, `submissionId`, `mockId`, `sessionId`, `errorId`) must conform to `isValidId()` (regex `^[a-zA-Z0-9_\-]+$` and length <= 128) to prevent ID injection.
5. **Payload Boundaries & Anti-Denial-of-Wallet**: Every string and array field is bounded with strict `.size()` checks (e.g., name <= 100, questionText <= 2000, notes <= 1000).
6. **Strict Schema Gate**: On document creation and update, `isValid[Entity]()` helper functions validate types, required keys, and bounded limits.
7. **Default Deny Catch-All**: The root rule explicitly matches `/{document=**}` and denies all reads and writes unless matched by hardened scopes.

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Payload 1 (Cross-User Profile Hijack)**: An authenticated user attempts to write to `/users/victim_user_uid` with their own email.
   * *Expected*: PERMISSION_DENIED (path UID mismatch).
2. **Payload 2 (Unauthenticated Reading)**: An unauthenticated request attempts to list `/users/{userId}/mockScores`.
   * *Expected*: PERMISSION_DENIED (requires `request.auth != null`).
3. **Payload 3 (Parent Document Bypass / Orphaned Write)**: An authenticated user tries to add a `dailySubmissions` document under a non-existent parent user profile.
   * *Expected*: PERMISSION_DENIED (Master Gate `exists(/databases/$(database)/documents/users/$(userId))` fails).
4. **Payload 4 (Ghost Field / Shadow Property Injection)**: An attacker attempts to inject `{ "isAdmin": true, "unlimitedAccess": true }` into `UserProfile`.
   * *Expected*: PERMISSION_DENIED (strict key and schema check rejects unknown keys).
5. **Payload 5 (Path ID Poisoning / Traversal Attack)**: An attacker submits an ID with directory traversal or illegal characters `../victim/override`.
   * *Expected*: PERMISSION_DENIED (`isValidId()` regex fails).
6. **Payload 6 (Oversized String / Denial-of-Wallet Attack)**: An attacker sends a 1MB string in `name` or `analysisNotes`.
   * *Expected*: PERMISSION_DENIED (`.size() <= max` check triggers).
7. **Payload 7 (Unbounded Array Injection)**: An attacker provides a 10,000-element array in `targetIIMs` or `completedSegmentIds`.
   * *Expected*: PERMISSION_DENIED (array size limit check triggers).
8. **Payload 8 (Type Poisoning - Number as String)**: An attacker passes `targetPercentile: "ninety-nine"` instead of a numeric value.
   * *Expected*: PERMISSION_DENIED (`data.targetPercentile is number` fails).
9. **Payload 9 (Cross-User List Scraping)**: User A tries to query or list `/users/UserB/errorLogs`.
   * *Expected*: PERMISSION_DENIED (`userId == request.auth.uid` is enforced at the rule level).
10. **Payload 10 (Negative Duration / Metric Inversion)**: An attacker logs a Pomodoro session with `durationMinutes: -500`.
    * *Expected*: PERMISSION_DENIED (`durationMinutes >= 0` boundary constraint).
11. **Payload 11 (Empty Required Keys)**: An attacker creates a `DailySubmission` missing the required `score` and `accuracy` keys.
    * *Expected*: PERMISSION_DENIED (`data.keys().hasAll(...)` check fails).
12. **Payload 12 (Root Traversal / Secret Doc Snooping)**: An attacker queries root `/system_configs` or unmapped paths.
    * *Expected*: PERMISSION_DENIED (Default-deny catch-all blocks any unlisted path).

---

## 3. Test Runner Specification
All 12 test vectors are enforced to return `PERMISSION_DENIED` at the Firestore security rules evaluation boundary.
