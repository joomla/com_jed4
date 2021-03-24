<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Field;

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\Field\ListField;

use function defined;

/**
 * List of Emails.
 *
 * @package  JED
 * @since    4.0.0
 */
class EmailsField extends ListField
{
	/**
	 * Type of field
	 *
	 * @var    string
	 * @since  4.0.0
	 */
	protected $type = 'Emails';

	/**
	 * Build a list of Email templates.
	 *
	 * @return  array  List of Email templates.
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
						'id',
						'subject',
					],
					[
						'value',
						'text'
					]
				)
			)
			->from($db->quoteName('#__jed_emails'));
		$db->setQuery($query);

		$options = $db->loadAssocList();

		return array_merge(parent::getOptions(), $options);
	}
}
