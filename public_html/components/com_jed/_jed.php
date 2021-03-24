<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\MVC\Controller\BaseController;

// Load JED Helper
JLoader::register('JedHelper', JPATH_COMPONENT . '/helpers/jed.php');

// Add JED styling
HTMLHelper::_('stylesheet', 'com_jed/style.css', ['version' => 'auto', 'relative' => true, 'detectDebug' => (bool) JDEBUG]);

$controller = BaseController::getInstance('jed');
$controller->execute(Factory::getApplication()->input->get('task'));
$controller->redirect();
