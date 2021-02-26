<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\Component\Jed\Administrator\Controller;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Controller\AdminController;
use Joomla\CMS\MVC\Model\BaseDatabaseModel;
use Joomla\CMS\Session\Session;
use Joomla\Component\Jed\Administrator\Model\EmailModel;

use function defined;

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
	 * @return  BaseDatabaseModel Model object on success; otherwise false on failure.
	 *
	 * @since   4.0.0
	 */
	public function getModel($name = 'Email', $prefix = 'Administrator', $config = array())
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
	 * @throws  \Exception
	 */
	public function testEmail(): void
	{
		Session::checkToken() or die;

		/** @var EmailModel $model */
		$model  = $this->getModel();
		$result = $model->testEmail();
		$this->setRedirect('index.php?option=com_jed&view=emails', $result['msg'], $result['state']);
	}
}
