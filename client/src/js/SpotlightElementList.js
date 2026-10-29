import React, { useCallback, useEffect, useMemo, useRef } from 'react';

// Long enough that running the pointer down the list doesn't drag the preview
// through every block on the way past, short enough to feel like a response.
const FOCUS_DELAY = 200;

// Longer on the way out: leaving one block usually means arriving at the next,
// and letting go of the highlight only to take it up again reads as a flicker.
const BLUR_DELAY = 400;

const SOURCE = 'elemental-spotlight';

/**
 * Hovering a block in the editor scrolls the preview to it and lights it up.
 *
 * The list is where this belongs rather than the individual block: it is handed
 * every block's data, which is the only place the id shown in the DOM can be
 * turned into the anchor the page rendered.
 *
 * Nothing is added to the DOM. One listener on the document reads which block
 * the pointer is over, which leaves elemental's own markup - and its drag and
 * drop, which is particular about the shape of the list - exactly as it was.
 */
const SpotlightElementList = (ElementListComponent) => {
  const Spotlight = (props) => {
    const timer = useRef(null);
    const anchor = useRef(null);

    // Block id as the DOM writes it, to the anchor the page rendered it with.
    const anchors = useMemo(() => {
      const map = new Map();

      (props.elements || []).forEach((element) => {
        const value = element && element.blockSchema && element.blockSchema.anchor;

        if (value) {
          map.set(`element-${element.id}`, value);
        }
      });

      return map;
    }, [props.elements]);

    const post = useCallback((message) => {
      // Looked up each time: the preview frame is replaced whenever the author
      // switches view mode, and a reference kept from last time is to a window
      // that no longer exists.
      const frame = Array.from(document.querySelectorAll('iframe'))
        .find((element) => element.src && element.src.includes('CMSPreview'));

      if (!frame || !frame.contentWindow) {
        return;
      }

      frame.contentWindow.postMessage({ source: SOURCE, ...message }, window.location.origin);
    }, []);

    const handleMove = useCallback((event) => {
      const row = event.target.closest && event.target.closest('.element-editor__element');
      const next = (row && anchors.get(row.id)) || null;

      if (next === anchor.current) {
        return;
      }

      anchor.current = next;
      window.clearTimeout(timer.current);

      timer.current = window.setTimeout(
        () => post(next ? { action: 'focus', anchor: next } : { action: 'blur' }),
        next ? FOCUS_DELAY : BLUR_DELAY
      );
    }, [anchors, post]);

    useEffect(() => {
      document.addEventListener('mouseover', handleMove);

      return () => {
        document.removeEventListener('mouseover', handleMove);
        window.clearTimeout(timer.current);
      };
    }, [handleMove]);

    return <ElementListComponent {...props} />;
  };

  Spotlight.displayName = 'SpotlightElementList';

  return Spotlight;
};

export default SpotlightElementList;
