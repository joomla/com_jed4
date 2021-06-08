/* This file is for later merging with install.mysql.uft8.sql */
/* It has been applied to the testing server ID264608 */
CREATE TABLE IF NOT EXISTS `#__jed_ticket_messages`
(
    `id`               INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `ticket_id`        INT(10)          NULL DEFAULT 0,
    `subject`          VARCHAR(255)     NOT NULL,
    `message`          TEXT             NOT NULL,
    `ordering`         INT(11)          NULL DEFAULT 0,
    `state`            TINYINT(1)       NULL DEFAULT 1,
    `checked_out`      INT(11) UNSIGNED,
    `checked_out_time` DATETIME         NULL DEFAULT NULL,
    `created_by`       INT(11)          NULL DEFAULT 0,
    `modified_by`      INT(11)          NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_ticket_internal_notes`
(
    `id`               INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `ticket_id`        INT(10)          NULL DEFAULT 0,
    `summary`          VARCHAR(255)     NULL DEFAULT "",
    `note`             TEXT             NULL,
    `ordering`         INT(11)          NULL DEFAULT 0,
    `state`            TINYINT(1)       NULL DEFAULT 1,
    `checked_out`      INT(11) UNSIGNED,
    `checked_out_time` DATETIME         NULL DEFAULT NULL,
    `created_by`       INT(11)          NULL DEFAULT 0,
    `modified_by`      INT(11)          NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE IF NOT EXISTS `#__jed_jedtickets`
(
    `id`                      INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `ticket_origin`           VARCHAR(255)     NULL DEFAULT "0",
    `ticket_category_type`    INT(10)          NULL DEFAULT 0,
    `ticket_subject`          VARCHAR(255)     NULL DEFAULT "",
    `ticket_text`             TEXT             NULL,
    `internal_notes`          TEXT             NULL,
    `uploaded_files_preview`  BLOB             NULL,
    `uploaded_files_location` VARCHAR(255)     NULL DEFAULT "",
    `allocated_group`         INT(10)          NULL DEFAULT 0,
    `allocated_to`            INT(11)          NULL DEFAULT 0,
    `linked_item_type`        INT(10)          NULL DEFAULT 0,
    `linked_item_id`          INT              NULL DEFAULT 0,
    `ticket_status`           VARCHAR(255)     NULL DEFAULT "0",
    `parent_id`               INT              NULL DEFAULT 0,
    `state`                   INT              NULL DEFAULT 0,
    `ordering`                INT              NULL DEFAULT 0,
    `created_by`              INT(11)          NULL DEFAULT 0,
    `created_on`              DATETIME         NULL DEFAULT "0000-00-00",
    `modified_by`             INT(11)          NULL DEFAULT 0,
    `modified_on`             DATETIME         NULL DEFAULT "0000-00-00",
    `checked_out`             INT UNSIGNED,
    `checked_out_time`        DATETIME         NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

