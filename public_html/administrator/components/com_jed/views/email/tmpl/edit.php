<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;

/** @var JedViewEmail $this */

HTMLHelper::_('formbehavior.chosen');

?>
<form action="<?php echo 'index.php?option=com_jed&layout=edit&id=' . $this->item->get('id'); ?>" method="post" name="adminForm" id="adminForm" class="form-validate">
	<div class="span9">
		<div class="control-group">
			<div class="control-label"><?php echo $this->form->getLabel('subject'); ?></div>
			<div class="controls"><?php echo $this->form->getInput('subject'); ?></div>
		</div>
		<div class="control-group">
			<div class="control-label"><?php echo $this->form->getLabel('body'); ?></div>
			<div class="controls"><?php echo $this->form->getInput('body'); ?></div>
		</div>
	</div>
	<div class="span3">
        <section>
            <h3><?php echo Text::_('COM_JED_EMAIL_PLACEHOLDERS'); ?></h3>
			<ul>
				<li>{USERNAME}</li>
				<li>{NAME}</li>
			</ul>
        </section>
	</div>
	<input type="hidden" name="task" value="" />
	<?php echo HTMLHelper::_('form.token'); ?>
</form>
