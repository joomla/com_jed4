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
use Joomla\CMS\Router\Route;
use Jed\Component\Jed\Administrator\View\Emails\HtmlView;

/** @var HtmlView $this */

$user = Factory::getUser();
Factory::getApplication()->getDocument()->getWebAssetManager()
	->useScript('form.validate');
?>
<form id="adminForm" action="<?php echo Route::_('index.php?option=com_jed&view=emails'); ?>" method="post" name="adminForm" class="form-validate">
    <div class="row">
        <div class="col-md-12">
            <div id="j-main-container" class="j-main-container">
                <?php if (empty($this->items)) : ?>
                <div class="alert alert-no-items">
                    <span class="icon-info-circle" aria-hidden="true"></span><span class="visually-hidden"><?php echo Text::_('INFO'); ?></span>
                    <?php echo Text::_('JGLOBAL_NO_MATCHING_RESULTS'); ?>
                </div>
                <?php else: ?>
                    <table class="table itemList" id="emailList">
                        <caption class="visually-hidden">
		                    <?php echo Text::_('COM_JED_EMAILS_TABLE_CAPTION'); ?>,
                            <span id="orderedBy"><?php echo Text::_('JGLOBAL_SORTED_BY'); ?> </span>,
                            <span id="filteredBy"><?php echo Text::_('JGLOBAL_FILTERED_BY'); ?></span>
                        </caption>
                        <thead>
                            <tr>
                                <td class="w-1 text-center">
		                            <?php echo HTMLHelper::_('grid.checkall'); ?>
                                </td>
                                <td scope="col" class="w-10 text-left">
                                    <?php echo Text::_('COM_JED_SUBJECT'); ?>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($this->items as $i => $item) : ?>
                                <?php
	                            $canCheckin = $user->authorise('core.manage', 'com_checkin') || $item->checked_out == $user->id || is_null($item->checked_out);
                                ?>
                                <tr>
                                    <td class="w-1 text-center">
	                                    <?php echo HTMLHelper::_('grid.id', $i, $item->id, false, 'cid', 'cb', $item->subject); ?>
                                    </td>
                                    <th>
	                                    <?php if ($item->checked_out) : ?>
		                                    <?php echo HTMLHelper::_('jgrid.checkedout', $i, $item->editor, $item->checked_out_time, 'emails.', $canCheckin); ?>
	                                    <?php endif; ?>
                                        <?php
                                            echo HTMLHelper::_(
                                                'link',
                                                Route::_('index.php?option=com_jed&task=email.edit&id=' . $item->id),
                                                $item->subject
                                            );
                                        ?>
                                    </th>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
	                <?php echo $this->pagination->getListFooter(); ?>
                <?php endif; ?>
                <input type="hidden" name="task" value="" />
                <input type="hidden" name="boxchecked" value="0" />
                <?php echo HTMLHelper::_('form.token'); ?>
            </div>
        </div>
    </div>

	<?php echo HTMLHelper::_(
		'bootstrap.renderModal',
		'emailModal',
		[
			'title'  => Text::_('COM_JED_SEND_TESTEMAIL'),
			'footer' => $this->loadTemplate('email_footer'),
			'modalWidth' => '60vh'
		],
		$this->loadTemplate('email_body')
	); ?>
</form>
