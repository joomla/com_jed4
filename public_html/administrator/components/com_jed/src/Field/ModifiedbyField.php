<?php
/**
 * @package       JED
 *
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Field;

defined('JPATH_BASE') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Form\FormField;

/**
 * Modified By Field
 *
 * @since  4.0.0
 */
class ModifiedbyField extends FormField
{
    /**
     * The form field type.
     *
     * @var        string
     * @since  4.0.0
     */
    protected $type = 'modifiedby';

    /**
     * Method to get the field input markup.
     *
     * @return    string    The field input markup.
     *
     * @since  4.0.0
     */
    protected function getInput()
    {
        // Initialize variables.
        $html = array();
        $user = Factory::getUser();
        $html[] = '<input type="hidden" name="' . $this->name . '" value="' . $user->id . '" />';
        if (!$this->hidden) {
            $html[] = "<div>" . $user->name . " (" . $user->username . ")</div>";
        }

        return implode($html);
    }
}
