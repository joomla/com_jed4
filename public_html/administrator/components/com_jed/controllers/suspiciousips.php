<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die();

use Joomla\CMS\Language\Text;
use Joomla\CMS\Session\Session;
use Joomla\CMS\MVC\Controller\AdminController;

/**
 * Suspiciousips list controller class.
 *
 * @since 4.0.0
 */
class JedControllerSuspiciousips extends AdminController
{
	/**
	 * Proxy for getModel.
	 *
	 * @param   string  $name    Optional. Model name
	 * @param   string  $prefix  Optional. Class prefix
	 * @param   array   $config  Optional. Configuration array for model
	 *
	 * @return  object    The Model
	 *
	 * @since   4.0.0
	 * @throws  Exception
	 */
	public function getModel($name = 'Suspiciousip', $prefix = 'JedModel', $config = array('ignore_request' => true))
	{
		$model = parent::getModel($name, $prefix, $config);

		return $model;
	}

	/**
	 * Method to cancel an edit.
	 *
	 * @param   string  $key  The name of the primary key of the URL variable.
	 *
	 * @return  void
	 *
	 * @since   4.0.0
	 */
	public function cancel($key = null)
	{
		Session::checkToken() or jexit(Text::_('JINVALID_TOKEN'));

		$this->setRedirect('index.php?option=com_jed', null);
	}
}
