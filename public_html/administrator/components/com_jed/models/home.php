<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\MVC\Model\BaseDatabaseModel;

/**
 * JED Home Model
 *
 * @package  JED
 * @since    4.0.0
 */
class JedModelHome extends BaseDatabaseModel
{
	/**
	 * Get total of extensions, reviews, reviews per day.
	 *
	 * @return  array  List of totals.
	 *
	 * @since   4.0.0
	 */
	public function getTotals(): array
	{
		$totals = [];
		$db     = $this->getDbo();

		// Get total number of extensions
		$query = $db->getQuery(true)
			->select('COUNT(' . $db->quoteName('id') . ')')
			->from($db->quoteName('#__jed_extensions'));
		$db->setQuery($query);
		$totals['extensions'] = $db->loadResult();

		// Get total number of reviews
		$query = $db->getQuery(true)
			->select('COUNT(' . $db->quoteName('id') . ')')
			->from($db->quoteName('#__jed_reviews'));
		$db->setQuery($query);
		$totals['reviews'] = $db->loadResult();

		// Get total number of reviews per day
		$query = $db->getQuery(true)
			->select('CEIL(COUNT(' . $db->quoteName('id') . ') / COUNT(DISTINCT DATE(' . $db->quoteName('created_on') . ')))')
			->from($db->quoteName('#__jed_reviews'));
		$db->setQuery($query);
		$totals['reviewsPerDay'] = $db->loadResult();

		return $totals;
	}

	/**
	 * Get the last 5 reviews.
	 *
	 * @return  array
	 *
	 * @since   4.0.0
	 */
	public function getReviews(): array
	{
		// @todo wait for review listing to be completed
		return [];

		$reviewsModel = BaseDatabaseModel::getInstance('Reviews', 'JedModel', ['ignore_request' => true]);
		$reviewsModel->setState('filter.order', 'id');
		$reviewsModel->setState('filter.direction', 'DESC');
		$reviewsModel->setState('list.limit', 5);

		return $reviewsModel->getItems();
	}

	/**
	 * Get the last 5 tickets.
	 *
	 * @return  array
	 *
	 * @since   4.0.0
	 */
	public function getTickets(): array
	{
		// @todo wait for ticket listing to be completed
		return [];

		$reviewsModel = BaseDatabaseModel::getInstance('Tickets', 'JedModel', ['ignore_request' => true]);
		$reviewsModel->setState('filter.order', 'id');
		$reviewsModel->setState('filter.direction', 'DESC');
		$reviewsModel->setState('list.limit', 5);

		return $reviewsModel->getItems();
	}
}
