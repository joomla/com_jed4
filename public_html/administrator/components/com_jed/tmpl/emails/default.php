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
use Joomla\Component\Jed\Administrator\View\Emails\HtmlView;

/** @var HtmlView $this */

?>
<form id="adminForm" action="<?php echo Route::_('index.php?option=com_jed&view=emails'); ?>" method="post" name="adminForm">
    <div class="row">
        <div class="col-md-12">
            <div id="j-main-container" class="j-main-container">
                <?php if (empty($this->items)) : ?>
                <div class="alert alert-no-items">
                    <span class="icon-info-circle" aria-hidden="true"></span><span class="visually-hidden"><?php echo Text::_('INFO'); ?></span>
                    <?php echo JText::_('JGLOBAL_NO_MATCHING_RESULTS'); ?>
                </div>
                <?php else: ?>
                    <?php if ($this->canDo->get('core.create')) : ?>
                        <?php echo Text::_('COM_JED_TESTMAIL_ADDRESS'); ?>
                        <div id="testmail">
                            <input type="text" name="email" value="" size="50" />
                        </div>
                    <?php endif; ?>

                    <table class="table itemList" id="emailList">
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
        </div>
    </div>
</form>
