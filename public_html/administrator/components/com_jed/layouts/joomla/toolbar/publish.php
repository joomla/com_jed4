<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('JPATH_BASE') or die;

use Joomla\CMS\HTML\HTMLHelper;

HTMLHelper::_('behavior.core');

/**
 * @var array $displayData The array with values
 *
 * @var string $title The button title
 */
$title = $displayData['title'];
?>
<button type="button" data-toggle="modal" onclick="jQuery('#publishModal').modal('show'); return true;" class="btn btn-small">
	<span class="icon-eye-open" aria-hidden="true"></span>
	<?php echo $title; ?>
</button>
