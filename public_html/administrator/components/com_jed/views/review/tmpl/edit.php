<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Include the component HTML helpers.
JHtml::addIncludePath(JPATH_COMPONENT . '/helpers/html');

JHtml::_('behavior.formvalidator');
JHtml::_('formbehavior.chosen', 'select');

JFactory::getDocument()->addScriptDeclaration("
	Joomla.submitbutton = function(task)
	{
		if (task == 'review.cancel' || document.formvalidator.isValid(document.getElementById('review-form')))
		{
			Joomla.submitform(task, document.getElementById('review-form'));
		}
	};
");
?>

<form action="<?php echo JRoute::_('index.php?option=com_jed&layout=edit&id=' . (int) $this->item->id); ?>" method="post" name="adminForm" id="review-form" class="form-validate form-horizontal">
    <fieldset>
		<?php echo $this->form->renderField('published'); ?>
    </fieldset>
    <input type="hidden" name="task" value=""/>
	<?php echo JHtml::_('form.token'); ?>
</form>

<p>@TODO review content</p>