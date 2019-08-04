<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

// No direct access
defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Layout\LayoutHelper;

HTMLHelper::_('formbehavior.chosen', 'select');

?>
<form action="<?php echo Route::_('index.php?option=com_jed&view=suspiciousip&layout=edit&id=' . (int) $this->item->id); ?>"
      method="post" name="adminForm" id="adminForm" class="form-validate">

	<?php echo LayoutHelper::render('joomla.edit.title_alias', $this); ?>

	<div class="form-horizontal">

		<div class="row-fluid form-horizontal-desktop">
			<div class="span3">
				<div class="form-horizontal">
					<?php echo $this->form->renderField('ipaddr'); ?>
				</div>
			</div>
			<div class="span9">

				<div class="form-horizontal">
					<?php echo $this->form->renderField('reason'); ?>
				</div>
			</div>
		</div>


	</div>

	<input type="hidden" name="option" value="com_jed"/>
	<input type="hidden" name="task" value=""/>
	<input name="jform[id]" id="jform_id" value="<?php echo !empty($this->item->id) ? $this->item->id : 0; ?>" class="readonly" readonly="" type="hidden">
	<input type="hidden" name="boxchecked" value="0"/>
	<?php echo HTMLHelper::_('form.token'); ?>
</form>
