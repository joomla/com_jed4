<?php
/**
 * @package    JED
 *
 * @copyright  Copyright (C) 2005 - 2019 Open Source Matters, Inc. All rights reserved.
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

/** @var JedViewReviews $this */
?>

<h1>Reviews for [extension name]</h1>
<?php foreach ($this->items as $item) : ?>
	<pre>
		<?php print_r($item); ?>
	</pre>
<?php endforeach; ?>
<?php echo $this->pagination->getPaginationLinks();
