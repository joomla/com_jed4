<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;

/** @var JedViewEmails $this */

?>
<form name="adminForm" id="adminForm" method="post" action="index.php?option=com_jed&view=emails">
	<div id="j-sidebar-container" class="span2">
		<?php echo $this->sidebar; ?>
	</div>
	<div id="j-main-container" class="span10">
        <?php if (empty($this->items)) : ?>
        <div class="alert alert-no-items">
			<?php echo JText::_('JGLOBAL_NO_MATCHING_RESULTS'); ?>
        </div>
        <?php else: ?>
            <?php if ($this->canDo->get('core.create')) : ?>
                <?php echo Text::_('COM_JED_TESTMAIL_ADDRESS'); ?>
                <div id="testmail">
                    <input type="text" name="email" value="" size="50" />
                </div>
            <?php endif; ?>

            <table class="table table-striped">
                <thead>
                    <tr>
                        <th width="1%"><input type="checkbox" name="toggle" value="" onclick="Joomla.checkAll(this);" /></th>
                        <th><?php echo Text::_('COM_JED_SUBJECT'); ?></th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <td colspan="3"><?php echo $this->pagination->getListFooter(); ?></td>
                    </tr>
                </tfoot>
                <tbody>
                    <?php foreach ($this->items as $i => $item) : ?>
                        <tr>
                            <td>
                                <?php echo HTMLHelper::_('grid.checkedout',  $item, $i, 'id'); ?>
                            </td>
                            <td>
                                <?php
                                    echo HTMLHelper::_(
                                        'link',
                                        Route::_('index.php?option=com_jed&task=email.edit&id=' . $item->id),
                                        $item->subject
                                    );
                                ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
		<input type="hidden" name="task" value="" />
		<input type="hidden" name="boxchecked" value="0" />
		<?php echo HTMLHelper::_('form.token'); ?>
	</div>
</form>
