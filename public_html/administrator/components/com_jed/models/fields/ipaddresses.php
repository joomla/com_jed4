<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;

JFormHelper::loadFieldClass('list');

/**
 * List of IP addresses.
 *
 * @package  JED
 * @since    4.0.0
 */
class JedFormFieldIpaddresses extends JFormFieldList
{
	/**
	 * Type of field
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $type = 'Ipaddresses';

	/**
	 * Build a list of IP addresses.
	 *
	 * @return  array  List of IP addresses.
	 *
	 * @throws  RuntimeException
	 * @since   4.0.0
	 *
	 */
	public function getOptions(): array
	{
		$db    = Factory::getDbo();
		$query = $db->getQuery(true)
			->select(
				$db->quoteName(
					[
						'ipAddress',
						'ipAddress',
					],
					[
						'value',
						'text'
					]
				)
			)
			->from($db->quoteName('#__jed_reviews'))
			->group($db->quoteName('ipAddress'))
			->order($db->quoteName('ipAddress'));
		$db->setQuery($query);

		$options = $db->loadAssocList();

		return array_merge(parent::getOptions(), $options);
	}
}
