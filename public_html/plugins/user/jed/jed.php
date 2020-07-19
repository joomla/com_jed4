<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Plugin\CMSPlugin;

/**
 * JED User Plugin
 *
 * @package  JED
 * @since    4.0.0
 */
class PlgUserJed extends CMSPlugin
{
	/**
	 * Database variable
	 *
	 * @var    JDatabaseDriver
	 * @since  4.0.0
	 */
	protected $db;

	/**
	 * Utility method to insert row into #__jed_users for a new user.
	 *
	 * @param   array    $user     Holds the new user data.
	 * @param   boolean  $isnew    True if a new user is stored.
	 * @param   boolean  $success  True if user was successfully stored in the database.
	 * @param   string   $msg      Message.
	 *
	 * @return  boolean
	 *
	 * @since   4.0.0
	 */
	public function onUserAfterSave($user, $isnew, $success, $msg)
	{
		$userId = (int) $user['id'];

		if (!$success || !$isnew || empty($userId))
		{
			return false;
		}

		$jedUser                = new stdClass();
		$jedUser->id            = $userId;
		$jedUser->developerName = $user['name'];
		$jedUser->user_id       = $userId;

		return $this->db->insertObject('#__jed_users', $jedUser);
	}
}
