<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\MVC\Model\AdminModel;

/**
 * JED User Model
 *
 * @package  JED
 * @since    4.0.0
 */
class JedModelUser extends AdminModel
{
	/**
	 * Method to get the record form.
	 *
	 * @param   array    $data      Data for the form.
	 * @param   boolean  $loadData  True if the form is to load its own data (default case), false if not.
	 *
	 * @return      mixed   A JForm object on success, false on failure
	 *
	 * @since       4.0.0
	 */
	public function getForm($data = [], $loadData = true)
	{
		// Get the form.
		$form = $this->loadForm('com_jed.user', 'user',
			array('control' => 'jform', 'load_data' => $loadData));

		if (empty($form))
		{
			return false;
		}

		return $form;
	}

	/**
	 * Method to get the data that should be injected in the form.
	 *
	 * @return      mixed   The data for the form.
	 *
	 * @since       4.0.0
	 * @throws      Exception
	 *
	 */
	protected function loadFormData()
	{
		// Check the session for previously entered form data.
		$data = Factory::getApplication()->getUserState('com_jed.edit.user.data', []);

		if (empty($data))
		{
			$data = $this->getItem();
		}

		return $data;
	}

	/**
	 * Method to get a single record.
	 *
	 * @param   integer  $pk  The id of the primary key.
	 *
	 * @return  \JObject|boolean  Object on success, false on failure.
	 *
	 * @since   4.0.0
	 */
	public function getItem($pk = null)
	{
		$item = parent::getItem($pk);

		$db    = $this->getDbo();
		$query = $db->getQuery(true);

		$query->select($db->quoteName(
			[
				'users.id',
				'users.name',
				'users.username',
				'users.registerDate',
				'jed_users.developerName',
			],
			[
				'id',
				'name',
				'username',
				'registerDate',
				'developerName',
			]
		))
			->select('COUNT(extensions.id) AS publishedExtensions')
			->select('COUNT(reviews.id) AS publishedReviews')
			->from($db->quoteName('#__users', 'users'))
			->leftJoin(
				$db->quoteName('#__jed_users', 'jed_users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName('jed_users.user_id')
			)
			->leftJoin(
				$db->quoteName('#__jed_extensions', 'extensions')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName('extensions.created_by')
				. ' AND ' . $db->quoteName('extensions.published') . ' = 1'
				. ' AND ' . $db->quoteName('extensions.approved') . ' = 1'
			)
			->leftJoin(
				$db->quoteName('#__jed_reviews', 'reviews')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName('reviews.created_by')
				. ' AND ' . $db->quoteName('reviews.published') . ' = 1'
			)
			->where($db->quoteName('users.id') . ' = ' . (int) $item->id);

		$db->setQuery($query);
		$data = $db->loadObject();

		$item->developerName   = $data->developerName;

		return $item;
	}
}
