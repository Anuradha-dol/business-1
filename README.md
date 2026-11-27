# Himeshi & Madhawa — Wedding Invitation

Run locally:

```sh
npm ci
npm run dev
```

The invitation opens with a layered beach scene and leads to a responsive wedding home. The original opening artwork is retained in `design-reference/`; the second scene uses a background derived from the supplied interface reference, with navigation, text and controls rendered separately. Motion is a layered 2D approximation; reduced-motion preferences skip the opening animation.

Names, date label, monogram and venue are in `src/data/wedding.ts`. The venue is The Cinnamon Room at Jetwing Lighthouse, Galle; event timing is still to be confirmed. The Story, Day and Venue panels use intentionally limited copy until the remaining details are supplied.

RSVP responses are saved as drafts in the visitor's browser only; they are **not sent** to the couple. Configure an actual delivery or storage service before using the form to collect responses. Music is a quiet synthesized instrumental, generated locally after the visitor presses the music button; no audio file is bundled.

Use `npm run build` for a production build and `npm run lint` for lint checks.
