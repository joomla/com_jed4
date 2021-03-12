<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;

?>
<div class="container-fluid">
	<?php if ($this->canDo->get('core.create')) : ?>
        <div class="control-group">
            <div class="control-label">
                <label for="testEmail">
	                <?php echo Text::_('COM_JED_TESTMAIL_ADDRESS'); ?>
                </label>
            </div>
            <div class="controls">
                <input type="text" name="email" id="testEmail" value="" class="form-control input-xxlarge">
            </div>
        </div>
	<?php endif; ?>
</div>
