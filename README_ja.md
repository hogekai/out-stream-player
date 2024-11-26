# InRenderer.js

- 現在は β バージョンです

## 説明

このライブラリは、Prebid.js におけるアウトストリーム動画広告の周辺エコシステムが整っていないことから作成されました。

このライブラリは、アウトストリーム動画広告をはじめとして、マルチフォーマットのレンダリングを可能にし、出版社・ビッダーアダプターにとって動画フォーマットを含めたマルチフォーマット広告枠の導入を推進することを目標に作成されています。

現在のサポートフォーマット: バナー・動画

例:

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
