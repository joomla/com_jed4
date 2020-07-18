<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Controller\AdminController;

/**
 * Extensions list controller class.
 *
 * @since 4.0.0
 */
class JedControllerReviews extends AdminController
{
	/**
	 * Text prefix
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	public $text_prefix = 'COM_JED_REVIEWS';

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
	public function getModel($name = 'Review', $prefix = 'JedModel', $config = ['ignore_request' => true])
	{
		return parent::getModel($name, $prefix, $config);
	}
}
