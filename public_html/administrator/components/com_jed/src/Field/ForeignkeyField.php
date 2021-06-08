<?php

/**
 * @package       JED
 *
 * @subpackage    Tickets
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Field;

defined('JPATH_BASE') or die;

use Exception;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\Field\ListField;
use Joomla\CMS\Language\Text;
use Joomla\Database\Exception\ExecutionFailureException;
use function is_array;
use function is_int;
use function is_object; 
use function is_string;

/**
 * Supports a value from an external table
 *
 * @since  4.0.0
 */
class ForeignKeyField extends ListField
{
	/**
	 * The form field type.
	 *
	 * @since  4.0.0
	 * @var      string
	 */
	protected $type = 'foreignkey';

	protected $layout = 'joomla.form.field.list-fancy-select';

	/**
	 * The translate.
	 *
	 * @since  4.0.0
	 * @var    boolean
	 */
	protected bool $translate = false;

	protected bool $header = false;

	private string $key_field;

	private string $value_field;

	/**
	 * Method to get the field input for a foreignkey field.
	 *
	 * @return  string  The field input.
	 *
	 * @since   4.0.0
	 */
	protected function getInput(): string
	{
		$data = $this->getLayoutData();

		if (!is_array($this->value) && !empty($this->value))
		{
			if (is_object($this->value))
			{
				$this->value = get_object_vars($this->value);
			}

			// String in format 2,5,4
			if (is_string($this->value))
			{
				$this->value = explode(',', $this->value);
			}

			// Integer is given
			if (is_int($this->value))
			{
				$this->value = array($this->value);
			}

			$data['value'] = $this->value;
		}


		try
		{
			$data['options'] = $this->getOptions();
		}
		catch (Exception $e)
		{
		}

		return $this->getRenderer($this->layout)->render($data);
	}

	/**
	 * getOptions
	 *
	 * @return array
	 *
	 * @since 4.0.0
	 * @throws Exception
	 */
	protected function getOptions(): array
	{
		$options = array();
		$db      = Factory::getDbo();
		try
		{
			$db->setQuery($this->processQuery());
			$results = $db->loadObjectList();
		}
		catch (ExecutionFailureException $e)
		{
			Factory::getApplication()->enqueueMessage(Text::_('JERROR_AN_ERROR_HAS_OCCURRED'), 'error');
		}

		// Add header.
		if (!empty($this->header))
		{
			$options[] = (object) ["value" => '', "text" => Text::_($this->header)];
		}

		// Build the field options.
		if (!empty($results))
		{
			foreach ($results as $item)
			{
				$options[] = (object) [
					"value" => $item->{$this->key_field},
					"text"  => $this->translate == true ? Text::_($item->{$this->value_field}) : $item->{$this->value_field}
				];
			}
		}

		// Merge any additional options in the XML definition.
		return array_merge(parent::getOptions(), $options);
	}

	/**
	 * Method to get the field input markup.
	 *
	 * @return   string  The field input markup.
	 *
	 * @since  4.0.0
	 */
	protected function processQuery(): string
	{
		// Type of input the field shows
		//$this->input_type = $this->getAttribute('input_type');

		// Database Table
		$table = $this->getAttribute('table');

		// The field that the field will save on the database
		$this->key_field = (string) $this->getAttribute('key_field');

		// The column that the field shows in the input
		$this->value_field = (string) $this->getAttribute('value_field');

		// Flag to identify if the fk_value is multiple
		$value_multiple = (int) $this->getAttribute('value_multiple', 0);

		$this->required = (string) $this->getAttribute('required', 0);

		// Flag to identify if the fk_value hides the trashed items
		$hideTrashed = (int) $this->getAttribute('hide_trashed', 0);

		// Flag to identify if the fk has default order
		$ordering = (int) $this->getAttribute('ordering', 0);


		// Load all the field options
		$db    = Factory::getDbo();
		$query = $db->getQuery(true);

		// Support for multiple fields on fk_values
		if ($value_multiple == 1)
		{
			// Get the fields for multiple value
			$value_fields = (string) $this->getAttribute('value_field_multiple');
			$value_fields = explode(',', $value_fields);
			$separator    = (string) $this->getAttribute('separator');

			$fk_value = ' CONCAT(';

			foreach ($value_fields as $field)
			{
				$fk_value .= $db->quoteName($field) . ', \'' . $separator . '\', ';
			}

			$fk_value = substr($fk_value, 0, -(strlen($separator) + 6));
			$fk_value .= ') AS ' . $db->quoteName($this->value_field);
		}
		else
		{
			$fk_value = $db->quoteName($this->value_field);
		}

		$query
			->select(
				array(
					$db->quoteName($this->key_field),
					$fk_value
				)
			)
			->from($table);

		if ($hideTrashed)
		{
			$query->where($db->quoteName('state') . ' != -2');
		}

		if ($ordering)
		{
			$query->order('ordering ASC');
		}

		// Only join on data that the user has created
		$user = Factory::getUser();
		// If the user is not an admin, then restrict the options to only be own
		if (!empty($user->id) && !in_array("8", $user->getAuthorisedGroups()) && !in_array("7", $user->getAuthorisedGroups()))
		{
			$query->where("created_by = " . (int) $user->id);
		}

		return $query;
	}

	/**
	 * Wrapper method for getting attributes from the form element
	 *
	 * @param   string  $name     Attribute name
	 * @param   mixed   $default  Optional value to return if attribute not found
	 *
	 * @return mixed The value of the attribute if it exists, null otherwise
	 *
	 * @since 4.0.0
	 */
	public function getAttribute($name, $default = null)
	{
		if (!empty($this->element[$name]))
		{
			return $this->element[$name];
		}
		else
		{
			return $default;
		}
	}
}
