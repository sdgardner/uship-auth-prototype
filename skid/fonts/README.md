# Skid fonts

Skid uses **Lato** (sans, primary UI) and **Roboto Mono** (numerics, data,
code).

## Lato — self-hosted

The full Lato family is bundled here as TTF files and wired up via
`@font-face` declarations at the top of `colors_and_type.css`. No CDN
fetch is needed for Lato. Available weights:

| Weight | File                       | Italic file                       |
|-------:|---------------------------|-----------------------------------|
| 100    | `Lato-Thin.ttf`           | `Lato-ThinItalic.ttf`             |
| 300    | `Lato-Light.ttf`          | `Lato-LightItalic.ttf`            |
| 400    | `Lato-Regular.ttf`        | `Lato-Italic.ttf`                 |
| 700    | `Lato-Bold.ttf`           | `Lato-BoldItalic.ttf`             |
| 900    | `Lato-Black.ttf`          | `Lato-BlackItalic.ttf`            |

Skid runtime UI uses **400** (body) and **700** (headers, labels, buttons,
badges) almost exclusively. Light/Black are available for marketing display.

## Roboto Mono — Google Fonts

Roboto Mono is loaded per-page via the Google Fonts CDN:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap">
```

## Substitution flag

The Figma metadata also references **Lucida Grande** and **Inter** — these
are Figma's *internal* annotation typefaces, not Skid type tokens. Skid
runtime type is **Lato + Roboto Mono only**.
