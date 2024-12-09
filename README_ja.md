# InRenderer.js

## 概要

InRenderer.js は、インレンダラー統合 (旧称: アウトストリーム)用のオープンソースレンダラーライブラリです。インレンダラー統合とは、[Prebid.js における動画フォーマットの統合方法の一つ](https://docs.prebid.org/prebid-video/video-overview#in-renderer-integration)で、広告サーバー側でバナー統合セットアップをするだけで動画フォーマットの供給を行えるようになります。

このライブラリでは、バナー・動画・ネイティブ (動画アセットを含む)のフォーマットをサポートしています。動画のみならずネイティブ広告もインレンダラー統合を行えることが出来るように作成されており、出版社、入札アダプター提供者向けにマルチフォーマット広告枠の導入を推進します。

また、Prebid.js と同じブラウザターゲットをサポートしています。世界中で 0.25 パーセント以上の使用率に含まれているブラウザで動作が保証されており、Opera Mini および IE11 はサポートされていません。

## なぜ InRenderer.js を導入する必要があるのか？

InRenderer.js は、導入コストがほとんどかからずに少ないコードで既存の広告枠にインレンダラー統合を導入することが出来ます。マルチフォーマット広告枠の導入は複数のデマンドソースが増えるのと同義なので、収益の向上が望めます。他にも、ネイティブ広告とネイティブ動画広告をインレンダラー統合に含ませることで、既存のマルチフォーマット広告枠も新しい収益の発見を望めるはずです。これはとても素晴らしいことだと思いませんか？

また、Prebid.org で動画統合方法が紹介されているのにもかかわらず、具体的なレンダラーが紹介されていないのに疑問を持ちませんでしたか？それは、入札アダプターにレンダラーが搭載されていることがほとんどであり、インレンダラー統合用に調整されているオープンソースレンダラーが存在しなかったからです。しかも、レンダラーの搭載率は**ほとんど**であり、全てのアダプターに搭載されているわけではありません。さらに、レンダラーが搭載されているアダプターはインレンダラー統合用に UI が調整されていないことがよくあります。この問題を、InRenderer.js は解決します。InRenderer.js は出版社と入札アダプターの両方で利用可能です。

## なぜネイティブ広告をインレンダラー統合に含めているのか？

このライブラリは本来、動画フォーマット用のレンダラーになるはずでした。しかし、ネイティブ広告の render メソッドは別に用意され、インレンダラー統合という素晴らしい統合方法において、ネイティブ広告は別物として扱われている現状に気づきました。ネイティブ広告は今後の未来を担う素晴らしいフォーマットです。広告サーバーでの一元管理も魅力的ですが、新しい時代に備えて、`pbjs.renderAd`で描画ができるようにインレンダラー統合に含ませるのは決して悪くない選択肢のはずです。

## InRenderer.js の実装方法

> Prebid.js とシームレスに統合するために、Prebid.js との連携を前提にしています。

### はじめに

InRenderer.js との連携方法を解説します。

まず、下記のような広告ユニットの情報を定義するオブジェクトがどこかにあるはずです。

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

そこに、下記のように`renderer`プロパティを設定します。

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
  ], // 新しく追加されたプロパティ
  renderer: {
    url: "https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-renderer.umd.min.js",
    render: (bid) => {
      var inRenderer = new InRenderer();
      inRenderer.render("{AD_UNIT_TARGET_ELEMENT_ID}", bid);
    },
  },
};
```

次に、`{AD_UNIT_TARGET_ELEMENT_ID}`を広告をレンダリングする`div`タグの ID に置換します。

例えば下記のような`div`タグがあったとして:

```html
<div id="ad-unit-1"></div>
```

次のような形に`{AD_UNIT_TARGET_ELEMENT_ID}`を置換します。

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
      inRenderer.render("ad-unit-1", bid); // `ad-unit-1`に置換された
    },
  },
};
```

これで統合は完了です。

### マルチフォーマット広告枠として広告ユニットを定義する

