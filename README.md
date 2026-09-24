# Off That Couch Fitness

React Native **0.87.1** app for Off That Couch Fitness, scaffolded and wired up
to match the structure and conventions of the Chitambara Maths project.

## What is in place

| Area | Notes |
| --- | --- |
| Navigation | `@react-navigation/native` v7 — native stack (`Appstack`) wrapping a 5-tab bottom navigator |
| Splash | Animated brand splash, auto-advances to onboarding after 3s |
| Onboarding | Welcome → Goal & event → Plan preview, boards `01`–`03` |
| Home | Built from the `OTCFitness/index.html` UI mockup (`otcf-app-v2.js` → `home`) |
| Theme | Dark-first design tokens lifted from `otcf.css` |
| Fonts | Inter (6 weights) + `react-native-vector-icons`, linked into both platforms |
| SVG | `react-native-svg` + `react-native-svg-transformer` (metro configured) |
| Storage | `@react-native-async-storage/async-storage` — persists the theme choice and the onboarding flag |
| Health | `@kingstinct/react-native-healthkit` (Nitro, new arch) — reads Apple Health so the Garmin row on the profile is live |

## Project structure

```
src/
├── assets/
│   ├── fonts/      Inter Regular → Black
│   ├── icons/
│   └── images/     logo-dark.jpeg, logo-white.jpeg
├── components/     Button, NavBar, StepDots, Pill, ChipRow, OptionRow,
│                   ContentRow, PlanCard, FormatChip, VideoTile, LockOverlay,
│                   WorkoutStep, Target, WeekBars, WeekStrip, SessionRow,
│                   ProgressRing, TrackBar, SectionTitle, StatTile, ComingSoon
├── constants/
│   ├── index.ts    Fonts, Sizes, ScreenNames, responsive helpers
│   └── theme.ts    LIGHT + DARK palettes, DISCIPLINE, RADIUS, gradients
├── context/
│   ├── ThemeContext.tsx        ThemeProvider, useTheme(), useThemedStyles()
│   └── OnboardingContext.tsx   OnboardingProvider, useOnboarding()
├── navigation/
│   ├── Appstack.tsx            Splash → onboarding → Main, plus detail screens
│   ├── BottomTabNavigator.tsx  Today · Plans · Coach · Fuel · Me
│   └── GlobalNavigation.tsx    navigationRef, navigate(), replaceToMain()
├── screens/        SplashScreen, WelcomeScreen, GoalScreen, PlanPreviewScreen,
│                   HomeScreen (Today), Plans/Coach/Fuel/Me,
│                   Session, Calendar, Notifications, Paywall, Login
├── types/
└── utils/
    ├── storage.ts  AsyncStorage wrapper — reads resolve to null, never throw
    └── color.ts    withAlpha() — the CSS `color-mix(... N%, transparent)`
```

## Theming

The mockup ships both themes and toggles between them, so the app carries both
token sets and follows the device colour scheme via `useColorScheme()`.

Never hardcode a colour in a screen. Read the palette instead:

```tsx
const { colors, gradients, isDark } = useTheme();
const styles = useThemedStyles(makeStyles);       // makeStyles = (c: Palette) => StyleSheet.create({...})
```

The **Me** tab carries a Dark mode switch. `mode` is `'system' | 'light' | 'dark'`
— it starts at `'system'` (follows the device) and flipping the switch sets an
explicit override, with a "Match my device again" row to go back:

```tsx
const { mode, setMode, toggleDark } = useTheme();
```

| Token | Dark | Light |
| --- | --- | --- |
| `bg` | `#070A08` | `#EEF2EE` |
| `surface` / `surface2` / `surface3` | `#10150F` / `#171E19` / `#1F2822` | `#FFFFFF` / `#F4F7F4` / `#E9EFEA` |
| `border` / `border2` | `#232D26` / `#2E3A31` | `#E0E7E1` / `#CFDAD1` |
| `text` / `text2` / `text3` | `#F1F5F1` / `#9CAAA1` / `#6C7A72` | `#0A100C` / `#5C6A61` / `#8B978F` |
| `accent` (+ ink) | `#55BE63` on `#06210C` | `#2F8A38` on `#FFFFFF` |

Brand ramp and discipline accents are shared: brand `#3FA448`; swim `#29A9D4`,
bike `#F0932B`, run `#3FA448`, strength `#8B72E0`, brick `#E0574B`,
recovery `#7C8A81`.

The splash swaps artwork with the theme — `logo-dark.jpeg` on near-black,
`logo-white.jpeg` on near-white — matching the mockup's own logo swap. Each
file has a different aspect ratio and a couple of columns of JPEG ringing, so
the frame is sized per artwork and overfilled by 1% to crop the edges.

## Running

```sh
npm start                 # Metro
npm run ios               # or: npx react-native run-ios --simulator "iPhone 16"
npm run android
npm run typecheck         # tsc --noEmit
npm run link-assets       # re-link fonts after adding to src/assets/fonts
```

### iOS pods

CocoaPods runs through bundler. Note that `bundle exec` resets the working
directory to the Gemfile root, so pass the project directory explicitly, and
make sure the shell has a UTF-8 locale:

