import Injector from 'lib/Injector';
import SpotlightElementList from './SpotlightElementList';

const register = () => {
  Injector.transform('elemental-spotlight', (updater) => {
    updater.component('ElementList', SpotlightElementList, 'SpotlightElementList');
  });
};

// Transforms have to be in place before silverstripe/admin calls Injector.load()
// on window load, and the CMS may already have parsed this document by the time
// the script runs - in which case a DOMContentLoaded listener would never fire
// and the block list would go back to being an ordinary list.
if (window.document.readyState === 'loading') {
  window.document.addEventListener('DOMContentLoaded', register);
} else {
  register();
}
