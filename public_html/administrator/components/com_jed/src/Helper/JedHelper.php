<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Helper;

defined('_JEXEC') or die;

use Exception;
use Joomla\CMS\Factory;
use Joomla\CMS\Object\CMSObject;
use function defined;

/**
 * JED Helper
 *
 * @since     4.0.0
 * @package   JED
 */
class JedHelper
{


	/**
	 * Checks whether or not a user is manager or super user
	 *
	 * @return bool
	 *
	 * @since 4.0.0
	 */
	static public function isAdminOrSuperUser(): bool
	{
		try
		{
			$user = Factory::getUser();

			return in_array("8", $user->groups) || in_array("7", $user->groups);
		}
		catch (Exception $exc)
		{
			return false;
		}
	}

	/**
	 * Gets a list of the actions that can be performed.
	 *
	 * @return CMSObject
	 *
	 * @since    4.0.0
	 */
	public static function getActions(): CMSObject
	{
		$user   = Factory::getUser();
		$result = new CMSObject();

		$assetName = 'com_jed';

		$actions = array(
			'core.admin', 'core.manage', 'core.create', 'core.edit', 'core.edit.own', 'core.edit.state', 'core.delete'
		);

		foreach ($actions as $action)
		{
			$result->set($action, $user->authorise($action, $assetName));
		}

		return $result;
	}

}

