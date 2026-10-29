# Elemental Spotlight

When an author hovers a block in the Silverstripe CMS, the preview panel
scrolls to that block and highlights it, so they can see which block they're
about to edit.

Works with [Silverstripe Elemental](https://github.com/silverstripe/silverstripe-elemental) 6.2
and the CMS's own preview panel. Nothing to configure, and nothing is added to
the live site for visitors.

## Install

```bash
composer require toastnz/elemental-spotlight
vendor/bin/sake flush
```

Until the module is on Packagist, add its repository to your `composer.json` first:

```json
"repositories": [
    { "type": "vcs", "url": "git@github.com:toastnz/elemental-spotlight.git" }
]
```

Open a page with blocks in the CMS with the preview panel showing, and hover a
block in the list.

## Styling the highlight

The block is given a plain outline and keyboard focus. If your site styles
`:focus-visible`, that is what shows. To keep the built-in outline but change
it:

```css
:root {
  --spotlight-colour: #3b9dff;
  --spotlight-width: 2px;
}
```

Leaving the list removes the highlight but leaves the page where it is, so an
author can hover a block and then go and look at it.

## How it works

The CMS and the preview are two windows, so there are two small scripts that
talk with `postMessage`.

- **In the CMS**, the block list tells the preview which block the pointer is
  over. It needs the block's anchor, which `ElementAnchorExtension` adds to the
  block data elemental already sends to the editor.
- **In the preview**, a script scrolls to that anchor and marks the block. It is
  only requested on a `?CMSPreview=1` page, so a visitor never downloads it,
  and it ignores any message that is not from its own origin and in the expected shape.

It scrolls to the anchor elemental already renders as the block's `id`, so it
works with any block template.

## Developing

```bash
npm install
npm run build    # lint, then build into client/dist
npm run watch
```

`client/dist` is committed, so installing the module needs no node. When
developing it as a composer `path` repository, expose its assets from the
project:

```json
"extra": {
    "expose": ["vendor/toastnz/elemental-spotlight/client/dist"]
}
```