InRenderer.js の効果を最大限にするためには、広告ユニットをマルチフォーマットにする必要があります。簡単な例を紹介しますが、詳しく知りたい場合は[Prebid.js マルチフォーマットドキュメント](https://docs.prebid.org/dev-docs/show-multi-format-ads.html)を参照してください。

先ほど用意した広告ユニットを下記のように変更します。ここで設定されている`video`には、InRenderer.js の動画プレイヤーが対応できる最大限の`protocols`と、`api`が設定されています。
また、`context`を`outstream`にすることも忘れないでください。これは、インレンダラー統合ということを示す重要な設定です。

```js
var adUnit = {
  code: "ad-unit-1",
  mediaTypes: {
    banner: {
      sizes: [[300, 250]],
    },
    // 追加された
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

これで、マルチフォーマット広告枠として広告枠が定義されました。

### ネイティブ広告を広告枠に追加する

広告枠の収益を最大化にするために、広告枠にネイティブフォーマットを追加します。InRenderer.js では Prebid.js の[最新のネイティブ広告実装ドキュメント](https://docs.prebid.org/prebid/native-implementation.html)をサポートしているので、実装時はそちらを参照してください。
ただし、広告サーバー側でネイティブテンプレートを定義するわけではなく、`native.adTemplate`を使用した構成のみサポートしていることに注意してください。

> InRenderer.js では、スタイル継続性とインレンダラー統合の性質から、ネイティブ広告の描画では内部的に iframe を生成しません。この動作について問題や意見がある場合は[リポジトリ](https://github.com/hogekai/in-renderer-js)の issue から報告してください。

簡単な画像実装例:

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

#### ネイティブ動画広告をサポートする

InRenderer.js は独自の方法でネイティブフォーマットの動画アセットをサポートしています。動画を表示するには特定の属性を含んだ動画コンテナを用意する必要があり、下記のようなタグを広告テンプレートに設定します。

```html
<div
  class="in-renderer-native-video"
  data-asset-id="1"
  data-player-width="320"
  data-player-height="180"
></div>
```

#### 動画コンテナの属性

| 属性名             | 型     | 必須 | 説明                             |
| ------------------ | ------ | ---- | -------------------------------- |
| class              | string | ✓    | `in-renderer-native-video`を設定 |
| data-asset-id      | string | ✓    | 動画アセットの ID                |
| data-player-width  | number | ✓    | プレーヤーの幅（ピクセル）       |
| data-player-height | number | ✓    | プレーヤーの高さ（ピクセル）     |

> プレイヤーサイズはレスポンシブに調整されます。設定された幅・高さを最大値として、アスペクト比を維持したまま縮小していきます。

ネイティブ動画アセットを広告ユニットに含むには、下記のような形にします。

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

Prebid.js は同じフォーマットを一つの広告ユニットに複数含ませることはできません。
動画アセットと画像アセットを同じ広告ユニットに設定するには、同じ`code`の広告ユニットを二つ用意し、一つ目に画像、二つ目に動画を含ませるのような形で実装します。

下記のような形になります:

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
  // 追加された
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

### 特定のフォーマットだけを描画する

InRenderer.js では、動画広告とネイティブ広告の描画に特化したエントリーポイントが用意されています。特定のユースケースでは、動画のみ描画したいなどの必要が出てくる場合があると思います。[Prebid.js レンダラードキュメント](https://docs.prebid.org/dev-docs/show-outstream-video-ads.html)における mediaTypes ごとの renderer 設定と、マルチエントリーポイントを活用します。

| URL                                                                                   | クラス           | 説明                           |
| ------------------------------------------------------------------------------------- | ---------------- | ------------------------------ |
| https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-renderer.umd.min.js        | InRenderer       | バナー・動画・ネイティブの描画 |
| https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-video-renderer.umd.min.js  | InVideoRenderer  | 動画の描画                     |
| https://cdn.jsdelivr.net/npm/in-renderer-js@latest/dist/in-native-renderer.umd.min.js | InNativeRenderer | ネイティブの描画               |

下記が例です:

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

### オプション

InRenderer.js では、広告の描画に関するオプションをいくつか用意しています。

#### 視認可能なインプレッションを追跡する

InRenderer.js では、フォーマットごとの MRC 定義に則った視認可能なインプレッションを追跡するイベントを用意しています。`onImpressionViewable`で追跡できます。

```js
var inRenderer = new InRenderer();
inRenderer.render("ad-unit-1", bid, {
  onImpressionViewable: () => {
    console.log("impression viewable");
    pbjs.triggerBilling(bid);
  },
});
```

#### ベンダーロゴを設定する

入札アダプターのレンダラーに InRenderer.js を使用する場合、ベンダーロゴを設定することが出来ます。

- `logo.imageUrl`: ロゴの URL
- `logo.clickUrl`: クリック先 URL

```js
var inRenderer = new InRenderer();
inRenderer.render("ad-unit-1", bid, {
  logo: {
    imageUrl: "https://example.com/imageUrl",
    clickUrl: "https://example.com/clickUrl",
  },
});
```

#### バナー広告にクリックスローを設定する

InRenderer.js では、クリックスローマクロをサポートしています。クリックスローマクロについては[こちら](https://docs.prebid.org/dev-docs/publisher-api-reference/renderAd.html)をご覧ください。

- `clickThrough`

```js
var inRenderer = new InRenderer();
inRenderer.render("ad-unit-1", bid, {
  clickThrough: "https://example.com/clickThrough",
});
```

## 開発者から

最近、Webのアドテクノロジーでオープンソースコミュニティが停滞していると感じています。様々な要因があると思いますが、私はこの状況をよしとはしたくありません。これから小規模から大規模まで、様々なモダンなソリューションを開発し、この業界を盛り上げたいと考えています。

もし、私のこれからの開発に興味があり、アドバイスやフィードバック、実施のテストに協力してくださる方がいれば、私に連絡してください。

Linked in: https://www.linkedin.com/in/kai-miyamoto-87393732b/
