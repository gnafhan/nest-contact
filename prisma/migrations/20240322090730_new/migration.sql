/*
  Warnings:

  - Made the column `country` on table `addresses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `addresses` MODIFY `country` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `contacts` MODIFY `last_name` VARCHAR(100) NULL,
    MODIFY `email` VARCHAR(100) NULL,
    MODIFY `phone` VARCHAR(20) NULL;
