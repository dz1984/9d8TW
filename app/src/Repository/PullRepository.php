<?php namespace Repository;

class PullRepository {


  public function findOrNew($data) 
  {
    $pull_id = $data['id'];
    $lat = $data['lat'];
    $lng = $data['lng'];
    $address = $data['address'];
    $content = $data['content'];

    if (null == $pull_id)
    {
      $pull = $this->addPull(compact('lat', 'lng', 'address'));

      $pull_id = $pull->id;
    }

    $this->addConfide(compact('pull_id', 'content'));

    return $this->findById($pull_id);
  }

  public function addPull($data)
  {
    $pull = Pull::post($data);

    return $pull;
  }

  public function addConfide($data)
  {
    $confide = Confide::post($data);

    return $confide;
  }

  public function findAllByBounds($bounds)
  {
    list($lat_lo, $lng_lo, $lat_hi, $lng_hi) = explode(',', $bounds);

    $pulls = Pull::with('confides')
                  ->whereBetween('lat', array($lat_lo, $lat_hi))
                  ->whereBetween('lng', array($lng_lo, $lng_hi))
                  ->get(array('id', 'lat', 'lng', 'address'));

    return $pulls;
  }

  public function findById($id)
  {
    $pull = Pull::find($id, array('id'));
    $pull->load('confides');

    return $pull;
  }
}
