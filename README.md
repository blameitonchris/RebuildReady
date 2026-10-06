# RebuildReady

**Plan your repairs. Price your rebuild.**

A basement restoration planner for homeowners and contractors. It shares one calculation engine between both views. No account, backend, regional price database, or paid services are needed. Prices default to blank; demonstration projects use conspicuously labeled example prices.

## Try the app

Open `RebuildReady.html` in a modern browser, or use the development server:

```sh
npm ci --cache /tmp/basementquote-npm
npm run dev -- --port 5173
```

Use the cloud workspace's port preview if available. The production files have been uploaded to the `gh-pages` branch. Public availability depends on enabling GitHub Pages in repository settings.

Choose **Explore an example project** for all six stages. The project has a 20 × 15 ft family room and a 10 × 8 ft laundry. Reconstruction repairs total 224 sq ft of walls, 360 sq ft of flooring, and 65 linear ft of trim. Demolition uses independent 4-foot heights, giving 260 sq ft of drywall removal after opening deductions.

The contractor-review drainage allowance is **110 ft**, entered independently of room perimeters. At 18 inches wide and 15 inches total depth with a 4-inch existing slab, the example shows approximately 7.64 cu yd total trench volume, 2.04 cu yd slab volume, and 5.60 cu yd excavation beneath the slab. The optional 8-inch gravel fill allowance gives 4.07 cu yd before waste. Concrete patching uses a separate 4-inch thickness, giving 2.04 cu yd before material waste. These are estimating assumptions, not construction instructions or approved specifications.

The example includes 2 industrial dehumidifiers × 3 days × **$65 demonstration daily rate** = **$390 paid directly by the homeowner**. This cost stays outside the contractor quote and all contractor percentages. Try choosing 3 units, changing duration, switching responsibility, adjusting drainage length to 0 / 101 ft, and overriding basin and permanent-pump quantities independently. All prices are examples, not local market estimates. The example deliberately leaves contractor readiness confirmations unverified.

The shareable `examples/full-restoration-plan.json` contains the full example. `examples/legacy-reconstruction-plan.json` is a version-1 reconstruction fixture for testing older-plan compatibility.

**Reconstruction-only example** retains the smaller original example. Download a JSON plan to share it; importing it in contractor view retains the plan while enabling contractor pricing controls.

## Six selectable stages

1. **Water removal** — temporary extraction pump and hose rentals, other equipment, delivery/pickup, setup, monitoring, and removal labor. Temporary pumps do not become permanent sump pumps.
2. **Drying & dehumidifiers** — editable 2-unit / 3-day starting allowance, easy 3-unit option, air movers, delivery/pickup, and moisture monitoring. Each rental has its own payment responsibility. Drying may overlap demolition; no duration guarantees dryness.
3. **Demolition & disposal** — floor-covering removal, drywall removal with per-room heights and opening deductions, insulation, trim, optional stud removal, hauling/disposal, and dumpster charges. Original drywall-removal and debris items are reused once. Disposal already included in hauling must not be entered again.
4. **Interior drainage & sump system** — actual entered run, editable trench width/depth, existing slab thickness, cutting, slab removal, excavation, separate slab/soil hauling, gravel, drain piping, fittings, basins, permanent pumps, discharge work, and optional backup/electrical allowances. The optional rule is one sump per 100 linear feet rounded up for positive lengths; zero adds none. It is a contractor estimating assumption, not a system design recommendation. Basin and pump overrides are independent.
5. **Concrete reinstatement** — independent patch length/width/thickness, concrete material and placement, material-only waste, delivery/minimum-load charges, and separate finishing labor. Contractor confirmation of concrete readiness is recorded before new flooring.
6. **Reconstruction & finishing** — the original drywall, insulation, flooring, baseboards, painting, and new stud repair/replacement. Quantities can be corrected independently from demolition.

Stage subtotals show equipment, materials, labor, fixed charges, and homeowner-paid rentals. Unselected stages/items are explicitly not included; blank required prices are unpriced; entered zero prices are shown as explicit zero costs. Known-cost subtotals are partial budgets when prices or quantities are missing.

