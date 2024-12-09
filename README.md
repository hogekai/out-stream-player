# InRenderer.js

## Overview

InRenderer.js is an open-source renderer library for in-renderer integration (formerly known as outstream). In-renderer integration is [one of the video format integration methods in Prebid.js](https://docs.prebid.org/prebid-video/video-overview#in-renderer-integration) that allows video format delivery with just banner integration setup on the ad server side.

This library supports banner, video, and native (including video assets) formats. It is designed to enable in-renderer integration for not only video but also native ads, promoting multi-format ad slot implementation for publishers and bid adapter providers.

Additionally, it supports the same browser targets as Prebid.js. Operation is guaranteed on browsers with usage rates above 0.25 percent worldwide, excluding Opera Mini and IE11.

## Why Should You Implement InRenderer.js?

InRenderer.js allows you to implement in-renderer integration into existing ad slots with minimal code and almost no implementation cost. Implementing multi-format ad slots is synonymous with increasing multiple demand sources, which can lead to revenue growth. Furthermore, by including native ads and native video ads in in-renderer integration, existing multi-format ad slots can discover new revenue opportunities. Don't you think this is wonderful?

Also, haven't you wondered why, despite video integration methods being introduced on Prebid.org, no specific renderer is introduced? This is because most bid adapters have built-in renderers, and there was no open-source renderer specifically adjusted for in-renderer integration. Moreover, renderer implementation is **mostly** present, but not in all adapters. Furthermore, adapters with built-in renderers often lack UI adjustments for in-renderer integration. InRenderer.js solves these problems. InRenderer.js is available for both publishers and bid adapters.

## Why Include Native Ads in In-Renderer Integration?

This library was originally intended to be a renderer for video formats. However, we noticed that native ads have a separate render method, and in the excellent integration method of in-renderer integration, native ads are treated as separate entities. Native ads are an excellent format that will shape the future. While centralized management on the ad server is attractive, including them in in-renderer integration to enable rendering with `pbjs.renderAd` is certainly not a bad choice as we prepare for a new era.

## How to Implement InRenderer.js

> To seamlessly integrate with Prebid.js, integration with Prebid.js is assumed.

### Getting Started

Let's explain how to integrate with InRenderer.js.

First, you should have an object somewhere that defines ad unit information, like this:

```js
var adUnit = {
  code: "ad-unit-1",
  mediaTypes: {
    banner: {
      sizes: [[300, 250]],
    },
  },
  bids: [
    {
      bidder: "michao",
      params: {
        placement: "123",
        site: 123,
      },
    },
  ],
};
```

Then, set up the `renderer` property as shown below:

```js
var adUnit = {
  code: "ad-unit-1",
  mediaTypes: {
    banner: {
      sizes: [[300, 250]],
    },
  },
  bids: [
    {
      bidder: "michao",
      params: {
        placement: "123",
        site: 123,
      },
    },
  ], // Newly added property
  renderer: {
    url: "https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-renderer.umd.min.js",
    render: (bid) => {
      var inRenderer = new InRenderer();
      inRenderer.render("{AD_UNIT_TARGET_ELEMENT_ID}", bid);
    },
  },
};
```

Next, replace `{AD_UNIT_TARGET_ELEMENT_ID}` with the ID of the `div` tag where you want to render the ad.

For example, if you have a `div` tag like this:

```html
<div id="ad-unit-1"></div>
```

Replace `{AD_UNIT_TARGET_ELEMENT_ID}` like this:

```js
var adUnit = {
  code: "ad-unit-1",
  mediaTypes: {
    banner: {
      sizes: [[300, 250]],
    },
  },
  bids: [
    {
      bidder: "michao",
      params: {
        placement: "123",
        site: 123,
      },
    },
  ],
  renderer: {
    url: "https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-renderer.umd.min.js",
    render: (bid) => {
      var inRenderer = new InRenderer();
      inRenderer.render("ad-unit-1", bid); // Replaced with `ad-unit-1`
    },
  },
};
```

The integration is now complete.

### Defining Ad Units as Multi-Format Ad Slots

To maximize the effectiveness of InRenderer.js, you need to make your ad units multi-format. Here's a simple example, but for more details, refer to the [Prebid.js Multi-Format Documentation](https://docs.prebid.org/dev-docs/show-multi-format-ads.html).

Modify the previously prepared ad unit as shown below. The `video` settings here include the maximum `protocols` and `api` that InRenderer.js's video player can support.
Also, don't forget to set `context` to `outstream`. This is an important setting that indicates in-renderer integration.

```js
var adUnit = {
  code: "ad-unit-1",
  mediaTypes: {
    banner: {
      sizes: [[300, 250]],
    },
    // Added
    video: {
      context: "outstream",
      playerSize: [320, 180],
      minduration: 0,
      maxduration: 120,
      mimes: ["video/mp4", "video/webm", "video/ogg"],
      protocols: [2, 3, 5, 6, 7, 8],
      api: [2],
    },
  },
  bids: [
    {
      bidder: "michao",
      params: {
        placement: "123",
        site: 123,
      },
    },
  ],
  renderer: {
    url: "https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-renderer.umd.min.js",
    render: (bid) => {
      var inRenderer = new InRenderer();
      inRenderer.render("ad-unit-1", bid);
    },
  },
};
```

Now the ad slot is defined as a multi-format ad slot.

### Adding Native Ads to the Ad Slot

To maximize ad slot revenue, add native format to the ad slot. InRenderer.js supports Prebid.js's [latest native ad implementation documentation](https://docs.prebid.org/prebid/native-implementation.html), so refer to that during implementation.
However, note that it only supports configurations using `native.adTemplate` rather than defining native templates on the ad server side.

> In InRenderer.js, native ad rendering does not internally generate an iframe due to style continuity and the nature of in-renderer integration. If you have any issues or opinions about this behavior, please report them through issues in the [repository](https://github.com/hogekai/in-renderer-js).

Simple image implementation example:

```js
var adUnit = {
  code: "ad-unit-1",
  mediaTypes: {
    banner: {
      sizes: [[300, 250]],
    },
    video: {
      context: "outstream",
      playerSize: [320, 180],
      minduration: 0,
      maxduration: 120,
      mimes: ["video/mp4", "video/webm", "video/ogg"],
      protocols: [2, 3, 5, 6, 7, 8],
      api: [2],
    },
    native: {
      adTemplate: `<div style="width: 300px; height:250px; background-image: url(##hb_native_asset_id_1##);">`,
      ortb: {
        assets: [
          {
            id: 1,
            required: 1,
            img: {
              type: 3,
              w: 300,
              h: 250,
            },
          },
        ],
      },
    },
  },
  bids: [
    {
      bidder: "michao",
      params: {
        placement: "123",
        site: 123,
      },
    },
  ],
  renderer: {
    url: "https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-renderer.umd.min.js",
    render: (bid) => {
      var inRenderer = new InRenderer();
      inRenderer.render("ad-unit-1", bid);
    },
  },
};
```

#### Supporting Native Video Ads

InRenderer.js supports video assets in native format through its own method. To display video, you need to prepare a video container with specific attributes and set up the following tag in the ad template:

```html
<div
  class="in-renderer-native-video"
  data-asset-id="1"
  data-player-width="320"
  data-player-height="180"
></div>
```

#### Video Container Attributes

| Attribute Name     | Type   | Required | Description                       |
| ------------------ | ------ | -------- | --------------------------------- |
| class              | string | ✓        | Set to `in-renderer-native-video` |
| data-asset-id      | string | ✓        | Video asset ID                    |
| data-player-width  | number | ✓        | Player width (pixels)             |
| data-player-height | number | ✓        | Player height (pixels)            |

> Player size is adjusted responsively. It maintains the aspect ratio while scaling down, using the set width and height as maximum values.

To include native video assets in an ad unit, structure it like this:

```js
var adUnits = [
  {
    code: "ad-unit-1",
    mediaTypes: {
      native: {
        adTemplate: `<div class="in-renderer-native-video" data-asset-id="1" data-player-width="320" data-player-height="180">`,
        ortb: {
          assets: [
            {
              id: 1,
              required: 1,
              video: {
                minduration: 0,
                maxduration: 120,
                mimes: ["video/mp4", "video/webm", "video/ogg"],
                protocols: [2, 3, 5, 6, 7, 8],
                api: [2],
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
        inRenderer.render("ad-unit-1", bid);
      },
    },
    bids: [
      {
        bidder: "michao",
        params: {
          placement: "123",
          site: 123,
        },
      },
    ],
  },
];
```

Prebid.js cannot include multiple instances of the same format in one ad unit.
To set up both video assets and image assets in the same ad unit, prepare two ad units with the same `code`, including images in the first and video in the second.

It would look like this:

```js
var adUnits = [
  {
    code: "ad-unit-1",
    mediaTypes: {
      banner: {
        sizes: [[300, 250]],
      },
      video: {
        context: "outstream",
        playerSize: [320, 180],
        minduration: 0,
        maxduration: 120,
        mimes: ["video/mp4", "video/webm", "video/ogg"],
        protocols: [2, 3, 5, 6, 7, 8],
        api: [2],
      },
      native: {
        adTemplate: `<div style="width: 300px; height:250px; background-image: url(##hb_native_asset_id_1##);">`,
        ortb: {
          assets: [
            {
              id: 1,
              required: 1,
              img: {
                type: 3,
                w: 300,
                h: 250,
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
        inRenderer.render("ad-unit-1", bid);
      },
    },
    bids: [
      {
        bidder: "michao",
        params: {
          placement: "123",
          site: 123,
        },
      },
    ],
  },
  // Added
  {
    code: "ad-unit-1",
    mediaTypes: {
      native: {
        adTemplate: `<div class="in-renderer-native-video" data-asset-id="1" data-player-width="320" data-player-height="180">`,
        ortb: {
          assets: [
            {
              id: 1,
              required: 1,
              video: {
                minduration: 0,
                maxduration: 120,
                mimes: ["video/mp4", "video/webm", "video/ogg"],
                protocols: [2, 3, 5, 6, 7, 8],
                api: [2],
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
        inRenderer.render("ad-unit-1", bid);
      },
    },
    bids: [
      {
        bidder: "michao",
        params: {
          placement: "123",
          site: 123,
        },
      },
    ],
  },
];
```

### Rendering Specific Formats Only

InRenderer.js provides specialized entry points for rendering video ads and native ads. In specific use cases, you might need to render only video ads, for example. Utilize multiple entry points along with renderer settings per mediaTypes as described in the [Prebid.js renderer documentation](https://docs.prebid.org/dev-docs/show-outstream-video-ads.html).

| URL                                                                                   | Class            | Description                      |
| ------------------------------------------------------------------------------------- | ---------------- | -------------------------------- |
| https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-renderer.umd.min.js        | InRenderer       | Render banner, video, and native |
| https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-video-renderer.umd.min.js  | InVideoRenderer  | Render video only                |
| https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-native-renderer.umd.min.js | InNativeRenderer | Render native only               |

Here's an example:

```js
var adUnits = [
  {
    code: "video",
    mediaTypes: {
      video: {
        context: "outstream",
        playerSize: [300, 250],
        minduration: 0,
        maxduration: 120,
        mimes: ["video/mp4"],
        protocols: [5],
        renderer: {
          url: "https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-video-renderer.umd.min.js",
          render: (bid) => {
            var inRenderer = new InVideoRenderer();
            inRenderer.render("video", bid);
          },
        },
      },
    },
    bids: [
      {
        bidder: "michao",
        params: {
          placement: "123",
          site: 123,
        },
      },
    ],
  },
];
```

### Options

InRenderer.js provides several options related to ad rendering.

#### Track Viewable Impressions

InRenderer.js provides events to track viewable impressions according to MRC definitions for each format. You can track them using `onImpressionViewable`.

```js
var inRenderer = new InRenderer();
inRenderer.render("ad-unit-1", bid, {
  onImpressionViewable: () => {
    console.log("impression viewable");
    pbjs.triggerBilling(bid);
  },
});
```

#### Set Vendor Logo

When using InRenderer.js as a renderer for bid adapters, you can set a vendor logo.

- `logo.imageUrl`: Logo URL
- `logo.clickUrl`: Click destination URL

```js
var inRenderer = new InRenderer();
inRenderer.render("ad-unit-1", bid, {
  logo: {
    imageUrl: "https://example.com/imageUrl",
    clickUrl: "https://example.com/clickUrl",
  },
});
```

#### Set Click-Through for Banner Ads

InRenderer.js supports click-through macros. For more information about click-through macros, see [here](https://docs.prebid.org/dev-docs/publisher-api-reference/renderAd.html).

- `clickThrough`

```js
var inRenderer = new InRenderer();
inRenderer.render("ad-unit-1", bid, {
  clickThrough: "https://example.com/clickThrough",
});
```

## From the Developer

Recently, I've felt that the open-source community in web ad technology has been stagnating. While there are various factors contributing to this, I don't want to accept this situation as it is. I plan to develop various modern solutions, from small to large scale, to energize this industry.

If you're interested in my future development work and would like to provide advice, feedback, or help with practical testing, please contact me.

LinkedIn: https://www.linkedin.com/in/kai-miyamoto-87393732b/
