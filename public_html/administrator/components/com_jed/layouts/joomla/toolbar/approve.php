<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('JPATH_BASE') or die;

/**
 * @var array   $displayData The array with values
 *
 * @var string  $title       The button title
 * @var integer $approved    The approved state
 */
$title = $displayData['title'];

$buttonClass = '';

switch ($displayData['approved'])
{
	case '0':
		$buttonClass = 'btn-warning';
		break;
	case '1':
		$buttonClass = 'btn-success';
		break;
	case '2':
		$buttonClass = 'btn-danger';
		break;
	case '3':
		$buttonClass = 'btn-info';
		break;
}
?>
<joomla-toolbar-button id="toolbar-checkmark-cicle">
    <button type="button" data-toggle="modal"
            data-bs-toggle="modal" data-bs-target="#approveModal"
            class="btn btn-small <?php
            echo $buttonClass; ?>">
        <span class="icon-checkmark-circle" aria-hidden="true"></span>
        <?php echo $title; ?>
    </button>
</joomla-toolbar-button>