```sh
LANG=en_US.UTF-8 bundle exec pod install --project-directory=ios
```

## Screen flow

```
Splash ──3s──▶ Welcome ──▶ Goal & event ──▶ Plan preview ──▶ Main (tabs)
                  │                                              │
                  └──▶ Sign in                              Today (04)
                                                     ┌───────────┴───────────┐
                                            Session detail (05)     Plan calendar (06)
                                                     │                       │
                                              Guide player          ──▶ back to a session
```

Onboarding runs **once**. `PlanPreviewScreen`'s "Start week 1 free" calls
`complete()`, which writes `@otcf/onboarding-complete`; the splash reads it and
routes returning athletes straight to `Main`. **Me → Replay onboarding** clears
the flag so the flow shows again on the next launch.

Both persisted values live under the `@otcf/` prefix:

| Key | Written by | Read by |
| --- | --- | --- |
| `@otcf/theme-mode` | the Dark mode switch (`setMode`) | `ThemeProvider` on mount |
| `@otcf/onboarding-complete` | `complete()` / cleared by `reset()` | `SplashScreen` before routing |

Both providers expose `ready`, which is false until the stored value has been
read back. `ThemeProvider` will not write before its first read has landed, so
the default can't clobber a saved preference, and the splash holds its 3s timer
until `ready` so it never routes on a stale flag.

## Deviations from the mockup

Two places where React Native can't do what the CSS does, both deliberate:

- **Plan calendar has no tab bar.** The mockup draws it with both a back arrow
  and the tab bar; it's a pushed stack screen here, so it keeps the back arrow.
  Making it keep the tab bar means nesting a stack inside the Today tab.
- **`filter: blur()` doesn't exist in RN.** The plan-detail freemium overlay
  (`LockOverlay`) uses it in the mockup: `blur(3.5px)` plus a 45% scrim. With
  no blur the gated rows stay sharp and fight the lock label, so the scrim
  carries the whole job at 82%. Same read, slightly different texture. A native
  blur module would close the gap.

### A gradient gotcha worth remembering

`react-native-linear-gradient` paints only its **content box** on iOS, so a
gradient with `padding` leaves its children sitting outside the painted area —
white-on-white, and it reads as clipping. Both the session hero and the plan
card hit this. The fix in both places: make the gradient an absolutely
positioned fill layer with no padding, and put the padded content in a sibling
`View`.

## Apple Health / Garmin

The profile's **Data sources** rows are real on iOS. Garmin is not a direct
integration and cannot be: the Garmin Health API needs developer approval plus a
server to receive their webhooks. The mockup already says the right thing —
*"Via Apple Health"*. Garmin Connect writes the watch's workouts into HealthKit
and the app reads them back out.

- `src/services/health.ts` — the HealthKit wrapper. Requests read access to
  workouts, heart rate, resting heart rate, active energy and sleep, then uses
  `querySources('HKWorkoutTypeIdentifier')` to see who has written workouts and
  the latest workout per source for a last-sync time. A source counts as Garmin
  when its bundle id or name matches `/garmin/i`.
- `src/hooks/useHealthSources.ts` — screen state. Re-reads on foreground,
  because access may be granted or a watch synced while we were backgrounded.

**iOS never reports whether *read* access was granted** — that is deliberate, so
apps cannot detect a refusal. So `asked` only means the sheet has been shown; a
refusal is indistinguishable from having no data. The Garmin row therefore says
"No Garmin data in Apple Health yet" rather than claiming a refusal.

Native setup, already applied:

| Piece | Where |
| --- | --- |
| `NSHealthShareUsageDescription` | `ios/OTCFitness/Info.plist` |
| `com.apple.developer.healthkit` | `ios/OTCFitness/OTCFitness.entitlements` |
| `CODE_SIGN_ENTITLEMENTS` (Debug + Release) | set via the `xcodeproj` gem |

Adding or changing any of these needs `pod install` and a full native rebuild.

**Testing:** the simulator has HealthKit but no Garmin, so the row will correctly
read "No Garmin data in Apple Health yet". Real data needs a physical iPhone
with Garmin Connect installed and synced.

## Progress (Analytics)

Screen 13 in the mockup, reached from **Me → Progress & analytics**. This screen
is **device-driven, not API-driven**: the athlete's band writes into Apple
Health, `readTrainingSummary()` reads it back, and `useTrainingSummary` keeps it
fresh on foreground.

| Panel | Where the number comes from |
| --- | --- |
| Training volume | Workouts over 6 weeks, minutes per discipline, bucketed by week |
| Sessions / Total time | Count and summed duration of those workouts |
| Load & recovery | 7-day rolling load vs the 28-day weekly average, in workout minutes |
| Avg sleep | Sleep over the last 14 nights, asleep values only (`inBed`/`awake` excluded) |
| Resting HR | Most recent resting heart rate sample |
| Fuelling vs load | Copy only — a band reports training, not meals |

