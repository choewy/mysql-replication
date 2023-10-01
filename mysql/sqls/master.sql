-- local Database 생성
CREATE DATABASE IF NOT EXISTS `local`;

-- master 계정 생성 및 권한 설정
CREATE USER 'master'@'%' IDENTIFIED BY 'master_password';
GRANT ALL PRIVILEGES ON `local`.* TO 'master'@'%';

-- replica 계정 생성 및 권한 설정
CREATE USER 'repl'@'%';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

FLUSH PRIVILEGES;

SHOW MASTER STATUS;