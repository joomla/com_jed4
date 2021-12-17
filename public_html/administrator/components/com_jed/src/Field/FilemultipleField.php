<?php
/**
 * @package       JED
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Field;

defined('JPATH_BASE') or die;

use Joomla\CMS\Form\FormField;

/**
 * Supports an HTML select list of categories
 *
 * @since 4.0.0
 *
 **/
class FileMultipleField extends FormField
{
	/**
	 * The form field type.
	 *
	 * @since  4.0.0
	 * @var        string
	 */
	protected $type = 'file';

	/**
	 * Method to get the field input markup.
	 *
	 * @return    string    The field input markup.
	 *
	 * @since  4.0.0
	 */
	protected function getInput(): string
	{
		// Initialize variables.
		return '<input type="file" name="' . $this->name . '[]" multiple>';
	}
}
