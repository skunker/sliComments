(function($){
window.addEvent('domready', function(){
	var comments_section = $('comments_section'),
		article_id = comments_section.getElement('form input[name=article_id]');


	if (!article_id) return;

	var comments_list = $('comments_list'),
		comments_counter = $('comments_counter'),
		comments_per_page = comments_list.getChildren('li.comment').length,
		position = comments_section.getElement('form').get('data-position'),
		lastCommentTime = comments_list[position == 'top' ? 'getFirst' : 'getLast']().getElement('.metadata .created').get('data-created'),
		buffer = [],
		chain = new Chain,

		request = new Request({
			url: 'index.php?option=com_slicomments&task=comments.live&article_id='+article_id.get('value'),
			format: 'raw',
			method: 'get',
			onSuccess: function(html){
				if (request.status == 200){
					var temp = new Element('ul', {html: html}),
						comments = temp.getChildren('li.comment');
					buffer.append(Array.prototype.slice.call(position == 'top' ? comments.reverse() : comments));
					lastCommentTime = buffer.getLast().getElement('.metadata .created').get('data-created');
					if (!autoUpdate) {
						liveCommentsInfo.show();
						liveCommentsCounter.set('html', (buffer.length).toString());
					} else if (!autoUpdateTimer) {
						activateAutoUpdate();
					}
				}
			},
			onFailure: function(xhr){
				if (xhr.status == 400){
					console.log(xhr.responseText);
				}
				// Don't try again
				clearInterval(requestTimer);
			}
		}),

		cc = comments_counter.get('html'), // Total number of comments
		autoUpdate = false,
		autoUpdateTimer,
		liveCommentsDisable = $('live-comments-disable'),
		liveCommentsInfo = $('live-comments-info'),
		liveCommentsCounter = liveCommentsInfo.getElement('strong'),
		isRunning = false,


		/**
		 * Inject in the list the latest comments necessary to fill a page.
		 * Activated when the user click on "show them"
		 */
		showComments = function(e){
			if (e){
				e.stop();
				liveCommentsInfo.dissolve();
			}
			if (!check(e)) return;
			// Get the latest comments but only the necessary to fill a page
			var comments = buffer.slice(comments_per_page * -1);
			// Clean the buffer
			buffer = [];
			// Inject the comments in the list, one at a time, with a interval of half a second beteween them.
			isRunning = true;
			var timer = (function(){
				if (!comments.length) {
					isRunning = false;
					clearInterval(timer);
					chain.callChain();
					return;
				}
				insertComment(comments.shift())
			}).periodical(500);
		},

		check = function(){
			if (!isRunning) return true;
			chain.chain(showComments.pass(arguments, this));
			return false;
		},

		/**
		 *
		 */
		autoShowComments = function(){
			if (buffer.length){
				insertComment(buffer.shift())
			} else {
				clearInterval(autoUpdateTimer);
				autoUpdateTimer = false;
			}
		},

		func = position == 'top' ? 'getLast' : 'getFirst',
		insertComment = function(comment){
			comments_counter.set('text', ++cc)
			comment.setStyle('opacity', 0)
				.inject(comments_list, position)
				.fade();
			comments_list[func]().nix(true);
		},

		/**
		 *
		 */
		activateAutoUpdate = function(e){
			if (e) {
				e.stop();
				liveCommentsInfo.hide();
				liveCommentsDisable.show();
			}
			autoUpdate = true;
			autoUpdateTimer = autoShowComments.periodical(1500)
		},

		/**
		 *
		 */
		disableAutoUpdate = function(e){
			e.stop();
			liveCommentsDisable.hide();
			showComments(); // Show the comments to clear the buffer
			autoUpdate = false;
			if (autoUpdateTimer) clearInterval(autoUpdateTimer);
		},

		requestTimer = (function(){
			request.send({
				data: {
					lt: lastCommentTime
				}
			});
		}).periodical(10000);

	// Add events
	liveCommentsDisable.getElement('a').addEvent('click', disableAutoUpdate);
	liveCommentsInfo.getElement('a.update_comments').addEvent('click', activateAutoUpdate);
	liveCommentsInfo.getElement('a.show_comments').addEvent('click', showComments);
});
})(document.id);