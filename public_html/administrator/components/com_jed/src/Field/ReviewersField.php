<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Field;

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\Field\ListField;

use function defined;

/**
 * List of Reviewers.
 *
 * @package  JED
 * @since    4.0.0
 */
class ReviewersField extends ListField
{
	/**
	 * Type of field
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $type = 'Reviewers';

	/**
	 * Build a list of Reviewers.
	 *
	 * @return  array  List of Reviewers.
	 *
	 * @since   4.0.0
	 *
	 * @throws  \RuntimeException
	 */
	public function getOptions(): array
	{
		$db    = Factory::getDbo();
		$query = $db->getQuery(true)
			->select(
				$db->quoteName(
					[
						'reviews.created_by',
						'username',
					],
					[
						'value',
						'text'
					]
				)
			)
			->from($db->quoteName('#__jed_reviews', 'reviews'))
			->leftJoin(
				$db->quoteName('#__users', 'users')
				. ' ON ' . $db->quoteName('users.id') . ' = ' . $db->quoteName('reviews.created_by')
			)
			->group($db->quoteName('reviews.created_by'))
			->order($db->quoteName('username'));
		$db->setQuery($query);

		$options = $db->loadAssocList();

		return array_merge(parent::getOptions(), $options);
	}
}
