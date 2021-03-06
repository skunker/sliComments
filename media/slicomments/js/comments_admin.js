window.addEvent('domready', function(){
	var form = document.id('adminForm');
	var editComment = function(event, clicked){
		event.stop();
		var td = this.get('tag') == 'td' ? this : this.getParent('td');
		if (td.hasClass('editing')) return;
		td.addClass('editing');
		var span = td.getElement('.text');
		var text = span.get('text');
		span.setStyle('display', 'none');
		var textarea = new Element('textarea', {'html': text.trim(), 'class': 'edit'}).inject(td);
		var dt = new DynamicTextarea(textarea, {'offset': 10});
		textarea.setStyle('padding', 5);
		dt.getLineHeight();
		dt.checkSize(true)
		new Element('div', {'class': 'comments-post'}).adopt(
			new Element('a', {'text': 'Cancel', 'href':'#', 'class': 'cancel-button'}),
			new Element('span', {'text': ' or '}),
			new Element('input', {'type': 'button', 'value': 'save', 'class': 'save-button'})
		).inject(td);
	};
	form.addEvent('dblclick:relay(.text)', editComment);
	form.addEvent('click:relay(.edit-comment)', editComment);

	form.addEvent('click:relay(.cancel-button)', function(event, clicked){
		var td = this.getParent('td');
		td.removeClass('editing');
		td.getElement('.text').setStyle('display', 'block');
		td.getElement('textarea').destroy();
		td.getElement('.comments-post').destroy();
		td.getElement('div').destroy();
		event.stop();
	});

	form.addEvent('click:relay(.save-button)', function(event, clicked){
		var td = this.getParent('td');
		var textarea = td.getElement('textarea');
		var data = {
			id: td.getParent('tr').getElement('input[type=checkbox]').get('value'),
			text: textarea.get('value'),
		};
		var token = form.getElements('input[type=hidden]').filter(function(e){
				return e.get('name').match(/[a-z0-9]{32}/i) && e.get('value') == '1';
		})[0].get('name');
		data[token] = 1;
		new Request({
			url: 'index.php?option=com_slicomments&task=comments.edit',
			format: 'raw',
			data: data,
			onSuccess: function(response){
				console.log(response);
				td.removeClass('editing');
				td.getElement('.text')
					.set('html', response)
					.setStyle('display', 'block');
				textarea.getParent('div').destroy();
				td.getElement('.comments-post').destroy();
			},
			onFailure: function(xhr){
				alert(xhr.responseText);
			}
		}).send();
	});
});