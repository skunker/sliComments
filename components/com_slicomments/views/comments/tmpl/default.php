<?php
// no direct access
defined('_JEXEC') or die;

if (($enabled = $this->params->get('enabled', true)) || $this->total > 0) :
require_once JPATH_ADMINISTRATOR.'/components/com_slicomments/helpers/comments.php';
JHtml::_('behavior.framework', true);
JHtml::_('stylesheet', 'slicomments/style.css', array(), true);
$user = JFactory::getUser();
$form_position = $this->params->get('form_position', 'before');
JHtml::_('script', 'slicomments/slicomments.js', true, true);
/*if ($this->params->get('livecomments', false))*/ JHtml::_('script', 'slicomments/livecomments.js', true, true);
?>
<div id="comments_section" class="no-js">
	<h4><?php echo JText::sprintf('COM_COMMENTS_COMMENTS_COUNT', '<span id="comments_counter" >'.$this->total.'</span>'); ?></h4>
	<?php if ($form_position == 'before' && $enabled) echo $this->loadTemplate('form'); ?>
	<?php /*if ($this->params->get('livecomments', false))*/; ?>
	<div id="live-comments-info"><?php echo JText::sprintf('COM_COMMENTS_LIVE_COMMENTS_NEW', '<strong>0</strong>', 
	'<a href="#" class="show_comments">'.JText::_('COM_COMMENTS_LIVE_COMMENTS_SHOW').'</a>',
	'<a href="#" class="update_comments">'.JText::_('COM_COMMENTS_LIVE_COMMENTS_UPDATE').'</a>');?></div>
	<div id="live-comments-disable"><a href="#"><?php echo JText::_('COM_COMMENTS_LIVE_COMMENTS_DISABLE'); ?></a></div>
	<?php /*endif;*/ ?>
	<ul id="comments_list" class="comment-list">
	<?php
	foreach ($this->items as $comment) {
		$this->partial('comment', $comment);
	}
	?>
	</ul>
	<?php if ($form_position == 'after' && $enabled) echo $this->loadTemplate('form'); ?>
	<?php if ($this->params->get('limit', 20) > 0): ?>
	<div id="pagination" class="clr">
		<div class="pagination">
			<?php echo $this->pagination->getPagesLinks(); ?>
		</div>
	</div>
	<?php endif; ?>
</div>
<?php endif; ?>
