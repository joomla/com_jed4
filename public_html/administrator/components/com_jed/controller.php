<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\MVC\Controller\BaseController;

/**
 * General Controller of JED component
 *
 * @since  4.0.0
 */
class JedController extends BaseController
{
	/**
	 * display task
	 *
	 * @param   boolean  $cachable
	 * @param   array    $urlparams
	 *
	 * @return  object
	 * @since   4.0.0
	 * @throws  Exception
	 */
	function display($cachable = false, $urlparams = array())
	{
		$input = Factory::getApplication()->input;

		$view = $input->get('view', false);

		if ($view == false)
		{
			$input->set('view', 'home');
		}

		return parent::display();
	}
}
