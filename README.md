# jQuery pager
## pagination with javascript using jQuery.

```
$('#pager').pager(total_results, hits, pages [, options]);
```

### where:
total_results (int) Total number of results
hits (int) Maximum number of hits per page
pages (int) Number of pages to generate in the page navigation

### options:
initialPage (1) Which page to show initially
controlsSelector ('.controls') The selector that will contain the pagination controls
prevControlSelector ('.prev')
nextControlSelector ('.next')
pagesControlSelector ('.pages')
activePageClass ('active')
synopsisSelector ('.synopsis')
hitIndexLowSelector ('.hti-index-low')
hitIndexHighSelector ('.hit-index-high')
totalHitsSelector ('.total-hits')
showSynopsis (true)
cloneControls ([]) Array of selectors where controls will be cloned

### Events
onInit: function(event, current_page, total_pages){} When pager is initialized
onPageChange: function(event, current_page, total_pages) {} When page has changed
beforePageChange: function(event, target_page, current_page, total_pages){} Page is about to change


