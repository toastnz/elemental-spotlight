<?php

namespace Toast\Spotlight\Extensions;

use SilverStripe\Core\Extension;
use SilverStripe\View\Requirements;

/**
 * Puts the listener on the page, but only when the page is being previewed.
 *
 * The CMS asks for its preview with ?CMSPreview=1, and that is the only time
 * this script has anything to do - so a real visitor never downloads it. The
 * script itself checks that it is in a frame before it does anything, which
 * covers the case of someone opening a preview URL directly in a tab.
 *
 * It brings its own styles rather than requiring a stylesheet, so that nothing
 * here has to fit in with how a given project loads its CSS.
 */
class PreviewRequirementsExtension extends Extension
{
    protected function onAfterInit(): void
    {
        $request = $this->owner->getRequest();

        if (!$request || $request->getVar('CMSPreview') === null) {
            return;
        }

        Requirements::javascript('toastnz/elemental-spotlight:client/dist/js/preview.js');
    }
}
