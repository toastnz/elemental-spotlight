# Elemental Spotlight

Hovering a block in the CMS scrolls the preview to it and lights it up, so an
author can see which block they are about to edit before they open it.

Nothing to configure. Install it, build the assets, and the block list behaves
this way on every page with a preview open.

## How the two halves talk

The CMS and the page it is previewing are two windows, so this is two scripts
and a `postMessage` between them.

**In the CMS**, `client/src/js/cms.js` transforms elemental's `ElementList`
through `Injector`. The list is the right place rather than the individual
block: it is handed every block's data, which is the only way to turn the
`element-61` in the DOM into the anchor the page rendered that block with.

It adds nothing to the DOM. One listener on the document reads which block the
pointer is over, which leaves elemental's own markup - and its drag and drop,
which is particular about the shape of the list - exactly as it was.

**In the page**, `client/src/js/preview.js` listens for those messages, scrolls
to the block and marks it. It only runs inside a frame, and it checks both the
origin of the message and that the message is one of ours before acting on it: a
page in a frame can be framed by anybody.

## Where the anchor comes from

The CMS knows a block by its id and the page knows it by its anchor, which
elemental builds from the block's title and renders as the block's `id`
attribute. Neither can work out the other, so `ElementAnchorExtension` puts the
anchor into the block schema - elemental's own channel to the editor - and the
CMS ends up with both.

That is also why nothing here needs a template of its own. It scrolls to the
anchor elemental already renders, so a project that has replaced
`ElementHolder.ss` is no different.

## What the highlight looks like

The block is given focus as well as being marked, so on a site that styles
`:focus-visible` the marker is the site's own, in the site's own colours.

The module carries a plain outline of its own for a site that doesn't. It is
deliberately a floor and not a house style: one class selector loses to any
`:focus-visible` rule, which is the way round it should be. Two custom
properties are there if you want to keep it but change it:

```css
:root {
  --spotlight-colour: #3b9dff;
  --spotlight-width: 2px;
}
```

Focus outlives the pointer, so leaving the list drops the focus as well as the
mark - otherwise the block an author hovered a minute ago would still be ringed.
The page is left where it is rather than scrolled back, so an author can hover a
block and then go and look at it.

## Weight on the site

None. The preview script is required only on a request the CMS makes for its
preview, which it marks with `?CMSPreview=1`, so a visitor never downloads it.
It brings its own styles rather than requiring a stylesheet, so nothing here has
to fit in with how a project loads its CSS.

## Installation

```bash
composer require toastnz/elemental-spotlight
vendor/bin/sake flush
```

## Local development

Installed from a composer `path` repository, the module's `client/dist` has to
be exposed from the project rather than by the module - see the same section in
the `toastnz/elemental-flavours` README for why:

```json
"extra": {
    "expose": [
        "vendor/toastnz/elemental-spotlight/client/dist"
    ]
}
```

To change the scripts:

```bash
npm install
npm run build    # lint, then a production build into client/dist
npm run watch
```

`client/dist` is committed, so a project installing the module never needs
node.
