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
 * JED Review Model
 *
 * @package  JED
 * @since    4.0.0
 */
class JedModelReview extends AdminModel
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
		$form = $this->loadForm('com_jed.review', 'review',
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
	 * @throws      Exception
	 *
	 * @since       4.0.0
	 */
	protected function loadFormData()
	{
		// Check the session for previously entered form data.
		$data = Factory::getApplication()->getUserState('com_jed.edit.review.data', []);

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

		// @TODO calculation for overall_score column
		$query->select($db->quoteName(
			[
				'reviews.published',
				'reviews.id',
				'reviews.title',
				'reviews.created_on',
				'reviews.ipAddress',
				'reviews.flagged',
				'reviews.extension_id',
				'reviews.created_by',
				'users.id',
				'users.username',
				'extensions.title',
				'extensions.created_by',
				'developers.username',
			],
			[
				'published',
				'id',
				'title',
				'created_on',
				'ipAddress',
				'flagged',
				'extensionId',
				'created_by',
				'userId',
				'username',
				'extensionname',
				'developerId',
				'developer',
			]
		))
			->from($db->quoteName('#__jed_reviews', 'reviews'))
			->leftJoin(
				$db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName('reviews.created_by')
			)
			->leftJoin(
				$db->quoteName('#__jed_extensions', 'extensions')
				. ' ON ' . $db->quoteName('extensions.id') . ' = ' . $db->quoteName('reviews.extension_id')
			)
			->leftJoin(
				$db->quoteName('#__users', 'developers')
				. ' ON ' . $db->quoteName('developers.id') . ' = ' . $db->quoteName('extensions.created_by')
			)
			->where($db->quoteName('reviews.id') . ' = ' . (int) $item->id);

		$db->setQuery($query);
		$data = $db->loadObject();

		$item->developerId   = $data->developerId;
		$item->developer     = $data->developer;
		$item->userId        = $data->userId;
		$item->username      = $data->username;
		$item->extensionId   = $data->extensionId;
		$item->extensionname = $data->extensionname;

		return $item;
	}
}
