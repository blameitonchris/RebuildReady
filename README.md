[README.md](https://github.com/user-attachments/files/33133798/README.md)
# RebuildReady

**Plan your repairs. Price your rebuild.**

RebuildReady helps homeowners organize repairs to water-damaged basements and helps contractors turn those repair plans into itemized estimates. It combines room measurements, repair quantities, equipment rentals, material costs, and labor in a guided interface with a soft blue theme.

## Who it is for

- **Homeowners:** Describe the damage, plan the work, enter known prices, and share a repair plan with a contractor.
- **Contractors:** Review measurements and scope, enter their rates, and prepare a printable customer estimate.

Contractors can also start an estimate directly. Homeowner estimates are planning budgets that need contractor review.

## Features

- Multiple rectangular rooms with floor area and wall measurements.
- Partial-height wall repairs and editable quantities.
- Separate equipment, material, and labor costs.
- Contractor overhead, profit markup, optional tax, and contingency.
- Homeowner-paid costs shown separately from the contractor quote.
- Warnings for missing measurements or prices.
- Drafts saved on the current device.
- Printable estimates and browser-based PDF saving.
- JSON export/import for backup and sharing editable plans.
- Responsive homeowner and contractor views.

## Repair stages

Select the stages needed for the project; not every basement needs every stage.

| Stage | Work covered |
| --- | --- |
| Water removal | Temporary extraction pumps, equipment rentals, and labor |
| Drying | Dehumidifier rentals, optional air movers, and monitoring |
| Demolition | Damaged flooring, drywall, insulation, trim, and debris disposal |
| Interior drainage | Concrete removal, excavation, gravel, piping, sump systems, and related allowances |
| Concrete reinstatement | Concrete patch quantities, materials, placement, and finishing |
| Reconstruction | Stud repairs, insulation, drywall, flooring, baseboards, and painting |

Equipment counts, rental days, demolition heights, trench dimensions, and pump quantities are adjustable estimating assumptions. They require contractor confirmation for the specific site. Stage order is a planning outline; drying and demolition may overlap.

## Getting started

If you have the standalone build, download **RebuildReady.html** and open it in a modern web browser.

1. Choose **Homeowner** or **Contractor**.
2. Start a project or choose **Explore an example project**.
3. Enter room measurements and select the repair stages.
4. Review quantities and enter equipment, material, and labor prices.
5. Review the cost breakdown and resolve missing information.
6. Save a PDF for reading or export JSON to share an editable plan.

Example-project prices are demonstration values, not verified local market prices.

## Saving and sharing

### PDF estimate

Use the PDF/print option and select **Save as PDF** in the browser print dialog. The PDF is the readable document to give a homeowner or contractor. If printing is blocked in an embedded preview, open the app or its printable estimate in a regular browser tab.

### Editable repair plan

Use **Export plan for RebuildReady (.json)** to download the project data. Another user can import that file into RebuildReady and continue editing the plan.

A JSON file contains structured app data. It is not a formatted Word document or PDF.

### Device drafts

Drafts stay in the browser on the current device. They do not automatically sync between people, browsers, or devices. Clearing browser data may remove them; export important plans as backups.

## Understanding the totals

- **Contractor quote:** Work and expenses included in the contractor's estimate, with the selected pricing adjustments.
- **Homeowner-paid costs:** Expenses paid directly by the homeowner, such as separately rented drying equipment.
- **Combined project budget:** Contractor quote plus homeowner-paid costs.

Review the percentage settings and their stated calculation bases. Profit markup is a percentage added to cost; it is different from profit margin. Confirm tax settings for the project. An estimate with missing prices is incomplete and should not be treated as the final project cost.

## Current scope and limits

- Rectangular rooms and USD pricing.
- Prices are entered by the user; automatic regional pricing is not included.
- No user accounts, payments, contractor marketplace, or automatic draft syncing.
- Drainage dimensions and pump quantities are estimating inputs, not an engineered system design.
- Drying duration is an allowance, not a guarantee that materials are ready for reconstruction.
- Mold remediation, contaminated-water cleanup, structural engineering, and other specialist work are excluded unless explicitly included as separately priced items.

RebuildReady is an estimating and planning tool. Final scope, site conditions, drying readiness, drainage design, and installation requirements need appropriate professional review.

## Project status

This is an initial version built with Codex and being refined through user feedback. Development checks reported for earlier versions included calculation tests, browser flows, saved drafts, JSON import/export, mobile layout, and print output. Run the repository's current checks before releasing changes.

## Feedback

To report a problem, open a GitHub issue in this repository. Include:

- What you were trying to do.
- What happened and what you expected.
- Your browser and device.
- A screenshot or example with personal and customer information removed.

## Development

This README describes the app's user-facing behavior. Follow the setup instructions and scripts in the repository for development. The standalone HTML build can be used without a development server.

