<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;

/** @var JedViewReview $this */

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

<form action="<?php echo JRoute::_('index.php?option=com_jed&view=review&layout=edit&id=' . (int) $this->item->id); ?>" method="post" name="adminForm" id="review-form" class="form-validate form-horizontal">
    <fieldset>
		<?php echo $this->form->renderField('published'); ?>
    </fieldset>
    <input type="hidden" name="task" value=""/>
	<?php echo HTMLHelper::_('form.token'); ?>
</form>

<h3><?php echo Text::_('COM_JED_REVIEW_VIEW_EDIT_TITLE'); ?></h3>
<table class="table table-striped" id="reviewList">
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_TITLE'); ?></td>
        <td><?php echo $this->item->title; ?></td>
    </tr>
	<tr>
		<td><?php echo Text::_('COM_JED_REVIEWS_SCORE'); ?></td>
		<td>@TODO Overall Score Calculation</td>
	</tr>
	<tr>
		<td><?php echo Text::_('COM_JED_REVIEWS_COMMENTS'); ?></td>
		<td><?php echo $this->item->body; ?></td>
	</tr>
    <tr>
        <td><?php echo Text::_('JGLOBAL_FIELD_CREATED_LABEL'); ?></td>
        <td><?php echo HTMLHelper::_('date', $this->item->created_on, Text::_('COM_JED_DATETIME_FORMAT')) ?></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_AUTHOR'); ?></td>
        <td>
	        <a href="<?php echo 'index.php?option=com_users&task=user.edit&id=' . (int) $this->item->user_id; ?>" title="<?php echo $this->escape($this->item->username); ?>">
				<?php echo $this->escape($this->item->username); ?>
            </a>
        </td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_EXTENSION'); ?></td>
        <td><a href="<?php echo 'index.php?option=com_jed&task=extension.edit&id=' . (int) $this->item->extension_id; ?>" title="<?php echo $this->escape($this->item->extensionname); ?>">
		        <?php echo $this->escape($this->item->extensionname); ?>
            </a></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_EXTENSIONS_DEVELOPER'); ?></td>
        <td><a href="<?php echo 'index.php?option=com_users&task=user.edit&id=' . (int) $this->item->developer_id; ?>" title="<?php echo $this->escape($this->item->developer); ?>">
		        <?php echo $this->escape($this->item->developer); ?>
            </a></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_VERSION'); ?></td>
        <td><?php echo $this->item->version; ?></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_SCORE_FUNCTIONALITY'); ?></td>
        <td><?php echo $this->item->functionality; ?></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_COMMENTS_FUNCTIONALITY'); ?></td>
        <td><?php echo $this->item->functionalityComment; ?></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_SCORE_EASE_OF_USE'); ?></td>
        <td><?php echo $this->item->easeOfUse; ?></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_COMMENTS_EASE_OF_USE'); ?></td>
        <td><?php echo $this->item->easeOfUseComment; ?></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_SCORE_SUPPORT'); ?></td>
        <td><?php echo $this->item->support; ?></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_COMMENTS_SUPPORT'); ?></td>
        <td><?php echo $this->item->supportComment; ?></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_SCORE_DOCUMENTATION'); ?></td>
        <td><?php echo $this->item->documentation; ?></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_COMMENTS_DOCUMENTATION'); ?></td>
        <td><?php echo $this->item->documentationComment; ?></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_SCORE_VALUE_FOR_MONEY'); ?></td>
        <td><?php echo $this->item->valueForMoney; ?></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_COMMENTS_VALUE_FOR_MONEY'); ?></td>
        <td><?php echo $this->item->valueForMoneyComment; ?></td>
    </tr>

    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_URL'); ?></td>
        <td><?php echo $this->item->url; ?></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_USED_FOR'); ?></td>
        <td><?php echo $this->item->usedFor; ?></td>
    </tr>

    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_IP_ADDRESS'); ?></td>
        <td><?php echo $this->item->ipAddress; ?></td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_FLAGGED'); ?></td>
        <td>
			<?php
			echo (int) $this->item->flagged === 1 && !is_null($item->ipAddress)
				? HTMLHelper::_(
					'link',
					'https://batchrev.extensions.joomla.org/ipaddress/' . $this->item->ipAddress . '.html',
					Text::_('JYES'),
					'target="_blank"'
				)
				: Text::_('JNO');
			?>
        </td>
    </tr>
    <tr>
        <td><?php echo Text::_('COM_JED_REVIEWS_AUTHENTICATED'); ?></td>
        <td>
			<?php
			echo (int) $this->item->authenticated === 1
				? Text::_('JYES')
				: Text::_('JNO');
			?>
        </td>
    </tr>
</table>
