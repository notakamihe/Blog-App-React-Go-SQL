-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: blog
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `postid` int NOT NULL,
  `authorid` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `postid` (`postid`),
  KEY `authorid` (`authorid`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`postid`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`authorid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (2,11,5),(5,11,4),(12,7,2),(13,1,2),(14,15,2),(17,7,5),(20,1,5);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` mediumtext NOT NULL,
  `likes` int DEFAULT '0',
  `createdat` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_user` (`author_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,'Why C++ is the worst programming language in 2021','It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)',0,'2021-02-05 18:57:22'),(7,1,'Front end development road map (February 2021)','ipsum lacus, lacinia quis posuere ut, pulvinar vitae dolor.\nInteger eu nibh at nisi ullamcorper sagittis id vel leo. Integer feugiat \nfaucibus libero, at maximus nisl suscipit posuere. Morbi nec enim nunc. \nPhasellus bibendum turpis ut ipsum egestas, sed sollicitudin elit convallis.',0,'2021-02-05 18:13:35'),(11,2,'Why Python is the best programming language in the history of mankind','Duis tincidunt laoreet ex, in pretium orci vestibulum eget. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis pharetra luctus lacus ut vestibulum. Maecenas ipsum lacus, lacinia quis posuere ut, pulvinar vitae dolor. Integer eu nibh at nisi ullamcorper sagittis id vel leo. Integer feugiat faucibus libero, at maximus nisl suscipit posuere. Morbi nec enim nunc. Phasellus bibendum turpis ut ipsum egestas, sed sollicitudin elit convallis. Cras pharetra mi tristique sapien vestibulum',0,'2021-02-06 15:02:35'),(15,5,'Why frontend frameworks are literally inventions straight from Heaven','I AM NOT EXAGGERATING.\n\nEleifend tempus ultricies enim commodo condimentum nisl vestibulum scelerisque bibendum cubilia ultricies ullamcorper per ullamcorper mi adipiscing a mi placerat ultrices varius euismod vestibulum adipiscing. A vitae vestibulum curae quam consectetur laoreet dis nunc mus a adipiscing elementum a libero ut himenaeos parturient eros hac. Morbi a a vestibulum vivamus etiam primis diam urna est ad curae volutpat ad fermentum fusce a accumsan a imperdiet nunc est est tristique adipiscing massa. Hendrerit per laoreet cubilia sit quam a facilisis ultricies neque suspendisse eu aenean non maecenas eu suspendisse purus adipiscing eleifend dapibus suspendisse porttitor adipiscing rhoncus at ipsum. Habitasse dictumst urna a parturient rhoncus vestibulum euismod suspendisse curabitur a parturient scelerisque a enim imperdiet condimentum. \n\nNec vestibulum dui pretium venenatis mus a scelerisque tincidunt dis tortor dictum vestibulum nibh nulla ullamcorper feugiat. A vulputate scelerisque adipiscing fringilla a phasellus ullamcorper fringilla vestibulum elit tellus sagittis dictum nam inceptos leo nunc ipsum. Dictumst parturient vel ipsum lacus vel per scelerisque orci a a felis aliquet fusce parturient per tristique a sed dui massa ac dui varius a a a non. Vulputate a a molestie blandit a orci justo nisl vel quam suspendisse vestibulum eget orci in vitae a fusce sit fames a parturient hac velit parturient congue. \n\nUllamcorper eu leo etiam morbi a metus mus duis ultricies est mattis nisi torquent rhoncus sociosqu a euismod non sem dictum condimentum mus leo suspendisse cum a adipiscing a. A libero vestibulum enim porta sagittis integer parturient etiam habitant iaculis ullamcorper pharetra scelerisque a vel bibendum. Vestibulum rhoncus hac in a morbi a ultrices ad suspendisse vehicula praesent potenti potenti ullamcorper a arcu leo metus adipiscing adipiscing scelerisque lectus pretium ridiculus. Aliquam eu erat nullam a ullamcorper at suspendisse semper facilisis maecenas commodo euismod venenatis faucibus accumsan a mus parturient adipiscing quis ante adipiscing vivamus gravida aliquam vitae condimentum potenti. Condimentum scelerisque suspendisse consectetur mauris adipiscing venenatis inceptos morbi consequat ac congue a senectus massa erat vestibulum nec enim himenaeos nunc a ullamcorper erat habitant urna.',0,'2021-02-06 13:57:51');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(80) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'johndoe@example.com','password','Jonathan Doe','This is the Jonathan Doe'),(2,'janedoe@example.com','$2a$10$fYCF9jvbIZMJMKsRu2C5zuKlZl8bTnn7rT11GXzkWnU8C6kRwnORy','Jane Doe',''),(4,'johnwick@example.com','$2a$10$EzTGRglPNhvCWDsDhr9zjOD.8jO.EpwiwNY/zAIQfYzVCY.iaEYxG','John Wick','this is the john wick speaking...'),(5,'notakamihe@gmail.com','$2a$10$ZrakIUeqzQdkYO2a6We7HONTiBeAlqD/gbWMu.XRlurDTgYX5CLbK','Michael',''),(7,'person@email.com','$2a$10$3HBS7LfxU4YW1mRCwDP6Nu4hRgefLj96tMa1mr8d2HCWG6nXTNZ.y','New person',''),(8,'joedoe@example.com','$2a$10$4Aa7zv.QdZs4mXVkWyazG.wt.6n6yPqvdvdUHHB2XQPxvT2091xY6','Joe Doe',''),(9,'jackdoe@example.com','$2a$10$h1yr0oGL6yhTdlnVF/sYz.z6V/1cqeeL52YmOfzBeat3aMqivh1FS','Jack Doe',''),(10,'jacklyndoe@email.com','$2a$10$JwQp4iUrVv6SbUrbdSJjM.qGnAEG1jMl9m1cYDBAxVHeCtmCh9MPK','Jacklyn','I am jacklyn');
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

-- Dump completed on 2021-02-06  9:51:58