**Sample fallback.** When the band has synced nothing (`sessions === 0`), the
screen renders the `SAMPLE` constant instead of sitting empty, behind a banner
that says so. Real sessions take over automatically the moment any arrive. The
banner is not decoration — without it, sample numbers would read as the
athlete's own. If access has never been requested, the banner becomes a Connect
button instead.

The mockup's Compliance, OTC Load and Weight tiles are not here. A band cannot
supply plan adherence or a proprietary load score, and body mass is outside the
requested read set — adding it would re-trigger the permission sheet for anyone
already connected. Sessions, Total time and Resting HR take their place.

Workout activity types are matched on raw `HKWorkoutActivityType` values
(cycling 13, running 37, swimming 46, strength 20/50) so the generated enum need
not be imported. Walking counts with running rather than being dropped.

## Storing what the band reports

HealthKit keeps the athlete's history, but the app needs its own copy — to work
offline, to be what the Progress screen is built from, and to be the queue the
API drains once it exists. `src/services/healthStore.ts` holds it.

| Key | Holds |
| --- | --- |
| `@otcf/workout-log` | Sessions, keyed by HealthKit uuid, each with a `synced` flag |
| `@otcf/sleep-log` | Minutes asleep per night, keyed by date |
| `@otcf/resting-hr-log` | Resting HR per day, keyed by date |
| `@otcf/health-anchor` | HealthKit anchor, so each sync asks only for what changed |
| `@otcf/health-last-sync` | When we last checked |

`syncWorkoutsFromDevice()` runs an **anchored** query: the first call brings the
history (capped at 180 days), every call after that is a delta. Workouts
HealthKit reports as deleted are removed from our copy too, and a session we
already hold keeps its `synced` flag so it is never re-sent. The log is capped
at 1000 newest entries.

`readTrainingSummary()` builds the bars from this stored log rather than a live
query, so the Progress screen shows the same data we would push to the backend.

**For the API, when it lands:** `unsyncedWorkouts()` returns the queue and
`markSynced(uuids)` closes it out. Nothing else needs to change.

The footer line on Progress — "N sessions stored on this device · N waiting to
sync · checked ..." — is the visible proof this is running.

### Sleep and resting HR

These are stored too, but **not** the same way as workouts, and the difference
is deliberate. A workout is an event with an id, so an anchor is the right tool.
Sleep and resting HR are one value per day: a night can be revised hours after
it ends and a watch can back-fill days late. So instead of an anchor, the last
**30 days** are re-derived on every sync and upserted by date — that heals late
arrivals and corrections on its own.

A day whose value is unchanged keeps its `synced` flag. A day whose value
actually moved is marked unsynced again, so the correction reaches the API
rather than being silently dropped. Both logs keep a year.

The Avg sleep tile averages the last 14 stored nights and Resting HR shows the
newest stored reading, so both come from the stored history rather than a live
query — the same rule the bars follow, and they survive offline the same way.

`unsyncedDailyMetrics()` returns the queue for these, and
`markDailyMetricsSynced(kind, dates)` closes it out.

### Tracking without a band

A band is not required for the app to track anything:

- **The phone itself.** iOS records step count and Apple exercise minutes with
  no wearable at all. Both are in `READ_TYPES` and surface as tiles on Progress.
- **Logged by hand.** `LogSessionScreen` (Progress → *Log a session*) writes a
  session straight into the same `@otcf/workout-log` via `addManualWorkout()`,
  with `sourceName: 'Added by hand'`. This is the only way to record a swim or a
  ride, which a phone in a pocket can never detect.

Manual entries carry our own uuid prefix (`manual-…`), so a HealthKit sync never
removes them — `mergeWorkouts` only deletes uuids HealthKit itself reports as
deleted. They queue for the API exactly like a band's sessions.

Note that adding a read type re-triggers the permission sheet, but iOS only asks
about the **new** types, not ones already granted.

### A bucketing bug worth remembering

Session ages are measured **midnight to midnight**. Measuring from today's
midnight to a timestamp later today yields a negative age, which drops the
session out of every week bucket and out of the 7/28-day windows — a session
logged today counted in the totals but drew no bar and no load. Both
`readTrainingSummary`'s week bucketing and its sleep-per-night grouping
normalise to the day start before subtracting.

## Still to build

Sections 01–03 of `index.html` are done. Everything in sections 04–06 still
renders the shared `ComingSoon` placeholder, so every tab and link stays
walkable:

| Section | Screens |
| --- | --- |
| ~~04 Plan library & training content~~ | done |
| 05 Coach & nutrition | `coach` · ~~`fuel`~~ · `scan` |
| 06 Insight & conversion | ~~`analytics`~~ · `paywall` · ~~`me`~~ |

`me` is built to the mockup, with two additions the mockup doesn't have: the
Appearance card (dark mode switch) and a Replay onboarding row under More.
Its "Progress & analytics" row opens `analytics`, which is still a placeholder.
Privacy, Help, Settings, Update and Connect have no destination yet.
`fuel` is built; its camera button and "Snap a meal" both open `scan`, which is
still a placeholder.

Note `index-option1.html` / `otcf-app-v2.js` are the **Option 1** alternative
(content-library model, no dated sessions) — not what this app is built from.
