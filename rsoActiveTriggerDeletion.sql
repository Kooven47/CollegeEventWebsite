CREATE TRIGGER `rsoActiveTriggerDeletion` AFTER DELETE ON `member_of`
 FOR EACH ROW BEGIN
    DECLARE count INT;
    SELECT COUNT(*) INTO count FROM member_of WHERE RSO_ID = OLD.RSO_ID;

    IF count >= 5 THEN
        UPDATE rso SET active = true WHERE RSO_ID = OLD.RSO_ID;
    ELSE
        UPDATE rso SET active = false WHERE RSO_ID = OLD.RSO_ID;
    END IF;
END