## Calculation rules

- Rental cost = equipment count × rental days × daily rate.
- Contractor direct costs = contractor materials + labor + equipment + fixed charges. Project-level allowances are added once, separately from stage subtotals.
- Overhead applies to contractor direct costs; profit markup applies to direct costs plus overhead; contingency applies to that subtotal including profit; optional tax applies to the whole contractor subtotal including contingency.
- Homeowner-paid rental costs bypass every contractor percentage and are added once to form the combined project budget. Enter all applicable direct-rental fees/tax in the final direct rental rate; automatic direct-rental tax is not added.
- Line-item costs and each percentage charge are rounded to cents before addition. Quantities displayed in the app are rounded for readability; costs use the full calculated quantities.
- Trench volume = entered length in feet × width in inches / 12 × total depth in inches / 12 ÷ 27.
- Existing slab volume uses slab thickness. Excavation beneath the slab = total trench volume minus slab volume, once.
- Gravel uses an explicitly entered quantity or an explicit fill-depth allowance. A manual quantity takes precedence. It is never equated automatically to total trench volume.
- Concrete volume = patch length × patch width in feet × patch thickness in feet ÷ 27. A blank patch length follows the entered drainage run. Patch thickness is independent from trench depth.
- Material waste increases purchase quantity only; labor uses the repair quantity without waste.

## Drafts, sharing, and print

The original `basementquote-v1` storage key is retained, so existing device drafts are recoverable. Version-1 JSON plans are validated and migrated to version 2 in memory. Water removal, drying, drainage, and concrete stages start **unselected**; demolition/reconstruction scope and costs are retained. New demolition heights inherit each room's original repair height and deductions, preserving the original removal quantity. New optional items start unselected. Version-2 plans preserve all stage quantities, rates, rental responsibility, percentages, and verification statuses through export/import.

Only one automatic draft is retained per browser/device. Drafts do not automatically share or sync. Browser storage can be cleared or unavailable; download JSON as a backup. The standalone file and server may have different browser origins and drafts. Imports contain project names, notes, quantities, and prices; share intentionally. Older versions of the app cannot import version-2 exports.

The printable document includes all six stage headings with selected/not-included status, itemized costs, rental responsibility, estimating assumptions, readiness confirmations, contractor quote, direct homeowner costs, combined project budget, notes, and exclusions. **Save estimate as PDF** is the primary download action. It opens the complete review and requests the browser print dialog; choose **Save as PDF** as the destination. Embedded previews may block printing without reporting a JavaScript error. The visible print panel offers **Open printable estimate in new tab** and **Download printable estimate (.html)**. If a new tab is blocked or still restricted, download the HTML file, open it directly in Chrome, Edge, Firefox, or Safari (not a word processor), click **Print / save PDF**, choose **Save as PDF**, and save. The printable file is a self-contained snapshot of the current estimate, including all warnings, branding, notes, and totals; it does not alter your device draft. The app suggests a project-specific filename beginning with `RebuildReady`; your browser may let you edit it before saving. Incomplete estimates are clearly labeled and include missing-measurement and missing-price warnings. Long plans span multiple pages.

**Export plan for RebuildReady (.json)** is the secondary action. For backup or sharing with someone who will import this file into RebuildReady. Use the PDF option for a readable estimate. JSON exports use `RebuildReady-<project>-Plan.json`; only the filename changes, not the data format or compatibility. Older downloaded files remain importable regardless of filename.

## Validation and rebuild

```sh
npm test
npm run standalone
# With the dev server running and /usr/bin/chromium available:
npm run test:browser
npm run test:design
npm run test:restoration
npm run test:sharing
```

Calculation tests cover multiple rooms, partial-height repairs/demolition, deductions, material-only waste, missing/zero prices, rental formulas, responsibility separation, sequential percentages, inch conversions, separate trench/slab/excavation/concrete volumes, explicit gravel assumptions, sump rounding and independent overrides, duplicate-charge prevention, invalid dimensions, and old/new JSON round trips.

