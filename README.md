# SparkTracker

A simple, anonymous event tracking library.

## Installation

You can include SparkTracker directly in your HTML using jsDelivr.

### via CDN (jsDelivr)

Add the following script tag to the `<head>` or just before the closing `</body>` tag of your website:

```html
<script src="https://cdn.jsdelivr.net/gh/thebetar/SparkTracker@master/dist/spark-tracker.min.js"></script>
```

_Note: It is recommended to replace `@main` with a specific release tag (e.g., `@v1.0.0`) for production stability._

## Usage

The tracker automatically initializes and tracks:

-   Page loads
-   Button clicks (`<button>`, `<a>`, `input[type="button"]`, `input[type="submit"]`)

Data is sent anonymously to your configured Supabase instance.
