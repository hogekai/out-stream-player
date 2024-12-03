# InRenderer.js

- Currently in beta

## Description

This library was created due to the lack of an ecosystem around outstream and native video ads in Prebid.js.

This library was created with the goal of enabling multi-format rendering, including outstream and native video ads, and promoting the adoption of multi-format ad spaces, including video formats, for publishers and bidder adopters.

Current supported formats: banner, video, native, native video

Examples of multi-format:.

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
    },
    "banner": {
      "size": [[300, 250]]
    }
  },
  "renderer": {
    "url": "https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-renderer.umd.min.js",
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
