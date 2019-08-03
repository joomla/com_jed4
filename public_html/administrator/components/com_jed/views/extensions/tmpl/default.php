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

defined('_JEXEC') or die;

/** @var JedViewExtensions $this */

$user      = Factory::getUser();
$listOrder = $this->escape($this->state->get('list.ordering'));
$userId    = $user->get('id');
?>
<form name="adminForm" id="adminForm" method="post" action="index.php?option=com_jed&view=extensions">
    <div id="j-sidebar-container" class="span2">
		<?php echo $this->sidebar; ?>
    </div>
    <div id="j-main-container" class="span10">
        <table class="table table-striped">
            <thead>
            <tr>
                <th width="20">
                    <input type="checkbox" name="toggle" value=""
                           onclick="checkAll(<?php echo count($this->items); ?>);"/>
                </th>
                <th>
                    &nbsp;
                </th>
                <th>
					<?php echo Text::_('COM_JED_EXTENSIONS_TITLE'); ?>
                </th>
                <th>
					<?php echo Text::_('COM_JED_EXTENSIONS_CATEGORY'); ?>
                </th>
                <th>
					<?php echo Text::_('COM_JED_EXTENSIONS_APPROVED'); ?>
                </th>
                <th>
					<?php echo Text::_('COM_JED_EXTENSIONS_DEVELOPER'); ?>
                </th>
                <th>
					<?php echo Text::_('COM_JED_EXTENSIONS_TYPE'); ?>
                </th>
                <th>
					<?php echo Text::_('COM_JED_EXTENSIONS_REVIEWCOUNT'); ?>
                </th>

                <th width="5">
					<?php echo Text::_('JGRID_HEADING_ID'); ?>
                </th>
            </tr>
            </thead>
            <tfoot>
            <tr>
                <td colspan="3"><?php echo $this->pagination->getListFooter(); ?></td>
            </tr>
            </tfoot>
            <tbody>
			<?php foreach ($this->items as $i => $item):

				$ordering = ($listOrder === 't.id');
				$canCreate = $user->authorise('core.create', 'com_jed.extension.' . $item->id);
				$canEdit = $user->authorise('core.edit', 'com_jed.extension.' . $item->id);
				$canCheckin = $user->authorise('core.manage',
						'com_checkin') || $item->checked_out === $userId || $item->checked_out === 0;
				$canEditOwn = $user->authorise('core.edit.own',
						'com_jed.extension.' . $item->id) && $item->created_by === $userId;
				$canChange = $user->authorise('core.edit.state', 'com_jed.extension.' . $item->id) && $canCheckin;
				?>
                <tr class="row<?php echo $i % 2; ?>">
                    <td>
						<?php echo HTMLHelper::_('grid.id', $i, $item->id); ?>
                    </td>
                    <td class="center" width="50">
                        <div class="btn-group">
							<?php echo HTMLHelper::_('jgrid.published', $item->published, $i, 'extensions.', $canChange); ?>
							<?php
							// Create dropdown items
							$action = ($item->published === 1) ? 'unpublish' : 'publish';
							HTMLHelper::_('actionsdropdown.' . $action, 'cb' . $i, 'extensions');

							// Render dropdown list
							echo HTMLHelper::_('actionsdropdown.render', $this->escape($item->name));
							?>
                        </div>
                    </td>
                    <td>
						<?php echo $item->name; ?>
                    </td>
                    <td>
						<?php echo $item->category; ?>
                    </td>
                    <td>
						<?php echo $item->approved; ?>
                    </td>
                    <td>
						<?php echo $item->developer; ?>
                    </td>
                    <td>
						<?php echo $item->type; ?>
                    </td>
                    <td>
						<?php echo $item->no_of_reviews; ?>
                    </td>

                    <td>
						<?php echo $item->id; ?>
                    </td>
                </tr>
			<?php endforeach; ?>
            </tbody>
        </table>
        <input type="hidden" name="task" value=""/>
        <input type="hidden" name="boxchecked" value="0"/>
		<?php echo HTMLHelper::_('form.token'); ?>
    </div>
</form>
