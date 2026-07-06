# HAEFA Interactive Referral Map

This is a React + TypeScript app for exploring healthcare referral facilities in the Kutupalong-Balukhali megacamp region. It turns a facility dataset into an interactive map so users can quickly understand what services exist, where they are located, and how they differ by type, agency, camp, and specialty coverage.  

## What the app does

The homepage introduces HAEFA and then presents a full-screen Leaflet map centered on the refugee settlement area. Each facility in the dataset is rendered as a custom marker, and each marker opens a detailed popup with facility metadata and service availability.

The map can be narrowed with a filter panel that supports:

- free-text search across facility name, agency, type, and camp
- filtering by facility name
- filtering by implementing agency
- filtering by facility type
- filtering by camp
- filtering by service availability

The popup for each facility is organized into tabs so people can inspect:

- an overview of the facility and its location
- capacity and risk indicators
- specialty services and referral-related capabilities

## Why it exists

This app is meant to support referral coordination and care planning. In a setting with many facilities, overlapping services, and limited capacity, a simple list is not enough. The map gives staff and coordinators a faster way to answer questions like:

- Which facilities are in this camp?
- Which sites offer a particular service?
- What facility type or implementing agency is responsible here?
- Which locations have capacity or risks that matter for referral decisions?

The visual map plus service filters help reduce search time and make it easier to compare facilities before sending a patient or coordinating care.

## How it works

The app is built around a single data file at [src/data/referral_data.json](src/data/referral_data.json). That JSON is loaded into the map layer and treated as the source of truth for facility records.

At runtime, the app:

1. Loads the facility dataset.
2. Builds filter options from the available values in the data.
3. Applies the selected filters in memory.
4. Renders only the matching facilities as markers.
5. Uses custom marker icons to visually distinguish facility types.
6. Opens a popup with structured facility details when a marker is selected.

The main UI is composed of these pieces:

- [src/components/App.tsx](src/components/App.tsx) provides the page shell and intro copy.
- [src/components/ReferralMap.tsx](src/components/ReferralMap.tsx) owns the map, marker rendering, and filter logic.
- [src/components/FilterPanel.tsx](src/components/FilterPanel.tsx) exposes the search and checkbox filters.
- [src/components/FacilityPopup.tsx](src/components/FacilityPopup.tsx) formats facility details for the popup.
- [src/components/MapLegend.tsx](src/components/MapLegend.tsx) explains the marker colors and facility types.

The map itself uses OpenStreetMap tiles via the HOT tile layer, and marker icons are created with `leaflet`, `react-leaflet`, and `lucide-react`.

## Getting started

Install dependencies and start the local dev server:

```bash
npm install
npm run dev
```

Open the URL printed by Vite in your browser.

### Other scripts

- `npm run build` compiles the app and produces a production bundle.
- `npm run lint` runs ESLint across the project.
- `npm run preview` serves the production build locally.

## Project structure

```text
src/
  components/      React UI and map logic
  data/            Facility dataset used by the map
  index.css        Global styles
  main.tsx         Application entrypoint
```

## Notes

The app assumes the facility dataset contains coordinates and the service fields used by the filter and popup views. Records without valid latitude and longitude are excluded from the map.
