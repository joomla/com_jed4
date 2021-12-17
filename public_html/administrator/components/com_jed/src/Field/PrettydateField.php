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

use Joomla\CMS\Form\FormField;
use DateTime;

/**
 * Pretty Date Field
 *
 * @since  4.0.0
 */
class PrettydateField extends FormField
{
    /**
     * The form field type.
     *
     * @var        string
     * @since  4.0.0
     */
    protected $type = 'prettydate';

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
       
        $d = new DateTime(''.$this->value);
         
       
        $html[] = $d->format("d M y H:i");
       // var_dump($html);exit();

        return implode($html);
    }
}
