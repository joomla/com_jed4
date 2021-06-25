<?php
/**
 * @package       JED
 *
 * @subpackage    VEL
 *
 * @copyright     Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 */

// No direct access
defined('_JEXEC') or die;


use Jed\Component\Jed\Site\Helper\JedHelper;

?>

<div class="page-header">
    <h2 itemprop="headline"><?php echo JedHelper::reformatTitle($this->item->title); ?></h2>
</div>
<div itemprop="articleBody">
    <p><?php echo JedHelper::reformatTitle($this->item->public_description); ?></p>
</div>

