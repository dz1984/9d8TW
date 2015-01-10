<?php namespace Repository;

interface IPullRepository {
	public function addPull($data);

	public function addConfide($id, $content);

	public function findAllByBounds($bounds);

	public function findById($id);
}