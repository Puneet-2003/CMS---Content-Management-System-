-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: localhost    Database: cms_database
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `originalName` varchar(255) NOT NULL,
  `mimeType` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `size` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` VALUES (2,'file-1763310983063-885817017.png','sign.png','image/png','uploads\\file-1763310983063-885817017.png',6021,'2025-11-16 16:36:23','2025-11-16 16:36:23'),(4,'file-1763311627557-927082532.png','ai3.png','image/png','uploads\\file-1763311627557-927082532.png',26661,'2025-11-16 16:47:07','2025-11-16 16:47:07'),(5,'file-1763344730237-217137788.jpg','WhatsApp Image 2025-10-19 at 19.17.45_74b4f84a.jpg','image/jpeg','uploads\\file-1763344730237-217137788.jpg',966424,'2025-11-17 01:58:50','2025-11-17 01:58:50'),(6,'file-1763345542696-621374090.png','ai2.png','image/png','uploads\\file-1763345542696-621374090.png',22282,'2025-11-17 02:12:22','2025-11-17 02:12:22');
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `pages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `published` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `userId` (`userId`),
  CONSTRAINT `pages_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES (1,'Hellp','hellp-1763309318236','<h3><strong>Hello my name is Puneet mneena</strong></h3>',1,'2025-11-16 16:08:38','2025-11-17 01:58:06',1),(2,'Life ','life-1763310699754','<p>happiness</p><p>peace</p>',1,'2025-11-16 16:31:39','2025-11-17 01:58:04',1),(3,'Daily Life','daily-life-1763345511891','<p>Great<em> Puneet</em></p>',1,'2025-11-17 02:11:51','2025-11-17 02:11:55',1);
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `excerpt` text,
  `published` tinyint(1) DEFAULT '0',
  `publishedAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `userId` (`userId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'My Amazing Blog Post','my-amazing-blog-post-1763286436834','<p>This is the full content of my blog post with lots of details...</p>','A short summary of the blog post',0,NULL,'2025-11-16 09:47:16','2025-11-17 02:11:07',1),(2,'My Story of Class 7th','my-story-of-class-7th-1763286528238','<p>Friends with lovedsrf ram ram huwerqwrfqw</p>','A short summary of the blog post',0,NULL,'2025-11-16 09:48:48','2025-11-17 02:11:03',1),(3,'Puneet Task -12','puneet-task-12-1763345568743','<p>Greae App</p>','CMS App',0,NULL,'2025-11-17 01:59:04','2025-11-17 02:12:48',1);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Administrator','admin@cms.com','$2a$12$IGw/HOjhxiKS1BN8iL4lKeRXoJiXNdsHgjCuD5u0JUgx/Mc..8iSK','admin','2025-11-16 09:31:43','2025-11-16 09:31:43'),(2,'John Doe','john@example.com','$2a$12$e/fBwKCPzXw0ZV6H6ig.8OGGRWXo088bp7j.YaStfwNMBHP.C.qA.','user','2025-11-16 09:31:53','2025-11-16 09:31:53'),(3,'Puneet Meena','puneetmeena283@gmail.com','$2a$12$XJRWRKHYlYxLDxgydcGF8e5gQU/a3bkWtvYZ.eFgTjA2/XzPS3vtm','user','2025-11-16 17:18:57','2025-11-16 17:18:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-17  8:12:33
