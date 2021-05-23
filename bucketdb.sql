


-- Database: `bucketdb`

-- Table structure for table `bucket`


CREATE TABLE `bucket` (
  `id` int(11) NOT NULL,
  `by` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ;



INSERT INTO `bucket` (`id`, `by`, `description`) VALUES
(2, 'admin', 'I want to go to Lake Louise'),
(3, 'admin1', 'I want to go to Lake Louise on this summer for sure');


-- Table structure for table `user`

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` text NOT NULL
) ;



INSERT INTO `user` (`id`, `username`, `password`) VALUES
(1, 'admin', '$2a$10$xAJNeumggY6juolfpnCSheGij1VwJ01KkrhOFzhJ9reD9pdVbdp3q'),
(2, 'admin1', '$2a$10$ZHOaBp/cRwK2DZO.xnFFP.zG4DqDQPnsvZfl8SzT2Rp.tB8MPEExm');




--
-- Indexes for table `bucket`
--
ALTER TABLE `bucket`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `bucket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;


