/** @todo: get this in manifests (Safari) */
if (location.href.includes('facebook.com') || location.href.includes('messenger.com')) {
  // change a single image
  var change = function(node) {
    // class for large emoji's is '_1ifu'
    // class for huge emoji's in '_19_r'
    // fixes #4
    var large = node.classList.contains('_1ifu');
    var huge = node.classList.contains('_19_r');
    // the filename of the png is also the codepoint
    node.outerHTML = '<span style="font-family: "Apple Color Emoji";font-size:'+(large?'2rem;':(huge?'3rem;':'1rem;'))+'">&#x' + node.src.match(/(?!\/)[a-f0-9]+(?=\.png)/)[0] + ';</span>';
  }

  // find all emojis
  var changeAll = function() {
    var emojis = document.querySelectorAll('img[src*="emoji.php"]');
    for (var i = 0; i < emojis.length; i++) {
      change(emojis[i]);
    }
  }

  // observe function
  var observer = new MutationObserver(function(mutations) {
    // loop over all mutations
    mutations.forEach(function(mutation) {
      try {
        var added = mutation.addedNodes;
        if (added) {
          // go over all DOM changes
          for (var i = 0; i < added.length; i++) {
            // check if it has a source
            if (typeof added[i].src != 'undefined') {
              // check if it's an evil emoji
              if (added[i].src.includes('emoji.php')) {
                // replace it
                change(added[i]);
              }
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    });
  });

  // change all of them when loaded
  window.addEventListener('DOMContentLoaded', function() {
    // change once at the start
    changeAll();

    // change every 500ms because it's cool to
    setInterval(function(){
      changeAll();
    },500);

    // fancy way that isn't done
    //
    // observer on the body only for the childList
    // observer.observe(document.body, {
    //   childList: true
    // });
  });
}
