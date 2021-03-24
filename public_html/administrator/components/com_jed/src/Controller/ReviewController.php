<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Controller;

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Controller\FormController;

use function defined;

/**
 * Review view level controller class.
 *
 * @since  4.0.0
 */
class ReviewController extends FormController
{
	/**
	 * @var string  The prefix to use with controller messages.
	 *
	 * @since   4.0.0
	 */
	protected $text_prefix = 'COM_JED_REVIEW';
}
