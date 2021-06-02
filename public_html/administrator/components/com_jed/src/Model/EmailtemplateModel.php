<?php
/**
 * @package       JED
 *
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Model;
// No direct access.
defined('_JEXEC') or die;

use Exception;
use Jed\Component\Jed\Administrator\Helper\JedHelper;
use Joomla\CMS\Factory;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\Model\AdminModel;
use Joomla\CMS\Table\Table;

/**
 * Email Template model class.
 *
 * @since  4.0.0
 */
class EmailtemplateModel extends AdminModel
{
    /**
     * @since   4.0.0
     * @var    string    Alias to manage history control
     */
    public $typeAlias = 'com_jed.emailtemplate';
    /**
     * @since    4.0.0
     * @var      string    The prefix to use with controller messages.
     */
    protected $text_prefix = 'COM_JED';
    /**
     * @since    4.0.0
     * @var null  Item data
     */
    protected $item = null;

    /**
     * Method to get the record form.
     *
     * @param array $data An optional array of data for the form to interogate.
     * @param boolean $loadData True if the form is to load its own data (default case), false if not.
     *
     * @return  mixed  A JForm object on success, false on failure
     *
     * @throws
     * @since    4.0.0
     *
     */
    public function getForm($data = array(), $loadData = true): Form
    {
        // Get the form.
        $form = $this->loadForm(
            'com_jed.emailtemplate', 'emailtemplate',
            array('control' => 'jform',
                'load_data' => $loadData
            )
        );


        if (empty($form)) {
            return false;
        }

        return $form;
    }


    /**
     * Returns a reference to the a Table object, always creating it.
     *
     * @param string $name The table type to instantiate
     * @param string $prefix A prefix for the table class name. Optional.
     * @param array $options Configuration array for model. Optional.
     *
     * @return    Table    A database object
     *
     * @throws Exception
     * @since    4.0.0
     */
    public function getTable($name = 'Emailtemplate', $prefix = 'Administrator', $options = array()): Table
    {
        return parent::getTable($name, $prefix, $options);
    }

    /**
     * Method to get the data that should be injected in the form.
     *
     * @return   mixed  The data for the form.
     *
     * @throws
     * @since 4.0.0
     *
     */
    protected function loadFormData()
    {
        // Check the session for previously entered form data.
        $data = Factory::getApplication()->getUserState('com_jed.edit.emailtemplate.data', array());

        if (empty($data)) {
            if ($this->item === null) {
                $this->item = $this->getItem();
            }

            $data = $this->item;


            // Support for multiple or not foreign key field: email_type
            $array = array();

            foreach ((array)$data->email_type as $value) {
                if (!is_array($value)) {
                    $array[] = $value;
                }
            }
            if (!empty($array)) {

                $data->email_type = $array;
            }
        }

        return $data;
    }

    /**
     * Method to get a single record.
     *
     * @param integer $pk The id of the primary key.
     *
     * @return  mixed    Object on success, false on failure.
     *
     * @throws Exception
     * @since 4.0.0
     */
    public function getItem($pk = null)
    {
        if (!$pk || $this->userIDItem($pk) || JedHelper::isAdminOrSuperUser()) {
            if ($item = parent::getItem($pk)) {
                if (isset($item->params)) {
                    $item->params = json_encode($item->params);
                }

                // Do any procesing on fields here if needed
            }

            return $item;
        } else {
            throw new Exception(Text::_("JERROR_ALERTNOAUTHOR"), 401);
        }
    }

    /**
     * This method revises if the $id of the item belongs to the current user
     *
     * @param integer $id The id of the item
     *
     * @return  boolean             true if the user is the owner of the row, false if not.
     *
     * @since 4.0.0
     *
     */
    public function userIDItem(int $id): bool
    {
        try {
            $user = Factory::getUser();
            $db = Factory::getDbo();

            $query = $db->getQuery(true);
            $query->select("id")
                ->from($db->quoteName('#__jed_email_templates'))
                ->where("id = " . $db->escape($id))
                ->where("created_by = " . $user->id);

            $db->setQuery($query);

            $results = $db->loadObject();
            if ($results) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $exc) {
            return false;
        }
    }


}
