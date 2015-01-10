<?php namespace Repository;

use Illuminate\Database\Eloquent\Model;

class PullRepository implements IPullRepository {

	private $pull_model;
	private $confide_model;

	public function __construct(Model $pull_model, Model $confide_model)
	{
		$this->pull_model = $pull_model;
		$this->confide_model = $confide_model;
	}

	public function addPull($data)
	{
		$pull = new $this->pull_model;

		$pull->lat = $data['lat'];
		$pull->lng = $data['lng'];
		$pull->address = $data['addr'];
		$pull->save();

		return $pull;
	}

	public function addConfide($id, $content)
	{
		$confide = $this->confide_model;
		$confide->pull_id = $id;
		$confide->content = $content;

		$confide->save();

		return $confide;
	}

	public function findAllByBounds($bounds)
	{
		list($lat_lo, $lng_lo, $lat_hi, $lng_hi) = explode(',', $bounds);

		$pulls = $this->pull_model->with('confides')
		              ->whereBetween('lat', array($lat_lo, $lat_hi))
		              ->whereBetween('lng', array($lng_lo, $lng_hi))
		              ->get(array('id', 'lat', 'lng', 'address'));

		return $pulls;
	}

	public function findById($id)
	{
		$pull = $this->pull_model->find($id, array('id'));
		$pull->load('confides');

		return $pull;
	}
}
