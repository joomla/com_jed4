<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Controller;

defined('_JEXEC') or die;

use Exception;
use Joomla\CMS\MVC\Controller\AdminController;

use function defined;

/**
 * Extensions list controller class.
 *
 * @since 4.0.0
 */
class ExtensionsController extends AdminController
{
	/**
	 * Set the text context
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $text_prefix = 'COM_JED_EXTENSIONS';

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
	public function getModel($name = 'Extension', $prefix = 'Administrator', $config = ['ignore_request' => true])
	{
		return parent::getModel($name, $prefix, $config);
	}
}
