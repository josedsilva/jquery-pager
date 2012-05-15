/**
* JQuery Plugin code generated from http://starter.pixelgraphics.us/
* @description JQuery pager.
* @author jose.dsilva@bombayworks.se
*
* @params
* total (integer) Total number of results/hits.
* pageHits (integer) Hits per page (how many results to show on a page).
* pageBatch (integer) Pages per batch (generates the page navigator).
* 
* @usage $('#pager').pager(200, 20, 10, {
			showSynopsis: false,
			initialPage: 2,
			onPageChange: function(event, page, pages) {
				alert("Page change event handler:\n"+'Current page: '+page+"\nTotal pages:"+pages);
			}
		 });
*/
(function($){
    $.pager = function(el, total, pageHits, pageBatch, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
		// create the 'data' object to store global variables.
        base.$el.data("pager", base);
        
        base.init = function(){
            if( typeof( total ) === "undefined" || total === null ) total = 0;
            if( typeof( pageHits ) === "undefined" || pageHits === null ) pageHits = 20;
            if( typeof( pageBatch ) === "undefined" || pageBatch === null ) pageBatch = 10;
            
            base.total = total;
            base.pageHits = pageHits;
            base.pageBatch = pageBatch;
            
            base.options = $.extend({},$.pager.defaultOptions, options);
            
            // Put your initialization code here
			base.pages = Math.ceil(base.total/base.pageHits); // how many pages?
			base.currentPage = base.options.initialPage; // which page to show?
			base.currentPageObject=null; //last page object (i.e. table-body) shown.
			
			base.cloneControls = new Array();
			for(x in base.options.cloneControls) {
				var $el = $('#'+base.options.cloneControls[x]);
				var $controls = $el.children(base.options.controlsSelector);
				var $synopsis = $el.children(base.options.synopsisSelector);
				base.cloneControls[x] = {
					$el : $el,
					controls: {
						el: $controls,
						prev: $controls.children(base.options.prevControlSelector),
						next: $controls.children(base.options.nextControlSelector),
						pages: $controls.children(base.options.pagesControlSelector)
					},
					synopsis: {
						el: $synopsis,
						hitIndexLow: $synopsis.children(base.options.hitIndexLowSelector),
						hitIndexHigh: $synopsis.children(base.options.hitIndexHighSelector),
						totalHits: $synopsis.children(base.options.totalHitsSelector)
					}
				};
				
				// bind events to slave controls.
				base.cloneControls[x].controls.prev.bind('click', function(event) {
					base.controls.prev.trigger('click');
					event.preventDefault();
				});
				
				base.cloneControls[x].controls.next.bind('click', function(event) {
					base.controls.next.trigger('click');
					event.preventDefault();
				});
				
				base.cloneControls[x].controls.pages.delegate('a', 'click', function(event) {
					var id = $(this).attr('id');
					base.controls.pages.children("a#"+id).trigger('click');
					event.preventDefault();
				});
			} //end for
			
			var $controls = base.$el.children(base.options.controlsSelector);
			base.controls = {
				el: $controls,
				prev: $controls.children(base.options.prevControlSelector),
				next: $controls.children(base.options.nextControlSelector),
				pages: $controls.children(base.options.pagesControlSelector)
			};
			
			// bind events on the controls.
			base.controls.prev.bind('click', function(event) {
				showPreviousPage();
				event.preventDefault();
			});
			
			base.controls.next.bind('click', function(event) {
				showNextPage();
				event.preventDefault();
			});
			
			base.controls.pages.delegate('a', 'click', function(event) {
				var id = $(this).attr('id');
				showPage(id);
				event.preventDefault();
			});
			
			var $synopsis = base.$el.children(base.options.synopsisSelector);
			base.synopsis = {
				hitIndexLow: $synopsis.children(base.options.hitIndexLowSelector),
				hitIndexHigh: $synopsis.children(base.options.hitIndexHighSelector),
				totalHits: $synopsis.children(base.options.totalHitsSelector)
			};
			
			if(! base.options.showSynopsis) {
				$synopsis.hide();
				for(x in base.cloneControls) {
					base.cloneControls[x].synopsis.el.hide();
				}
			}
			
			// bind events to event handlers.
			base.$el.bind('onInit', base.options.onInit);
			base.$el.bind('onPageChange', base.options.onPageChange);
			base.$el.bind('beforePageChange', base.options.beforePageChange);
			
			base.$el.trigger('onInit', [base.currentPage, base.pages]);
			showPage(base.currentPage);
        };
		
		// helper functions
		function isFirstPage() {
			return (base.currentPage==1);
		};
			
		function isLastPage() {
			return (base.currentPage==base.pages);
		};
			
		function countPages() {
			return base.pages;
		};
			
		function getHitIndexLow() {
			var h1 = base.pageHits * (parseInt(base.currentPage)-1) + 1;
			return h1;
		};
			
		function setHitIndexLow() {
			var hil = getHitIndexLow();
			base.synopsis.hitIndexLow.html(hil);
			for(x in base.cloneControls) {
				base.cloneControls[x].synopsis.hitIndexLow.html(hil);
			}
		};
			
		function getHitIndexHigh() {
			var h2 = base.currentPage * base.pageHits;
			if(h2 > base.total)
				h2 = base.total;
			return h2;
		};

		function setHitIndexHigh() {
			var hih = getHitIndexHigh();
			base.synopsis.hitIndexHigh.html(hih);
			for(x in base.cloneControls) {
				base.cloneControls[x].synopsis.hitIndexHigh.html(hih);
			}
		};
			
		function setTotalHits() {
			var th = base.total;
			base.synopsis.totalHits.html(th);
			for(x in base.cloneControls) {
				base.cloneControls[x].synopsis.totalHits.html(th);
			}
		};
			
		function setSynopsis() {
			setHitIndexLow();
			setHitIndexHigh();
			setTotalHits();
		};
			
		function setNavigation() {
			// show previous
			var visibility = isFirstPage() ? 'hidden' : 'visible';
			base.controls.prev.css('visibility', visibility);
			for(x in base.cloneControls) {
				base.cloneControls[x].controls.prev.css('visibility', visibility);
			}
			
			// show next
			visibility = isLastPage() ? 'hidden' : 'visible';
			base.controls.next.css('visibility', visibility);
			for(x in base.cloneControls) {
				base.cloneControls[x].controls.next.css('visibility', visibility);
			}
			
			// show pages
			var html = getPagesHTML();
			base.controls.pages.html(html);
			for(x in base.cloneControls) {
				base.cloneControls[x].controls.pages.html(html);
			}
		};
			
		function getPagesHTML() {
			var currentPageBatch = Math.ceil(base.currentPage/base.pageBatch);
			var pbHighMax = currentPageBatch * base.pageBatch;
			var pbLow = parseInt(pbHighMax) - parseInt(base.pageBatch) + 1;
			var pbHigh = Math.min(pbHighMax, base.pages);
			
			var a = new Array();
			if(base.currentPage > base.pageBatch) {
				a[0] = '<a href="" class="control" id="1">1</a>' + '<a href="" class="control" id="' + (parseInt(base.currentPage)-1) + '">...</a>';
			}
			
			var index=1;
			for(var i=pbLow; i<=pbHigh; ++i) {
				a[index++] = '<a href="" id="' + i + '" class="control ' + (i==base.currentPage?base.options.activePageClass:'') + '">' + i + '</a>';
			}
			
			if(pbHigh < base.pages) {
				a[index] = '<a href="" class="control" id="' + (parseInt(pbHigh)+1) + '">...</a>' + '<a href="" class="control" id="' + base.pages + '">' + base.pages + '</a>';
			}
			
			return a.join(' ');
		};
			
		function showPage(whichPage) {
			base.$el.trigger('beforePageChange', [whichPage, base.currentPage, base.pages]);
			
			if(base.currentPageObject != null)
				base.currentPageObject.css('display', 'none');
				
			setPage(whichPage);
			
			if(base.options.showSynopsis) {
				// show synopsis
				setSynopsis();
			}
			
			// show page navigation
			setNavigation();
			
			// show hits
			base.currentPageObject.css('display', ($.browser.msie)?'block':'table-row-group');
			
			base.$el.trigger('onPageChange', [whichPage, base.pages]);
		};
			
		function setPage(page) {
			base.currentPage = page;
			base.currentPageObject = $('#page'+page);
		};
			
		function showPreviousPage() {
			if(base.currentPage > 1) {
				showPage( (parseInt(base.currentPage)-1) );
			}
		};
			
		function showNextPage() {
			if(base.currentPage < base.pages) {
				showPage( (parseInt(base.currentPage)+1) );
			}
		};
        
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        // 
        // };
		
		base.getCurrentPage = function() {
			return base.currentPage;
		};
		
		base.showPage = function(page) {
			showPage(page);
			return this.data("pager");
		};
        
        // Run initializer
        base.init();
    };
    
    $.pager.defaultOptions = {
		initialPage: 1,
        controlsSelector: '.controls',
        prevControlSelector: '.prev',
        nextControlSelector: '.next',
        pagesControlSelector: '.pages',
        activePageClass: 'active',
        synopsisSelector: '.synopsis',
        hitIndexLowSelector: '.hit-index-low',
        hitIndexHighSelector: '.hit-index-high',
        totalHitsSelector: '.total-hits',
        showSynopsis: true,
		cloneControls: [],
		onInit: function(event, page, pages) {},
        onPageChange: function(event, page, pages) {},
        beforePageChange: function(event, page, prevPage, pages) {}
    };
    
    $.fn.pager = function(total, pageHits, pageBatch, options){
        return this.each(function(){
            (new $.pager(this, total, pageHits, pageBatch, options));
        });
    };
    
    // This function breaks the chain, but returns
    // the pager if it has been attached to the object.
    $.fn.getpager = function(){
        return this.data("pager");
    };
    
})(jQuery);
