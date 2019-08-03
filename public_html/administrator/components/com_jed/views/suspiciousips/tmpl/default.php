<?php
/**
 * Jed
 *
 * @package   Matware.Jed
 * @version   $Id:
 * @copyright Copyright (C) 2004 - 2019 Matware. All rights reserved.
 * @author    Matias Aguirre
 * @email maguirre@matware.com.ar
 * @link      http://www.matware.com.ar/
 * @license   GNU General Public License version 2 or later; see LICENSE
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Router\Route;

$user       = Factory::getUser();
$userId     = $user->get('id');
$listOrder  = $this->escape($this->state->get('list.ordering'));
$listDirn   = $this->escape($this->state->get('list.direction'));
$canOrder   = $user->authorise('core.edit.state', 'com_jed.suspiciousips');
$saveOrder  = $listOrder == 't.ordering';
$sortFields = $this->getSortFields();

HTMLHelper::_('formbehavior.chosen', 'select');
?>
<script type="text/javascript">
    Joomla.orderTable = function () {
        table = document.getElementById("sortTable");
        direction = document.getElementById("directionTable");
        order = table.options[table.selectedIndex].value;
        if (order != '<?php echo $listOrder; ?>') {
            dirn = 'asc';
        } else {
            dirn = direction.options[direction.selectedIndex].value;
        }
        Joomla.tableOrdering(order, dirn, '');
    }
</script>

<form action="<?php echo Route::_('index.php?option=com_jed&view=suspiciousips'); ?>" method="post" name="adminForm"
      id="adminForm">
	<?php if (!empty($this->sidebar)) : ?>
	<div id="j-sidebar-container" class="span2">
		<?php echo $this->sidebar; ?>
	</div>
	<div id="j-main-container" class="span10">
		<?php else : ?>
		<div id="j-main-container">
			<?php endif; ?>
			<?php
			// Search tools bar
			echo LayoutHelper::render('joomla.searchtools.default', array('view' => $this));
			?>
			<div class="clearfix"></div>
			<?php if (empty($this->items)) : ?>
				<div class="alert alert-no-items">
					<?php echo Text::_('JGLOBAL_NO_MATCHING_RESULTS'); ?>
				</div>
			<?php else : ?>
				<table class="table table-striped">
					<tr>
						<th width="20">
							<input type="checkbox" name="toggle" value="" onclick="checkAll(<?php echo count($this->items); ?>);"/>
						</th>
						<th>

						</th>
						<th>
							<?php echo Text::_('COM_JED_SUSPICIOUSIPS_CREATED_DATE'); ?>
						</th>
						<th>
							<?php echo Text::_('COM_JED_SUSPICIOUSIPS_CREATED_BY'); ?>
						</th>
						<th>
							<?php echo Text::_('COM_JED_SUSPICIOUSIPS_IPADDR'); ?>
						</th>
						<th>
							<?php echo Text::_('COM_JED_SUSPICIOUSIPS_REASON'); ?>
						</th>

						<th width="5">
							<?php echo Text::_('JGRID_HEADING_ID'); ?>
						</th>
					</tr>

					<?php

					foreach ($this->items as $i => $item):

						$ordering = ($listOrder == 't.id');
						$canCreate = $user->authorise('core.create', 'com_jed.suspiciousip.' . $item->id);
						$canEdit = $user->authorise('core.edit', 'com_jed.suspiciousip.' . $item->id);
						$canCheckin = $user->authorise('core.manage', 'com_checkin') || $item->checked_out == $userId || $item->checked_out == 0;
						$canEditOwn = $user->authorise('core.edit.own', 'com_jed.suspiciousip.' . $item->id) && $item->created_by == $userId;
						$canChange = $user->authorise('core.edit.state', 'com_jed.suspiciousip.' . $item->id) && $canCheckin;
						?>
						<tr class="row<?php echo $i % 2; ?>">
							<td>
								<?php echo HTMLHelper::_('grid.id', $i, $item->id); ?>
							</td>
							<td class="center" width="50">
								<div class="btn-group">
									<?php echo HTMLHelper::_('jgrid.published', $item->state, $i, 'suspiciousips.', $canChange, 'cb', $item->publish_up, $item->publish_down); ?>
									<?php
									// Create dropdown items
									$action = ($item->state == 1) ? 'unpublish' : 'publish';
									HTMLHelper::_('actionsdropdown.' . $action, 'cb' . $i, 'suspiciousips');

									// Render dropdown list
									echo HTMLHelper::_('actionsdropdown.render', $this->escape($item->name));
									?>
								</div>
							</td>
							<td>
								<?php echo $item->created_date; ?>
							</td>
							<td>
								<?php echo $item->created_by; ?>
							</td>
							<td>
								<?php echo $item->ipaddr; ?>
							</td>
							<td>
								<?php echo $item->reason; ?>
							</td>
							<td>
								<?php echo $item->id; ?>
							</td>
						</tr>
					<?php endforeach; ?>

					<tr>
						<td colspan="7">
							<?php echo $this->pagination->getListFooter(); ?>
						</td>
					</tr>

					<tfoot><?php echo $this->loadTemplate('foot'); ?></tfoot>
				</table>
			<?php endif; ?>

			<input type="hidden" name="option" value="com_jed"/>
			<input type="hidden" name="task" value=""/>
			<input type="hidden" name="boxchecked" value="0"/>
			<input type="hidden" name="filter_order" value="<?php echo $listOrder; ?>"/>
			<input type="hidden" name="filter_order_Dir" value="<?php echo $listDirn; ?>"/>
			<?php echo HTMLHelper::_('form.token'); ?>
		</div>
</form>
