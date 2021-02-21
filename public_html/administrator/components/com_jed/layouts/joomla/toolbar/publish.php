<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

\defined('JPATH_BASE') or die;

use Joomla\CMS\HTML\HTMLHelper;

HTMLHelper::_('behavior.core');

/**
 * @var array   $displayData The array with values
 *
 * @var string  $title       The button title
 * @var integer $published   The published state
 */
$title = $displayData['title'];
?>
<button type="button" data-toggle="modal"
        data-bs-toggle="modal" data-bs-target="#publishModal"
        class="btn btn-small <?php
        echo (int) $displayData['published'] === 1 ? 'btn-success' : 'btn-danger'; ?>">
    <span class="icon-eye-open" aria-hidden="true"></span>
	<?php
	echo $title; ?>
</button>
