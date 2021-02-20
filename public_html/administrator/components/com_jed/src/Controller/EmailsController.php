<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Jed\Administrator\Controller;

\defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Controller\AdminController;
use Joomla\CMS\Session\Session;

/**
 * Emails controller.
 *
 * @since   4.0.0
 */
class EmailsController extends AdminController
{
	protected $text_prefix = 'COM_JED_EMAILS';

	/**
	 * Method to get a model object, loading it if required.
	 *
	 * @param   string  $name    The model name. Optional.
	 * @param   string  $prefix  The class prefix. Optional.
	 * @param   array   $config  Configuration array for model. Optional.
	 *
	 * @return  \JModelLegacy|boolean  Model object on success; otherwise false on failure.
	 *
	 * @since   4.0.0
	 */
	public function getModel($name = 'Email', $prefix = 'JedModel', $config = array())
	{
		return parent::getModel($name, $prefix, $config);
	}

	/**
	 * Send a test email.
	 *
	 * @return  void.
	 *
	 * @since   4.0.0
	 *
	 * @throws  Exception
	 */
	public function testEmail(): void
	{
		// Check for request forgeries
		Session::checkToken() or die(Text::_('JINVALID_TOKEN'));

		/** @var JedModelEmail $model */
		$model  = $this->getModel('Email', 'JedModel');
		$result = $model->testEmail();
		$app    = Factory::getApplication();
		$app->redirect('index.php?option=com_jed&view=emails', $result['msg'], $result['state']);
	}
}
