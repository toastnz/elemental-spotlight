<?php

namespace Toast\Spotlight\Extensions;

use SilverStripe\Core\Extension;

/**
 * Tells the CMS where each block ended up on the page.
 *
 * The block list in the CMS knows a block by its id; the page knows it by its
 * anchor, which elemental builds from the block's title and which is what the
 * block is rendered with as its `id` attribute. Neither can work out the other,
 * so the anchor travels with the rest of the block's data to the editor and the
 * CMS has both.
 *
 * The block schema is elemental's own channel for this - whatever is put here
 * arrives as a property of the block in the editor.
 */
class ElementAnchorExtension extends Extension
{
    protected function updateBlockSchema(array &$blockSchema): void
    {
        $blockSchema['anchor'] = $this->owner->getAnchor();
    }
}
