<?php
/**
 * @package       JED
 *
 * @subpackage    Ticket
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Jed\Component\Jed\Administrator\Table;
// No direct access
defined('_JEXEC') or die;

use Exception;
use Joomla\CMS\Access\Access;
use Joomla\CMS\Factory;
use Joomla\CMS\Table\Table as Table;
use Joomla\Database\DatabaseDriver;


/**
 * Emailtemplate table
 *
 * @since 4.0.0
 */
class EmailtemplateTable extends Table
{
    /**
     * Id of row - used to indicate if new row
     *
     * @var    int
     * @since  4.0.0
     */
    protected int $id;

    /**
     * Constructor
     *
     * @param DatabaseDriver $db A database connector object
     *
     * @since    4.0.0
     */
    public function __construct(DatabaseDriver $db)
    {
        $this->typeAlias = 'com_jed.emailtemplate';
        parent::__construct('#__jed_email_templates', 'id', $db);
        $this->setColumnAlias('published', 'state');
        $this->id = 0;

    }

    /**
     * Get the type alias for the history table
     *
     * @return  string  The alias as described above
     *
     * @since   4.0.0
     */
    public function getTypeAlias(): string
    {
        return 'com_jed.emailtemplate';
    }

    /**
     * Overloaded bind function to pre-process the params.
     *
     * @param array $src Named array
     * @param mixed $ignore Optional array or list of parameters to ignore
     *
     * @return  null string  null is operation was satisfactory, otherwise returns an error
     *
     * @throws Exception
     * @since   4.0.0
     * @see     Table:bind
     */
    public function bind($src, $ignore = '')
    {
        $date = Factory::getDate();
        $task = Factory::getApplication()->input->get('task');


        // Support for multiple field: email_type
        if (isset($src['email_type'])) {
            if (is_array($src['email_type'])) {
                $src['email_type'] = implode(',', $src['email_type']);
            } elseif (strpos($src['email_type'], ',') != false) {
                $src['email_type'] = explode(',', $src['email_type']);
            } elseif (strlen($src['email_type']) == 0) {
                $src['email_type'] = '';
            }
        } else {
            $src['email_type'] = '';
        }

        if ($src['id'] == 0 && empty($src['created_by'])) {
            $src['created_by'] = Factory::getUser()->id;
        }

        if ($src['id'] == 0 && empty($src['modified_by'])) {
            $src['modified_by'] = Factory::getUser()->id;
        }

        if ($task == 'apply' || $task == 'save') {
            $src['modified_by'] = Factory::getUser()->id;
        }

        if ($src['id'] == 0) {
            $src['created'] = $date->toSql();
        }

        if ($task == 'apply' || $task == 'save') {
            $src['modified'] = $date->toSql();
        }

        /*		if (isset($src['params']) && is_array($src['params']))
                {
                    $registry = new Registry;
                    $registry->loadArray($src['params']);
                    $src['params'] = (string) $registry;
                }

                if (isset($src['metadata']) && is_array($src['metadata']))
                {
                    $registry = new Registry;
                    $registry->loadArray($src['metadata']);
                    $src['metadata'] = (string) $registry;
                }
        */
        if (!Factory::getUser()->authorise('core.admin', 'com_jed.emailtemplate.' . $src['id'])) {
            $actions = Access::getActionsFromFile(
                JPATH_ADMINISTRATOR . '/components/com_jed/access.xml',
                "/access/section[@name='emailtemplate']/"
            );
            $default_actions = Access::getAssetRules('com_jed.emailtemplate.' . $src['id'])->getData();
            $array_jaccess = array();

            foreach ($actions as $action) {
                if (key_exists($action->name, $default_actions)) {
                    $array_jaccess[$action->name] = $default_actions[$action->name];
                }
            }

            $src['rules'] = $this->JAccessRulestoArray($array_jaccess);
        }

        // Bind the rules for ACL where supported.
        if (isset($src['rules']) && is_array($src['rules'])) {
            $this->setRules($src['rules']);
        }

        return parent::bind($src, $ignore);
    }

    /**
     * This function convert an array of JAccessRule objects into an rules array.
     *
     * @param array $jaccessrules An array of JAccessRule objects.
     *
     * @return  array
     * @since 4.0.0
     */
    private function JAccessRulestoArray(array $jaccessrules): array
    {
        $rules = array();

        foreach ($jaccessrules as $action => $jaccess) {
            $actions = array();

            if ($jaccess) {
                foreach ($jaccess->getData() as $group => $allow) {
                    $actions[$group] = ((bool)$allow);
                }
            }

            $rules[$action] = $actions;
        }

        return $rules;
    }

    /**
     * Overloaded check function
     *
     * @return bool
     *
     * @since 4.0.0
     */
    public function check(): bool
    {
        // If there is an ordering column and this is a new row then get the next ordering value
        if (property_exists($this, 'ordering') && $this->id == 0) {
            $this->ordering = self::getNextOrder();
        }


        return parent::check();
    }

    /**
     * Delete a record by id
     *
     * @param mixed $pk Primary key value to delete. Optional
     *
     * @return bool
     *
     * @since 4.0.0
     */
    public function delete($pk = null): bool
    {
        $this->load($pk);

        return parent::delete($pk);
    }

    /**
     * Define a namespaced asset name for inclusion in the #__assets table
     *
     * @return string The asset name
     *
     * @since 4.0.0
     * @see   Table::_getAssetName
     *
     */
    protected function _getAssetName(): string
    {
        $k = $this->_tbl_key;

        return 'com_jed.emailtemplate.' . (int)$this->$k;
    }


    /**
     * Returns the parent asset's id. If you have a tree structure, retrieve the parent's id using the external key field
     *
     * @param Table|null $table Table name
     * @param int|null $id Id
     *
     * @return mixed The id on success, false on failure.
     * @since 4.0.0
     * @see   Table::_getAssetParentId
     */
    protected function _getAssetParentId(Table $table = null, int $id = null)
    {
        // We will retrieve the parent-asset from the Asset-table
        $assetParent = Table::getInstance('Asset');

        // Default: if no asset-parent can be found we take the global asset
        $assetParentId = $assetParent->getRootId();

        // The item has the component as asset-parent
        $assetParent->loadByName('com_jed');

        // Return the found asset-parent-id
        if ($assetParent->id) {
            $assetParentId = $assetParent->id;
        }

        return $assetParentId;
    }
}
