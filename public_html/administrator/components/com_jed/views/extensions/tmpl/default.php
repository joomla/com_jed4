<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;

defined('_JEXEC') or die;

/** @var JedViewExtensions $this */

HTMLHelper::_('formbehavior.chosen');

$user      = Factory::getUser();
$userId    = $user->get('id');
$listOrder  = $this->escape($this->state->get('list.ordering'));
$listDirn   = $this->escape($this->state->get('list.direction'));
?>
<form name="adminForm" id="adminForm" method="post" action="index.php?option=com_jed&view=extensions">
    <div id="j-sidebar-container" class="span2">
		<?php echo $this->sidebar; ?>
    </div>
    <div id="j-main-container" class="span10">
	    <?php echo LayoutHelper::render('joomla.searchtools.default', ['view' => $this]); ?>
	    <?php if (empty($this->items)) : ?>
            <div class="alert alert-no-items">
			    <?php echo Text::_('JGLOBAL_NO_MATCHING_RESULTS'); ?>
            </div>
	    <?php else : ?>
        <table class="table table-striped">
            <thead>
            <tr>
                <th><input type="checkbox" name="toggle" value="" onclick="Joomla.checkAll(this);" /></th>
                <th>
		            <?php echo HTMLHelper::_('searchtools.sort', 'JPUBLISHED', 'extensions.published', $listDirn, $listOrder); ?>
                </th>
                <th>
		            <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_APPROVED', 'extensions.approved', $listDirn, $listOrder); ?>
                </th>
                <th>
                <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_TITLE', 'extensions.title', $listDirn, $listOrder); ?>
                </th>
                <th>
                <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_CATEGORY', 'categories.title', $listDirn, $listOrder); ?>
                </th>
                <th>
                <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_LAST_UPDATED', 'extensions.modified_on', $listDirn, $listOrder); ?>
                </th>
                <th>
                <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_DATE_ADDED', 'extensions.created_on', $listDirn, $listOrder); ?>
                </th>
                <th>
		            <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_DEVELOPER', 'users.name', $listDirn, $listOrder); ?>
                </th>
                <th>
		            <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_TYPE', 'extensions.type', $listDirn, $listOrder); ?>
                </th>
                <th>
		            <?php echo HTMLHelper::_('searchtools.sort', 'COM_JED_EXTENSIONS_REVIEWCOUNT', 'extensions.reviewcount', $listDirn, $listOrder); ?>
                </th>
                <th width="1%">
		            <?php echo HTMLHelper::_('searchtools.sort', 'JGRID_HEADING_ID', 'extensions.id', $listDirn, $listOrder); ?>
                </th>
            </tr>
            </thead>
            <tfoot>
            <tr>
                <td colspan="9"><?php echo $this->pagination->getListFooter(); ?></td>
            </tr>
            </tfoot>
            <tbody>
			<?php foreach ($this->items as $i => $item):

				$ordering = ($listOrder === 'extension.id');
				$canCreate = $user->authorise('core.create', 'com_jed.extension.' . $item->id);
				$canEdit = $user->authorise('core.edit', 'com_jed.extension.' . $item->id);
				$canCheckin = $user->authorise('core.manage',
						'com_checkin') || $item->checked_out === $userId || $item->checked_out === 0;
				$canEditOwn = $user->authorise('core.edit.own',
						'com_jed.extension.' . $item->id) && $item->created_by === $userId;
				$canChange = $user->authorise('core.edit.state', 'com_jed.extension.' . $item->id) && $canCheckin;
				?>
                <tr>
                    <td>
		                <?php echo HTMLHelper::_('grid.id', $i, $item->id); ?>
                    </td>
                    <td class="center" width="50">
		                <?php echo HTMLHelper::_('jgrid.published', $item->published, $i, 'extensions.', $canChange); ?>
                    </td>
                    <td>
		                <?php
		                switch ($item->approved)
		                {
		                    // Rejected
			                case '-1':
				                $icon = 'unpublish';
				                break;
				            // Approved
			                case '1':
				                $icon = 'publish';
				                break;
				            // Awaiting response
			                case '2':
				                $icon = 'expired';
				                break;
				            // Pending
			                case '0':
			                default:
			                    $icon = 'pending';
				                break;

		                }
		                echo '<span class="icon-' . $icon . '" aria-hidden="true"></span>';
		                ?>
                    </td>
                    <td>
		                <?php echo HTMLHelper::_('link', 'index.php?option=com_jed&task=extension.edit&id=' . $item->id, $item->title); ?>
                    </td>
                    <td>
		                <?php echo $item->category; ?>
                    </td>
                    <td>
		                <?php echo HTMLHelper::_('date', $item->modified_on, Text::_('COM_JED_DATETIME_FORMAT')); ?>
                    </td>
                    <td>
		                <?php echo HTMLHelper::_('date', $item->created_on, Text::_('COM_JED_DATETIME_FORMAT')); ?>
                    </td>
                    <td>
						<?php echo $item->developer; ?>
                    </td>
                    <td>
						<?php echo Text::_('COM_JED_EXTENSIONS_TYPE_' . $item->type); ?>
                    </td>
                    <td>
						<?php echo $item->reviewCount; ?>
                    </td>
                    <td>
						<?php echo $item->id; ?>
                    </td>
                </tr>
			<?php endforeach; ?>
            </tbody>
        </table>
        <?php endif; ?>
        <input type="hidden" name="task" value=""/>
        <input type="hidden" name="boxchecked" value="0"/>
		<?php echo HTMLHelper::_('form.token'); ?>
    </div>
</form>
