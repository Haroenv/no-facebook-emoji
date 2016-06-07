if (location.href.includes('facebook.com') || location.href.includes('messenger.com')) {
  // change a single image
  var change = function(node) {
    console.log(node);
    node.outerHTML = '<span>' + '&#x' + node.src.match(/(?!\/)[a-f0-9]+(?=\.png)/)[0] + ';' + '</span>';
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
          // go over all dom changes
          for (var i = 0; i < added.length; i++) {
            // check if it has a src
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

      }
    });
  });

  // change all of them when loaded
  window.addEventListener('DOMContentLoaded', function() {
    changeAll();
    setTimeout(function(){
      console.log("changing");
      changeAll();
    },500);
    // observator on the body for just the childList
    //
    // fancy way that isn't done
    //
    // observer.observe(document.body, {
    //   childList: true
    // });
  });

}
