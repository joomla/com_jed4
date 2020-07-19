<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;

/** @var JedViewUser $this */

HTMLHelper::_('behavior.formvalidator');
HTMLHelper::_('formbehavior.chosen');

Factory::getDocument()->addScriptDeclaration("
	Joomla.submitbutton = function(task)
	{
		if (task == 'user.cancel' || document.formvalidator.isValid(document.getElementById('user-form')))
		{
			Joomla.submitform(task, document.getElementById('user-form'));
		}
	};
");
?>

<form action="<?php echo 'index.php?option=com_jed&view=user&layout=edit&id=' . (int) $this->item->id; ?>" method="post" name="adminForm" id="user-form" class="form-validate form-horizontal">

	<?php echo HTMLHelper::_('bootstrap.startTabSet', 'userTab', ['active' => 'overview']); ?>

	<?php echo HTMLHelper::_(
		'bootstrap.addTab',
		'userTab',
		'overview',
		Text::_('COM_JED_USER_OVERVIEW_TAB')
	); ?>
    <div class="row-fluid form-horizontal-desktop">
        <div class="span12">
            <div class="form-horizontal">
                <table class="table table-striped" id="userList">
                    <tr>
                        <td><?php echo Text::_('COM_JED_USER_NAME'); ?></td>
                        <td><?php echo $this->item->name; ?></td>
                    </tr>
                    <tr>
                        <td><?php echo Text::_('COM_JED_USER_USERNAME'); ?></td>
                        <td><?php echo $this->item->username; ?></td>
                    </tr>
                    <tr>
                        <td><?php echo Text::_('COM_JED_USER_DEVELOPER_NAME'); ?></td>
                        <td><?php echo $this->form->getInput('developerName'); ?></td>
                    </tr>
                    <tr>
                        <td><?php echo Text::_('COM_JED_USERS_PUBLISHED_EXTENSIONS'); ?></td>
                        <td>
                            <a href="<?php echo 'index.php?option=com_jed&view=extensions&filter[developer]=' . (int) $item->id; ?>" title="<?php echo Text::_('COM_JED_USERS_EXTENSIONS_BY') . ' ' . $this->escape($item->username); ?>">
								<?php echo $this->item->publishedExtensions; ?>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td><?php echo Text::_('COM_JED_USERS_PUBLISHED_REVIEWS'); ?></td>
                        <td>
                            <a href="<?php echo 'index.php?option=com_jed&view=reviews&filter[reviewer]=' . (int) $item->id; ?>" title="<?php echo Text::_('COM_JED_USERS_REVIEWS_BY') . ' ' . $this->escape($item->username); ?>">
								<?php echo $this->item->publishedReviews; ?>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td><?php echo Text::_('COM_JED_USERS_ACTIVE_TICKETS'); ?></td>
                        <td>
                            @TODO Active ticket count & link
                        </td>
                    </tr>
                    <tr>
                        <td><?php echo Text::_('COM_JED_USER_REGISTER_DATE'); ?></td>
                        <td><?php echo HTMLHelper::_('date', $this->item->registerDate, Text::_('COM_JED_DATETIME_FORMAT')); ?></td>
                    </tr>
                    <tr>
                        <td><?php echo Text::_('COM_JED_USER_LASTVISIT_DATE'); ?></td>
                        <td><?php echo HTMLHelper::_('date', $this->item->lastvisitDate, Text::_('COM_JED_DATETIME_FORMAT')); ?></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
	<?php echo HTMLHelper::_('bootstrap.endTab'); ?>

	<?php echo HTMLHelper::_(
		'bootstrap.addTab',
		'userTab',
		'permissions',
		Text::_('COM_JED_USER_PERMISSIONS_TAB')
	); ?>

    <div class="row-fluid form-horizontal-desktop">
        <div class="span12">
            <div class="form-horizontal">
                Permissions
            </div>
        </div>
    </div>

	<?php echo HTMLHelper::_('bootstrap.endTab'); ?>

	<?php echo HTMLHelper::_(
		'bootstrap.addTab',
		'userTab',
		'history',
		Text::_('COM_JED_USER_HISTORY_TAB')
	); ?>

    <div class="row-fluid form-horizontal-desktop">
        <div class="span12">
            <div class="form-horizontal">
                history
            </div>
        </div>
    </div>

	<?php echo HTMLHelper::_('bootstrap.endTab'); ?>

    <input type="hidden" name="task" value=""/>
	<?php echo HTMLHelper::_('form.token'); ?>
</form>