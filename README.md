# InRenderer.js

- Currently in beta

## Description

This library was created because the ecosystem around outstream video advertising in Prebid.js is not in place.

This library enables multi-format rendering, including outstream video ads, with the goal of promoting the introduction of multi-format ad slots, including video formats, for publishers and bidder adapters.

Currently supported formats: Banner, Video

Example:

```javascript
{
  "code": "video-unit",
  "mediaTypes": {
    "video": {
      "context": "outstream",
      "playerSize": [640, 360],
      "minduration": 0,
      "maxduration": 120,
      "mimes": ["video/mp4"],
      "protocols": [5]
    }
  },
  "renderer": {
    "url": "./fakeRenderer.js",
    "render": (bid) => {
      const inRenderer = new InRenderer();
      inRenderer.render("video-unit", bid);
    }
  },
  "bids": [
    {
      "bidder": "michao",
      "params": {
        "placement": 123,
        "site": 123
      }
    }
  ]
}
```