Browser checks cover both views, saved drafts, import/export, new stage editing, two/three-unit rental controls, zero-length drainage, sump overrides, validation, print output, mobile overflow, keyboard focus, reduced motion, key text contrast, and standalone styling. Sharing checks verify print invocation, descriptive filenames, unchanged drafts, complete/incomplete PDFs, and exact JSON round trips.

## Design and first-version limits

Warm white pages, white cards, navy text, soft blue accents, and inline SVG branding retain the existing visual identity. The guided four-step flow separates room measurements, stage scope, pricing, and review.

USD and rectangular rooms only. Labor is priced per listed unit, not automatically estimated hours/productivity. Wall paint excludes ceilings. Drainage cutting defaults to two run-length cuts with a manual correction; endpoints, waste, and site-specific work must be reviewed. Waste quantities are continuous allowances, not rounded purchase packs. Tax applies to the whole contractor subtotal; local rules may require different treatment. The app cannot detect duplicate costs embedded in arbitrary rates or free-text allowances; contractors must confirm that disposal, finishing, delivery, and other included charges are not entered twice.

Drying and concrete confirmation checkboxes record the entered status only; the app does not verify moisture, engineering, equipment capacity, or site readiness. Mold remediation, contaminated-water cleanup, structural engineering, and specialist work remain excluded unless explicitly named and separately priced. Electrical/plumbing work is included only as named allowances. This app is an estimating tool, not a DIY remediation or excavation guide.

The source is plain JavaScript and CSS, Vite for development/build, and Node's built-in calculation tests. No login, payment, marketplace, claims processing, or automatic regional pricing is implemented. Only static app files are uploaded for the free GitHub Pages testing version. No domain, paid service, account system, or payment integration is added.

Run `node scripts/print-fallback-check.mjs` to verify the actual native print button, an iframe without print/popup permissions, repeat clicks, the printable HTML download, printing outside the iframe, and unchanged drafts. Headless Chromium verifies native print events and generated PDF content; operating-system print dialogs still depend on your browser permissions.

## Free GitHub Pages testing site

The production payload is the self-contained `RebuildReady.html`, uploaded as `index.html`, plus `.nojekyll`. It has no external asset dependencies and works at the repository subpath. Source, test fixtures, credentials, and personal browser drafts are excluded from this payload. Built-in examples use labeled demonstration prices. The local draft storage key and JSON format remain unchanged. Drafts from the local preview or a downloaded file do not automatically move to the public website; export JSON there and import it on the new site.

First-time activation: open the repository's **Settings → Pages**. Choose **Deploy from a branch**, select **gh-pages** and **/ (root)**, and Save. Use the public address GitHub displays after its deployment finishes. Expected address: `https://blameitonchris.github.io/RebuildReady/`. Do not buy a domain or upgrade a plan. If Pages is unavailable on the current free plan, stop and resolve repository visibility or hosting with the owner before continuing.

Future updates: make and test your changes in this project, run the existing browser checks with the development server running, then run:

```sh
npm run deploy:pages
```

This reruns all calculation tests, rebuilds the production app and standalone file, and pushes only static production files to `gh-pages` without force-pushing. GitHub then republishes automatically if Pages is enabled. Wait for the repository's Pages deployment to complete and refresh the public site. You can also ask Codex to update and republish the app. Save source changes to `main` separately; the deployment branch contains the built site only.

Public-site check: `SITE_URL=https://blameitonchris.github.io/RebuildReady/ node scripts/public-site-check.mjs`. This runs desktop/mobile flows, JSON round-trip, native print events, printable-file download, and a PDF layout check. `/usr/bin/chromium` is needed. Local production verification does not prove that the public URL is reachable.

Homeowners select services and review quantities; material prices and labor rates are editable only in contractor view. Add prices in homeowner view accepts known rentals and separate charges, with selected material/labor services listed for contractor pricing. Existing and imported contractor rates are retained, included in calculations, and available read-only in the final estimate. Switching views, saving drafts, and JSON sharing never erase prices.
