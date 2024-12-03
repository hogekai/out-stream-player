# InRenderer.js

- Currently in beta

## Description

This library was created due to the lack of an ecosystem around outstream and native video ads in Prebid.js.

This library was created with the goal of enabling multi-format rendering, including outstream and native video ads, and promoting the adoption of multi-format ad spaces, including video formats, for publishers and bidder adopters.

Current supported formats: banner, video, native, native video

Examples of multi-format:.

```javascript
var sizes = [[300, 250]];
var PREBID_TIMEOUT = 2000;
var adUnits = [
  {
    code: "unit-1",
    mediaTypes: {
      banner: {
        sizes: sizes,
      },
      video: {
        context: "outstream",
        playerSize: [640, 360],
        minduration: 0,
        maxduration: 120,
        mimes: ["video/mp4"],
        protocols: [5],
      },
      native: {
        adTemplate: `<div class="sponsored-post" style="width: 640; height: 480px;">
                <div class="thumbnail" style="background-image: url(##hb_native_asset_id_1##);"></div>
                <div class="content">
                    <h1>
                        <a href="##hb_native_linkurl##" target="_blank" class="in-renderer-native-link">##hb_native_asset_id_2##</a>
                    </h1>
                    <p>##hb_native_asset_id_4##</p>
                    <div class="attribution">##hb_native_asset_id_3##</div>
                    <div class="in-renderer-native-video" data-asset-id="5" data-player-width="480" data-player-height="270"></div>
                </div>
            </div>`,
        ortb: {
          assets: [
            {
              id: 1,
              required: 1,
              img: {
                type: 3,
                w: 989,
                h: 742,
              },
            },
            {
              id: 2,
              required: 1,
              title: {
                len: 800,
              },
            },
            {
              id: 3,
              required: 1,
              data: {
                type: 1,
              },
            },
            {
              id: 4,
              required: 1,
              data: {
                type: 2,
              },
            },
            {
              id: 5,
              required: 1,
              video: {
                minduration: 0,
                maxduration: 120,
                mimes: ["video/mp4"],
                protocols: [8],
              },
            },
          ],
        },
      },
    },
    renderer: {
      url: "https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-renderer.umd.min.js",
      render: (bid) => {
        var inRenderer = new InRenderer();
        inRenderer.render("unit-1", bid);
      },
    },
    bids: [
      {
        bidder: "michao",
        params: {
          placement: 123,
          site: 123,
        },
      },
    ],
  },
];

var pbjs = window.pbjs || {};
pbjs.que = window.pbjs.que || [];

pbjs.que.push(function () {
  pbjs.setConfig({
    debug: true,
  });
  pbjs.addAdUnits(adUnits);
  pbjs.requestBids({
    timeout: PREBID_TIMEOUT,
    bidsBackHandler: function () {
      const highestCpmBids = pbjs.getHighestCpmBids("unit-1");
      pbjs.renderAd(document, highestCpmBids[0].adId);
    },
  });
});
```

```html
<div id="unit-1"></div>
```
