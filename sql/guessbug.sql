-- phpMyAdmin SQL Dump
-- version 4.4.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2015-07-07 15:40:02
-- 服务器版本： 5.5.42-log
-- PHP Version: 5.5.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `guessbug`
--

-- --------------------------------------------------------

--
-- 表的结构 `article`
--

CREATE TABLE IF NOT EXISTS `article` (
  `aid` int(10) NOT NULL,
  `submit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `from_uid` int(10) NOT NULL,
  `to_level` tinyint(1) NOT NULL DEFAULT '0',
  `for_prob_oj` char(20) NOT NULL,
  `for_prob_id` char(10) NOT NULL,
  `title` char(100) NOT NULL,
  `content` longtext NOT NULL,
  `visiblity` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `article`
--

INSERT INTO `article` (`aid`, `submit_time`, `from_uid`, `to_level`, `for_prob_oj`, `for_prob_id`, `title`, `content`, `visiblity`) VALUES
(1, '2015-07-07 05:50:26', 1, 0, '0', '0', 'about', 'this+is+%60about%60+page2', 1),
(2, '2015-07-07 06:37:22', 1, 0, '0', '0', 'Contribute', 'This+is+an+%60Contribute%60+page', 1);

-- --------------------------------------------------------

--
-- 表的结构 `invitation`
--

CREATE TABLE IF NOT EXISTS `invitation` (
  `iid` int(10) NOT NULL,
  `string` char(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `oj`
--

CREATE TABLE IF NOT EXISTS `oj` (
  `oid` int(10) NOT NULL,
  `name` char(20) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `oj`
--

INSERT INTO `oj` (`oid`, `name`) VALUES
(1, 'CodeForces'),
(2, 'ZOJ'),
(3, 'HDU'),
(4, 'POJ');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `uid` int(10) NOT NULL,
  `name` char(50) NOT NULL,
  `password` char(100) NOT NULL,
  `email` char(100) NOT NULL,
  `homepage` char(100) NOT NULL,
  `level` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`uid`, `name`, `password`, `email`, `homepage`, `level`) VALUES
(1, 'admin', '$2y$10$Pnt7a2O2eqkMdIC8z1HoqOgKTPi6fgFPt8gOl8mo2srPhxPlaCVnm', 'guessever@gmail.com', 'http%3A%2F%2Fguessever.tk', 9);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`aid`),
  ADD UNIQUE KEY `aid` (`aid`);

--
-- Indexes for table `invitation`
--
ALTER TABLE `invitation`
  ADD PRIMARY KEY (`iid`),
  ADD UNIQUE KEY `iid` (`iid`),
  ADD UNIQUE KEY `string` (`string`);

--
-- Indexes for table `oj`
--
ALTER TABLE `oj`
  ADD PRIMARY KEY (`oid`),
  ADD UNIQUE KEY `oid` (`oid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `uid` (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `article`
--
ALTER TABLE `article`
  MODIFY `aid` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `invitation`
--
ALTER TABLE `invitation`
  MODIFY `iid` int(10) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `oj`
--
ALTER TABLE `oj`
  MODIFY `oid` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `uid` int(10) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
