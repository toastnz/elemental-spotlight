const SOURCE = 'elemental-spotlight';
const FOCUS_CLASS = 'spotlight-focus';

// Carried here rather than in a stylesheet so the module has one thing to put
// on the page and no opinion about how a project loads its CSS. An outline is
// deliberate: a border would take up room and move the block it is marking.
//
// This is a floor, not a house style. The block is given focus as well, so a
// site with a focus style of its own already draws its own ring, and one plain
// class selector is beaten by any :focus-visible rule - which is the way round
// it should be, since the site's own marker is the one that belongs on it.
const STYLES = `
  .${FOCUS_CLASS} {
    outline: var(--spotlight-width, 2px) solid var(--spotlight-colour, #3b9dff);
    outline-offset: calc(var(--spotlight-width, 2px) * -1);
    transition: outline-color .2s ease;
  }
`;

/**
 * Lights up the block the author is hovering over in the CMS.
 *
 * Runs only inside the preview frame, and only on messages from the CMS window
 * that sent it - a page in a frame can be framed by anyone, so both the origin
 * and the shape of the message are checked before anything is acted on.
 */
class Spotlight {
    constructor() {
        this.focused = null;

        const styles = document.createElement('style');
        styles.textContent = STYLES;
        document.head.appendChild(styles);

        window.addEventListener('message', (event) => this.receive(event));
    }

    receive(event) {
        const message = event.data;

        if (event.origin !== window.location.origin) {
            return;
        }

        if (!message || message.source !== SOURCE) {
            return;
        }

        if (message.action === 'focus') {
            this.focus(message.anchor);
        }

        if (message.action === 'blur') {
            this.blur();
        }
    }

    focus(anchor) {
        const block = anchor && document.getElementById(anchor);

        if (!block || block === this.focused) {
            return;
        }

        this.blur();

        this.focused = block;
        block.classList.add(FOCUS_CLASS);

        // The site's own helper moves focus as well as scrolling, which is
        // what draws the site's own marker on the block. Falling back to
        // scrollIntoView keeps this working where there is no such helper; a
        // block taller than the window is scrolled to its top rather than its
        // middle, or its heading ends up above the fold.
        if (typeof window.scrollToElementByID === 'function') {
            window.scrollToElementByID(anchor);
        } else {
            block.scrollIntoView({
                behavior: 'smooth',
                block: block.clientHeight > window.innerHeight ? 'start' : 'center',
            });
        }
    }

    blur() {
        if (!this.focused) {
            return;
        }

        // Focus is what a site's own marker hangs off, and it outlives the
        // pointer: without this the block the author hovered a minute ago is
        // still ringed. The page is left where it is rather than scrolled back,
        // so an author can hover a block and then go and look at it.
        if (this.focused.contains(document.activeElement)) {
            document.activeElement.blur();
        }

        this.focused.classList.remove(FOCUS_CLASS);
        this.focused = null;
    }
}

// Only in a preview. Opening the same URL in a tab of its own leaves the page
// exactly as a visitor sees it.
if (window.self !== window.top) {
    new Spotlight();
}
