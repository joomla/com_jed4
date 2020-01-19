<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;

?>
<tr>
	<th width="20">
		<input type="checkbox" name="toggle" value="" onclick="checkAll(<?php echo count($this->items); ?>);"/>
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
